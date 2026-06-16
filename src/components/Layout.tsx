import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, ChevronDown, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollToTop } from './ScrollToTop';

export function Layout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLogoExpanded, setIsLogoExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Главная', path: '/' },
    {
      name: 'Каталог',
      path: '/catalog',
      submenu: [
        { name: 'Электромобили', path: '/catalog?type=electric' },
        { name: 'Гибриды', path: '/catalog?type=hybrid' },
      ]
    },
    { name: 'Конфигуратор', path: '/configurator' },
    { name: 'Отслеживание', path: '/tracking' },
    { name: 'Сравнение', path: '/compare' },
    { name: 'Услуги', path: '/services' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <ScrollToTop />
      {/* Фиксированная группа: Top Bar + Header */}
      <div className="fixed top-0 left-0 right-0 z-50">

        {/* Main Header */}
        <motion.header
          className={`transition-all duration-300 ${
            isScrolled 
              ? 'bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-800/30 shadow-sm'
              : 'bg-white/40 dark:bg-black/40 backdrop-blur-md border-b border-transparent'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="max-w-[1400px] mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <Link 
                to="/" 
                className="flex items-center gap-3 group"
                onClick={(e) => {
                  e.preventDefault();
                  if (location.pathname === '/') {
                    setIsLogoExpanded(true);
                  } else {
                    navigate('/');
                  }
                }}
              >
                <motion.img
                  src="/logo.png"
                  alt="China Motors Logo"
                  className="w-11 h-11 rounded-xl shadow-lg shadow-blue-500/20"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                />
                <div className="hidden sm:block">
                  <h1 className="font-bold text-lg tracking-tight uppercase font-display bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:text-blue-500 transition-colors">
                    China Motors
                  </h1>
                  <p className="text-[10px] uppercase font-medium tracking-wider text-gray-500 dark:text-gray-400">Таджикистан</p>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-4">
                {navItems.map((item) => (
                  <div
                    key={item.path}
                    className="relative"
                    onMouseEnter={() => item.submenu && setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                        isActive(item.path)
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      {item.name}
                      {item.submenu && <ChevronDown className="w-4 h-4" />}
                    </Link>

                    {item.submenu && openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden"
                      >
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.path}
                            to={subitem.path}
                            className="block px-4 py-3 hover:bg-blue-50/70 dark:hover:bg-blue-900/30 transition-colors border-b border-gray-100/50 dark:border-gray-800/50 last:border-0"
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <motion.button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 backdrop-blur-sm transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Переключить тему"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.button>

                <Link to="/configurator">
                  <motion.button
                    className="hidden lg:block px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Подобрать авто
                  </motion.button>
                </Link>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 backdrop-blur-sm transition-colors"
                  aria-label="Меню"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50"
              >
                <div className="max-w-[1400px] mx-auto px-6 py-4 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-blue-50/70 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 px-4 py-2">
                      <Phone className="w-4 h-4" />
                      <a href="tel:+992990800051">+992 99 080 0051</a> ||
                      <a href="tel:+992928011170">+992 92 801 1170</a> ||
                      <a href="tel:+992902888880">+992 90 288 8880</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 px-4 py-2">
                      <MapPin className="w-4 h-4" />
                      <span>Худжанд, Автосалон Укоб (напротив аквопарка)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>

      <div className="h-[50px] lg:h-[50px]" />

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <div 
                className="flex items-center gap-2 mb-4 w-fit cursor-pointer group"
                onClick={() => setIsLogoExpanded(true)}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <motion.img 
                    src="/logo.png" 
                    alt="China Motors Logo" 
                    className="w-10 h-10 rounded-xl shadow-lg shadow-blue-500/20"
                    whileHover={{ scale: 1.05, rotate: -5 }}
                  />
                </div>
                <h3 className="font-bold text-lg tracking-tight uppercase font-display group-hover:text-blue-500 transition-colors">China Motors</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs md:max-w-none">
                Самые доступные и качественные автомобили из Китая в Таджикистане. Мы помогаем вам найти идеальное авто по лучшей цене, с полным сопровождением на каждом этапе импорта.
              </p>
            </div>

            <div className="flex justify-center md:justify-start lg:ml-12">
              <div>
                <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Услуги</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link to="/configurator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Конфигуратор</Link></li>
                  <li><Link to="/catalog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Каталог авто</Link></li>
                  <li><Link to="/tracking" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Отслеживание</Link></li>
                  <li><Link to="/compare" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Сравнение</Link></li>
                  <li><Link to="/services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Все услуги</Link></li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center md:justify-start">
              <div>
                <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Контакты</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <Phone className="w-4 h-4" />
                    <a href="tel:+992990800051" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">+992 99 080 0051</a>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <Phone className="w-4 h-4" />
                    <a href="tel:+992928011170" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">+992 92 801 1170</a>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <Phone className="w-4 h-4" />
                    <a href="tel:+992902888880" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">+992 90 288 8880</a>
                  </li>
                  <li className="mt-4 flex items-center justify-center md:justify-start gap-2">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="text-left">Худжанд, Автосалон Укоб <br /> (напротив аквопарка)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-200/50 dark:border-gray-800/50 mt-8 pt-8 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} China Motors TJ. Все права защищены.</p>
            <div className="flex items-center gap-2">
              <span>Разработано в</span>
              <a 
                href="https://www.learn-it-academy.site/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 px-3 py-1.5 overflow-hidden rounded-lg bg-[#0a0a0a] border border-[#222] transition-all duration-500 hover:border-[#F24E4E]/50 hover:bg-[#111] hover:shadow-[0_0_15px_rgba(242,78,78,0.2)] hover:-translate-y-0.5"
              >
                {/* Glow sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F24E4E]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                
                {/* Stylized cube icon */}
                <svg className="relative w-4 h-4 text-[#F24E4E] drop-shadow-[0_0_0_rgba(242,78,78,0)] group-hover:drop-shadow-[0_0_8px_rgba(242,78,78,0.8)] transition-all duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>

                {/* Animated text */}
                <span className="relative text-xs font-bold tracking-[0.15em] text-[#A3A3A3] group-hover:text-white transition-colors duration-300 uppercase">
                  Learn <span className="text-[#F24E4E] drop-shadow-[0_0_0_rgba(242,78,78,0)] group-hover:drop-shadow-[0_0_8px_rgba(242,78,78,0.8)] transition-all duration-300">IT</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Fullscreen Logo Modal */}
      <AnimatePresence>
        {isLogoExpanded && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsLogoExpanded(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 dark:bg-black/80 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.1 }}
              className="relative p-2"
            >
              <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 rounded-[3rem] blur-3xl animate-pulse" />
              <img
                src="/logo.png"
                alt="China Motors Extended Logo"
                className="w-64 h-64 md:w-96 md:h-96 rounded-[2.5rem] shadow-2xl shadow-blue-500/30 relative z-10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
