import { useState, useEffect } from 'react';
import { 
  Sparkles, MapPin, Flame, Heart, TrendingUp, 
  RefreshCw, Loader, AlertCircle, ChevronRight 
} from 'lucide-react';
import { recommendationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FoodCard from '../components/FoodCard';
import { Link } from 'react-router-dom';

const RecommendationPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personalized');
  const [location, setLocation] = useState(null);

  // User preferences for recommendation
  const [preferences, setPreferences] = useState({
    prefer_spicy: false,
    prefer_soup: false,
    is_vegetarian: false,
    region: '',
    exclude_allergens: [],
  });

  useEffect(() => {
    loadRecommendations();
  }, [activeTab, user]);

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (activeTab) {
        case 'personalized':
          if (isAuthenticated) {
            response = await recommendationAPI.getPersonalized(12);
          } else {
            response = await recommendationAPI.getByTaste({ limit: 12 });
          }
          break;
          
        case 'nearby':
          if (location) {
            response = await recommendationAPI.getNearby(location.lat, location.lng, 12);
          } else {
            getUserLocation();
            response = await recommendationAPI.getByTaste({ limit: 12 });
          }
          break;
          
        case 'trending':
          response = await recommendationAPI.get({ 
            filter_type: 'popular',
            limit: 12 
          });
          break;
          
        case 'taste':
          response = await recommendationAPI.getByTaste({
            ...preferences,
            limit: 12,
          });
          break;
          
        default:
          response = await recommendationAPI.get({ limit: 12 });
      }
      
      setRecommendations(response.data.recommendations || response.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personalized', label: 'Dành cho bạn', icon: <Sparkles size={18} /> },
    { id: 'trending', label: 'Xu hướng', icon: <TrendingUp size={18} /> },
    { id: 'nearby', label: 'Gần đây', icon: <MapPin size={18} /> },
    { id: 'taste', label: 'Theo khẩu vị', icon: <Heart size={18} /> },
  ];

  const regions = ['Miền Bắc', 'Miền Trung', 'Miền Nam'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          <Sparkles className="inline-block mr-2 text-primary-500" />
          Gợi ý món ăn
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {isAuthenticated 
            ? `Xin chào ${user?.full_name}! Dưới đây là những món ăn được gợi ý dành riêng cho bạn.`
            : 'Khám phá những món ăn phù hợp với khẩu vị của bạn.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Taste Preferences (when taste tab is active) */}
      {activeTab === 'taste' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 animate-fadeIn">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Tùy chọn khẩu vị
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vùng miền
              </label>
              <select
                value={preferences.region}
                onChange={(e) => setPreferences({ ...preferences, region: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-primary-500 outline-none"
              >
                <option value="">Tất cả</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => setPreferences({ ...preferences, prefer_spicy: !preferences.prefer_spicy })}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                preferences.prefer_spicy
                  ? 'bg-red-500 text-white'
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              <Flame size={16} />
              Thích cay
            </button>
            <button
              onClick={() => setPreferences({ ...preferences, prefer_soup: !preferences.prefer_soup })}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                preferences.prefer_soup
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              🍜 Món nước
            </button>
            <button
              onClick={() => setPreferences({ ...preferences, is_vegetarian: !preferences.is_vegetarian })}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                preferences.is_vegetarian
                  ? 'bg-green-500 text-white'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            >
              🥬 Ăn chay
            </button>
          </div>

          <button
            onClick={loadRecommendations}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <RefreshCw size={18} />
            )}
            Cập nhật gợi ý
          </button>
        </div>
      )}

      {/* Nearby notice */}
      {activeTab === 'nearby' && !location && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 flex items-center gap-4">
          <MapPin className="text-blue-500 flex-shrink-0" size={24} />
          <div className="flex-1">
            <h4 className="font-medium text-gray-800">Cho phép truy cập vị trí</h4>
            <p className="text-sm text-gray-600">Để xem các món ăn phổ biến gần bạn</p>
          </div>
          <button
            onClick={getUserLocation}
            className="btn-primary"
          >
            Cho phép
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <Loader className="w-10 h-10 mx-auto text-primary-500 animate-spin mb-4" />
          <p className="text-gray-500">Đang tải gợi ý...</p>
        </div>
      )}

      {/* Recommendations Grid */}
      {!loading && recommendations.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendations.map((item, index) => (
            <div key={item.id || index} className="relative">
              <FoodCard food={item.food || item} />
              {item.score && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-primary-600">
                  {(item.score * 100).toFixed(0)}% phù hợp
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && recommendations.length === 0 && (
        <div className="text-center py-20">
          <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Chưa có gợi ý
          </h3>
          <p className="text-gray-500 mb-4">
            {isAuthenticated 
              ? 'Hãy tương tác nhiều hơn để nhận được gợi ý tốt hơn.'
              : 'Đăng nhập để nhận gợi ý cá nhân hóa.'}
          </p>
          {!isAuthenticated && (
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">
              Đăng nhập
              <ChevronRight size={18} />
            </Link>
          )}
        </div>
      )}

      {/* Refresh */}
      {!loading && recommendations.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadRecommendations}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Làm mới gợi ý
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
