# SPDX-License-Identifier: Apache-2.0
# Copyright upstream contributors; see corresponding LICENSE file.
# Extracted without function-body changes for the webgame pilot.
# Source: https://github.com/FreedomIntelligence/gamecraft-bench/blob/a43347534374df9a0c1a6c001aa9380862783f6d/gamecraft_bench/verifier/score.py
# Modification: retained only named helpers and required standard-library imports.

from __future__ import annotations
import ast
import operator


class FormulaError(RuntimeError):
    """Raised when ``score_formula`` is malformed or references an unknown id."""


_BINOPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
}


_UNARYOPS = {
    ast.UAdd: operator.pos,
    ast.USub: operator.neg,
}


def _safe_eval_formula(formula: str, variables: dict[str, float]) -> float:
    """Evaluate ``formula`` with variables. Allows numbers, names, +-*/%**,
    parentheses; rejects everything else (no calls, no attributes, no
    subscripts, no comparisons, no comprehensions)."""
    try:
        tree = ast.parse(formula, mode="eval")
    except SyntaxError as e:
        raise FormulaError(f"could not parse formula: {e}") from e
    return float(_eval_node(tree.body, variables))


def _eval_node(node: ast.AST, variables: dict[str, float]) -> float:
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return float(node.value)
        raise FormulaError(f"unsupported constant: {node.value!r}")
    if isinstance(node, ast.Name):
        if node.id not in variables:
            raise FormulaError(f"unknown variable in formula: {node.id!r}")
        return float(variables[node.id])
    if isinstance(node, ast.BinOp):
        op = _BINOPS.get(type(node.op))
        if op is None:
            raise FormulaError(f"unsupported binary operator: {type(node.op).__name__}")
        return float(op(_eval_node(node.left, variables),
                        _eval_node(node.right, variables)))
    if isinstance(node, ast.UnaryOp):
        op = _UNARYOPS.get(type(node.op))
        if op is None:
            raise FormulaError(f"unsupported unary operator: {type(node.op).__name__}")
        return float(op(_eval_node(node.operand, variables)))
    raise FormulaError(f"disallowed expression: {type(node).__name__}")

