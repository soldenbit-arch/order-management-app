import React from 'react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-4">Страница не найдена</p>
      <a href="/" className="text-blue-600 hover:underline">
        Вернуться на главную
      </a>
    </div>
  );
} 