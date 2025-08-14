import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');

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

// Создаем файл заказов если его нет
async function ensureOrdersFile() {
  try {
    await fs.access(ordersFile);
  } catch {
    await fs.mkdir(path.dirname(ordersFile), { recursive: true });
    await fs.writeFile(ordersFile, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Читаем заказы
async function readOrders(): Promise<Order[]> {
  await ensureOrdersFile();
  const data = await fs.readFile(ordersFile, 'utf-8');
  return JSON.parse(data);
}

// Записываем заказы
async function writeOrders(orders: Order[]) {
  await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), 'utf-8');
}

// GET - получить все заказы
export async function GET() {
  try {
    const orders = await readOrders();
    // Сортируем заказы по дате создания - новые сверху
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error reading orders:', error);
    return NextResponse.json({ error: 'Failed to read orders' }, { status: 500 });
  }
}

// POST - создать новый заказ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orders = await readOrders();
    
    const newOrder: Order = {
      id: Date.now().toString(),
      customerName: body.name || 'Клиент',
      customerEmail: body.email || 'client@example.com',
      customerPhone: body.phone || '+7 (999) 999-99-99',
      serviceId: body.service || 1,
      serviceName: body.serviceName || 'Услуга',
      totalPrice: body.totalPrice || 0,
      status: 'pending',
      message: body.message || '',
      partnerId: body.partnerId || null,
      partnerName: body.partnerName || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    await writeOrders(orders);
    
    return NextResponse.json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PUT - обновить заказ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    const orders = await readOrders();
    const orderIndex = orders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString()
    };
    
    await writeOrders(orders);
    
    return NextResponse.json(orders[orderIndex]);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE - удалить заказ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    const orders = await readOrders();
    const filteredOrders = orders.filter(order => order.id !== id);
    
    if (filteredOrders.length === orders.length) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    await writeOrders(filteredOrders);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
} 