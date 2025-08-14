import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface PartnerService {
  id: string;
  name: string;
  price: string;
  icon: string;
  partnerName: string;
  description: string;
  isAvailable: boolean;
  imageUrl: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

const dataFilePath = path.join(process.cwd(), 'data', 'partner-services.json');

// Функция для чтения данных из файла
async function readPartnerServices(): Promise<PartnerService[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Если файл не существует, возвращаем начальные данные
    const initialServices = [
      {
        id: '1',
        name: "Разработка мобильного приложения",
        price: "от 150.000 ₽",
        icon: "/images/Linear Video, Audio, Sound  Gallery.svg",
        partnerName: "TechPartner",
        description: "Создание нативных и кроссплатформенных приложений",
        isAvailable: true,
        imageUrl: "/images/Linear Video, Audio, Sound  Gallery.svg",
        link: "/partner-services/1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: "Веб-разработка",
        price: "от 80.000 ₽",
        icon: "/images/Linear Video, Audio, Sound  Gallery.svg",
        partnerName: "WebStudio",
        description: "Создание современных веб-сайтов и веб-приложений",
        isAvailable: true,
        imageUrl: "/images/Linear Video, Audio, Sound  Gallery.svg",
        link: "/partner-services/2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: "UI/UX дизайн",
        price: "от 50.000 ₽",
        icon: "/images/Linear Video, Audio, Sound  Gallery.svg",
        partnerName: "DesignLab",
        description: "Создание пользовательских интерфейсов и опыта",
        isAvailable: false,
        imageUrl: "/images/Linear Video, Audio, Sound  Gallery.svg",
        link: "/partner-services/3",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Создаем директорию если её нет
    const dir = path.dirname(dataFilePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Записываем начальные данные
    await fs.writeFile(dataFilePath, JSON.stringify(initialServices, null, 2), 'utf-8');
    return initialServices;
  }
}

// Функция для записи данных в файл
async function writePartnerServices(services: PartnerService[]): Promise<void> {
  const dir = path.dirname(dataFilePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(services, null, 2), 'utf-8');
}

// GET - получение всех услуг партнеров
export async function GET() {
  try {
    const services = await readPartnerServices();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении услуг партнеров' },
      { status: 500 }
    );
  }
}

// POST - создание новой услуги партнера
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const services = await readPartnerServices();
    
    const newService: PartnerService = {
      id: Date.now().toString(),
      name: body.name,
      price: body.price,
      icon: body.icon || "/images/Linear Video, Audio, Sound  Gallery.svg",
      partnerName: body.partnerName,
      description: body.description,
      isAvailable: body.isAvailable !== undefined ? body.isAvailable : true,
      imageUrl: body.imageUrl || "/images/Linear Video, Audio, Sound  Gallery.svg",
      link: body.link || "/partner-services/" + Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    services.push(newService);
    await writePartnerServices(services);
    
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при создании услуги партнера' },
      { status: 500 }
    );
  }
}

// PUT - обновление услуги партнера
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const services = await readPartnerServices();
    
    const index = services.findIndex(service => service.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Услуга партнера не найдена' },
        { status: 404 }
      );
    }
    
    services[index] = {
      ...services[index],
      name: body.name,
      price: body.price,
      icon: body.icon,
      partnerName: body.partnerName,
      description: body.description,
      isAvailable: body.isAvailable,
      imageUrl: body.imageUrl,
      link: body.link,
      updatedAt: new Date().toISOString()
    };
    
    await writePartnerServices(services);
    return NextResponse.json(services[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при обновлении услуги партнера' },
      { status: 500 }
    );
  }
}

// DELETE - удаление услуги партнера
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID услуги партнера не указан' },
        { status: 400 }
      );
    }
    
    const services = await readPartnerServices();
    const filteredServices = services.filter(service => service.id !== id);
    
    if (filteredServices.length === services.length) {
      return NextResponse.json(
        { error: 'Услуга партнера не найдена' },
        { status: 404 }
      );
    }
    
    await writePartnerServices(filteredServices);
    return NextResponse.json({ message: 'Услуга партнера удалена' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при удалении услуги партнера' },
      { status: 500 }
    );
  }
} 