import json
from pathlib import Path
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "vendor"))
from analog_results import write_results
from score_formula import _safe_eval_formula, FormulaError
from validation_results import ValidationResult

class IntegrationTests(unittest.TestCase):
    def test_partial_is_not_full_success(self):
        temporary_root = ROOT / "artifacts" / "test-temp"
        temporary_root.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(dir=temporary_root) as directory:
            write_results([("good", True, ""), ("bad", False, "")], Path(directory), strict=True)
            result = json.loads((Path(directory) / "reward.json").read_text())
            self.assertEqual(result["reward"], 0)
            self.assertEqual(result["partial"], 0.5)

    def test_formula_rejects_code_and_missing_variables(self):
        self.assertEqual(_safe_eval_formula("(a+b)/2", {"a": 1, "b": 0}), 0.5)
        for expression in ["__import__('os').getcwd()", "a.real", "missing+1"]:
            with self.assertRaises(FormulaError):
                _safe_eval_formula(expression, {"a": 1})

    def test_validation_preserves_failed_status(self):
        result = ValidationResult(False, "functional-failure", {"evidence": "evidence/"})
        self.assertFalse(result.to_dict()["success"])
        self.assertEqual(result.to_dict()["details"]["evidence"], "evidence/")

if __name__ == "__main__":
    unittest.main()
