"use client";
import React, { useState } from "react";
import Button from "@/components/common/Button";
import Link from "next/link";

function PartnerLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Сохраняем данные партнера в localStorage
        localStorage.setItem('partner', JSON.stringify(data.partner));
        window.location.href = '/partner-dashboard';
      } else {
        setError(data.error || 'Ошибка авторизации');
      }
    } catch (error) {
      setError('Произошла ошибка. Попробуйте еще раз.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Вход для партнеров
          </h1>
          <p className="text-gray-600">
            Войдите в свой партнерский кабинет
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="partner@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            color="secondary"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти в кабинет'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <Link 
            href="/"
            className="text-purple-600 hover:text-purple-800 text-sm"
          >
            ← Вернуться на главную
          </Link>
          
          <div className="text-xs text-gray-500 space-y-2">
            <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-md">
              <p className="font-semibold">Тестовые данные:</p>
              <p>Email: <code>test@partner.com</code></p>
              <p>Пароль: <code>password</code></p>
            </div>
            <div>
              <p>Нет аккаунта партнера?</p>
              <a href="mailto:support@example.com" className="text-purple-600">
                Свяжитесь с нами
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerLogin; 