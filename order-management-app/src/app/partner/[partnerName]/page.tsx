"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Menubar from "@/components/globals/Menubar";
import Dialog from "@/components/common/Dialog";
import Button from "@/components/common/Button";

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

function PartnerPage() {
  const params = useParams();
  const partnerName = decodeURIComponent(params.partnerName as string);
  
  const [services, setServices] = useState<PartnerService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<PartnerService[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchPartnerServices();
  }, [partnerName]);

  const fetchPartnerServices = async () => {
    try {
      const response = await fetch('/api/partner-services');
      const allServices = await response.json();
      
      // Фильтруем услуги конкретного партнера
      const partnerServices = allServices.filter((service: PartnerService) => 
        service.partnerName === partnerName && service.isAvailable
      );
      
      setServices(partnerServices);
    } catch (error) {
      console.error('Ошибка при загрузке услуг партнера:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceSelection = (service: PartnerService) => {
    setSelectedServices(prev => {
      const isSelected = prev.find(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const isServiceSelected = (service: PartnerService) => {
    return selectedServices.find(s => s.id === service.id) !== undefined;
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => {
      const price = parseInt(service.price.replace(/[^\d]/g, '')) || 0;
      return total + price;
    }, 0);
  };

  const handleOrderServices = async () => {
    if (selectedServices.length === 0) {
      alert('Выберите хотя бы одну услугу');
      return;
    }

    try {
      // Создаем заказ для выбранных услуг партнера
      const serviceNames = selectedServices.map(s => s.name).join(', ');
      const orderDescription = `Заказ услуг партнера "${partnerName}": ${serviceNames}`;
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Клиент',
          email: 'client@example.com',
          phone: '+7 (999) 999-99-99',
          message: orderDescription,
          serviceName: serviceNames,
          totalPrice: getTotalPrice(),
          partnerName: partnerName,
          partnerId: 'test-partner-id'
        })
      });

      if (response.ok) {
        const order = await response.json();
        setSelectedServices([]);
        setShowCart(false);
        window.location.href = `/order-created?order=${order.id}`;
      } else {
        console.error('Error creating order');
        alert('Ошибка при создании заказа. Попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Ошибка при создании заказа. Попробуйте еще раз.');
    }
  };



  if (loading) {
    return (
      <div>
        <Menubar back="/our-partners">{partnerName}</Menubar>
        <div className="text-center py-8">
          <div className="text-lg">Загрузка услуг...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Menubar back="/our-partners">{partnerName}</Menubar>
      
      <div className="mb-6">
        <div className="flex justify-center rounded-2xl bg-[linear-gradient(90deg,_#E5E6FA_0%,_#BABDFF_100%)] mb-4 min-h-[140px] items-center">
          <img
            src="/images/Remove-bg.ai_1732383936587 1.png"
            alt={partnerName}
          />
        </div>
        <div className="text-center">
          <h1 className="font-semibold text-3xl text-neutral-950 mb-2">
            {partnerName}
          </h1>
          <p className="font-medium text-md text-neutral-900/60">
            {services.length} {services.length === 1 ? 'услуга' : 'услуг'} доступно
          </p>
        </div>
      </div>

      <div className={`${selectedServices.length > 0 ? 'mb-[150px]' : ''}`}>
        {services.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                role="button"
                onClick={() => toggleServiceSelection(service)}
                className={`flex flex-col justify-end items-center text-center bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all relative ${
                  isServiceSelected(service) 
                    ? 'ring-2 ring-purple-500 shadow-lg' 
                    : ''
                }`}
              >
                {isServiceSelected(service) && (
                  <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
                <img
                  className="mb-2.5 w-16 h-16 object-contain"
                  src={service.imageUrl || service.icon}
                  alt={service.name}
                />
                <p className="font-extrabold text-md text-neutral-950 mb-1">
                  {service.name}
                </p>
                <p className="text-sm text-purple-600 font-semibold">
                  {service.price}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>У данного партнера пока нет доступных услуг</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button - В стиле приложения */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0">
          <div className="rounded-t-[28px] bg-white shadow-6xl pt-5 px-4 pb-7 device-container">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-neutral-950">
                  {selectedServices.length} {selectedServices.length === 1 ? 'услуга' : 'услуг'} выбрано
                </h4>
                <p className="font-medium text-md text-neutral-900/50">
                  Общая стоимость: {getTotalPrice().toLocaleString()} ₽
                </p>
              </div>
              <button
                onClick={() => setShowCart(true)}
                className="rounded-[100px] bg-neutral-100 shadow-4xl size-10 grid place-content-center ml-3"
                title="Подробнее"
              >
                <img
                  src="/images/Linear  Arrows Alt Arrow Right.svg"
                  alt="Подробнее"
                  className="w-4 h-4"
                />
              </button>
            </div>
            <Button className="w-full" onClick={handleOrderServices}>
              Заказать услуги
            </Button>
          </div>
        </div>
      )}

      {/* Cart Details Dialog */}
      <Dialog open={showCart} onClose={() => setShowCart(false)}>
        <div className="p-6">
          <h3 className="font-semibold text-center text-4xl text-neutral-950 mb-5">
            Корзина ({selectedServices.length})
          </h3>
          
          <div className="flex flex-col gap-3 mb-6">
            {selectedServices.map((service) => (
              <div key={service.id} className="rounded-2xl bg-white shadow-4xl p-4 pt-3 flex justify-between gap-2 items-center">
                <div className="flex-1">
                  <b className="font-semibold text-lg text-neutral-950 block mb-1">
                    {service.name}
                  </b>
                  <p className="font-medium text-sm text-neutral-900/50 mb-1">
                    {service.description}
                  </p>
                  <p className="text-sm font-semibold text-[rgb(111,_53,_255)]">
                    {service.price}
                  </p>
                </div>
                <button
                  onClick={() => toggleServiceSelection(service)}
                  className="rounded-[100px] bg-red-100 shadow-4xl size-10 grid place-content-center"
                  title="Удалить"
                >
                  <img
                    src="/images/Linear  Essentional, UI Trash Bin Trash.svg"
                    alt="Удалить"
                    className="w-4 h-4"
                  />
                </button>
              </div>
            ))}
          </div>
          
          <div className="border-t border-neutral-200 pt-4">
            <h4 className="font-semibold text-center text-3xl text-neutral-950 mb-5">
              Итого: {getTotalPrice().toLocaleString()} ₽
            </h4>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCart(false)}
                variant="outlined"
                color="secondary"
                className="flex-1"
              >
                Продолжить выбор
              </Button>
              <Button
                onClick={handleOrderServices}
                color="secondary"
                className="flex-1"
              >
                Оформить заказ
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default PartnerPage; 