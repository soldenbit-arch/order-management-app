"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/common/Button";
import Dialog from "@/components/common/Dialog";
import Link from "next/link";

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

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  isActive: boolean;
  partnerName: string;
  link: string;
  createdAt: string;
}

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
  createdAt: string;
  updatedAt: string;
}

function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState<'services' | 'banners' | 'orders'>('services');
  
  // Services states
  const [services, setServices] = useState<PartnerService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<PartnerService | null>(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    price: "",
    icon: "",
    description: "",
    imageUrl: "",
    link: ""
  });

  // Banners states
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerFormData, setBannerFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    link: ""
  });

  // Orders states
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const [currentPartner, setCurrentPartner] = useState<any>(null);

  useEffect(() => {
    // Получаем данные текущего партнера из localStorage
    const partnerData = localStorage.getItem('partner');
    if (partnerData) {
      const partner = JSON.parse(partnerData);
      setCurrentPartner(partner);
      fetchServices(partner.name);
      fetchBanners(partner);
      fetchOrders(partner.name);
    } else {
      // Если партнер не авторизован, перенаправляем на страницу входа
      window.location.href = '/partner-login';
    }
  }, []);

  // Services functions
  const fetchServices = async (partnerName: string) => {
    try {
      const response = await fetch('/api/partner-services');
      const data = await response.json();
      // Фильтруем только услуги текущего партнера
      const partnerServices = data.filter((service: PartnerService) => 
        service.partnerName === partnerName
      );
      setServices(partnerServices);
    } catch (error) {
      console.error('Ошибка при загрузке услуг:', error);
    } finally {
      setServicesLoading(false);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPartner) return;
    
    try {
      if (editingService) {
        // Обновление существующей услуги
        const response = await fetch('/api/partner-services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingService.id,
            ...serviceFormData,
            partnerName: currentPartner.name,
            isAvailable: true
          })
        });
        
        if (response.ok) {
          await fetchServices(currentPartner.name);
          resetServiceForm();
          setShowServiceForm(false);
        }
      } else {
        // Создание новой услуги
        const response = await fetch('/api/partner-services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...serviceFormData,
            partnerName: currentPartner.name,
            isAvailable: true
          })
        });
        
        if (response.ok) {
          await fetchServices(currentPartner.name);
          resetServiceForm();
          setShowServiceForm(false);
        }
      }
    } catch (error) {
      console.error('Ошибка при сохранении услуги:', error);
    }
  };

  const handleServiceEdit = (service: PartnerService) => {
    setEditingService(service);
    setServiceFormData({
      name: service.name,
      price: service.price,
      icon: service.icon,
      description: service.description,
      imageUrl: service.imageUrl,
      link: service.link
    });
    setShowServiceForm(true);
  };

  const handleServiceDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
      try {
        const response = await fetch(`/api/partner-services?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchServices(currentPartner.name);
        }
      } catch (error) {
        console.error('Ошибка при удалении услуги:', error);
      }
    }
  };

  const resetServiceForm = () => {
    setServiceFormData({
      name: "",
      price: "",
      icon: "",
      description: "",
      imageUrl: "",
      link: ""
    });
    setEditingService(null);
  };

  const handleServiceCancel = () => {
    setShowServiceForm(false);
    resetServiceForm();
  };



  // Banners functions
  const fetchBanners = async (partner: any) => {
    try {
      // Получаем данные баннера текущего партнера
      setBannerFormData({
        title: partner.bannerTitle || '',
        subtitle: partner.bannerSubtitle || '',
        imageUrl: partner.bannerImage || '',
        link: ''
      });
    } catch (error) {
      console.error('Ошибка при загрузке баннера:', error);
    } finally {
      setBannersLoading(false);
    }
  };

  // Orders functions
  const fetchOrders = async (partnerName: string) => {
    try {
      const response = await fetch(`/api/partner-orders?partnerName=${encodeURIComponent(partnerName)}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Ошибка при загрузке заказов:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });

      if (response.ok) {
        // Обновляем локальный список заказов
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
          )
        );
      } else {
        alert('Ошибка при обновлении статуса заказа');
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
      alert('Ошибка при обновлении статуса заказа');
    }
  };

  const handleOrderView = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPartner) return;
    
    try {
      const response = await fetch('/api/partners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentPartner.id,
          bannerTitle: bannerFormData.title,
          bannerSubtitle: bannerFormData.subtitle,
          bannerImage: bannerFormData.imageUrl
        })
      });
      
      if (response.ok) {
        const updatedPartner = await response.json();
        // Обновляем данные в localStorage и состоянии
        const newPartnerData = { ...currentPartner, ...updatedPartner };
        localStorage.setItem('partner', JSON.stringify(newPartnerData));
        setCurrentPartner(newPartnerData);
        setShowBannerForm(false);
      }
    } catch (error) {
      console.error('Ошибка при сохранении баннера:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Партнерский кабинет</h1>
              <p className="text-gray-600">{currentPartner?.name || 'Загрузка...'}</p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <span>На главную</span>
              <img src="/images/Linear Arrows Alt Arrow Right.svg" alt="" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button 
            onClick={() => setActiveTab('services')}
            color={activeTab === 'services' ? 'secondary' : 'primary'}
            variant={activeTab === 'services' ? 'contained' : 'outlined'}
            size="small"
          >
            Мои услуги
          </Button>
          <Button 
            onClick={() => setActiveTab('banners')}
            color={activeTab === 'banners' ? 'secondary' : 'primary'}
            variant={activeTab === 'banners' ? 'contained' : 'outlined'}
            size="small"
          >
            Баннеры
          </Button>
          <Button 
            onClick={() => setActiveTab('orders')}
            color={activeTab === 'orders' ? 'secondary' : 'primary'}
            variant={activeTab === 'orders' ? 'contained' : 'outlined'}
            size="small"
          >
            Заказы
          </Button>
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Управление услугами</h2>
              <Button onClick={() => setShowServiceForm(true)} color="secondary" size="small">
                Добавить услугу
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              {servicesLoading ? (
                <div className="text-center py-8">
                  <div className="text-lg">Загрузка услуг...</div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Услуга
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Цена
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={service.imageUrl || service.icon} 
                              alt={service.name}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{service.name}</div>
                              <div className="text-sm text-gray-500">{service.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {service.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            service.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {service.isAvailable ? 'Активна' : 'Неактивна'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            onClick={() => handleServiceEdit(service)}
                            variant="outlined"
                            color="secondary"
                            size="small"
                          >
                            Редактировать
                          </Button>
                          <Button
                            onClick={() => handleServiceDelete(service.id)}
                            variant="outlined"
                            color="primary"
                            size="small"
                          >
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              
              {!servicesLoading && services.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">У вас пока нет услуг</p>
                  <Button onClick={() => setShowServiceForm(true)} color="secondary">
                    Добавить первую услугу
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Управление баннером</h2>
              <Button 
                onClick={() => setShowBannerForm(true)} 
                color="secondary" 
                size="small"
              >
                Редактировать баннер
              </Button>
            </div>
            
            <div className="p-6">
              {currentPartner && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Текущий баннер на странице "Наши партнеры":</h3>
                  
                  {/* Preview баннера */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-center rounded-2xl bg-[linear-gradient(90deg,_#E5E6FA_0%,_#BABDFF_100%)] mb-4 min-h-[140px] items-center">
                      <img
                        src={currentPartner.bannerImage}
                        alt={currentPartner.bannerTitle}
                        className="max-h-24"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <b className="font-semibold text-3xl text-neutral-950">
                        {currentPartner.bannerTitle}
                      </b>
                      <p className="font-medium text-md text-neutral-900/60">
                        {currentPartner.bannerSubtitle}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Заказы ваших услуг</h2>
            </div>
            
            <div className="overflow-x-auto">
              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="text-lg">Загрузка заказов...</div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID заказа
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Клиент
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Услуга
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Стоимость
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-xs">{order.customerEmail}</div>
                            <div className="text-xs">{order.customerPhone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-medium">{order.serviceName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.totalPrice.toLocaleString()} ₽
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'paid' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status === 'pending' ? 'В ожидании' :
                             order.status === 'paid' ? 'Оплачен' :
                             order.status === 'in_progress' ? 'В работе' :
                             order.status === 'completed' ? 'Завершен' :
                             order.status === 'cancelled' ? 'Отменен' : order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value as Order['status'])}
                              className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="pending">В ожидании</option>
                              <option value="paid">Оплачен</option>
                              <option value="in_progress">В работе</option>
                              <option value="completed">Завершен</option>
                              <option value="cancelled">Отменен</option>
                            </select>
                            <button
                              onClick={() => handleOrderView(order)}
                              className="text-purple-600 hover:text-purple-900 text-xs font-medium"
                            >
                              Детали
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              
              {!ordersLoading && orders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Заказов ваших услуг пока нет</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Service Form Dialog */}
      <Dialog open={showServiceForm} onClose={handleServiceCancel}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingService ? 'Редактировать услугу' : 'Добавить услугу'}
          </h3>
          
          <form onSubmit={handleServiceSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название услуги *
              </label>
              <input
                type="text"
                required
                value={serviceFormData.name}
                onChange={(e) => setServiceFormData({...serviceFormData, name: e.target.value})}
                placeholder="Название услуги"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена *
              </label>
              <input
                type="text"
                required
                value={serviceFormData.price}
                onChange={(e) => setServiceFormData({...serviceFormData, price: e.target.value})}
                placeholder="от 50 000 ₽"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={serviceFormData.description}
                onChange={(e) => setServiceFormData({...serviceFormData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL изображения
              </label>
              <input
                type="text"
                value={serviceFormData.imageUrl}
                onChange={(e) => setServiceFormData({...serviceFormData, imageUrl: e.target.value})}
                placeholder="/images/service.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL иконки
              </label>
              <input
                type="text"
                value={serviceFormData.icon}
                onChange={(e) => setServiceFormData({...serviceFormData, icon: e.target.value})}
                placeholder="/images/icon.svg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ссылка
              </label>
              <input
                type="text"
                value={serviceFormData.link}
                onChange={(e) => setServiceFormData({...serviceFormData, link: e.target.value})}
                placeholder="/partner-services/1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>



            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={handleServiceCancel}
                variant="outlined"
                color="secondary"
              >
                Отмена
              </Button>
              <Button type="submit" color="secondary">
                {editingService ? 'Обновить' : 'Создать'}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Banner Form Dialog */}
      <Dialog open={showBannerForm} onClose={() => setShowBannerForm(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Редактировать баннер
          </h3>
          
          <form onSubmit={handleBannerSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Заголовок баннера *
              </label>
              <input
                type="text"
                required
                value={bannerFormData.title}
                onChange={(e) => setBannerFormData({...bannerFormData, title: e.target.value})}
                placeholder="Название партнера"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подзаголовок *
              </label>
              <input
                type="text"
                required
                value={bannerFormData.subtitle}
                onChange={(e) => setBannerFormData({...bannerFormData, subtitle: e.target.value})}
                placeholder="Краткое описание услуг"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL изображения
              </label>
              <input
                type="text"
                value={bannerFormData.imageUrl}
                onChange={(e) => setBannerFormData({...bannerFormData, imageUrl: e.target.value})}
                placeholder="/images/partner-logo.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={() => setShowBannerForm(false)}
                variant="outlined"
                color="secondary"
              >
                Отмена
              </Button>
              <Button type="submit" color="secondary">
                Сохранить
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onClose={() => setShowOrderDetails(false)}>
        {selectedOrder && (
          <div className="p-6 max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Детали заказа #{selectedOrder.id.slice(-6)}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Клиент:</label>
                <p className="text-lg font-semibold">{selectedOrder.customerName}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Услуга:</label>
                <p className="text-lg font-semibold">{selectedOrder.serviceName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Стоимость:</label>
                <p className="text-lg font-semibold text-purple-600">
                  {selectedOrder.totalPrice.toLocaleString()} ₽
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Статус:</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    handleOrderStatusUpdate(selectedOrder.id, e.target.value as Order['status']);
                    setSelectedOrder(prev => prev ? {...prev, status: e.target.value as Order['status']} : null);
                  }}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pending">В ожидании</option>
                  <option value="paid">Оплачен</option>
                  <option value="in_progress">В работе</option>
                  <option value="completed">Завершен</option>
                  <option value="cancelled">Отменен</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Дата создания:</label>
                <p>{new Date(selectedOrder.createdAt).toLocaleDateString('ru-RU')}</p>
              </div>
              
              {selectedOrder.message && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Детали:</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm whitespace-pre-wrap">{selectedOrder.message}</p>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <Button 
                  onClick={() => setShowOrderDetails(false)}
                  className="w-full"
                  color="secondary"
                >
                  Закрыть
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default PartnerDashboard; 