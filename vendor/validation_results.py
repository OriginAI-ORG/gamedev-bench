# SPDX-License-Identifier: Apache-2.0
# Copyright upstream contributors; see corresponding LICENSE file.
# Extracted without function-body changes for the webgame pilot.
# Source: https://github.com/waynchi/gamedevbench/blob/48488b8ed70a3a1b1108f9062ba1774deb75b07a/gamedevbench/src/utils/data_types.py
# Modification: retained only named helpers and required standard-library imports.

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Optional


@dataclass
class ValidationResult:
    """Container for validation test results."""

    success: bool
    message: str
    details: Optional[Dict] = field(default_factory=dict)
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())

    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization."""
        return {
            "success": self.success,
            "message": self.message,
            "details": self.details,
            "timestamp": self.timestamp,
        }

    def __str__(self) -> str:
        status = "PASSED" if self.success else "FAILED"
        return f"{status}: {self.message}"

