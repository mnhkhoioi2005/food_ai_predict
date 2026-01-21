"""
AI Server - Vietnamese Food Recognition
FastAPI server để serve AI model nhận diện món ăn
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from config import settings
from model import get_classifier


# Pydantic models for response
class PredictionItem(BaseModel):
    label: str
    confidence: float
    rank: int


class PredictionResponse(BaseModel):
    success: bool
    predictions: List[PredictionItem]
    message: Optional[str] = None
    note: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    framework: str
    labels_count: int


# Create FastAPI app
app = FastAPI(
    title="Vietnamese Food Recognition AI",
    description="AI API để nhận diện món ăn Việt Nam từ hình ảnh",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Load model khi server start"""
    print("🚀 Starting AI Server...")
    classifier = get_classifier()
    print(f"✓ Model loaded: {classifier.framework}")
    print(f"✓ Labels: {len(classifier.labels)}")


@app.get("/", response_model=dict)
async def root():
    """Root endpoint"""
    return {
        "message": "Vietnamese Food Recognition AI Server",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    classifier = get_classifier()
    return HealthResponse(
        status="healthy",
        model_loaded=classifier.model is not None or classifier.framework == 'mock',
        framework=classifier.framework,
        labels_count=len(classifier.labels)
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """
    Nhận diện món ăn từ hình ảnh
    
    - **file**: File hình ảnh (JPG, PNG, WEBP)
    
    Returns:
        Danh sách predictions với label và confidence
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File phải là hình ảnh (JPG, PNG, WEBP)"
        )
    
    # Read file
    contents = await file.read()
    
    # Check file size (max 10MB)
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File quá lớn. Tối đa 10MB"
        )
    
    # Get prediction
    classifier = get_classifier()
    result = classifier.predict(contents)
    
    if not result['success']:
        raise HTTPException(
            status_code=500,
            detail=result.get('error', 'Prediction failed')
        )
    
    return PredictionResponse(
        success=True,
        predictions=[
            PredictionItem(**pred) for pred in result['predictions']
        ],
        message=f"Đã nhận diện {len(result['predictions'])} món ăn",
        note=result.get('note')
    )


@app.get("/labels")
async def get_labels():
    """
    Lấy danh sách các nhãn món ăn model có thể nhận diện
    """
    classifier = get_classifier()
    return {
        "total": len(classifier.labels),
        "labels": classifier.labels
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
