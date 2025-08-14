import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: number;
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

// GET - получение заказов пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    
    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email или телефон обязательны' },
        { status: 400 }
      );
    }
    
    const orders = await readOrders();
    
    // Фильтруем заказы по email или телефону
    const userOrders = orders.filter(order => {
      if (email && order.customerEmail === email) return true;
      if (phone && order.customerPhone === phone) return true;
      return false;
    });
    
    // Сортируем заказы по дате создания - новые сверху
    userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json(userOrders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении заказов пользователя' },
      { status: 500 }
    );
  }
}

