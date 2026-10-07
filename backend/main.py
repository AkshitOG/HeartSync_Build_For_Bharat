import sys
from pathlib import Path

# Add src to sys.path so careergps can be imported cleanly
src_path = str(Path(__file__).parent / "src")
if src_path not in sys.path:
    sys.path.insert(0, src_path)

from careergps.main import app  # noqa: F401
