"""Build an allowlisted source archive, excluding personal configuration and records."""
import datetime
import hashlib
import io
import json
from pathlib import Path
import tarfile
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
FILES = [".gitignore", ".gitattributes", "README.md", "THIRD_PARTY_NOTICES.md", "LICENSE", "NOTICE", "CONTRIBUTING.md", "SECURITY.md", "CHANGELOG.md", "CITATION.cff", "package.json", "package-lock.json", "docs/PROTOCOL.md",
         "configs/pilot.json", "configs/upstream-lock.json", "configs/OriginGameDevBench.json", "configs/source-index.json", "configs/task-licenses.json", "configs/review-signoff.json", "configs/family-review-notes.json", "docs/WEBGAME-REVISION-2026-10-16.md", "docs/art-generation-prompts.md", "docs/IDENTIFIERS-3.0.0.md", "docs/REPOSITORY-1.0.0.md", "docs/ACCEPTANCE-ERRATA-2026-10-15.md", "docs/RUN-TIME-ESTIMATE-2026-10-19.md"]
DIRS = ["core", "agents", "runner", "environments", "tasks", "taskkits", "samples", "vendor", "scripts", "tests", "validation", "results", "docs/task-reviews"]
EXCLUDED = {"__pycache__", "node_modules", ".git", ".codex", ".agents", ".env", ".npm-cache", ".browsers"}

def main():
    command = ["node", "scripts/release-check.mjs", "--save-qa"]
    if "--final" in sys.argv:
        command.append("--final")
    subprocess.run(command, cwd=ROOT, check=True)
    files = [ROOT / p for p in FILES]
    for folder in DIRS:
        for file in (ROOT / folder).rglob("*"):
            if file.is_symlink():
                raise SystemExit("Symlink rejected: " + str(file))
            relative = file.relative_to(ROOT)
            if relative.as_posix() == "scripts/deployment_receipt.py":
                continue
            if file.is_file() and not any(p in EXCLUDED or p.startswith(".env") for p in relative.parts) and file.suffix != ".pyc":
                files.append(file)
    files = sorted(set(files))
    release = "OriginGameDevBench-" + json.loads((ROOT / "package.json").read_text())["version"] + "-" + datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    destination = ROOT / "dist"
    destination.mkdir(exist_ok=True)
    manifest = {
        "release": release, "stage": "validated-baseline" if "--final" in sys.argv else "release-candidate", "scope": "Standalone OriginGameDevBench source, 228 directly authored bilingual tasks, references, checks, review records, media provenance and sanitized validation receipts.",
        "excludes": ["personal Codex configuration", "AGENTS.md", "chat/session history", "secrets", "upstream task datasets", "local artifacts", "installed binaries"],
        "release_checks_passed": True,
        "files": [{"path": p.relative_to(ROOT).as_posix(), "sha256": hashlib.sha256(p.read_bytes()).hexdigest(), "bytes": p.stat().st_size} for p in files],
    }
    content = (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    archive = destination / (release + ".tar.gz")
    with tarfile.open(archive, "w:gz") as tar:
        for file in files:
            data=file.read_bytes()
            info=tarfile.TarInfo(file.relative_to(ROOT).as_posix())
            info.size=len(data);info.mode=0o644
            tar.addfile(info,io.BytesIO(data))
        info = tarfile.TarInfo("release-manifest.json")
        info.size = len(content)
        tar.addfile(info, io.BytesIO(content))
    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
    (destination / (archive.name + ".sha256")).write_text(digest + "  " + archive.name + "\n", encoding="utf-8")
    (destination / (release + ".manifest.json")).write_bytes(content)
    (destination / "latest.json").write_text(json.dumps({"release":release,"archive":archive.name,"sha256":digest,"files":len(files),"bytes":archive.stat().st_size},indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"archive":str(archive),"sha256":digest,"files":len(files),"bytes":archive.stat().st_size},indent=2))

if __name__ == "__main__":
    main()
