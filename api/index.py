import sys
import os
from pathlib import Path

# Add backend and backend/src to path
root_dir = Path(__file__).parent.parent
backend_dir = root_dir / "backend"
backend_src = backend_dir / "src"

sys.path.insert(0, str(backend_src))
sys.path.insert(0, str(backend_dir))

from careergps.main import app
