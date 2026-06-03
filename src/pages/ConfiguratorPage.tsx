import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, Car, Calendar, ArrowRight, Sparkles, MapPin, Zap, 
  DollarSign, CheckCircle, Battery, Fuel, Settings, ShoppingCart 
} from 'lucide-react';
import { carsApi, ordersApi } from '../lib/supabaseClient';

const carTypes = [
  { 
    id: 'electric', 
    name: 'Электромобиль', 
    icon: Battery, 
    color: 'from-green-500 to-emerald-600',
    description: '0% пошлина, 0% НДС до 2033 года',
    benefit: 'Экономия до 40% на налогах',
  },
  { 
    id: 'hybrid', 
    name: 'Гибрид', 
    icon: Settings, 
    color: 'from-blue-500 to-cyan-500',
    description: 'Сниженный акциз, экономия топлива',
    benefit: 'Оптимальный баланс',
  },
];

const budgetRanges = [
  { id: 'economy', label: 'Эконом', range: '150 000 – 250 000 SM', min: 150000, max: 250000 },
  { id: 'comfort', label: 'Комфорт', range: '250 000 – 350 000 SM', min: 250000, max: 350000 },
  { id: 'business', label: 'Бизнес', range: '350 000 – 500 000 SM', min: 350000, max: 500000 },
  { id: 'premium', label: 'Премиум', range: 'от 500 000 SM', min: 500000, max: 999999 },
];

const usageTypes = [
  { id: 'personal', label: 'Личное использование', icon: Car },
  { id: 'family', label: 'Семейный автомобиль', icon: Car },
  { id: 'business', label: 'Для бизнеса / такси', icon: Globe },
];

