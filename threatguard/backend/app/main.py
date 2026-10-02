import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import router
from app.core.config import get_settings

logger = logging.getLogger("threatguard")

app = FastAPI(title="ThreatGuard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.exception_handler(Exception)
async def unhandled(_: Request, exc: Exception):
    logger.exception("Unhandled error", exc_info=exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.get("/health")
def health():
    from app.services.analyzer import get_predictor

    predictor = get_predictor()
    try:
        predictor.load()
        return {"status": "ok", "model": predictor.model_name}
    except Exception as exc:
        return {"status": "degraded", "detail": str(exc)}


app.include_router(router)
