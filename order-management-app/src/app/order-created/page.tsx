"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/common/Button";

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  features: string[];
}

function OrderCreatedContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchService = async () => {
    try {
      const response = await fetch('/api/services');
      const services = await response.json();
      const foundService = services.find((s: Service) => s.id === parseInt(serviceId!));
      setService(foundService || null);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId) {
      fetchService();
    } else {
      setLoading(false);
    }
  }, [serviceId]);

  const handleContactUs = async () => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Клиент',
          email: 'client@example.com',
          phone: '+7 (999) 999-99-99',
          message: `Заинтересован в услуге: ${service?.name || 'Неизвестная услуга'}`,
          service: service?.id
        })
      });

      if (response.ok) {
        alert('Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.');
        window.location.href = '/';
      } else {
        alert('Ошибка при отправке заявки. Попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Error sending application:', error);
      alert('Ошибка при отправке заявки. Попробуйте еще раз.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Заказ создан!
          </h1>
          <p className="text-gray-600">
            Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время.
          </p>
        </div>

        {service && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <img 
                src={service.image} 
                alt={service.name}
                className="w-12 h-12 rounded-lg object-cover mr-3"
              />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.category}</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-600 mb-2">{service.description}</p>
              <p className="font-bold text-lg text-purple-600">{service.price}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button 
            onClick={handleContactUs}
            className="w-full"
            color="secondary"
          >
            Связаться с нами
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outlined"
            color="secondary"
            className="w-full"
          >
            Вернуться на главную
          </Button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Номер заказа: #{Date.now().toString().slice(-6)}</p>
          <p>Дата: {new Date().toLocaleDateString('ru-RU')}</p>
        </div>
      </div>
    </div>
  );
}

export default function OrderCreated() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>}>
      <OrderCreatedContent />
    </Suspense>
  );
}
