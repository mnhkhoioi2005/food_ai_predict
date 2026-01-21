# 🍜 Vietnamese Food AI Recognition & Recommendation System

Hệ thống nhận diện và gợi ý món ăn Việt Nam bằng AI

## 📁 Project Structure

```
food_ai_predict/
├── 📁 ai_models/                    # AI/ML Models
│   ├── 📁 food_recognition/         # Mô hình nhận diện món ăn
│   │   ├── 📁 efficientnet/
│   │   ├── 📁 mobilenet/
│   │   ├── 📁 yolo/
│   │   └── 📁 vision_transformer/
│   ├── 📁 recommendation/           # Mô hình gợi ý
│   │   ├── 📁 content_based/
│   │   └── 📁 collaborative/
│   ├── 📁 trained_weights/          # Weights đã train
│   └── 📁 exports/                  # ONNX, TFLite exports
│
├── 📁 backend/                      # FastAPI Backend
│   ├── 📁 app/
│   │   ├── 📁 api/
│   │   │   ├── 📁 v1/
│   │   │   │   ├── 📁 endpoints/
│   │   │   │   │   ├── food_recognition.py
│   │   │   │   │   ├── food_search.py
│   │   │   │   │   ├── recommendation.py
│   │   │   │   │   ├── user.py
│   │   │   │   │   └── location.py
│   │   │   │   └── router.py
│   │   │   └── deps.py
│   │   ├── 📁 core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   ├── 📁 models/               # SQLAlchemy models
│   │   │   ├── food.py
│   │   │   ├── user.py
│   │   │   ├── ingredient.py
│   │   │   └── interaction.py
│   │   ├── 📁 schemas/              # Pydantic schemas
│   │   │   ├── food.py
│   │   │   ├── user.py
│   │   │   └── recommendation.py
│   │   ├── 📁 services/
│   │   │   ├── ai_service.py
│   │   │   ├── recommendation_service.py
│   │   │   ├── search_service.py
│   │   │   └── location_service.py
│   │   ├── 📁 utils/
│   │   │   ├── image_processing.py
│   │   │   └── translation.py
│   │   └── main.py
│   ├── 📁 migrations/               # Alembic migrations
│   ├── requirements.txt
│   └── Dockerfile
│
├── 📁 ai_server/                    # TensorFlow Serving / ONNX Runtime
│   ├── 📁 serving/
│   │   ├── model_loader.py
│   │   ├── inference.py
│   │   └── preprocessing.py
│   ├── config.yaml
│   └── Dockerfile
│
├── 📁 frontend/                     # Web Frontend
│   ├── 📁 web/                      # React/Next.js Web App
│   │   ├── 📁 public/
│   │   ├── 📁 src/
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📁 common/
│   │   │   │   ├── 📁 food/
│   │   │   │   │   ├── FoodCard.jsx
│   │   │   │   │   ├── FoodDetail.jsx
│   │   │   │   │   └── FoodGallery.jsx
│   │   │   │   ├── 📁 camera/
│   │   │   │   │   ├── CameraCapture.jsx
│   │   │   │   │   └── ImageUpload.jsx
│   │   │   │   ├── 📁 search/
│   │   │   │   │   ├── SearchBar.jsx
│   │   │   │   │   └── FilterPanel.jsx
│   │   │   │   └── 📁 recommendation/
│   │   │   │       └── RecommendationList.jsx
│   │   │   ├── 📁 pages/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Recognition.jsx
│   │   │   │   ├── Search.jsx
│   │   │   │   ├── FoodDetail.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── 📁 hooks/
│   │   │   ├── 📁 services/
│   │   │   │   └── api.js
│   │   │   ├── 📁 utils/
│   │   │   ├── 📁 i18n/             # Đa ngôn ngữ
│   │   │   │   ├── vi.json
│   │   │   │   └── en.json
│   │   │   └── App.jsx
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── 📁 mobile/                   # React Native / Flutter App
│       ├── 📁 src/
│       │   ├── 📁 screens/
│       │   ├── 📁 components/
│       │   ├── 📁 navigation/
│       │   └── 📁 services/
│       └── package.json
│
├── 📁 data/                         # Data & Datasets
│   ├── 📁 raw/                      # Dữ liệu thô
│   │   └── 📁 images/
│   ├── 📁 processed/                # Dữ liệu đã xử lý
│   ├── 📁 food_info/                # Thông tin món ăn
│   │   ├── foods.json
│   │   ├── ingredients.json
│   │   ├── regions.json
│   │   └── allergens.json
│   └── 📁 augmented/                # Dữ liệu augmented
│
├── 📁 notebooks/                    # Jupyter Notebooks
│   ├── 01_data_exploration.ipynb
│   ├── 02_data_preprocessing.ipynb
│   ├── 03_model_training.ipynb
│   ├── 04_model_evaluation.ipynb
│   └── 05_recommendation_system.ipynb
│
├── 📁 scripts/                      # Utility Scripts
│   ├── download_dataset.py
│   ├── preprocess_images.py
│   ├── train_model.py
│   ├── export_model.py
│   └── seed_database.py
│
├── 📁 database/                     # Database
│   ├── 📁 schemas/
│   │   └── init.sql
│   ├── 📁 seeds/
│   │   └── foods_seed.sql
│   └── docker-compose.yml
│
├── 📁 tests/                        # Tests
│   ├── 📁 unit/
│   ├── 📁 integration/
│   └── 📁 e2e/
│
├── 📁 docs/                         # Documentation
│   ├── API.md
│   ├── SETUP.md
│   ├── MODEL_TRAINING.md
│   └── 📁 diagrams/
│
├── 📁 config/                       # Configuration files
│   ├── .env.example
│   ├── .env.development
│   └── .env.production
│
├── docker-compose.yml               # Docker Compose
├── .gitignore
├── mota.txt
└── README.md
```

## 🚀 Features

### 1. Nhận diện món ăn
- Upload hình ảnh món ăn
- Chụp ảnh trực tiếp từ camera
- Nhận diện real-time

### 2. Thông tin món ăn đa ngôn ngữ
- Tên món (Việt/Anh)
- Vùng miền xuất xứ
- Nguyên liệu
- Cách ăn đúng
- Cảnh báo dị ứng

### 3. Tìm kiếm & Lọc
- Tìm kiếm theo từ khóa
- Lọc theo vùng miền, nguyên liệu, loại món

### 4. Gợi ý thông minh
- Theo vị trí hiện tại (Google Maps)
- Theo khẩu vị cá nhân
- Theo lịch sử tương tác

## 🛠 Tech Stack

- **AI/ML**: EfficientNet, MobileNet, YOLO, Vision Transformer
- **Recommendation**: Content-based & Collaborative Filtering
- **Backend**: FastAPI, TensorFlow Serving, ONNX Runtime
- **Database**: PostgreSQL
- **Frontend**: React.js / Next.js
- **Mobile**: React Native / Flutter
- **Maps**: Google Maps Platform
- **Containerization**: Docker

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd food_ai_predict

# Setup backend
cd backend
pip install -r requirements.txt

# Setup frontend
cd ../frontend/web
npm install

# Start with Docker
docker-compose up -d
```

## 📄 License

MIT License
