import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Package, CheckCircle, Truck, Home, MapPin, Clock, 
  FileText, Search, Phone, MessageCircle, Lock, AlertCircle 
} from 'lucide-react';
import { ordersApi, subscribeToOrder } from '../lib/supabaseClient';

const stageIcons: any = {
  1: FileText,
  2: CheckCircle,
  3: Package,
  4: Truck,
  5: FileText,
  6: Home,
};

export function TrackingPage() {
  const [searchType, setSearchType] = useState('order');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [orderList, setOrderList] = useState<any[]>([]);
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [expandedStage, setExpandedStage] = useState<any>(null);

  useEffect(() => {
    if (!order?.id) return;
    
    const subscription = subscribeToOrder(order.id, (updatedOrder: any) => {
      setOrder(updatedOrder);
      setTrackingInfo(updatedOrder.tracking_info);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [order?.id]);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);
    setOrderList([]);

    try {
      let result;
      if (searchType === 'order') {
        result = await ordersApi.getByOrderNumber(searchValue.trim().toUpperCase());
        if (!result.tracking_info) {
          result.tracking_info = createInitialTrackingInfo(result.created_at);
        }
        setOrder(result);
        setTrackingInfo(result.tracking_info);
      } else {
        const orders = await ordersApi.getByPhone(searchValue.trim());
        if (!orders || orders.length === 0) {
          throw new Error('Заказы не найдены');
        }
        
        if (orders.length === 1) {
          result = orders[0];
          if (!result.tracking_info) {
            result.tracking_info = createInitialTrackingInfo(result.created_at);
          }
          setOrder(result);
          setTrackingInfo(result.tracking_info);
        } else {
          setOrderList(orders);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Заказ не найден');
    } finally {
      setLoading(false);
    }
  };

  const selectOrder = (selectedOrder: any) => {
    let result = { ...selectedOrder };
    if (!result.tracking_info) {
      result.tracking_info = createInitialTrackingInfo(result.created_at);
    }
    setOrder(result);
    setTrackingInfo(result.tracking_info);
    setOrderList([]);
  };

  const createInitialTrackingInfo = (createdAt: string) => {
    return {
      current_stage: 1,
      stages: [
        { id: 1, title: 'Заявка принята', description: 'Ваша заявка получена и зарегистрирована в системе', location: 'Худжанд, офис компании', completed: true, date: createdAt, locked: false },
        { id: 2, title: 'Подтверждение заказа', description: 'Менеджер свяжется с вами для подтверждения деталей заказа', location: 'Худжанд, отдел продаж', completed: false, date: null, locked: true },
        { id: 3, title: 'Покупка автомобиля', description: 'Мы приобретаем автомобиль у официального дилера в Китае', location: 'Китай, дилерский центр', completed: false, date: null, locked: true },
        { id: 4, title: 'Доставка в Таджикистан', description: 'Автомобиль доставляется в Таджикистан через КПП Хоргос', location: 'КПП Хоргос, граница', completed: false, date: null, locked: true },
        { id: 5, title: 'Таможенное оформление', description: 'Прохождение таможенных процедур и оформление документов', location: 'Худжанд, таможенный пост', completed: false, date: null, locked: true },
        { id: 6, title: 'Готов к выдаче', description: 'Автомобиль готов к передаче. Вы можете забрать его в Худжанд', location: 'Худжанд, Автосалон', completed: false, date: null, locked: true },
      ],
      current_location: 'Худжанд, офис компании',
      estimated_delivery: null,
      admin_notes: '',
    };
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Ожидается';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProgress = (stages: any[]) => {
    if (!stages) return 0;
    const completed = stages.filter(s => s.completed).length;
    return Math.round((completed / stages.length) * 100);
  };

  const getStageStatus = (stage: any, index: number, stages: any[]) => {
    const previousStageCompleted = index === 0 || stages[index - 1]?.completed;
    const isLocked = stage.locked && !previousStageCompleted;
    
    return {
      isCompleted: stage.completed,
      isCurrent: stage.id === trackingInfo?.current_stage && !stage.completed,
      isLocked: isLocked,
      canBeUnlocked: previousStageCompleted,
    };
  };

  if (!order) {
    return (
      <div className="min-h-screen py-12 px-6 bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
          >
            <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-center">Отследить заказ</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Введите номер заказа или телефон для отслеживания
            </p>

            {orderList.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4 text-center">Выберите заказ</h3>
                {orderList.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => selectOrder(o)}
                    className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-500 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-blue-600">{o.order_number}</span>
                      <span className="text-xs text-gray-500">{formatDate(o.created_at)}</span>
                    </div>
                    <div className="text-sm font-medium">{o.cars?.name || 'Автомобиль'}</div>
                    <div className="text-xs text-gray-500 mt-1 capitalize">
                      Статус: {o.status === 'pending' ? 'В обработке' : o.status === 'processing' ? 'Выполняется' : o.status === 'shipped' ? 'В пути' : o.status === 'delivered' ? 'Доставлен' : o.status === 'cancelled' ? 'Отменён' : o.status}
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => setOrderList([])}
                  className="w-full mt-4 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium"
                >
                  Назад к поиску
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSearchType('order')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      searchType === 'order'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    По номеру заказа
                  </button>
                  <button
                    onClick={() => setSearchType('phone')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      searchType === 'phone'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    По телефону
                  </button>
                </div>

                <form onSubmit={handleSearch}>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder={searchType === 'order' ? 'Например: GI-TJ-2026-0001' : '+992 123 456 789'}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Поиск...' : 'Отследить'}
                  </button>
                </form>
              </>
            )}

          </motion.div>
        </div>
      </div>
    );
  }

  const stages = trackingInfo?.stages || [];
  const currentStage = trackingInfo?.current_stage || 1;
  const progress = calculateProgress(stages);

  const isCompleted = stages.every((s: any) => s.completed);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen py-8 px-4 md:py-12 md:px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Отслеживание доставки
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Заказ <span className="font-mono font-bold">{order.order_number}</span>
              </p>
            </div>
            <button
              onClick={() => {
                setOrder(null);
                setSearchValue('');
              }}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Другой заказ
            </button>
          </div>
        </motion.div>

        {/* Карточка заказа */}
        <motion.div
          className="mb-6 p-5 md:p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Автомобиль</div>
              <div className="font-bold">{order.cars?.name || 'Уточняется'}</div>
              {order.cars?.brand && (
                <div className="text-sm text-gray-500">{order.cars.brand}</div>
              )}
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Клиент</div>
              <div className="font-medium">{order.customer_name}</div>
              <div className="text-sm text-gray-500">{order.customer_phone}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Статус заказа</div>
              <div className={`font-medium flex items-center gap-1 ${
                order.status === 'delivered' ? 'text-green-600' :
                order.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {order.status === 'pending' && '⏳ В обработке'}
                {order.status === 'processing' && '🔄 Выполняется'}
                {order.status === 'shipped' && '🚚 В пути'}
                {order.status === 'delivered' && '✅ Доставлен'}
                {order.status === 'cancelled' && '❌ Отменён'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Дата заказа</div>
              <div className="font-medium">{formatDate(order.created_at)}</div>
            </div>
          </div>

          {isCancelled && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Заказ отменён. Свяжитесь с менеджером для уточнения деталей.
              </p>
            </div>
          )}

          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Прогресс выполнения</span>
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          </div>

          <div className="relative h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-600 dark:text-gray-400">Текущий этап:</span>
            <span className="font-medium">{stages.find((s: any) => s.id === currentStage)?.title || 'Не определен'}</span>
          </div>

          {trackingInfo?.estimated_delivery && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">Ожидаемая дата выдачи:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatDate(trackingInfo.estimated_delivery)}
              </span>
            </div>
          )}
        </motion.div>

        {/* Информация о процессе */}
        {!isCancelled && (
          <div className="mb-6 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Как это работает:</span> Каждый этап становится доступным только после завершения предыдущего. 
                  Администратор отмечает этапы по мере их выполнения.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Этапы */}
        <div className="relative">
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-cyan-500 to-gray-300 dark:to-gray-700" />

          <div className="space-y-4">
            {stages.map((stage: any, index: number) => {
              const Icon = stageIcons[stage.id] || Package;
              const status = getStageStatus(stage, index, stages);
              const isExpanded = expandedStage === stage.id;
              
              return (
                <motion.div
                  key={stage.id}
                  className="relative"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={`relative z-10 w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                        status.isCompleted
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                          : status.isCurrent
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse'
                          : status.isLocked
                          ? 'bg-gray-300 dark:bg-gray-700'
                          : 'bg-gray-200 dark:bg-gray-800'
                      }`}
                    >
                      {status.isLocked ? (
                        <Lock className="w-6 h-6 text-gray-500" />
                      ) : (
                        <Icon className={`w-6 h-6 ${
                          status.isCompleted || status.isCurrent ? 'text-white' : 'text-gray-500'
                        }`} />
                      )}
                    </div>

                    <div className="flex-1">
                      <div
                        className={`p-4 md:p-5 rounded-2xl transition-all cursor-pointer ${
                          status.isCurrent
                            ? 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-500'
                            : status.isCompleted
                            ? 'bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800'
                            : status.isLocked
                            ? 'bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 opacity-75'
                            : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
                        }`}
                        onClick={() => !status.isLocked && setExpandedStage(isExpanded ? null : stage.id)}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            {status.isLocked && (
                              <Lock className="w-4 h-4 text-gray-400 mt-1" />
                            )}
                            <div>
                              <h3 className={`font-bold text-lg mb-0.5 ${
                                status.isLocked ? 'text-gray-500 dark:text-gray-400' : ''
                              }`}>
                                {stage.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {status.isLocked 
                                  ? 'Этап заблокирован. Дождитесь завершения предыдущего этапа.'
                                  : status.isCompleted 
                                  ? 'Этап успешно завершён'
                                  : status.isCurrent 
                                  ? 'Выполняется сейчас'
                                  : 'Ожидает выполнения'
                                }
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className={status.isCompleted ? 'text-gray-500' : 'font-medium'}>
                              {stage.date ? formatDateTime(stage.date) : 'Ожидается'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{stage.location || 'Уточняется'}</span>
                        </div>

                        {isExpanded && !status.isLocked && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800"
                          >
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {stage.description || 'Описание отсутствует'}
                            </p>
                          </motion.div>
                        )}

                        {status.isCurrent && trackingInfo?.current_location && (
                          <div className="mt-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-xs text-blue-600 font-medium">
                              Активный этап • {trackingInfo.current_location}
                            </span>
                          </div>
                        )}

                        {status.isCompleted && (
                          <div className="mt-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-green-600 font-medium">
                              Завершено {stage.date && `• ${formatDate(stage.date)}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Завершение */}
        {isCompleted && (
          <motion.div
            className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
              Поздравляем! Автомобиль готов к выдаче
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Вы можете забрать автомобиль по адресу: Худжанд, ул. Рудаки 127
            </p>
            <p className="text-sm text-gray-500">
              Пожалуйста, свяжитесь с менеджером для согласования времени
            </p>
          </motion.div>
        )}

        {/* Контакты */}
        <motion.div
          className="mt-8 p-5 md:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-bold text-lg mb-3">Нужна помощь?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Свяжитесь с нами для уточнения деталей заказа
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/8618899599013"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-green-500 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <a
              href="tel:+902888880"
              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Позвонить
            </a>
          </div>
          
          {trackingInfo?.admin_notes && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium mb-1">Примечание от менеджера:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{trackingInfo.admin_notes}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
