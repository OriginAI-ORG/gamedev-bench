"""Bridge the independent browser verdict into the three upstream result conventions."""
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "vendor"))
from analog_results import write_results
from score_formula import _safe_eval_formula
from validation_results import ValidationResult

def export(folder):
    folder = Path(folder)
    verdict = json.loads((folder / "verdict.json").read_text(encoding="utf-8"))
    checks = [(item["id"], item["passed"], item.get("message", "")) for item in verdict["checks"]]
    if not checks:
        checks = [("no_checks", False, "No independent checks executed")]
    write_results(checks, output=folder, strict=True)
    variables = {"c" + str(i): float(ok) for i, (_, ok, _) in enumerate(checks)}
    formula = "(" + "+".join(variables) + ")/" + str(len(checks))
    partial = _safe_eval_formula(formula, variables)
    breakdown = {
        "formula": formula, "variables": variables, "partial": partial,
        "reward": int(verdict["functional_pass"]), "full_pass_requires_all": True,
        "requirements": [{"id": name, "aggregated": float(ok), "description": msg} for name, ok, msg in checks],
        "aggregation": "all-required-checks; no best-demo aggregation",
        "judge": {"name": "independent-browser-rules", "model": None},
    }
    (folder / "breakdown.json").write_text(json.dumps(breakdown, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (folder / "reward.txt").write_text(str(int(verdict["functional_pass"])) + "\n", encoding="utf-8")
    result = ValidationResult(
        verdict["functional_pass"], verdict["status"],
        {"checks": verdict["checks"], "evidence": "evidence/", "partial": partial},
        timestamp=verdict["finished_at"],
    )
    (folder / "origin-validation.json").write_text(json.dumps(result.to_dict(), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__":
    export(sys.argv[1])
