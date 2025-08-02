"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/common/Button";
import Dialog from "@/components/common/Dialog";

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  features: string[];
}

interface Category {
  id: number;
  name: string;
  description: string;
}

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
  createdAt: string;
  updatedAt: string;
}

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

function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'services' | 'categories' | 'orders' | 'partner-services'>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [partnerServices, setPartnerServices] = useState<PartnerService[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingPartnerService, setEditingPartnerService] = useState<PartnerService | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  
  // Order states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    features: ''
  });
  
  const [partnerFormData, setPartnerFormData] = useState({
    name: '',
    price: '',
    icon: '/images/Linear Video, Audio, Sound  Gallery.svg',
    partnerName: '',
    description: '',
    isAvailable: true,
    imageUrl: '/images/Remove-bg.ai_1732383936587 1.png',
    link: ''
  });

  useEffect(() => {
    fetchServices();
    fetchOrders();
    fetchPartnerServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerServices = async () => {
    try {
      const response = await fetch('/api/partner-services');
      const data = await response.json();
      setPartnerServices(data);
    } catch (error) {
      console.error('Error loading partner services:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      // Получаем уникальные категории из услуг
      const response = await fetch('/api/services');
      const services = await response.json();
      const uniqueCategories = [...new Set(services.map((service: Service) => service.category))] as string[];
      setCategories(uniqueCategories.map((name: string, index: number) => ({ id: index, name, description: '' })));
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      // Сортируем заказы по дате создания (новые сверху)
      const sortedOrders = data.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchServices();
        setShowForm(false);
        resetForm();
      } else {
        alert('Ошибка при добавлении услуги');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Ошибка при добавлении услуги');
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingService) return;

    try {
      const response = await fetch(`/api/services?id=${editingService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchServices();
        setShowForm(false);
        setEditingService(null);
        resetForm();
      } else {
        alert('Ошибка при обновлении услуги');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Ошибка при обновлении услуги');
    }
  };

  const handleDeleteService = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
      try {
        const response = await fetch(`/api/services?id=${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchServices();
        } else {
          alert('Ошибка при удалении услуги');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Ошибка при удалении услуги');
      }
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      price: service.price,
      description: service.description,
      image: service.image,
      features: Array.isArray(service.features) ? service.features.join(', ') : ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      description: "",
      image: "",
      features: ""
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    resetForm();
  };

  // Функции для управления категориями
  const categoryNames = [...new Set(services.map(service => service.category))];

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category: string) => {
    setEditingCategory(category);
    setCategoryName(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (category: string) => {
    if (confirm(`Вы уверены, что хотите удалить категорию "${category}"? Все услуги в этой категории будут также удалены.`)) {
      try {
        // Удаляем все услуги в этой категории
        const servicesToDelete = services.filter(service => service.category === category);
        for (const service of servicesToDelete) {
          await fetch(`/api/services?id=${service.id}`, {
            method: 'DELETE'
          });
        }
        await fetchServices();
        await fetchCategories();
      } catch (error) {
        console.error('Ошибка при удалении категории:', error);
      }
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) return;

    try {
      if (editingCategory) {
        // Обновляем категорию во всех услугах
        const servicesToUpdate = services.filter(service => service.category === editingCategory);
        for (const service of servicesToUpdate) {
          await fetch(`/api/services?id=${service.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...service,
              category: categoryName
            })
          });
        }
      } else {
        // Создаем новую услугу с новой категорией
        const newService = {
          id: Date.now(),
          name: `Новая услуга в категории ${categoryName}`,
          category: categoryName,
          price: 'от 50 000 ₽',
          description: 'Описание новой услуги',
          image: '/images/foodtech-application.png',
          features: ['Функция 1', 'Функция 2', 'Функция 3']
        };

        await fetch('/api/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newService)
        });
      }
      
      await fetchServices();
      await fetchCategories();
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryName('');
    } catch (error) {
      console.error('Ошибка при обновлении категории:', error);
    }
  };

  const handleCategoryCancel = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCategoryName('');
  };

  // Функции для управления услугами партнеров
  const handleAddPartnerService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/partner-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerFormData)
      });
      
      if (response.ok) {
        await fetchPartnerServices();
        setPartnerFormData({
          name: '',
          price: '',
          icon: '/images/Linear Video, Audio, Sound  Gallery.svg',
          partnerName: '',
          description: '',
          isAvailable: true,
          imageUrl: '/images/Remove-bg.ai_1732383936587 1.png',
          link: ''
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Ошибка при добавлении услуги партнера:', error);
    }
  };

  const handleEditPartnerService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPartnerService) return;
    
    try {
      const response = await fetch('/api/partner-services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingPartnerService.id,
          ...partnerFormData
        })
      });
      
      if (response.ok) {
        await fetchPartnerServices();
        setEditingPartnerService(null);
        setPartnerFormData({
          name: '',
          price: '',
          icon: '/images/Linear Video, Audio, Sound  Gallery.svg',
          partnerName: '',
          description: '',
          isAvailable: true,
          imageUrl: '/images/Remove-bg.ai_1732383936587 1.png',
          link: ''
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Ошибка при обновлении услуги партнера:', error);
    }
  };

  const handleDeletePartnerService = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту услугу партнера?')) {
      try {
        const response = await fetch(`/api/partner-services?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchPartnerServices();
        }
      } catch (error) {
        console.error('Ошибка при удалении услуги партнера:', error);
      }
    }
  };

  const handleEditPartner = (service: PartnerService) => {
    setEditingPartnerService(service);
    setPartnerFormData({
      name: service.name,
      price: service.price,
      icon: service.icon,
      partnerName: service.partnerName,
      description: service.description,
      isAvailable: service.isAvailable,
      imageUrl: service.imageUrl,
      link: service.link
    });
    setShowForm(true);
  };

  const resetPartnerForm = () => {
    setPartnerFormData({
      name: '',
      price: '',
      icon: '/images/Linear Video, Audio, Sound  Gallery.svg',
      partnerName: '',
      description: '',
      isAvailable: true,
      imageUrl: '/images/Remove-bg.ai_1732383936587 1.png',
      link: ''
    });
  };

  const handlePartnerCancel = () => {
    setShowForm(false);
    setEditingPartnerService(null);
    resetPartnerForm();
  };

  // Функции для управления заказами
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId, status })
      });

      if (response.ok) {
        await fetchOrders();
      } else {
        alert('Ошибка при обновлении статуса заказа');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Ошибка при обновлении статуса заказа');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
      try {
        const response = await fetch(`/api/orders?id=${orderId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchOrders();
        } else {
          alert('Ошибка при удалении заказа');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Ошибка при удалении заказа');
      }
    }
  };

  const handleShowOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
    setShowOrderDetails(false);
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Ожидает оплаты';
      case 'paid': return 'Оплачен';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Выполнен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-xl">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Админ панель</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex-shrink-0 ${
              activeTab === 'services' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Услуги
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex-shrink-0 ${
              activeTab === 'categories' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Категории
          </button>
          <button
            onClick={() => setActiveTab('partner-services')}
            className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex-shrink-0 ${
              activeTab === 'partner-services' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Услуги партнеров
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex-shrink-0 ${
              activeTab === 'orders' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Заказы
          </button>
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Управление услугами</h2>
              <Button onClick={() => setShowForm(true)} className="text-sm px-3 py-1">Добавить услугу</Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                      Название
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Категория
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Цена
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={service.image} 
                            alt={service.name}
                            className="w-8 h-8 rounded-lg object-cover mr-2"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {service.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {service.description.substring(0, 30)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs text-gray-900">{service.category}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs font-medium text-gray-900">{service.price}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEdit(service)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs"
                          >
                            Изменить
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded text-xs"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {services.length === 0 && (
                <div className="text-center py-6">
                  <div className="text-gray-500 text-sm">Услуг пока нет</div>
                  <div className="text-gray-400 text-xs mt-1">Добавьте первую услугу</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Управление категориями</h2>
              <Button onClick={handleAddCategory}>Добавить категорию</Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Название
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Количество услуг
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {services.filter(service => service.category === category.name).length}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditCategory(category.name)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Partner Services Tab */}
        {activeTab === 'partner-services' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Управление услугами партнеров</h2>
              <Button onClick={() => setShowForm(true)} className="text-sm px-3 py-1">Добавить услугу</Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                      Название
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Партнер
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Цена
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                      Статус
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {partnerServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-1 flex items-center justify-center w-6 h-6 rounded bg-primary-dark shadow-5xl mr-2">
                            <img
                              src={service.icon}
                              alt=""
                              className="w-4 h-4"
                            />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-900">
                              {service.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {service.description.substring(0, 25)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs text-gray-900">{service.partnerName}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs font-medium text-gray-900">{service.price}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded-full ${
                          service.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {service.isAvailable ? 'Доступна' : 'Недоступна'}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditPartner(service)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs"
                          >
                            Изменить
                          </button>
                          <button
                            onClick={() => handleDeletePartnerService(service.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded text-xs"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {partnerServices.length === 0 && (
                <div className="text-center py-6">
                  <div className="text-gray-500 text-sm">Услуг партнеров пока нет</div>
                  <div className="text-gray-400 text-xs mt-1">Добавьте первую услугу партнера</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Управление заказами</h2>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                      Клиент
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Услуга
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                      Сумма
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Статус
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs text-gray-900">{order.serviceName}</div>
                        {order.message && (
                          <div className="text-xs text-gray-500 mt-1 max-w-[100px] truncate" title={order.message}>
                            {order.message.substring(0, 15)}...
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs font-medium text-gray-900">
                          {order.totalPrice.toLocaleString()} ₽
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleShowOrderDetails(order)}
                            className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                            title="Детали заказа"
                          >
                            Детали
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {orders.length === 0 && (
                <div className="text-center py-6">
                  <div className="text-gray-500 text-sm">Заказов пока нет</div>
                  <div className="text-gray-400 text-xs mt-1">Когда пользователи будут делать заказы, они появятся здесь</div>
                </div>
              )}
            </div>

            {/* Статистика заказов */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-xs font-medium text-gray-500">Всего</div>
                <div className="text-lg font-bold text-gray-900">{orders.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-xs font-medium text-gray-500">Ожидают</div>
                <div className="text-lg font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'pending').length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-xs font-medium text-gray-500">Оплачены</div>
                <div className="text-lg font-bold text-blue-600">
                  {orders.filter(o => o.status === 'paid').length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-xs font-medium text-gray-500">В работе</div>
                <div className="text-lg font-bold text-orange-600">
                  {orders.filter(o => o.status === 'in_progress').length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-xs font-medium text-gray-500">Выполнены</div>
                <div className="text-lg font-bold text-green-600">
                  {orders.filter(o => o.status === 'completed').length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingService ? 'Редактировать услугу' : 'Добавить услугу'}
                </h3>
                <form onSubmit={editingService ? handleEditService : handleAddService}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Категория
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Выберите категорию</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Цена
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Описание
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Изображение (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      {editingService ? 'Обновить' : 'Добавить'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Category Form Modal */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}
                </h3>
                <form onSubmit={handleCategorySubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название категории
                    </label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCategoryCancel}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      {editingCategory ? 'Обновить' : 'Добавить'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
                )}

        {/* Partner Service Form Modal */}
        {showForm && activeTab === 'partner-services' && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingPartnerService ? 'Редактировать услугу партнера' : 'Добавить услугу партнера'}
                </h3>
                <form onSubmit={editingPartnerService ? handleEditPartnerService : handleAddPartnerService}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название услуги
                    </label>
                    <input
                      type="text"
                      value={partnerFormData.name}
                      onChange={(e) => setPartnerFormData({...partnerFormData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название партнера
                    </label>
                    <input
                      type="text"
                      value={partnerFormData.partnerName}
                      onChange={(e) => setPartnerFormData({...partnerFormData, partnerName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Цена
                    </label>
                    <input
                      type="text"
                      value={partnerFormData.price}
                      onChange={(e) => setPartnerFormData({...partnerFormData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="от 50.000 ₽"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Иконка (путь к файлу)
                    </label>
                    <input
                      type="text"
                      value={partnerFormData.icon}
                      onChange={(e) => setPartnerFormData({...partnerFormData, icon: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/images/icon.svg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Описание
                    </label>
                    <textarea
                      value={partnerFormData.description}
                      onChange={(e) => setPartnerFormData({...partnerFormData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL изображения партнера
                    </label>
                    <input
                      type="text"
                      value={partnerFormData.imageUrl}
                      onChange={(e) => setPartnerFormData({...partnerFormData, imageUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/images/partner-logo.png"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ссылка на партнера
                    </label>
                    <input
                      type="text"
                      value={partnerFormData.link}
                      onChange={(e) => setPartnerFormData({...partnerFormData, link: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://partner-website.com или /partner-page"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={partnerFormData.isAvailable}
                        onChange={(e) => setPartnerFormData({...partnerFormData, isAvailable: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Доступна для заказа</span>
                    </label>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handlePartnerCancel}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      {editingPartnerService ? 'Обновить' : 'Добавить'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
         {showOrderDetails && selectedOrder && (
           <Dialog open={showOrderDetails} onClose={handleCloseOrderDetails}>
             <div className="p-4 md:p-6 w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
               <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Детали заказа #{selectedOrder.id}</h3>
               
               <div className="grid grid-cols-1 gap-3 md:gap-6 mb-4 md:mb-6">
                 <div>
                   <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">Информация о клиенте</h4>
                   <div className="space-y-1 md:space-y-2">
                     <div>
                       <p className="text-sm font-medium text-gray-700">Имя:</p>
                       <p className="text-base md:text-lg font-semibold text-gray-900 break-words">{selectedOrder.customerName}</p>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-700">Email:</p>
                       <p className="text-base md:text-lg font-semibold text-gray-900 break-words">{selectedOrder.customerEmail}</p>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-700">Телефон:</p>
                       <p className="text-base md:text-lg font-semibold text-gray-900 break-words">{selectedOrder.customerPhone}</p>
                     </div>
                   </div>
                 </div>
                 
                 <div>
                   <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">Информация о заказе</h4>
                   <div className="space-y-1 md:space-y-2">
                     <div>
                       <p className="text-sm font-medium text-gray-700">Услуга:</p>
                       <p className="text-base md:text-lg font-semibold text-gray-900 break-words">{selectedOrder.serviceName}</p>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-700">Сумма:</p>
                       <p className="text-base md:text-lg font-semibold text-gray-900">{selectedOrder.totalPrice.toLocaleString()} ₽</p>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-700">Статус:</p>
                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                         {getStatusText(selectedOrder.status)}
                       </span>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="mb-4 md:mb-6">
                 <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">Состав заказа</h4>
                 <div className="bg-gray-50 rounded-lg p-4">
                   <div className="space-y-3">
                     <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-700">Основная услуга:</span>
                       <span className="text-sm font-medium text-gray-900">{selectedOrder.serviceName}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-700">Базовые функции:</span>
                       <span className="text-sm font-medium text-gray-900">30 000 ₽</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-700">Дополнительные функции:</span>
                       <span className="text-sm font-medium text-gray-900">22 000 ₽</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-700">Дизайн:</span>
                       <span className="text-sm font-medium text-gray-900">50 000 ₽</span>
                     </div>
                     <hr className="my-2" />
                     <div className="flex justify-between items-center">
                       <span className="text-sm font-semibold text-gray-900">Итого:</span>
                       <span className="text-lg font-bold text-gray-900">{selectedOrder.totalPrice.toLocaleString()} ₽</span>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="mb-4 md:mb-6">
                 <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">Сообщение клиента</h4>
                 <div className="bg-gray-50 rounded-lg p-4">
                   <p className="text-sm text-gray-700">{selectedOrder.message || 'Сообщение не указано'}</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 md:mb-6">
                 <div>
                   <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">Даты</h4>
                   <div className="space-y-1 md:space-y-2">
                     <div>
                       <p className="text-sm font-medium text-gray-700">Создан:</p>
                       <p className="text-sm text-gray-900">
                         {new Date(selectedOrder.createdAt).toLocaleDateString('ru-RU')} в {new Date(selectedOrder.createdAt).toLocaleTimeString('ru-RU')}
                       </p>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-700">Обновлен:</p>
                       <p className="text-sm text-gray-900">
                         {new Date(selectedOrder.updatedAt).toLocaleDateString('ru-RU')} в {new Date(selectedOrder.updatedAt).toLocaleTimeString('ru-RU')}
                       </p>
                     </div>
                   </div>
                 </div>
                 
                 <div>
                   <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">Управление статусом</h4>
                   <div className="space-y-1 md:space-y-2">
                     {selectedOrder.status === 'pending' && (
                       <div className="flex flex-col sm:flex-row gap-2">
                         <button
                           onClick={() => {
                             handleUpdateOrderStatus(selectedOrder.id, 'paid');
                             handleCloseOrderDetails();
                           }}
                           className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-2 rounded text-sm w-full sm:w-auto"
                         >
                           ✓ Пометить как оплаченный
                         </button>
                         <button
                           onClick={() => {
                             handleUpdateOrderStatus(selectedOrder.id, 'cancelled');
                             handleCloseOrderDetails();
                           }}
                           className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-2 rounded text-sm w-full sm:w-auto"
                         >
                           ✗ Отменить заказ
                         </button>
                       </div>
                     )}
                     {selectedOrder.status === 'paid' && (
                       <button
                         onClick={() => {
                           handleUpdateOrderStatus(selectedOrder.id, 'in_progress');
                           handleCloseOrderDetails();
                         }}
                         className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded text-sm w-full sm:w-auto"
                       >
                         Начать работу
                       </button>
                     )}
                     {selectedOrder.status === 'in_progress' && (
                       <button
                         onClick={() => {
                           handleUpdateOrderStatus(selectedOrder.id, 'completed');
                           handleCloseOrderDetails();
                         }}
                         className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-2 rounded text-sm w-full sm:w-auto"
                       >
                         ✓ Завершить заказ
                       </button>
                     )}
                   </div>
                 </div>
               </div>

               <div className="flex flex-col sm:flex-row justify-end gap-3">
                 <button
                   onClick={() => handleDeleteOrder(selectedOrder.id)}
                   className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-4 py-2 rounded text-sm w-full sm:w-auto"
                 >
                   Удалить заказ
                 </button>
                 <button
                   onClick={handleCloseOrderDetails}
                   className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm w-full sm:w-auto"
                 >
                   Закрыть
                 </button>
               </div>
             </div>
           </Dialog>
         )}
      </div>
    </div>
  );
}

export default AdminPanel; 