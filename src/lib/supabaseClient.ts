import { createClient } from '@supabase/supabase-js';

// ================================
// SUPABASE CONFIG
// ================================

const supabaseUrl ='https://nbmquntupeegnguxpruw.supabase.co';

const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ibXF1bnR1cGVlZ25ndXhwcnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzY5NjEsImV4cCI6MjA5NTY1Mjk2MX0.4NiVs-dwJ3EWPLiHzTMYK_wkXAWa1StejoJvJ35SmOs';

console.log('SUPABASE URL:', supabaseUrl);
console.log('SUPABASE KEY EXISTS:', !!supabaseAnonKey);

export const supabase = createClient(
supabaseUrl,
supabaseAnonKey
);

// ================================
// CARS API
// ================================

export const carsApi = {
getAll: async () => {
console.log('=== carsApi.getAll START ===');

try {
  console.log('Sending request to Supabase...');

  const response = await supabase
    .from('cars')
    .select('*');

  console.log('FULL RESPONSE:', response);

  const { data, error } = response;

  console.log('DATA:', data);
  console.log('ERROR:', error);

  if (error) {
    console.error('SUPABASE ERROR:', error);
    throw error;
  }

  console.log('SUCCESSFULLY LOADED CARS');

  return data;
} catch (e) {
  console.error('FETCH FAILED:', e);

  throw e;
}

},

getById: async (id: string) => {
console.log('=== carsApi.getById START ===');

try {
  const response = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();

  console.log('FULL RESPONSE:', response);

  const { data, error } = response;

  console.log('DATA:', data);
  console.log('ERROR:', error);

  if (error) {
    console.error('SUPABASE ERROR:', error);
    throw error;
  }

  console.log('SUCCESSFULLY LOADED CAR');

  return data;
} catch (e) {
  console.error('FETCH FAILED:', e);

  throw e;
}

}
};

// ================================
// FAVORITES API
// ================================

export const favoritesApi = {
getAll: async (userId: string) => {
console.log('=== favoritesApi.getAll START ===');

const favs = JSON.parse(
  localStorage.getItem('favs_' + userId) || '[]'
);

console.log('FAVORITES:', favs);

return favs;

},

toggle: async (
carId: string,
userId: string
) => {
console.log('=== favoritesApi.toggle START ===');

let favs = JSON.parse(
  localStorage.getItem('favs_' + userId) || '[]'
);

if (favs.includes(carId)) {
  favs = favs.filter(
    (id: string) => id !== carId
  );
} else {
  favs.push(carId);
}

localStorage.setItem(
  'favs_' + userId,
  JSON.stringify(favs)
);

console.log('UPDATED FAVORITES:', favs);

return favs.includes(carId);

}
};

// ================================
// ORDERS API
// ================================

export const ordersApi = {
create: async (orderData: any) => {
console.log('=== ordersApi.create START ===');

try {
  const order_number =
    'GI-TJ-' +
    new Date().getFullYear() +
    '-' +
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

  console.log('ORDER NUMBER:', order_number);

  // Получаем базовые этапы из Supabase
  const { data: stagesData, error: stagesError } = await supabase
    .from('tracking_stages')
    .select('*')
    .order('id', { ascending: true });

  if (stagesError) {
    console.error('Ошибка загрузки этапов:', stagesError);
  }

  const stages = stagesData?.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    location: s.location,
    completed: s.id === 1,
    locked: s.id !== 1, // первый этап всегда разблокирован
    date: s.id === 1 ? new Date().toISOString() : null
  })) || [];

  const tracking_info = {
    current_stage: 1,
    stages,
    current_location: stagesData?.[0]?.location || 'Худжанд, офис компании',
    estimated_delivery: null,
    admin_notes: '',
  };

  const response = await supabase
    .from('orders')
    .insert([
      {
        ...orderData,
        order_number,
        created_at: new Date().toISOString(),
        status: 'pending',
        tracking_info
      }
    ])
    .select()
    .single();

  console.log('FULL RESPONSE:', response);

  const { data, error } = response;

  console.log('DATA:', data);
  console.log('ERROR:', error);

  if (error) {
    console.error('SUPABASE ERROR:', error);
    throw error;
  }

  console.log('ORDER CREATED');

  return data;
} catch (e) {
  console.error('FETCH FAILED:', e);

  throw e;
}

},
getByOrderNumber: async (number: string) => {
  const { data, error } = await supabase.from('orders').select('*, cars(*)').eq('order_number', number).single();
  if (error) throw error;
  return data;
},
getByPhone: async (phone: string) => {
  const { data, error } = await supabase.from('orders').select('*, cars(*)').eq('customer_phone', phone);
  if (error) throw error;
  return data || [];
}
};

// ================================
// CONSULTATION API
// ================================

export const consultationApi = {
create: async (data: any) => {
console.log('=== consultationApi.create START ===');

try {
  const response = await supabase
    .from('consultations')
    .insert([data]);

  console.log('FULL RESPONSE:', response);

  const { error } = response;

  console.log('ERROR:', error);

  if (error) {
    console.error('SUPABASE ERROR:', error);
    throw error;
  }

  console.log('CONSULTATION CREATED');

  return true;
} catch (e) {
  console.error('FETCH FAILED:', e);

  throw e;
}

}
};

// ================================
// REALTIME
// ================================

export const subscribeToOrder = (
orderId: string,
callback: any
) => {
console.log(
'=== subscribeToOrder START ==='
);

try {
const subscription = supabase
.channel('order_updates')
.on(
'postgres_changes',
{
event: 'UPDATE',
schema: 'public',
table: 'orders',
filter: `id=eq.${orderId}`
},
(payload) => {
console.log(
'REALTIME PAYLOAD:',
payload
);

      callback(payload.new);
    }
  )
  .subscribe((status) => {
    console.log(
      'REALTIME STATUS:',
      status
    );
  });

console.log(
  'REALTIME SUBSCRIPTION CREATED'
);

return {
  unsubscribe: () => {
    console.log(
      'REALTIME UNSUBSCRIBE'
    );

    supabase.removeChannel(subscription);
  }
};

} catch (e) {
console.error(
'REALTIME FAILED:',
e
);

throw e;

}
};
