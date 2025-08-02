import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const contactsFile = path.join(process.cwd(), 'data', 'contacts.json');

interface Contact {
  name: string;
  email: string;
  phone: string;
  message: string;
  service?: number;
  totalPrice?: string;
  date: string;
}

// Создаем файл контактов если его нет
async function ensureContactsFile() {
  try {
    await fs.access(contactsFile);
  } catch {
    await fs.mkdir(path.dirname(contactsFile), { recursive: true });
    await fs.writeFile(contactsFile, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Читаем контакты
async function readContacts(): Promise<Contact[]> {
  await ensureContactsFile();
  const data = await fs.readFile(contactsFile, 'utf-8');
  return JSON.parse(data);
}

// Записываем контакты
async function writeContacts(contacts: Contact[]) {
  await fs.writeFile(contactsFile, JSON.stringify(contacts, null, 2), 'utf-8');
}

// GET - получить все контакты
export async function GET() {
  try {
    const contacts = await readContacts();
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error reading contacts:', error);
    return NextResponse.json({ error: 'Failed to read contacts' }, { status: 500 });
  }
}

// POST - создать новый контакт и заказ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const contacts = await readContacts();
    
    const newContact: Contact = {
      name: body.name || 'Клиент',
      email: body.email || 'client@example.com',
      phone: body.phone || '+7 (999) 999-99-99',
      message: body.message || '',
      service: body.service,
      totalPrice: body.totalPrice,
      date: new Date().toISOString()
    };
    
    contacts.push(newContact);
    await writeContacts(contacts);
    
    // Если это заказ (есть service), создаем заказ
    if (body.service) {
      try {
        // Получаем информацию об услуге
        const servicesPath = path.join(process.cwd(), 'data', 'services.json');
        let services = [];
        try {
          const servicesData = await fs.readFile(servicesPath, 'utf-8');
          services = JSON.parse(servicesData);
        } catch (error) {
          console.error('Ошибка при чтении услуг:', error);
        }
        const service = services.find((s: any) => s.id === body.service);
        
        // Создаем заказ напрямую
        const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
        let orders = [];
        try {
          const ordersData = await fs.readFile(ordersPath, 'utf-8');
          orders = JSON.parse(ordersData);
        } catch (error) {
          // Если файл не существует, создаем пустой массив
          orders = [];
        }
        
        // Правильно извлекаем сумму из строки "180 000 ₽"
        let totalPrice = 0;
        if (body.totalPrice) {
          const priceString = body.totalPrice.toString();
          const priceMatch = priceString.match(/(\d+(?:\s*\d+)*)/);
          if (priceMatch) {
            totalPrice = parseInt(priceMatch[1].replace(/\s/g, ''));
          }
        }
        
        const newOrder = {
          id: Date.now().toString(),
          customerName: newContact.name,
          customerEmail: newContact.email,
          customerPhone: newContact.phone,
          serviceId: body.service,
          serviceName: service?.name || 'Услуга',
          totalPrice: totalPrice,
          status: 'pending',
          message: newContact.message,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        orders.push(newOrder);
        await fs.writeFile(ordersPath, JSON.stringify(orders, null, 2), 'utf-8');
        
        console.log('Заказ создан успешно:', newOrder);
      } catch (error) {
        console.error('Ошибка при создании заказа:', error);
      }
    }
    
    console.log('Новая заявка:', newContact);
    
    return NextResponse.json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
} 