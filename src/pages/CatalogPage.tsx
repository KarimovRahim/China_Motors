import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Zap, TrendingUp, Filter, Search, Battery, Gauge, Timer, ShoppingCart, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { carsApi, favoritesApi, ordersApi } from '../lib/supabaseClient';

const filters = [
  { label: 'Все авто', value: 'all' },
  { label: 'Электромобили', value: 'electric' },
  { label: 'Гибриды', value: 'hybrid' },
];

const countries = [
  { label: '🇨🇳 Китай', value: 'china' },
];

const sortOptions = [
  { label: 'По популярности', value: 'popular' },
  { label: 'Цена: по возрастанию', value: 'price-asc' },
  { label: 'Цена: по убыванию', value: 'price-desc' },
];

export function CatalogPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hoveredCar, setHoveredCar] = useState<any>(null);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Модалка заказа
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
  const [submitting, setSubmitting] = useState(false);

  const userId = 'guest-' + Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    fetchCars();
    loadFavorites();
  }, []);

  const fetchCars = async () => {
    try {
      const data = await carsApi.getAll();
      setCars(data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favs = await favoritesApi.getAll(userId);
      setFavorites(favs.map((c: any) => c.id));
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
    }
  };

  const toggleFavorite = async (carId: string) => {
    try {
      const isFav = await favoritesApi.toggle(carId, userId);
      setFavorites(prev => 
        isFav ? [...prev, carId] : prev.filter(id => id !== carId)
      );
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleOrderClick = (car: any) => {
    setSelectedCar(car);
    setOrderForm({
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      customer_city: 'Худжанд',
      notes: '',
    });
    setOrderSuccess(false);
    setShowOrderModal(true);
  };

  const handleOrderSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const order = await ordersApi.create({
        car_id: selectedCar.id,
        customer_name: orderForm.customer_name,
        customer_phone: orderForm.customer_phone,
        customer_email: orderForm.customer_email,
        customer_city: orderForm.customer_city,
        total_price: selectedCar.price,
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

  const filteredCars = cars
    .filter(car => {
      if (selectedType === 'electric' && car.type !== 'Электромобиль') return false;
      if (selectedType === 'hybrid' && car.type !== 'Гибрид') return false;
      
      if (selectedCountry === 'china' && !car.country?.includes('Китай')) return false;
      if (selectedCountry === 'korea' && !car.country?.includes('Корея')) return false;
      if (selectedCountry === 'uae' && !car.country?.includes('ОАЭ')) return false;
      if (selectedCountry === 'usa' && !car.country?.includes('США')) return false;
      
      if (showOnlyInStock && !car.in_stock) return false;
      
      const price = Number(car.price);
      if (price < priceRange[0] * 1000 || price > priceRange[1] * 1000) return false;
      
      if (searchQuery && !car.name?.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !car.brand?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Загрузка каталога...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 md:py-12 md:px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-display tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Каталог автомобилей
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
            {cars.length} автомобилей доступно для заказа
          </p>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar Desktop / Mobile Modal Content */}
          <motion.div
            className={`fixed inset-0 z-50 lg:static lg:z-auto lg:block lg:col-span-1 ${isMobileFiltersOpen ? 'block' : 'hidden'}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Overlay for mobile modal */}
            {isMobileFiltersOpen && (
              <div 
                className="absolute inset-0 bg-black/60 lg:hidden"
                onClick={() => setIsMobileFiltersOpen(false)}
              />
            )}
            
            <div className="relative h-full lg:h-auto bg-white dark:bg-black lg:bg-transparent lg:dark:bg-transparent w-[85%] sm:w-[350px] lg:w-auto p-5 lg:p-0 overflow-y-auto lg:overflow-visible shadow-2xl lg:shadow-none delay-100 lg:sticky lg:top-24 space-y-5">
              
              <div className="flex justify-between items-center lg:hidden mb-4">
                <h3 className="font-bold text-xl">Фильтры</h3>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <X className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
              </div>

              <div className="lg:p-5 lg:rounded-2xl lg:bg-white lg:dark:bg-gray-900 border-none lg:border lg:border-gray-200 lg:dark:border-gray-800">
                <div className="hidden lg:flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-lg">Фильтры</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Поиск</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="BYD, Zeekr..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Тип двигателя</label>
                    <div className="space-y-1.5">
                      {filters.map((filter) => (
                        <button
                          key={filter.value}
                          onClick={() => setSelectedType(filter.value)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm ${
                            selectedType === filter.value
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Страна</label>
                    <div className="space-y-1.5">
                      {countries.map((country) => (
                        <button
                          key={country.value}
                          onClick={() => setSelectedCountry(country.value)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm ${
                            selectedCountry === country.value
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {country.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Цена до: {priceRange[1]}k SM
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e: any) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showOnlyInStock}
                        onChange={(e: any) => setShowOnlyInStock(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm">Только в наличии</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="lg:p-5 lg:rounded-2xl lg:bg-white lg:dark:bg-gray-900 border-none lg:border lg:border-gray-200 lg:dark:border-gray-800">
                <label className="text-sm font-medium mb-2 block">Сортировка</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm outline-none"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {favorites.length > 0 && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    <h3 className="font-bold">Избранное</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {favorites.length} {favorites.length === 1 ? 'автомобиль' : 
                     favorites.length < 5 ? 'автомобиля' : 'автомобилей'}
                  </p>
                  <Link to="/compare">
                    <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Сравнить выбранное
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Cars Grid */}
          <div className="lg:col-span-3 order-first lg:order-none">
            <div className="mb-4 flex flex-row justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-xl lg:bg-transparent lg:p-0">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Найдено: {filteredCars.length} авто
              </p>
              
              <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex items-center gap-2 lg:hidden px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm font-medium text-sm hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 text-blue-600" />
                Фильтры
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredCar(car.id)}
                  onMouseLeave={() => setHoveredCar(null)}
                >
                  <div className="relative rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-lg">
                    <Link to={`/catalog/${car.id}`}>
                      <div className="relative h-52 overflow-hidden">
                        <motion.img
                          src={car.image_url || 'https://via.placeholder.com/400x300'}
                          alt={car.name}
                          className="w-full h-full object-cover"
                          animate={{ scale: hoveredCar === car.id ? 1.08 : 1 }}
                          transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {car.popular && (
                          <div className="absolute top-3 left-3 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            ТОП
                          </div>
                        )}
                      </div>
                    </Link>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(car.id);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform z-10"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(car.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-700'
                        }`}
                      />
                    </button>

                    <div className="p-4">
                      <Link to={`/catalog/${car.id}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold">{car.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{car.brand} • {car.year}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                              {Number(car.price).toLocaleString()} SM
                            </div>
                            <div className="text-xs text-gray-500">{car.price_usd}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-0.5 text-xs rounded-md ${
                            car.type === 'Электромобиль' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : car.type === 'Гибрид'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                          }`}>
                            {car.type}
                          </span>
                          <span className="text-sm text-gray-500">{car.country}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Battery className="w-4 h-4 text-green-500" />
                            <div>
                              <div className="text-xs text-gray-500">Запас хода</div>
                              <div className="text-sm font-medium">{car.range_km} км</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Gauge className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="text-xs text-gray-500">Мощность</div>
                              <div className="text-sm font-medium">{car.power_hp} л.с.</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                          <Timer className="w-4 h-4" />
                          Доставка: {car.delivery_time}
                        </div>
                      </Link>

                      <div className="flex gap-2">
                        <Link to={`/catalog/${car.id}`} className="flex-1">
                          <button className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm font-medium">
                            Подробнее
                          </button>
                        </Link>
                        <button
                          onClick={() => handleOrderClick(car)}
                          className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Заказать
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Автомобили не найдены</p>
                <button
                  onClick={() => {
                    setSelectedType('all');
                    setSelectedCountry('all');
                    setSearchQuery('');
                    setPriceRange([0, 500000]);
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модалка оформления заказа */}
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
                
                {selectedCar && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-4">
                    <p className="font-medium">{selectedCar.name}</p>
                    <p className="text-sm text-gray-500">{Number(selectedCar.price).toLocaleString()} SM</p>
                  </div>
                )}

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
    </div>
  );
}
