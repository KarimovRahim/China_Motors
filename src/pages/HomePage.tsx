import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Globe, Shield, TrendingUp, Sparkles, Timer, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { carsApi } from '../lib/supabaseClient';

const countries = [
  {
    name: 'Китай',
    flag: '🇨🇳',
    cars: ['Zeekr', 'Sealion', 'Link&CO', 'Changan', 'Aion', 'Geely'],
    delivery: '12-25 дней',
    popular: 'Электромобили',
    advantage: 'Лучшие цены',
  }
];

const features = [
  {
    icon: Globe,
    title: 'Импорт из Китая',
    description: 'Прямые поставки из Китая с полным сопровождением',
  },
  {
    icon: Zap,
    title: 'Электромобили 0%',
    description: 'Льготный ввоз электрокаров в Таджикистан до 2033 года',
  },
  {
    icon: Timer,
    title: 'Быстрая доставка',
    description: 'От 12 дней из Китая, отслеживание на каждом этапе',
  },
];

const stats = [
  { value: '100+', label: 'Видов авто' },
  { value: '4', label: 'Страны' },
  { value: '0%', label: 'Пошлина' },
  { value: '12+', label: 'Дней в пути' },
];

const popularBrands = [
  { name: 'BYD', logo: '🇨🇳', models: 'Han, Tang, Atto 3' },
  { name: 'Changan', logo: '🇨🇳', models: 'Deepal SL03, Eado, UNI-V' },
  { name: 'Link&CO', logo: '🇨🇳', models: '01, 03, 09' },
  { name: 'Zeekr', logo: '🇨🇳', models: '001, 007, 009' },
  { name: 'NIO', logo: '🇨🇳', models: 'ET7, ES6, ES8' },
  { name: 'Aion', logo: '🇨🇳', models: 'Aion S, Aion V' },
];

