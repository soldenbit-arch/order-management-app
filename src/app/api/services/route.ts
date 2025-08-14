import { NextRequest, NextResponse } from 'next/server';

// Простое хранилище в памяти (в реальном проекте используйте базу данных)
let services = [
  {
    id: 1,
    name: "Фудтех-приложение",
    category: "Приложения",
    price: "100 000 ₽ +",
    description: "Полный набор функций для работы с заказами на доставку. Подходит для ресторанов, сервисов по доставке готовой еды или продуктов.",
    image: "/images/foodtech-application.png",
    features: ["Регистрация и авторизация", "Профиль пользователя", "Корзина и оформление заказа"]
  },
  {
    id: 2,
    name: "Интернет-магазин",
    category: "Приложения",
    price: "80 000 ₽ +",
    description: "Современный интернет-магазин с полным функционалом для продаж.",
    image: "/images/online-store.png",
    features: ["Каталог товаров", "Корзина", "Оплата", "Личный кабинет"]
  },
  {
    id: 3,
    name: "Социальная сеть",
    category: "Приложения",
    price: "120 000 ₽ +",
    description: "Современная социальная платформа с функциями общения и обмена контентом.",
    image: "/images/social-network-application.png",
    features: ["Профили пользователей", "Лента новостей", "Мессенджер", "Медиа-контент"]
  },
  {
    id: 4,
    name: "Образовательная платформа",
    category: "Приложения",
    price: "90 000 ₽ +",
    description: "Интерактивная платформа для онлайн-обучения с различными форматами контента.",
    image: "/images/learning-application.png",
    features: ["Курсы и уроки", "Тесты и оценки", "Прогресс обучения", "Форум"]
  },
  {
    id: 5,
    name: "Система бронирования",
    category: "Сервисы",
    price: "70 000 ₽ +",
    description: "Удобная система для бронирования услуг, столиков и мероприятий.",
    image: "/images/booking-service.png",
    features: ["Календарь бронирований", "Управление расписанием", "Уведомления", "Оплата"]
  },
  {
    id: 6,
    name: "Сервис доставки",
    category: "Сервисы",
    price: "85 000 ₽ +",
    description: "Комплексное решение для логистики и доставки товаров.",
    image: "/images/deliver-services.png",
    features: ["Отслеживание заказов", "Геолокация", "Уведомления", "Аналитика"]
  },
  {
    id: 7,
    name: "Платежная система",
    category: "Финансы",
    price: "150 000 ₽ +",
    description: "Безопасная система для обработки платежей и финансовых операций.",
    image: "/images/payment-system.png",
    features: ["Множественные способы оплаты", "Безопасность", "Отчетность", "Интеграции"]
  },
  {
    id: 8,
    name: "Геолокация и трекинг",
    category: "Технологии",
    price: "60 000 ₽ +",
    description: "Система отслеживания местоположения и маршрутов.",
    image: "/images/geo-location-tracking.png",
    features: ["GPS трекинг", "Карты и маршруты", "История перемещений", "Геозоны"]
  },
  {
    id: 9,
    name: "Push-уведомления",
    category: "Технологии",
    price: "45 000 ₽ +",
    description: "Система отправки уведомлений для повышения вовлеченности пользователей.",
    image: "/images/push-notification.png",
    features: ["Персонализация", "Аналитика", "A/B тестирование", "Автоматизация"]
  },
  {
    id: 10,
    name: "Поиск по каталогу",
    category: "Функции",
    price: "35 000 ₽ +",
    description: "Умный поиск с фильтрацией и рекомендациями.",
    image: "/images/search-the-catelog.png",
    features: ["Полнотекстовый поиск", "Фильтры", "Рекомендации", "История поиска"]
  },
  {
    id: 11,
    name: "Корзина и оформление",
    category: "E-commerce",
    price: "50 000 ₽ +",
    description: "Полнофункциональная система корзины и оформления заказов.",
    image: "/images/cart-checkout.png",
    features: ["Корзина покупок", "Оформление заказа", "Сохранение корзины", "Купоны"]
  },
  {
    id: 12,
    name: "Регистрация и авторизация",
    category: "Безопасность",
    price: "40 000 ₽ +",
    description: "Система аутентификации с различными методами входа.",
    image: "/images/register-and-authorization.png",
    features: ["Регистрация", "Вход через соцсети", "Двухфакторная аутентификация", "Восстановление пароля"]
  },
  {
    id: 13,
    name: "Профиль пользователя",
    category: "Пользователи",
    price: "30 000 ₽ +",
    description: "Персонализированный профиль с настройками и историей.",
    image: "/images/user-profile.png",
    features: ["Личные данные", "Настройки", "История активности", "Избранное"]
  },
  {
    id: 14,
    name: "Отзывы и рейтинги",
    category: "Отзывы",
    price: "25 000 ₽ +",
    description: "Система отзывов и рейтингов для повышения доверия.",
    image: "/images/reviews-and-rating.png",
    features: ["Отзывы пользователей", "Рейтинги", "Модерация", "Ответы на отзывы"]
  },
  {
    id: 15,
    name: "Вопросы и ответы",
    category: "Поддержка",
    price: "20 000 ₽ +",
    description: "Система FAQ и поддержки пользователей.",
    image: "/images/question-answer.png",
    features: ["FAQ", "Чат поддержки", "База знаний", "Тикеты"]
  },
  {
    id: 16,
    name: "Уникальный дизайн",
    category: "Дизайн",
    price: "200 000 ₽ +",
    description: "Эксклюзивный дизайн с индивидуальным подходом.",
    image: "/images/unique-design.png",
    features: ["Индивидуальный дизайн", "Брендинг", "UI/UX", "Адаптивность"]
  },
  {
    id: 17,
    name: "Кастомизированный дизайн",
    category: "Дизайн",
    price: "150 000 ₽ +",
    description: "Персонализированный дизайн под ваши требования.",
    image: "/images/customized-design.png",
    features: ["Настройка под бренд", "Уникальные элементы", "Современный дизайн", "Оптимизация"]
  },
  {
    id: 18,
    name: "Шаблонный дизайн",
    category: "Дизайн",
    price: "80 000 ₽ +",
    description: "Качественный дизайн на основе проверенных шаблонов.",
    image: "/images/template-design.png",
    features: ["Готовые шаблоны", "Быстрая разработка", "Качество", "Экономия"]
  }
];

export async function GET() {
  return NextResponse.json(services);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, price, description, image, features } = body;

    if (!name || !category || !price) {
      return NextResponse.json(
        { error: 'Необходимо заполнить обязательные поля' },
        { status: 400 }
      );
    }

    const newService = {
      id: Date.now(),
      name,
      category,
      price,
      description: description || '',
      image: image || '/images/default-service.png',
      features: features || []
    };

    services.push(newService);

    return NextResponse.json(newService, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Произошла ошибка при создании услуги' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const serviceIndex = services.findIndex(service => service.id === id);
    if (serviceIndex === -1) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    services[serviceIndex] = { ...services[serviceIndex], ...updateData };

    return NextResponse.json(services[serviceIndex]);
  } catch {
    return NextResponse.json(
      { error: 'Произошла ошибка при обновлении услуги' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    const serviceIndex = services.findIndex(service => service.id === id);
    if (serviceIndex === -1) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    services = services.filter(service => service.id !== id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Произошла ошибка при удалении услуги' },
      { status: 500 }
    );
  }
} 