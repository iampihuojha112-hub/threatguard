from functools import lru_cache

from app.core.config import get_settings
from ml.inference import PhishingPredictor


@lru_cache
def get_predictor() -> PhishingPredictor:
    return PhishingPredictor(get_settings().model_dir)
