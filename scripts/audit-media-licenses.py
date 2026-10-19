"""Inventory media and verify recorded license evidence without network access.

--write refreshes the inventory; --require-cleared rejects unresolved permissions.
No mode grants rights or treats a repository-wide license as an asset license.
"""
import argparse
from collections import Counter, defaultdict
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.wav', '.ogg',
              '.mp3', '.mp4', '.webm', '.ttf', '.otf', '.woff', '.woff2', '.glb', '.gltf'}
SCOPES = ('tasks', 'taskkits', 'samples')
REPORT = 'validation/media-license-audit.json'
EVIDENCE = 'configs/media-license-evidence.json'
STATUSES = {'project-provenance', 'license-evidence', 'restricted-license', 'unresolved'}


def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def build_report(root=ROOT):
    evidence = json.loads((root / EVIDENCE).read_text(encoding='utf-8'))
    by_hash = {}
    errors = []
    for group in evidence['groups']:
        if group['status'] not in STATUSES or group['status'] == 'unresolved':
            raise ValueError('Invalid reviewed evidence status: ' + group['status'])
        if not group.get('evidence_files'):
            raise ValueError('Missing evidence files: ' + group['id'])
        for file, expected in group['evidence_files'].items():
            resolved = (root / file).resolve()
            if not resolved.is_relative_to(root.resolve()):
                raise ValueError('Evidence path escapes repository')
            if not resolved.is_file() or digest(resolved) != expected:
                errors.append('Missing or changed evidence: ' + file)
        for sha in group['sha256']:
            if sha in by_hash:
                raise ValueError('Duplicate reviewed media hash: ' + sha)
            by_hash[sha] = group
    files = defaultdict(list)
    for scope in SCOPES:
        for file in sorted((root / scope).rglob('*')):
            if file.is_symlink():
                raise ValueError('Symlink in media scope: ' + file.as_posix())
            if file.is_file() and file.suffix.lower() in EXTENSIONS:
                files[digest(file)].append(file.relative_to(root).as_posix())
    records = []
    for sha, paths in sorted(files.items()):
        group = by_hash.get(sha)
        records.append({
            'sha256': sha,
            'paths': sorted(paths),
            'status': group['status'] if group else 'unresolved',
            'evidence_group': group['id'] if group else None,
            'license': group['license'] if group else None,
            'action': group['obligations'] if group else
                'Obtain matching author permission/license evidence or replace in a versioned task revision; repository-level licensing alone is insufficient.'
        })
    stale = sorted(set(by_hash) - set(files))
    if stale:
        errors.append('Reviewed hashes no longer present: ' + ', '.join(stale))
    source_records = sorted((root / 'tasks').glob('*/assets.json'))
    source_records += [root / EVIDENCE, root / 'configs/source-index.json']
    statuses = Counter(record['status'] for record in records)
    unresolved = [r for r in records if r['status'] == 'unresolved']
    affected = sorted({p.split('/')[1] for r in unresolved for p in r['paths'] if p.startswith('tasks/')})
    return {
        'schema_version': 1,
        'review_date': evidence['review_date'],
        'scope': list(SCOPES),
        'extensions': sorted(EXTENSIONS),
        'limitations': 'Standalone media inventory and recorded license evidence; not a legal clearance opinion. Inline graphics, generated-art copyright, trademarks and all upstream ownership chains are not independently certified.',
        'source_records_sha256': {p.relative_to(root).as_posix(): digest(p) for p in source_records},
        'summary': {
            'media_paths': sum(len(paths) for paths in files.values()),
            'unique_contents': len(records),
            'by_status': dict(sorted(statuses.items())),
            'unresolved_task_ids': affected,
            'evidence_errors': errors,
            'redistribution_review_complete': not unresolved and not errors
        },
        'media': records
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true')
    parser.add_argument('--require-cleared', action='store_true')
    args = parser.parse_args()
    report = build_report()
    destination = ROOT / REPORT
    if args.write:
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    else:
        stored = json.loads(destination.read_text(encoding='utf-8')) if destination.exists() else None
        if stored != report:
            print('Media audit is stale or missing. Review changes, then run python scripts/audit-media-licenses.py --write.')
            return 1
    summary = dict(report['summary'])
    summary['unresolved_tasks'] = len(summary.pop('unresolved_task_ids'))
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    if report['summary']['evidence_errors']:
        return 1
    if args.require_cleared and not report['summary']['redistribution_review_complete']:
        print('Publication blocked: unresolved media permissions remain. See docs/MEDIA-LICENSE-AUDIT.md.')
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
