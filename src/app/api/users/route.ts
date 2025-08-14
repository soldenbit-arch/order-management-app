import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const usersFile = path.join(process.cwd(), 'data', 'users.json');

// Создаем файл пользователей если его нет
async function ensureUsersFile() {
  try {
    await fs.access(usersFile);
  } catch {
    await fs.mkdir(path.dirname(usersFile), { recursive: true });
    const defaultUsers: User[] = [
      {
        id: 'user-1',
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 999-99-99',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    await fs.writeFile(usersFile, JSON.stringify(defaultUsers, null, 2), 'utf-8');
  }
}

// Читаем пользователей
async function readUsers(): Promise<User[]> {
  await ensureUsersFile();
  const data = await fs.readFile(usersFile, 'utf-8');
  return JSON.parse(data);
}

// Записываем пользователей
async function writeUsers(users: User[]) {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf-8');
}

// GET - получить всех пользователей
export async function GET() {
  try {
    const users = await readUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error reading users:', error);
    return NextResponse.json({ error: 'Failed to read users' }, { status: 500 });
  }
}

// POST - создать нового пользователя
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    const users = await readUsers();
    
    // Проверяем, что email уникален
    if (users.find(u => u.email === email)) {
      return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 400 });
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeUsers(users);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error in users API:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// PUT - обновить пользователя
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await writeUsers(users);
    return NextResponse.json(users[userIndex]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE - удалить пользователя
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users.splice(userIndex, 1);
    await writeUsers(users);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
} 