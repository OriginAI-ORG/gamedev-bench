"""Validate the actual archive and optionally extract into a fresh local smoke folder."""
import hashlib
import io
import json
import re
from pathlib import Path, PurePosixPath
import sys
import tarfile
import tempfile

ROOT = Path(__file__).resolve().parents[1]
latest = json.loads((ROOT / "dist/latest.json").read_text(encoding="utf-8"))
if not re.fullmatch(r"OriginGameDevBench-" + re.escape(json.loads((ROOT / "package.json").read_text())["version"]) + r"-\d{8}T\d{6}Z", latest.get("release", "")) or latest.get("archive") != latest["release"] + ".tar.gz":
    raise SystemExit("Invalid release/archive name")
archive = ROOT / "dist" / latest["archive"]
if hashlib.sha256(archive.read_bytes()).hexdigest() != latest["sha256"]:
    raise SystemExit("Archive hash mismatch")
with tarfile.open(archive, "r:gz") as tar:
    members = tar.getmembers()
    names = set()
    portable_names = set()
    for member in members:
        parts = PurePosixPath(member.name).parts
        if member.name.casefold() in portable_names or member.name != PurePosixPath(member.name).as_posix() or not member.isfile() or member.name.startswith("/") or ".." in parts or "\\" in member.name or ":" in member.name:
            raise SystemExit("Invalid archive member: " + member.name)
        if member.name not in {".gitignore", ".gitattributes"} and any(p.startswith(".") or p == "AGENTS.md" for p in parts):
            raise SystemExit("Unexpected configuration file: " + member.name)
        names.add(member.name)
        portable_names.add(member.name.casefold())
    manifest = json.load(tar.extractfile("release-manifest.json"))
    if manifest.get("release") != latest["release"]:
        raise SystemExit("Release identity mismatch")
    expected = {item["path"]: item for item in manifest["files"]}
    if len(expected) != len(manifest["files"]):
        raise SystemExit("Duplicate manifest entries")
    required = {"LICENSE", "NOTICE", "configs/OriginGameDevBench.json", "configs/source-index.json", "taskkits/OriginGameDevBench/quality.mjs", "environments/verification/visual.mjs", "validation/qa.json"}
    if not required <= names:
        raise SystemExit("Release is incomplete: " + str(sorted(required - names)))
    if names != set(expected) | {"release-manifest.json"}:
        raise SystemExit("Archive and allowlisted manifest differ")
    for name, item in expected.items():
        body = tar.extractfile(name).read()
        if len(body) != item["bytes"] or hashlib.sha256(body).hexdigest() != item["sha256"]:
            raise SystemExit("Source hash mismatch: " + name)
    if "--extract-smoke" in sys.argv:
        smoke_root = ROOT / "artifacts" / "release-smoke"
        smoke_root.mkdir(parents=True, exist_ok=True)
        target = Path(tempfile.mkdtemp(prefix=manifest["release"] + "-", dir=smoke_root))
        for member in members:
            output = target / member.name
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(tar.extractfile(member).read())
        print(str(target))
    else:
        print("Archive validated: " + str(len(expected)) + " files; no personal directories or upstream datasets.")
