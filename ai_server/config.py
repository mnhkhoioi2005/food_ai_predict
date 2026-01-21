"""
AI Server Configuration
"""
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    DEBUG: bool = True
    
    # Model
    MODEL_TYPE: str = "efficientnet"  # efficientnet, mobilenet, resnet
    MODEL_PATH: str = "models/food_classifier.h5"
    LABELS_PATH: str = "models/labels.json"
    
    # Image
    IMAGE_SIZE: int = 224
    CONFIDENCE_THRESHOLD: float = 0.5
    
    class Config:
        env_file = ".env"


settings = Settings()
