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

// GET - получение всех заказов партнеров
export async function GET() {
  try {
    const orders = await readOrders();
    
    // Фильтруем только заказы партнеров (те, у которых есть partnerName)
    const partnerOrders = orders.filter(order => order.partnerName);
    
    return NextResponse.json(partnerOrders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении заказов партнеров' },
      { status: 500 }
    );
  }
}

// PUT - обновить статус заказа партнера
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const orders = await readOrders();
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
    return NextResponse.json(orders[orderIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при обновлении заказа' },
      { status: 500 }
    );
  }
}

// DELETE - удалить заказ партнера
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const orders = await readOrders();
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    orders.splice(orderIndex, 1);
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при удалении заказа' },
      { status: 500 }
    );
  }
} 