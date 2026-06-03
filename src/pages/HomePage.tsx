import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Globe, Shield, TrendingUp, Sparkles, Timer, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

const carImages = [
  'https://images.unsplash.com/photo-1745715689234-6e64c312d6fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1752959837780-72d6192a5265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1753026351567-cb61056e4056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const countries = [
  {
    name: 'Китай',
    flag: '🇨🇳',
    cars: ['Zeekr', 'Sealion', 'Link&CO', 'Changan', 'Aion', 'Geely'],
    delivery: '12-25 дней',
    popular: 'Электромобили',
    advantage: 'Лучшие цены на электрокары',
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
    title: 'Электромобили 0% пошлина',
    description: 'Льготный ввоз электрокаров в Таджикистан до 2033 года',
  },
  {
    icon: Timer,
    title: 'Быстрая доставка',
    description: 'От 12 дней из Китая, отслеживание на каждом этапе',
  },
];

const stats = [
  { value: '100+', label: 'Видов автомобилей' },
  { value: '4', label: 'Страны импорта' },
  { value: '0%', label: 'Пошлина на электрокары' },
  { value: '12', label: 'Дней из Китая' },
];

const popularBrands = [
  { name: 'BYD', logo: '🇨🇳', models: 'Han, Tang, Atto 3' },
  { name: 'Changan', logo: '🇨🇳', models: 'Deepal SL03, Eado, UNI-V' },
  { name: 'Link&CO', logo: '🇨🇳', models: '01, 03, 09' },
  { name: 'Zeekr', logo: '🇨🇳', models: '001, 007, 009' },
  { name: 'NIO', logo: '🇨🇳', models: 'ET7, ES6, ES8' },
  { name: 'Aion', logo: '🇨🇳', models: 'Aion S, Aion V, Aion LX' },
  { name: 'Geely', logo: '🇨🇳', models: 'Geometry C, Emgrand, Monjaro' },
  { name: 'Sealion', logo: '🇨🇳', models: 'Seal, Dolphin, Song Plus' },
];

export function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredCountry, setHoveredCountry] = useState<any>(null);

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
  }, []);

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Hero Section - Текст слева, машина справа */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
          <motion.img
            key={currentImageIndex}
            src={carImages[currentImageIndex]}
            alt="Premium car"
            className="w-full h-full object-cover object-center"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
        </motion.div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-20 max-w-[1400px] mx-auto px-6 w-full">
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
              >
                <Flag className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white">Официальный импортёр в Таджикистане</span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-white font-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Импорт авто
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  в Таджикистан
                </span>
                <br />
                под ключ
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg font-light leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Электромобили с нулевой пошлиной. Доставка от 12 дней.
                Полное юридическое и техническое сопровождение.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Link to="/configurator">
                  <motion.button
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl overflow-hidden shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center gap-2 font-medium">
                      Подобрать автомобиль
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </Link>

                <Link to="/catalog">
                  <motion.button
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/20 transition-colors text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Смотреть каталог
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                className="flex items-center gap-8 mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-gray-300 mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Пустая колонка справа - машина видна */}
            <div className="hidden lg:block" />
          </div>
        </div>

        {/* Индикатор скролла */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative bg-white dark:bg-black">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display tracking-tight">Почему выбирают нас</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">Прозрачный импорт автомобилей в Таджикистан без переплат</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Map Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">География импорта</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Выберите страну и узнайте условия доставки</p>
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
              className="p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all cursor-pointer shadow-lg hover:shadow-xl"
              whileHover={{ y: -8, scale: 1.01 }}
            >
              {/* Флаг и название */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">{countries[0].flag}</div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {countries[0].name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Прямые поставки в Таджикистан</p>
                </div>
              </div>

              {/* Основные характеристики */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Доставка</p>
                    <p className="font-bold">{countries[0].delivery}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20">
                  <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Популярно</p>
                    <p className="font-bold">{countries[0].popular}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Особенность</p>
                    <p className="font-bold text-sm">{countries[0].advantage}</p>
                  </div>
                </div>
              </div>

              {/* Популярные бренды */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">🚗</span>
                  Популярные бренды из Китая:
                </p>
                <div className="flex flex-wrap gap-2">
                  {countries[0].cars.map((car) => (
                    <motion.span
                      key={car}
                      className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {car}
                    </motion.span>
                  ))}
                </div>
              </div>

               {/* Кнопка действия */}
               <div className="mt-6 text-center">
                <Link to="/catalog?country=china">
                  <motion.button
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Смотреть авто из Китая
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Эффект свечения при наведении */}
            {hoveredCountry === 'Китай' && (
              <motion.div
                className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Popular Brands Section */}
      <section className="py-20 px-6 bg-white dark:bg-black">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Популярные бренды</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Самые востребованные автомобили для импорта в Таджикистан</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularBrands.map((brand, index) => (
              <motion.div
                key={brand.name}
                className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center hover:border-blue-500 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl mb-2">{brand.logo}</div>
                <h4 className="font-bold mb-1">{brand.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{brand.models}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Как мы работаем</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">4 простых шага к вашему автомобилю</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Консультация', desc: 'Обсуждаем ваши пожелания, бюджет и сроки' },
              { step: '02', title: 'Подбор и покупка', desc: 'Находим лучший вариант, проверяем историю, выкупаем' },
              { step: '03', title: 'Доставка и таможня', desc: 'Организуем логистику, оформляем все документы' },
              { step: '04', title: 'Выдача в Таджикистане', desc: 'Передаём авто с полным пакетом документов' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-5xl font-bold text-blue-600/20 dark:text-blue-400/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Готовы заказать авто?</h2>
            <p className="text-xl mb-8 text-white/90">
              Получите бесплатную консультацию и точный расчёт стоимости за 5 минут
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/configurator">
                <motion.button
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-medium hover:bg-opacity-90 transition-all inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-5 h-5" />
                  Подобрать авто
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <motion.button
                onClick={openWhatsApp}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-medium hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Связаться с менеджером
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
