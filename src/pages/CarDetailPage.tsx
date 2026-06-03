import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, Share2, Zap, Shield, Clock,
  Calculator, CheckCircle, Battery, Gauge, ShoppingCart,
  Phone, MessageCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { carsApi, favoritesApi, ordersApi, consultationApi } from '../lib/supabaseClient';

export function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_city: 'Худжанд',
    notes: '',
  });
  const [consultForm, setConsultForm] = useState({
    name: '',
    phone: '',
    question: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const userId = 'guest-' + Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const data = await carsApi.getById(id!);
      setCar(data);
      
      const favs = await favoritesApi.getAll(userId);
      setIsFavorite(favs.some((c: any) => c.id === data?.id));
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      navigate('/catalog');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const isFav = await favoritesApi.toggle(car.id, userId);
      setIsFavorite(isFav);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: car.name,
        text: `${car.brand} ${car.name} — ${car.price} SM`,
        url: window.location.href,
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована!');
    }
  };

  const handleOrderSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const order = await ordersApi.create({
        car_id: car.id,
        customer_name: orderForm.customer_name,
        customer_phone: orderForm.customer_phone,
        customer_email: orderForm.customer_email,
        customer_city: orderForm.customer_city,
        total_price: car.price,
        notes: orderForm.notes,
        status: 'pending',
      });
      
      setOrderNumber(order.order_number);
      setOrderSuccess(true);
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
      alert('Ошибка при создании заказа. Попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConsultSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await consultationApi.create({
        ...consultForm,
        car_model: car.name,
      });
      alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
      setShowConsultModal(false);
      setConsultForm({ name: '', phone: '', question: '' });
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при отправке. Попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const phone = '8618899599013';
    const message = encodeURIComponent(`Здравствуйте! Интересуюсь автомобилем ${car.name}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const calculateImportCosts = () => {
    if (!car) return [];
    
    const basePrice = Number(car.price) * 0.79; 
    const delivery = car.country?.includes('Китай') ? 18500 : 25000;
    const customs = car.type === 'Электромобиль' ? 0 : basePrice * 0.15;
    const vat = car.type === 'Электромобиль' ? 0 : (basePrice + customs) * 0.14;
    const registration = Number(car.price) * 0.03;
    const documents = 3500;
    const total = Number(car.price);

    return [
      { label: 'Стоимость авто (EXW)', value: `${Math.round(basePrice).toLocaleString()} SM` },
      { label: 'Доставка до Худжанд', value: `${delivery.toLocaleString()} SM` },
      { label: 'Таможенная пошлина', value: car.type === 'Электромобиль' ? '0 SM (льгота)' : `${Math.round(customs).toLocaleString()} SM` },
      { label: 'НДС (14%)', value: car.type === 'Электромобиль' ? '0 SM (освобождение)' : `${Math.round(vat).toLocaleString()} SM` },
      { label: 'Регистрационный сбор', value: `${Math.round(registration).toLocaleString()} SM` },
      { label: 'Оформление', value: `${documents.toLocaleString()} SM` },
      { label: 'Итого под ключ', value: `${total.toLocaleString()} SM`, total: true },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!car) return null;

  const costs = calculateImportCosts();
  const images = car.images || [car.image_url];

  return (
    <div className="min-h-screen py-8 px-4 md:py-12 md:px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/catalog" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Назад к каталогу
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Левая колонка - Изображения */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="sticky top-28 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <motion.img
                  src={images[selectedImage]}
                  alt={car.name}
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                />

                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={toggleFavorite}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Навигация по изображениям */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((image: string, index: number) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-blue-500' : 'border-transparent'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img src={image} alt={`${car.name} ${index + 1}`} className="w-full h-20 object-cover" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Правая колонка - Информация */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Заголовок */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  car.type === 'Электромобиль' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium'
                    : car.type === 'Гибрид'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 font-medium'
                }`}>
                  {car.type}
                </span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">{car.country}</span>
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                  car.in_stock 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {car.in_stock ? 'В наличии' : 'Под заказ'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 font-display tracking-tight">{car.name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">{car.brand} • {car.year}</p>
            </div>

            {/* Цена */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {Number(car.price).toLocaleString()} SM
              </div>
              <div className="text-gray-600 dark:text-gray-400">{car.price_usd}</div>
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>Цена под ключ в Худжанд со всеми сборами</span>
              </div>
            </div>

            {/* Описание */}
            {car.description && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{car.description}</p>
            )}

            {/* Быстрые характеристики */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-500">Мощность</span>
                </div>
                <div className="text-xl font-bold">{car.power_hp} л.с.</div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Battery className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-500">Запас хода</span>
                </div>
                <div className="text-xl font-bold">{car.range_km} км</div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-500">Разгон 0-100</span>
                </div>
                <div className="text-xl font-bold">{car.acceleration}</div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-500">Доставка</span>
                </div>
                <div className="text-xl font-bold">{car.delivery_time}</div>
              </div>
            </div>

            {/* Калькулятор стоимости */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg">Расчёт стоимости импорта</h3>
              </div>

              <div className="space-y-2">
                {costs.map((cost: any, index: number) => (
                  <div
                    key={index}
                    className={`flex justify-between items-start ${
                      cost.total ? 'pt-3 mt-1 border-t-2 border-blue-200 dark:border-blue-800' : ''
                    }`}
                  >
                    <span className={cost.total ? 'text-base font-bold' : 'text-sm'}>
                      {cost.label}
                    </span>
                    <span className={cost.total ? 'text-xl font-bold text-blue-600 dark:text-blue-400' : ''}>
                      {cost.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Соответствие требованиям */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg">Соответствие требованиям РТ</h3>
              </div>
              <div className="space-y-2">
                {[
                  { text: 'Экологический стандарт Евро-4', ok: true },
                  { text: 'Левый руль', ok: true },
                  { text: 'ABS и системы безопасности', ok: true },
                  { text: `Год выпуска: ${car.year} (не старше 2013)`, ok: car.year >= 2013 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className={`w-4 h-4 ${item.ok ? 'text-green-500' : 'text-yellow-500'}`} />
                    <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
              
              {car.type === 'Электромобиль' && (
                <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    ✅ Электромобиль — 0% пошлина, 0% НДС, 0% акциз до 2033 года
                  </p>
                </div>
              )}
            </div>

            {/* Вкладки */}
            {car.specs && Object.keys(car.specs).length > 0 && (
              <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex border-b border-gray-200 dark:border-gray-800">
                  {['specs', 'features'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'specs' ? 'Характеристики' : 'Комплектация'}
                    </button>
                  ))}
                </div>
                <div className="p-5">
                  {activeTab === 'specs' ? (
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(car.specs).map(([key, value]: any) => (
                        <div key={key}>
                          <div className="text-xs text-gray-500 mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="font-medium">{value}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {(car.features || []).map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Кнопки действий */}
            <div className="space-y-3">
              <button
                onClick={() => setShowOrderModal(true)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Оформить заказ
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowConsultModal(true)}
                  className="py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Консультация
                </button>
                <button
                  onClick={openWhatsApp}
                  className="py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
              </div>
              
              <Link to="/compare" className="block">
                <button className="w-full py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 transition-colors text-sm">
                  ⚖️ Добавить к сравнению
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Модалка заказа */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-auto"
          >
            {!orderSuccess ? (
              <>
                <h3 className="text-xl font-bold mb-4">Оформление заказа</h3>
                
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-4">
                  <p className="font-medium">{car.name}</p>
                  <p className="text-sm text-gray-500">{Number(car.price).toLocaleString()} SM</p>
                </div>

                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Ваше имя *"
                    value={orderForm.customer_name}
                    onChange={(e) => setOrderForm({...orderForm, customer_name: e.target.value})}
                    required
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                  />
                  <input
                    type="tel"
                    placeholder="Телефон *"
                    value={orderForm.customer_phone}
                    onChange={(e) => setOrderForm({...orderForm, customer_phone: e.target.value})}
                    required
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={orderForm.customer_email}
                    onChange={(e) => setOrderForm({...orderForm, customer_email: e.target.value})}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="Город"
                    value={orderForm.customer_city}
                    onChange={(e) => setOrderForm({...orderForm, customer_city: e.target.value})}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                  />
                  <textarea
                    placeholder="Примечания к заказу"
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                    rows={3}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 resize-none"
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium disabled:opacity-50"
                    >
                      {submitting ? 'Отправка...' : 'Отправить заявку'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOrderModal(false)}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-800 rounded-xl"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Заказ оформлен!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Номер вашего заказа:
                </p>
                <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-4">
                  {orderNumber}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Мы свяжемся с вами в ближайшее время для подтверждения.
                </p>
                <button
                  onClick={() => {
                    setShowOrderModal(false);
                    setOrderSuccess(false);
                  }}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl"
                >
                  Понятно
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Модалка консультации */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Консультация</h3>
            <p className="text-gray-500 text-sm mb-4">
              Оставьте свои данные, и мы свяжемся с вами чтобы рассказать подробнее про {car.name}.
            </p>

            <form onSubmit={handleConsultSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя *"
                value={consultForm.name}
                onChange={(e) => setConsultForm({...consultForm, name: e.target.value})}
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              />
              <input
                type="tel"
                placeholder="Телефон *"
                value={consultForm.phone}
                onChange={(e) => setConsultForm({...consultForm, phone: e.target.value})}
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              />
              <textarea
                placeholder="Ваш вопрос (необязательно)"
                value={consultForm.question}
                onChange={(e) => setConsultForm({...consultForm, question: e.target.value})}
                rows={3}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 resize-none"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-50"
                >
                  {submitting ? 'Отправка...' : 'Отправить'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConsultModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-800 rounded-xl"
                >
                  Отмена
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
