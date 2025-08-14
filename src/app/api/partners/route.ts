import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Partner {
  id: string;
  name: string;
  email: string;
  password: string;
  description: string;
  logo: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const partnersFile = path.join(process.cwd(), 'data', 'partners.json');

// Создаем файл партнеров если его нет
async function ensurePartnersFile() {
  try {
    await fs.access(partnersFile);
  } catch {
    await fs.mkdir(path.dirname(partnersFile), { recursive: true });
    const defaultPartners: Partner[] = [
      {
        id: 'test-partner-1',
        name: 'Тестовый партнер',
        email: 'test@partner.com',
        password: 'password',
        description: 'Безопасность, разработка приложений, сайтов',
        logo: '/images/Remove-bg.ai_1732383936587 1.png',
        bannerTitle: 'Тестовый партнер',
        bannerSubtitle: 'Качественные IT-решения для вашего бизнеса',
        bannerImage: '/images/Remove-bg.ai_1732383936587 1.png',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    await fs.writeFile(partnersFile, JSON.stringify(defaultPartners, null, 2), 'utf-8');
  }
}

// Читаем партнеров
async function readPartners(): Promise<Partner[]> {
  await ensurePartnersFile();
  const data = await fs.readFile(partnersFile, 'utf-8');
  return JSON.parse(data);
}

// Записываем партнеров
async function writePartners(partners: Partner[]) {
  await fs.writeFile(partnersFile, JSON.stringify(partners, null, 2), 'utf-8');
}

// GET - получить всех партнеров
export async function GET() {
  try {
    const partners = await readPartners();
    // Убираем пароли из ответа
    const safePartners = partners.map(({password, ...partner}) => partner);
    return NextResponse.json(safePartners);
  } catch (error) {
    console.error('Error reading partners:', error);
    return NextResponse.json({ error: 'Failed to read partners' }, { status: 500 });
  }
}

// POST - создать нового партнера или авторизация
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, ...otherData } = body;

    const partners = await readPartners();

    if (action === 'login') {
      // Авторизация партнера
      const partner = partners.find(p => p.email === email && p.password === password);
      if (partner) {
        const { password: _, ...safePartner } = partner;
        return NextResponse.json({ success: true, partner: safePartner });
      } else {
        return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
      }
    } else {
      // Создание нового партнера
      const newPartner: Partner = {
        id: Date.now().toString(),
        email,
        password,
        name: otherData.name || 'Новый партнер',
        description: otherData.description || 'Описание партнера',
        logo: otherData.logo || '/images/Remove-bg.ai_1732383936587 1.png',
        bannerTitle: otherData.bannerTitle || otherData.name || 'Новый партнер',
        bannerSubtitle: otherData.bannerSubtitle || 'Качественные услуги',
        bannerImage: otherData.bannerImage || '/images/Remove-bg.ai_1732383936587 1.png',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      partners.push(newPartner);
      await writePartners(partners);

      const { password: _, ...safePartner } = newPartner;
      return NextResponse.json(safePartner, { status: 201 });
    }
  } catch (error) {
    console.error('Error in partners API:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// PUT - обновить партнера
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const partners = await readPartners();
    const partnerIndex = partners.findIndex(p => p.id === id);

    if (partnerIndex === -1) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    partners[partnerIndex] = {
      ...partners[partnerIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await writePartners(partners);

    const { password: _, ...safePartner } = partners[partnerIndex];
    return NextResponse.json(safePartner);
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
  }
}

// DELETE - удалить партнера
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 });
    }

    const partners = await readPartners();
    const partnerIndex = partners.findIndex(p => p.id === id);

    if (partnerIndex === -1) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    partners.splice(partnerIndex, 1);
    await writePartners(partners);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
} 