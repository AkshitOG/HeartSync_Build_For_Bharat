import sys
import traceback
from pathlib import Path

root_dir = Path(__file__).parent.parent
backend_dir = root_dir / "backend"
backend_src = backend_dir / "src"

if str(backend_src) not in sys.path:
    sys.path.insert(0, str(backend_src))
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="CareerGPS Platform")

startup_error = None
startup_tb = None

try:
    import careergps.main
    app = careergps.main.app
except Exception as e:
    startup_error = str(e)
    startup_tb = traceback.format_exc()
    print(f"CRITICAL STARTUP ERROR: {startup_error}")
    traceback.print_exc()

    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
    async def debug_error_handler(path: str):
        return JSONResponse(
            status_code=500,
            content={
                "error": "Python Startup Exception",
                "detail": startup_error,
                "traceback": startup_tb
            }
        )

handler = app