export function ConfiguratorPage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string|null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string|null>(null);
  const [selectedUsage, setSelectedUsage] = useState<string|null>(null);
  const [aiInput, setAiInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [allCars, setAllCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Для оформления заказа
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_city: 'Худжанд',
    notes: '',
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    fetchAllCars();
  }, []);

  const fetchAllCars = async () => {
    try {
      const data = await carsApi.getAll();
      setAllCars(data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const getRecommendations = () => {
    let filtered = [...allCars];
    
    // Фильтр по типу
    if (selectedType) {
      const typeMap: any = {
        electric: 'Электромобиль',
        hybrid: 'Гибрид',
        combustion: 'ДВС',
      };
      filtered = filtered.filter(car => car.type === typeMap[selectedType]);
    }
    
    // Фильтр по бюджету
    if (selectedBudget) {
      const budget = budgetRanges.find(b => b.id === selectedBudget);
      if (budget) {
        filtered = filtered.filter(car => {
          const price = Number(car.price);
          return price >= budget.min && price <= budget.max;
        });
      }
    }
    
    // Сортировка по популярности
    filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    
    // Добавляем процент совпадения
    const withMatch = filtered.slice(0, 3).map((car, index) => ({
      ...car,
      match: 98 - index * 3,
      reason: getRecommendationReason(car),
    }));
    
    return withMatch;
  };

  const getRecommendationReason = (car: any) => {
    const reasons = [];
    if (car.type === 'Электромобиль') reasons.push('0% пошлина и НДС');
    if (car.power_hp > 300) reasons.push('высокая мощность');
    if (car.range_km > 500) reasons.push('большой запас хода');
    if (car.popular) reasons.push('популярная модель');
    return reasons.slice(0, 2).join(', ') || 'Отличный выбор';
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const recs = getRecommendations();
      setRecommendations(recs);
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepComplete = () => {
    if (step === 1) return selectedType !== null;
    if (step === 2) return selectedBudget !== null;
    if (step === 3) return selectedUsage !== null;
    return true;
  };

  const handleReset = () => {
    setStep(1);
    setSelectedType(null);
    setSelectedBudget(null);
    setSelectedUsage(null);
    setShowResults(false);
  };

  const handleOrderClick = (car: any) => {
    setSelectedCar(car);
    setOrderForm({
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      customer_city: 'Худжанд',
      notes: `Подобрано через конфигуратор. Тип: ${car.type}, Бюджет: ${budgetRanges.find(b => b.id === selectedBudget)?.label}`,
    });
    setOrderSuccess(false);
    setShowOrderModal(true);
  };

  const handleOrderSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const order = await ordersApi.create({
        car_id: selectedCar.id,
        ...orderForm,
        total_price: selectedCar.price,
        status: 'pending',
      });
      
      setOrderNumber(order.order_number);
      setOrderSuccess(true);
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
      alert('Ошибка при создании заказа. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen py-8 px-4 md:py-12 md:px-6 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 mb-4">
              <CheckCircle className="w-4 h-4" />
              <span>Подбор завершён</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Ваши идеальные варианты</h1>
            <p className="text-gray-600 dark:text-gray-400">
              На основе ваших предпочтений
            </p>
          </motion.div>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {recommendations.map((car, index) => (
                <motion.div
                  key={car.id}
                  className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative h-48">
                    <img 
                      src={car.image_url || 'https://via.placeholder.com/400x300'} 
                      alt={car.name} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">
                      {car.match}% совпадение
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">{car.country}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="text-sm text-gray-500">{car.type}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{car.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 capitalize">{car.reason}</p>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {Number(car.price).toLocaleString()} SM
                    </div>
                    <p className="text-xs text-gray-500 mb-4">под ключ • доставка {car.delivery_time}</p>
                    
                    <div className="flex gap-2">
                      <Link to={`/catalog/${car.id}`} className="flex-1">
                        <button className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm">
                          Подробнее
                        </button>
                      </Link>
                      <button
                        onClick={() => handleOrderClick(car)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all text-sm flex items-center justify-center gap-1"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Заказать
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                К сожалению, по вашему запросу ничего не найдено
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl"
              >
                Попробовать другие параметры
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={handleReset}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Начать новый подбор
            </button>
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
                    <p className="font-medium">{selectedCar?.name}</p>
                    <p className="text-sm text-gray-500">{Number(selectedCar?.price).toLocaleString()} SM</p>
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

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium disabled:opacity-50"
                      >
                        {loading ? 'Отправка...' : 'Отправить заявку'}
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
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Заказ оформлен!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Номер вашего заказа:</p>
                  <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-4">
                    {orderNumber}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Мы свяжемся с вами в ближайшее время.
                  </p>
                  <div className="flex gap-3">
                    <Link
                      to={`/tracking?order=${orderNumber}`}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-xl"
                    >
                      Отслеживать заказ
                    </Link>
                    <button
                      onClick={() => {
                        setShowOrderModal(false);
                        setOrderSuccess(false);
                      }}
                      className="flex-1 py-3 bg-gray-200 dark:bg-gray-800 rounded-xl"
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 md:py-12 md:px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-[900px] mx-auto">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-display tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Конфигуратор импорта
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light">Подберём автомобиль за 3 шага</p>
        </motion.div>

        {/* Прогресс */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= num
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                  }`}
                  animate={{ scale: step === num ? 1.1 : 1 }}
                >
                  {step > num ? <CheckCircle className="w-5 h-5" /> : num}
                </motion.div>
                {num < 3 && (
                  <div className={`w-16 md:w-24 h-0.5 mx-2 ${step > num ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="mb-10"
          >
            {/* Шаг 1: Тип двигателя */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-2 text-center">Выберите тип двигателя</h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">Какой автомобиль вам нужен?</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {carTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-6 rounded-2xl text-center transition-all ${
                        selectedType === type.id
                          ? 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-500'
                          : 'bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 hover:border-blue-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mx-auto mb-4`}>
                        <type.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{type.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{type.description}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">{type.benefit}</p>
                    </motion.button>
                  ))}
                </div>

                {selectedType === 'electric' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  >
                    <p className="text-sm text-green-700 dark:text-green-400 text-center">
                      ⚡ Электромобили в Таджикистане: 0% пошлина, 0% НДС, 0% акциз до 2033 года
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Шаг 2: Бюджет */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-2 text-center">Ваш бюджет</h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">Выберите ценовой диапазон</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {budgetRanges.map((budget) => (
                    <motion.button
                      key={budget.id}
                      onClick={() => setSelectedBudget(budget.id)}
                      className={`p-5 rounded-2xl transition-all ${
                        selectedBudget === budget.id
                          ? 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-500'
                          : 'bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 hover:border-blue-300'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <h3 className="text-xl font-bold mb-1">{budget.label}</h3>
                      <p className="text-gray-500">{budget.range}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Шаг 3: Использование */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-2 text-center">Цель использования</h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">Как будете использовать авто?</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {usageTypes.map((usage) => (
                    <motion.button
                      key={usage.id}
                      onClick={() => setSelectedUsage(usage.id)}
                      className={`p-5 rounded-2xl transition-all ${
                        selectedUsage === usage.id
                          ? 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-500'
                          : 'bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 hover:border-blue-300'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <usage.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-bold">{usage.label}</h3>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Навигация */}
        <div className="flex justify-between max-w-2xl mx-auto">
          {step > 1 && (
            <motion.button
              onClick={handleBack}
              className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Назад
            </motion.button>
          )}

          <motion.button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className={`ml-auto px-6 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 text-sm ${
              isStepComplete()
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={isStepComplete() ? { scale: 1.02 } : {}}
            whileTap={isStepComplete() ? { scale: 0.98 } : {}}
          >
            {step === 3 ? 'Показать результаты' : 'Далее'}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
