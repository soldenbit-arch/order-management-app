import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId?: number;
  serviceName: string;
  totalPrice: number;
  status: 'pending' | 'paid' | 'in_progress' | 'completed' | 'cancelled';
  message: string;
  partnerId?: string;
  partnerName?: string;
  createdAt: string;
  updatedAt: string;
}

const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json');

// Функция для чтения заказов из файла
async function readOrders(): Promise<Order[]> {
  try {
    const data = await fs.readFile(ordersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// GET - получение заказов партнера
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerName = searchParams.get('partnerName');
    
    if (!partnerName) {
      return NextResponse.json(
        { error: 'Название партнера обязательно' },
        { status: 400 }
      );
    }
    
    const orders = await readOrders();
    
    console.log(`Поиск заказов для партнера: ${partnerName}`);
    console.log(`Всего заказов в системе: ${orders.length}`);
    
    // Фильтруем заказы по услугам партнера
    // Приоритет: сначала проверяем поле partnerName, потом fallback на текстовый поиск
    const partnerOrders = orders.filter(order => {
      // 1. Прямое совпадение по полю partnerName (наиболее точный способ)
      if (order.partnerName && order.partnerName.toLowerCase() === partnerName.toLowerCase()) {
        return true;
      }
      
      // 2. Fallback: поиск по тексту для старых заказов
      const lowerServiceName = order.serviceName.toLowerCase();
      const lowerMessage = order.message.toLowerCase();
      const lowerPartnerName = partnerName.toLowerCase();
      
      return lowerServiceName.includes(`(${lowerPartnerName})`) || 
             lowerMessage.includes(`от ${lowerPartnerName}`) ||
             (lowerMessage.includes(`партнера: `) && lowerMessage.includes(lowerPartnerName)) ||
                            lowerServiceName.includes(lowerPartnerName);
      });
      
      console.log(`Найдено заказов для партнера "${partnerName}": ${partnerOrders.length}`);
      partnerOrders.forEach(order => {
        console.log(`- Заказ ${order.id}: ${order.serviceName} (partnerName: ${order.partnerName})`);
      });
      
      return NextResponse.json(partnerOrders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении заказов партнера' },
      { status: 500 }
    );
  }
} 