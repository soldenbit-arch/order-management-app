import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, service } = body;

    // Валидация данных
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Необходимо заполнить все обязательные поля' },
        { status: 400 }
      );
    }

    // Здесь можно добавить отправку email или сохранение в базу данных
    // Пока просто логируем данные
    console.log('Новая заявка:', {
      name,
      email,
      phone,
      message,
      service,
      date: new Date().toISOString()
    });

    // В реальном проекте здесь будет отправка email или сохранение в БД
    // await sendEmail({ name, email, phone, message, service });
    // await saveToDatabase({ name, email, phone, message, service });

    return NextResponse.json(
      { success: true, message: 'Заявка успешно отправлена' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при отправке формы:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке формы' },
      { status: 500 }
    );
  }
} 