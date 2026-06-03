import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Zap, TrendingUp, DollarSign, MapPin, Award, Battery, Gauge, Timer, Trash2, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { carsApi } from '../lib/supabaseClient';

export function ComparePage() {
  const [allCars, setAllCars] = useState<any[]>([]);
  const [selectedCars, setSelectedCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCars();

    // Загружаем сохранённое сравнение из localStorage
    const saved = localStorage.getItem('compareCars');
    if (saved) {
      try {
        const savedIds = JSON.parse(saved);
        if (savedIds.length > 0) {
          // Будет заполнено после загрузки всех авто
        }
      } catch (e) {
        console.error('Ошибка загрузки сравнения:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (allCars.length > 0) {
      const saved = localStorage.getItem('compareCars');
      if (saved) {
        try {
          const savedIds = JSON.parse(saved);
          const carsToCompare = allCars.filter(car => savedIds.includes(car.id));
          if (carsToCompare.length > 0) {
            setSelectedCars(carsToCompare.slice(0, 3));
          } else {
            setSelectedCars(allCars.slice(0, 2));
          }
        } catch (e) {
          setSelectedCars(allCars.slice(0, 2));
        }
      } else {
        setSelectedCars(allCars.slice(0, 2));
      }
    }
  }, [allCars]);

  const fetchCars = async () => {
    try {
      const data = await carsApi.getAll();
      setAllCars(data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = (cars: any[]) => {
    const ids = cars.map(c => c.id);
    localStorage.setItem('compareCars', JSON.stringify(ids));
  };

  const addCar = (car: any) => {
    if (selectedCars.length < 3 && !selectedCars.find(c => c.id === car.id)) {
      const newSelected = [...selectedCars, car];
      setSelectedCars(newSelected);
      saveToLocalStorage(newSelected);
      setShowAddMenu(false);
      setSearchQuery('');
    }
  };

  const removeCar = (id: string) => {
    if (selectedCars.length > 1) {
      const newSelected = selectedCars.filter(car => car.id !== id);
      setSelectedCars(newSelected);
      saveToLocalStorage(newSelected);
    }
  };

  const clearAll = () => {
    setSelectedCars([allCars[0]]);
    saveToLocalStorage([allCars[0]]);
  };

  const getCarSpecValue = (car: any, spec: string) => {
    if (!car) return '—';

    switch (spec) {
      case 'price':
        return `${Number(car.price).toLocaleString()} SM`;
      case 'power':
        return `${car.power_hp || '—'} л.с.`;
      case 'range':
        return `${car.range_km || '—'} км`;
      case 'acceleration':
        return car.acceleration || '—';
      case 'type':
        return car.type || '—';
      case 'country':
        return car.country || '—';
      case 'delivery':
        return car.delivery_time || '—';
      case 'battery':
        return car.specs?.battery || '—';
      case 'warranty':
        return car.specs?.warranty || '—';
      case 'brand':
        return car.brand || '—';
      case 'year':
        return car.year || '—';
      default:
        return '—';
    }
  };

  // Данные для графиков
  const comparisonData = [
    {
      category: 'Мощность (л.с.)',
      ...selectedCars.reduce((acc, car, idx) => ({
        ...acc,
        [`car${idx + 1}`]: car.power_hp || 0
      }), {})
    },
    {
      category: 'Запас хода (км)',
      ...selectedCars.reduce((acc, car, idx) => ({
        ...acc,
        [`car${idx + 1}`]: car.range_km || 0
      }), {})
    },
    {
      category: 'Цена (тыс. SM)',
      ...selectedCars.reduce((acc, car, idx) => ({
        ...acc,
        [`car${idx + 1}`]: Math.round((car.price || 0) / 1000)
      }), {})
    },
  ];

  const radarData = [
    {
      subject: 'Мощность',
      ...selectedCars.reduce((acc, car, idx) => ({
        ...acc,
        [`car${idx + 1}`]: Math.min(((car.power_hp || 0) / 600) * 100, 100)
      }), {}),
      fullMark: 100
    },
    {
      subject: 'Запас хода',
      ...selectedCars.reduce((acc, car, idx) => ({
        ...acc,
        [`car${idx + 1}`]: Math.min(((car.range_km || 0) / 1000) * 100, 100)
      }), {}),
      fullMark: 100
    },
    {
      subject: 'Динамика',
      ...selectedCars.reduce((acc, car, idx) => {
        const accel = parseFloat(car.acceleration) || 10;
        return { ...acc, [`car${idx + 1}`]: Math.max(0, Math.min(100, (1 - accel / 10) * 100)) };
      }, {}),
      fullMark: 100
    },
    {
      subject: 'Цена/Качество',
      ...selectedCars.reduce((acc, car, idx) => {
        const priceScore = Math.max(0, Math.min(100, 100 - ((car.price || 0) / 500000) * 100));
        return { ...acc, [`car${idx + 1}`]: Math.round(priceScore) };
      }, {}),
      fullMark: 100
    },
  ];

  const colors = ['#2563eb', '#06b6d4', '#10b981'];

  const filteredAvailableCars = allCars.filter(car =>
    !selectedCars.find(c => c.id === car.id) &&
    (car.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  return (
    <div className="min-h-screen py-8 px-4 md:py-12 md:px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Сравнение автомобилей
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Выберите до 3 автомобилей для детального сравнения
          </p>
        </motion.div>

        {/* Карточки выбранных авто */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {selectedCars.map((car, index) => (
            <motion.div
              key={car.id}
              className="relative rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {selectedCars.length > 1 && (
                <button
                  onClick={() => removeCar(car.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <Link to={`/catalog/${car.id}`}>
                <div className="relative h-44">
                  <img
                    src={car.image_url || 'https://via.placeholder.com/400x300'}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/catalog/${car.id}`}>
                  <h3 className="text-lg font-bold hover:text-blue-600 transition-colors">{car.name}</h3>
                </Link>
                <p className="text-sm text-gray-500 mb-2">{car.brand} • {car.country}</p>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {Number(car.price).toLocaleString()} SM
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-md ${car.type === 'Электромобиль'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : car.type === 'Гибрид'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                    }`}>
                    {car.type}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {selectedCars.length < 3 && (
            <motion.button
              onClick={() => setShowAddMenu(true)}
              className="relative rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-all min-h-[280px] flex flex-col items-center justify-center gap-3"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Plus className="w-7 h-7 text-blue-600" />
              </div>
              <span className="font-medium text-gray-600 dark:text-gray-400">Добавить автомобиль</span>
            </motion.button>
          )}
        </div>

        {/* Кнопки управления */}
        {selectedCars.length > 0 && (
          <div className="flex justify-end mb-6">
            <button
              onClick={clearAll}
              className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Очистить сравнение
            </button>
          </div>
        )}

        {/* Модалка выбора */}
        {showAddMenu && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowAddMenu(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-auto"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Выберите автомобиль</h2>
                <button onClick={() => setShowAddMenu(false)} className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Поиск по названию или бренду..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredAvailableCars.map(car => (
                  <button
                    key={car.id}
                    onClick={() => addCar(car)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
                  >
                    <img
                      src={car.image_url || 'https://via.placeholder.com/100'}
                      alt={car.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold">{car.name}</h3>
                      <p className="text-sm text-gray-500">{car.brand}</p>
                      <p className="text-sm font-medium text-blue-600">
                        {Number(car.price).toLocaleString()} SM
                      </p>
                    </div>
                    <Plus className="w-5 h-5 text-blue-600" />
                  </button>
                ))}
              </div>

              {filteredAvailableCars.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Нет доступных автомобилей
                </p>
              )}
            </motion.div>
          </motion.div>
        )}

        {selectedCars.length >= 2 && (
          <>
            {/* Графики */}
            <motion.div
              className="p-5 md:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Визуальное сравнение
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3 text-sm">Сравнение характеристик</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      {selectedCars.map((car, idx) => (
                        <Bar key={car.id} dataKey={`car${idx + 1}`} fill={colors[idx]} name={car.name} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-medium mb-3 text-sm">Радар характеристик</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis tick={{ fontSize: 10 }} />
                      {selectedCars.map((car, idx) => (
                        <Radar
                          key={car.id}
                          name={car.name}
                          dataKey={`car${idx + 1}`}
                          stroke={colors[idx]}
                          fill={colors[idx]}
                          fillOpacity={0.3}
                        />
                      ))}
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Таблица сравнения */}
            <motion.div
              className="overflow-x-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="min-w-[800px] p-5 md:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold mb-4">Детальное сравнение</h2>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 font-medium text-gray-500">Характеристика</th>
                      {selectedCars.map(car => (
                        <th key={car.id} className="text-left py-3 font-bold">{car.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Бренд', icon: Award, spec: 'brand' },
                      { label: 'Цена', icon: DollarSign, spec: 'price' },
                      { label: 'Тип', icon: Zap, spec: 'type' },
                      { label: 'Страна', icon: MapPin, spec: 'country' },
                      { label: 'Год', icon: Award, spec: 'year' },
                      { label: 'Мощность', icon: Gauge, spec: 'power' },
                      { label: 'Запас хода', icon: TrendingUp, spec: 'range' },
                      { label: 'Разгон 0-100', icon: Timer, spec: 'acceleration' },
                      { label: 'Доставка', icon: MapPin, spec: 'delivery' },
                      { label: 'Батарея/Двигатель', icon: Battery, spec: 'battery' },
                      { label: 'Гарантия', icon: Award, spec: 'warranty' },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <td className="py-3 flex items-center gap-2">
                          <row.icon className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{row.label}</span>
                        </td>
                        {selectedCars.map(car => (
                          <td key={car.id} className="py-3">{getCarSpecValue(car, row.spec)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Преимущества */}
            <motion.div
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {selectedCars.map((car, idx) => {
                const advantages = [];
                if (car.type === 'Электромобиль') {
                  advantages.push('0% пошлина и НДС');
                  advantages.push('Экологичность');
                }
                if (car.power_hp > 300) advantages.push('Высокая мощность');
                if (car.range_km > 500) advantages.push('Большой запас хода');
                if (car.price < 300000) advantages.push('Доступная цена');

                return (
                  <div key={car.id} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <h4 className="font-bold mb-2" style={{ color: colors[idx] }}>{car.name}</h4>
                    <ul className="space-y-1">
                      {advantages.slice(0, 3).map((adv, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <span className="text-green-500">✓</span> {adv}
                        </li>
                      ))}
                    </ul>
                    <Link to={`/catalog/${car.id}`}>
                      <button className="mt-3 text-sm flex items-center gap-1" style={{ color: colors[idx] }}>
                        Подробнее <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                );
              })}
            </motion.div>
          </>
        )}

        {selectedCars.length < 2 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Добавьте минимум 2 автомобиля для сравнения
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
