import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, X, Loader, CheckCircle, AlertCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { recognitionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FoodCard from '../components/FoodCard';
import { Link } from 'react-router-dom';

const RecognitionPage = () => {
  const [mode, setMode] = useState('upload'); // 'upload' | 'camera'
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const { isAuthenticated } = useAuth();

  // Handle file upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.');
        return;
      }
      
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  // Capture from webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          setImage(file);
          setPreview(imageSrc);
          setResult(null);
          setError(null);
        });
    }
  }, [webcamRef]);

  // Submit for recognition
  const handleRecognize = async () => {
    if (!image) {
      setError('Vui lòng chọn hoặc chụp ảnh');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = mode === 'camera'
        ? await recognitionAPI.cameraCapture(image)
        : await recognitionAPI.uploadImage(image);
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Reset state
  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          <Camera className="inline-block mr-2 text-primary-500" />
          Nhận diện món ăn
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Chụp ảnh hoặc tải lên hình ảnh món ăn, AI sẽ nhận diện và cung cấp thông tin chi tiết
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('upload'); handleReset(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all
                ${mode === 'upload' ? 'bg-white shadow text-primary-600' : 'text-gray-600'}`}
            >
              <Upload size={18} />
              Tải ảnh lên
            </button>
            <button
              onClick={() => { setMode('camera'); handleReset(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all
                ${mode === 'camera' ? 'bg-white shadow text-primary-600' : 'text-gray-600'}`}
            >
              <Camera size={18} />
              Chụp ảnh
            </button>
          </div>

          {/* Upload Mode */}
          {mode === 'upload' && !preview && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all"
            >
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Kéo thả ảnh vào đây hoặc click để chọn
              </p>
              <p className="text-sm text-gray-400">
                Hỗ trợ: JPG, PNG, WEBP (tối đa 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Camera Mode */}
          {mode === 'camera' && !preview && (
            <div className="relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: "environment"
                }}
                onUserMedia={() => setCameraReady(true)}
                onUserMediaError={() => setError('Không thể truy cập camera. Vui lòng cấp quyền.')}
                className="w-full rounded-2xl"
              />
              {cameraReady && (
                <button
                  onClick={capture}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <div className="w-12 h-12 bg-primary-500 rounded-full" />
                </button>
              )}
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full rounded-2xl"
              />
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          {preview && !result && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Chọn ảnh khác
              </button>
              <button
                onClick={handleRecognize}
                disabled={loading}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Camera size={18} />
                    Nhận diện
                  </>
                )}
              </button>
            </div>
          )}

          {/* Auth notice */}
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-blue-50 text-blue-600 rounded-xl text-sm">
              💡 <Link to="/login" className="underline font-medium">Đăng nhập</Link> để lưu lịch sử nhận diện và nhận gợi ý cá nhân hóa.
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Kết quả nhận diện
          </h2>

          {!result && !loading && (
            <div className="text-center py-12 text-gray-400">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Kết quả sẽ hiển thị ở đây</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <Loader className="w-12 h-12 mx-auto mb-4 text-primary-500 animate-spin" />
              <p className="text-gray-600">Đang phân tích hình ảnh...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fadeIn">
              {/* Main prediction */}
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <CheckCircle size={20} />
                  <span className="font-medium">Nhận diện thành công!</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-1">
                  {result.predictions?.[0]?.food_name_vi || result.food_name || 'Món ăn Việt Nam'}
                </p>
                <p className="text-gray-500">
                  Độ tin cậy: {((result.predictions?.[0]?.confidence || result.confidence || 0.9) * 100).toFixed(1)}%
                </p>
              </div>

              {/* Top predictions */}
              {result.predictions && result.predictions.length > 1 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Các kết quả khác:</h3>
                  <div className="space-y-2">
                    {result.predictions.slice(1, 5).map((pred, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <span className="text-gray-700">{pred.food_name_vi}</span>
                        <span className="text-sm text-gray-500">
                          {(pred.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Food details */}
              {result.food && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Thông tin món ăn:</h3>
                  <FoodCard food={result.food} />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Nhận diện khác
                </button>
                {result.food && (
                  <Link
                    to={`/food/${result.food.id}`}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    Xem chi tiết
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-12 bg-primary-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          💡 Mẹo để có kết quả tốt nhất
        </h3>
        <ul className="grid md:grid-cols-2 gap-4 text-gray-600">
          <li className="flex items-start gap-2">
            <CheckCircle className="text-primary-500 mt-0.5 flex-shrink-0" size={18} />
            <span>Chụp ảnh rõ nét, đủ sáng</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="text-primary-500 mt-0.5 flex-shrink-0" size={18} />
            <span>Để món ăn ở trung tâm khung hình</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="text-primary-500 mt-0.5 flex-shrink-0" size={18} />
            <span>Tránh che khuất món ăn</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="text-primary-500 mt-0.5 flex-shrink-0" size={18} />
            <span>Chụp từ góc nhìn phía trên</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RecognitionPage;