export function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredCountry, setHoveredCountry] = useState<any>(null);
  const [carImages, setCarImages] = useState([
    'https://images.unsplash.com/photo-1745715689234-6e64c312d6fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  ]);

  useEffect(() => {
    async function loadImages() {
      try {
        const cars = await carsApi.getAll();
        if (cars && cars.length > 0) {
          const imgs = cars.filter(c => c.images?.[0]).map(c => c.images[0]);
          if (imgs.length > 0) {
            // take up to 4 images
            setCarImages(imgs.slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Failed to load car images", err);
      }
    }
    loadImages();
  }, []);

  const openWhatsApp = () => {
    const phone = '8618899599013';
    const message = encodeURIComponent('Здравствуйте! Интересуюсь автомобилем из каталога');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carImages]);

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Hero Section - Текст слева, машина справа */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent lg:from-black/70 lg:via-black/40 z-10" />
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={carImages[currentImageIndex]}
              alt="Premium car"
              className="absolute inset-0 w-full h-full object-cover object-center"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            />
          </AnimatePresence>
        </motion.div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-6 w-full pt-16 mt-[-10vh] md:mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Текст слева */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4 md:mb-6"
              >
                <Flag className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                <span className="text-[10px] md:text-sm text-white font-medium uppercase tracking-wider">Официальный импортёр</span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-[1.1] tracking-tight text-white font-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Импорт авто
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  в Таджикистан
                </span>
              </motion.h1>

              <motion.p
                className="text-sm sm:text-base md:text-xl text-gray-300 mb-6 md:mb-8 max-w-lg font-light leading-relaxed drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Электромобили с нулевой пошлиной. Доставка от 12 дней. Полное юридическое сопровождение.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 md:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Link to="/configurator" className="w-full sm:w-auto">
                  <motion.button
                    className="w-full sm:w-auto group relative px-6 py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl overflow-hidden shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 font-medium text-sm md:text-base">
                      Подобрать автомобиль
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </Link>

                <Link to="/catalog" className="w-full sm:w-auto">
                  <motion.button
                    className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl hover:bg-white/20 transition-colors text-white font-medium text-sm md:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Смотреть каталог
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Пустая колонка справа - машина видна */}
            <div className="hidden lg:block" />
          </div>
        </div>

        {/* Индикатор скролла - скрыть на очень маленьких мобилках */}
        <motion.div
          className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5 md:p-2">
            <div className="w-1 h-1.5 md:h-2 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </section>
      
      {/* Stats Mobile - floating section just below hero or overlapping on mobile */}
      <section className="relative z-30 -mt-10 mb-10 px-4 md:-mt-16 sm:px-6 w-full max-w-[1400px] mx-auto">
         <motion.div
            className="flex items-center justify-between sm:justify-around bg-black/40 dark:bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center px-2 flex-1">
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md">
                  {stat.value}
                </div>
                <div className="text-[9px] sm:text-xs md:text-sm text-gray-300 mt-0.5 md:mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 relative bg-white dark:bg-black">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            className="text-center mb-10 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-6 font-display tracking-tight">Почему выбирают нас</h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-400 font-light">Прозрачный импорт автомобилей в Таджикистан без переплат</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative p-5 md:p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all flex sm:block items-center gap-4 sm:gap-0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 shrink-0 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center sm:mb-4">
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg sm:mb-2">{feature.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Map Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div
            className="text-center mb-10 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight">География импорта</h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-400">Выберите страну и узнайте условия доставки</p>
          </motion.div>

          {/* Карточка Китая - единственный элемент */}
          <motion.div
            className="relative group max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onMouseEnter={() => setHoveredCountry('Китай')}
            onMouseLeave={() => setHoveredCountry(null)}
          >
            <motion.div
              className="p-5 sm:p-8 rounded-[2rem] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all shadow-lg hover:shadow-xl"
              whileHover={{ y: -4, scale: 1.01 }}
            >
              {/* Флаг и название */}
              <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
                <div className="text-5xl md:text-6xl drop-shadow-sm">{countries[0].flag}</div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {countries[0].name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mt-1">Прямые поставки</p>
                </div>
              </div>

              {/* Основные характеристики - Сетка на мобилке по 2 колонки, или скроллируемая */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-5 md:mb-6">
                <div className="flex items-center gap-2.5 p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                  <Timer className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 leading-tight">Доставка</p>
                    <p className="font-bold text-xs md:text-sm">{countries[0].delivery}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-cyan-50 dark:bg-cyan-900/20">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 leading-tight">Популярно</p>
                    <p className="font-bold text-xs md:text-sm">{countries[0].popular}</p>
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1 flex items-center gap-2.5 p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-green-50 dark:bg-green-900/20">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400 shrink-0" />
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 leading-tight">Особенность</p>
                    <p className="font-bold text-xs md:text-sm">{countries[0].advantage}</p>
                  </div>
                </div>
              </div>

              {/* Популярные бренды */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs md:text-sm font-medium mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400">🚗</span>
                  Популярные бренды из Китая:
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {countries[0].cars.map((car) => (
                    <span
                      key={car}
                      className="px-3 py-1.5 md:px-4 md:py-2 text-[11px] md:text-sm rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 font-medium shadow-sm"
                    >
                      {car}
                    </span>
                  ))}
                </div>
              </div>

               {/* Кнопка действия */}
               <div className="mt-6 md:mt-8">
                <Link to="/catalog?country=china" className="block">
                  <motion.button
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl md:rounded-2xl font-medium shadow-md shadow-blue-500/20"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Смотреть авто из Китая
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Эффект свечения при наведении */}
            {hoveredCountry === 'Китай' && (
              <motion.div
                className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-xl md:blur-2xl transition-opacity duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Popular Brands Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-white dark:bg-black">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            className="text-center mb-10 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 tracking-tight">В центре внимания</h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-400">Самые востребованные автомобили для импорта в Таджикистан</p>
          </motion.div>

          {/* Горизонтальный скролл на мобильном */}
          <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {popularBrands.map((brand, index) => (
              <motion.div
                key={brand.name}
                className="min-w-[140px] w-[140px] md:min-w-0 md:w-auto p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-center hover:border-blue-500/50 transition-all snap-center shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <div className="text-3xl mb-2.5 drop-shadow-sm">{brand.logo}</div>
                <h4 className="font-bold text-sm md:text-base mb-1 text-gray-900 dark:text-white">{brand.name}</h4>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 leading-tight">{brand.models}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            className="text-center mb-10 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 tracking-tight">Как мы работаем</h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-400">4 простых шага к вашему автомобилю</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: '01', title: 'Консультация', desc: 'Обсуждаем ваши пожелания, бюджет и сроки.' },
              { step: '02', title: 'Подбор', desc: 'Находим лучший вариант, проверяем, выкупаем.' },
              { step: '03', title: 'Доставка', desc: 'Организуем логистику, оформляем документы.' },
              { step: '04', title: 'Выдача', desc: 'Передаём авто с полным пакетом в Худжанде.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600/10 to-cyan-500/10 dark:from-blue-400/10 dark:to-cyan-400/10 absolute top-4 right-6 pointer-events-none select-none">{item.step}</div>
                <h3 className="text-lg md:text-xl font-bold mb-2 mt-4 relative z-10 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-blue-600 to-cyan-500 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white tracking-tight leading-tight">Готовы заказать авто?</h2>
            <p className="text-base md:text-xl mb-8 md:mb-10 text-white/90 font-light px-4">
              Получите бесплатную консультацию и точный расчёт стоимости за 5 минут
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link to="/configurator" className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-6 py-4 md:px-8 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-xl hover:shadow-white/20 transition-all inline-flex items-center justify-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Подобрать авто
                </motion.button>
              </Link>

              <motion.button
                onClick={openWhatsApp}
                className="w-full sm:w-auto px-6 py-4 md:px-8 bg-transparent border-2 border-white/80 text-white rounded-2xl font-bold hover:bg-white/10 transition-all justify-center items-center flex"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Написать менеджеру
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

