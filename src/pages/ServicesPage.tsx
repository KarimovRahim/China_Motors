import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Shield, Globe, FileText, Truck, Wrench, 
  HeadphonesIcon, Sparkles, CheckCircle, Battery, Car,
  Phone, MessageCircle, Calendar, Clock, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { consultationApi } from '../lib/supabaseClient';

const services = [
  {
    icon: Globe,
    title: 'Подбор автомобиля',
    description: 'Помощь в выборе идеального авто под ваши требования и бюджет',
    features: ['AI-подбор по параметрам', 'Конфигуратор импорта', 'Консультация эксперта', 'Проверка истории авто'],
    color: 'from-blue-600 to-cyan-500',
  },
  {
    icon: Truck,
    title: 'Доставка в Таджикистан',
    description: 'Надёжная логистика с полным контролем на каждом этапе',
    features: ['Ж/д доставка из Китая (12-25 дней)', 'Автодоставка через КПП Хоргос', 'Отслеживание онлайн', 'Страхование груза'],
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: FileText,
    title: 'Таможенное оформление',
    description: 'Профессиональное прохождение всех таможенных процедур',
    features: ['Сертификация в Таджикистане', 'Растаможка (0% на электрокары)', 'Подготовка документов', 'Юридическая поддержка'],
    color: 'from-blue-600 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Страхование',
    description: 'Защита от всех рисков на всех этапах',
    features: ['Страхование груза', 'КАСКО в Таджикистане', 'Гарантия производителя', 'Юридическая чистота'],
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Wrench,
    title: 'Сервис и обслуживание',
    description: 'Техническая поддержка после покупки',
    features: ['Гарантийное обслуживание', 'Ремонт и диагностика', 'Оригинальные запчасти', 'Помощь с зарядными станциями'],
    color: 'from-cyan-500 to-blue-600',
  },
];

const advantages = [
  { title: 'Прозрачность', description: 'Полный контроль на каждом этапе с онлайн-отслеживанием' },
  { title: 'Экономия', description: 'До 40% выгоднее на электромобилях за счёт льгот' },
  { title: 'Скорость', description: 'От 12 дней доставка из Китая в Худжанд' },
  { title: 'Гарантии', description: 'Юридическая чистота и страхование всех рисков' },
];

const faqs = [
  {
    q: 'Сколько времени занимает доставка в Таджикистан?',
    a: 'Из Китая — 12-25 дней (ж/д или автодоставка через КПП Хоргос).',
  },
  {
    q: 'Какие налоги при импорте электромобиля?',
    a: 'До 2033 года: 0% таможенная пошлина, 0% НДС, 0% акциз. Только регистрационный сбор 3%.',
  },
  {
    q: 'Можно ли ввезти авто с правым рулём?',
    a: 'Нет, в Таджикистан разрешён ввоз только автомобилей с левым расположением руля.',
  },
];

export function ServicesPage() {
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultForm, setConsultForm] = useState({
    name: '',
    phone: '',
    message: '',
    service: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const openWhatsApp = () => {
    const phone = '8618899599013';
    const message = encodeURIComponent('Здравствуйте! Интересуюсь услугами импорта автомобилей.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const openConsultModal = (service = '') => {
    setConsultForm({ name: '', phone: '', message: '', service });
    setSuccess(false);
    setShowConsultModal(true);
  };

  const handleConsultSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await consultationApi.create(consultForm);
      setSuccess(true);
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при отправке. Попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 md:py-12 md:px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Наши услуги
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Полный спектр услуг для импорта автомобиля в Таджикистан
          </p>
        </motion.div>

        {/* Сетка услуг */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
              <ul className="space-y-2 mb-4">
                {service.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openConsultModal(service.title)}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
              >
                Заказать консультацию →
              </button>
            </motion.div>
          ))}
        </div>

        {/* Баннер про электромобили */}
        <motion.div
          className="mb-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <Battery className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2 text-green-700 dark:text-green-400">
                Специальные условия на электромобили
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                В Таджикистане действует освобождение от таможенной пошлины, НДС и акциза 
                на ввоз электромобилей до 2033 года.
              </p>
            </div>
            <Link to="/catalog?type=electric">
              <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors whitespace-nowrap">
                Смотреть электромобили
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Преимущества */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {advantages.map((item, index) => (
              <motion.div
                key={index}
                className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="mb-12 p-6 md:p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Часто задаваемые вопросы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl md:text-4xl font-bold mb-3">Готовы заказать авто?</h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Получите бесплатную консультацию и точный расчёт стоимости
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => openConsultModal()}
              className="px-8 py-3 bg-white text-blue-600 rounded-xl font-medium hover:bg-opacity-90 transition-all inline-flex items-center justify-center gap-2"
            >
              <HeadphonesIcon className="w-5 h-5" />
              Бесплатная консультация
            </button>
            <button
              onClick={openWhatsApp}
              className="px-8 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </button>
          </div>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+86 188 9959 9013</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Худжанд, Таджикистан</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Пн-Сб: 9:00 – 18:00</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Модалка консультации */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full"
          >
            {!success ? (
              <>
                <h3 className="text-xl font-bold mb-4">Бесплатная консультация</h3>
                
                {consultForm.service && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Услуга: <span className="font-medium">{consultForm.service}</span>
                  </p>
                )}

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
                    placeholder="Ваш вопрос или комментарий"
                    value={consultForm.message}
                    onChange={(e) => setConsultForm({...consultForm, message: e.target.value})}
                    rows={3}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 resize-none"
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium disabled:opacity-50"
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
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Спасибо за обращение!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Мы свяжемся с вами в ближайшее время.
                </p>
                <button
                  onClick={() => setShowConsultModal(false)}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl"
                >
                  Закрыть
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
