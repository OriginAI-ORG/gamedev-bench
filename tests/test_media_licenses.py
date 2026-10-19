"""Evidence-integrity checks for the standalone media inventory."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location('media_audit', Path(__file__).resolve().parents[1] / 'scripts/audit-media-licenses.py')
AUDIT = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(AUDIT)


class MediaAuditTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        for folder in ['configs', 'tasks/demo', 'taskkits', 'samples', 'vendor']:
            (self.root / folder).mkdir(parents=True)
        (self.root / 'configs/source-index.json').write_text('{}', encoding='utf-8')
        (self.root / 'tasks/demo/assets.json').write_text('{}', encoding='utf-8')
        self.asset = self.root / 'tasks/demo/image.svg'
        self.asset.write_text('<svg/>', encoding='utf-8')
        self.license = self.root / 'vendor/notice.txt'
        self.license.write_text('Example test permission', encoding='utf-8')
        self.evidence = {'review_date': '2026-10-19', 'groups': [{
            'id': 'test-license', 'status': 'license-evidence', 'license': 'test-only',
            'sha256': [AUDIT.digest(self.asset)],
            'evidence_files': {'vendor/notice.txt': AUDIT.digest(self.license)},
            'obligations': 'Retain notice.'
        }]}
        self.save()

    def save(self):
        (self.root / AUDIT.EVIDENCE).write_text(json.dumps(self.evidence), encoding='utf-8')

    def test_duplicates_share_evidence(self):
        (self.root / 'taskkits/copy.svg').write_bytes(self.asset.read_bytes())
        report = AUDIT.build_report(self.root)
        self.assertEqual(report['summary']['media_paths'], 2)
        self.assertEqual(report['summary']['unique_contents'], 1)
        self.assertTrue(report['summary']['redistribution_review_complete'])

    def test_new_media_requires_review(self):
        (self.root / 'samples/new.svg').write_text('<svg>new</svg>', encoding='utf-8')
        report = AUDIT.build_report(self.root)
        self.assertFalse(report['summary']['redistribution_review_complete'])
        self.assertEqual(report['summary']['by_status']['unresolved'], 1)

    def test_modified_notice_blocks_clearance(self):
        self.license.write_text('Changed terms', encoding='utf-8')
        report = AUDIT.build_report(self.root)
        self.assertFalse(report['summary']['redistribution_review_complete'])
        self.assertTrue(report['summary']['evidence_errors'])

    def test_removed_media_invalidates_evidence(self):
        self.asset.unlink()
        self.assertTrue(AUDIT.build_report(self.root)['summary']['evidence_errors'])

    def test_duplicate_decisions_rejected(self):
        self.evidence['groups'].append(dict(self.evidence['groups'][0]))
        self.save()
        with self.assertRaisesRegex(ValueError, 'Duplicate'):
            AUDIT.build_report(self.root)


if __name__ == '__main__':
    unittest.main()
