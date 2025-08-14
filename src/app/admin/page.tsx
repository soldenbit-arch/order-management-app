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

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  partnerId?: string;
  partnerName?: string;
  createdAt: string;
  updatedAt: string;
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState<'services' | 'partnerServices' | 'partners' | 'partnerOrders' | 'users' | 'orders'>('services');
  
  // States for Services
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
    features: ""
  });

  // States for Partner Services
  const [partnerServices, setPartnerServices] = useState<PartnerService[]>([]);
  const [partnerLoading, setPartnerLoading] = useState(true);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [editingPartnerService, setEditingPartnerService] = useState<PartnerService | null>(null);
  const [partnerFormData, setPartnerFormData] = useState({
    name: "",
    price: "",
    icon: "",
    partnerName: "",
    description: "",
    isAvailable: true,
    imageUrl: "",
    link: ""
  });

  // States for Partners
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [showPartnerCreateForm, setShowPartnerCreateForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [partnerCreateFormData, setPartnerCreateFormData] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
    logo: "",
    bannerTitle: "",
    bannerSubtitle: "",
    bannerImage: "",
    isActive: true
  });

  // States for Partner Orders
  const [partnerOrders, setPartnerOrders] = useState<Order[]>([]);
  const [partnerOrdersLoading, setPartnerOrdersLoading] = useState(true);
  const [selectedPartnerOrder, setSelectedPartnerOrder] = useState<Order | null>(null);
  const [showPartnerOrderDetails, setShowPartnerOrderDetails] = useState(false);

  // States for Users
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    phone: "",
    isActive: true
  });

  // States for Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchPartnerServices();
    fetchPartners();
    fetchPartnerOrders();
    fetchUsers();
    fetchOrders();
  }, []);

  // Services functions
  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Ошибка при загрузке услуг:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const features = formData.features.split(',').map(f => f.trim()).filter(f => f);
      
      if (editingService) {
        // Обновление существующей услуги
        const response = await fetch('/api/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingService.id,
            ...formData,
            features
          })
        });
        
        if (response.ok) {
          await fetchServices();
          setShowForm(false);
          setEditingService(null);
          resetForm();
        }
      } else {
        // Создание новой услуги
        const response = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            features
          })
        });
        
        if (response.ok) {
          await fetchServices();
          setShowForm(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Ошибка при сохранении услуги:', error);
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
      features: service.features.join(', ')
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
      try {
        const response = await fetch(`/api/services?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchServices();
        }
      } catch (error) {
        console.error('Ошибка при удалении услуги:', error);
      }
    }
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

  // Partner Services functions
  const fetchPartnerServices = async () => {
    try {
      const response = await fetch('/api/partner-services');
      const data = await response.json();
      setPartnerServices(data);
    } catch (error) {
      console.error('Ошибка при загрузке услуг партнеров:', error);
    } finally {
      setPartnerLoading(false);
    }
  };

  // Partners functions
  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners');
      const data = await response.json();
      setPartners(data);
    } catch (error) {
      console.error('Ошибка при загрузке партнеров:', error);
    } finally {
      setPartnersLoading(false);
    }
  };

  const handlePartnerCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPartner) {
        // Обновление существующего партнера
        const response = await fetch('/api/partners', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingPartner.id,
            ...partnerCreateFormData
          })
        });
        
        if (response.ok) {
          await fetchPartners();
          setShowPartnerCreateForm(false);
          setEditingPartner(null);
          resetPartnerCreateForm();
        }
      } else {
        // Создание нового партнера
        const response = await fetch('/api/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partnerCreateFormData)
        });
        
        if (response.ok) {
          await fetchPartners();
          setShowPartnerCreateForm(false);
          resetPartnerCreateForm();
        }
      }
    } catch (error) {
      console.error('Ошибка при сохранении партнера:', error);
    }
  };

  const handlePartnerCreateEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setPartnerCreateFormData({
      name: partner.name,
      email: partner.email,
      password: partner.password,
      description: partner.description,
      logo: partner.logo,
      bannerTitle: partner.bannerTitle,
      bannerSubtitle: partner.bannerSubtitle,
      bannerImage: partner.bannerImage,
      isActive: partner.isActive
    });
    setShowPartnerCreateForm(true);
  };

  const handlePartnerCreateDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этого партнера?')) {
      try {
        const response = await fetch(`/api/partners?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchPartners();
        }
      } catch (error) {
        console.error('Ошибка при удалении партнера:', error);
      }
    }
  };

  const resetPartnerCreateForm = () => {
    setPartnerCreateFormData({
      name: "",
      email: "",
      password: "",
      description: "",
      logo: "",
      bannerTitle: "",
      bannerSubtitle: "",
      bannerImage: "",
      isActive: true
    });
  };

  const handlePartnerCreateCancel = () => {
    setShowPartnerCreateForm(false);
    setEditingPartner(null);
    resetPartnerCreateForm();
  };

  // Partner Orders functions
  const fetchPartnerOrders = async () => {
    try {
      const response = await fetch('/api/partner-orders-all');
      const data = await response.json();
      setPartnerOrders(data);
    } catch (error) {
      console.error('Ошибка при загрузке заказов партнеров:', error);
    } finally {
      setPartnerOrdersLoading(false);
    }
  };

  const handlePartnerOrderStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch('/api/partner-orders-all', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          status: newStatus
        })
      });
      
      if (response.ok) {
        await fetchPartnerOrders();
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса заказа партнера:', error);
    }
  };

  const handlePartnerOrderDelete = async (orderId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот заказ партнера?')) {
      try {
        const response = await fetch(`/api/partner-orders-all?id=${orderId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchPartnerOrders();
        }
      } catch (error) {
        console.error('Ошибка при удалении заказа партнера:', error);
      }
    }
  };

  const handlePartnerOrderView = (order: Order) => {
    setSelectedPartnerOrder(order);
    setShowPartnerOrderDetails(true);
  };

  // Users functions
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Обновление существующего пользователя
        const response = await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingUser.id,
            ...userFormData
          })
        });
        
        if (response.ok) {
          await fetchUsers();
          setShowUserForm(false);
          setEditingUser(null);
          resetUserForm();
        }
      } else {
        // Создание нового пользователя
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userFormData)
        });
        
        if (response.ok) {
          await fetchUsers();
          setShowUserForm(false);
          resetUserForm();
        }
      }
    } catch (error) {
      console.error('Ошибка при сохранении пользователя:', error);
    }
  };

  const handleUserEdit = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive
    });
    setShowUserForm(true);
  };

  const handleUserDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        const response = await fetch(`/api/users?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchUsers();
        }
      } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
      }
    }
  };

  const resetUserForm = () => {
    setUserFormData({
      name: "",
      email: "",
      phone: "",
      isActive: true
    });
  };

  const handleUserCancel = () => {
    setShowUserForm(false);
    setEditingUser(null);
    resetUserForm();
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPartnerService) {
        // Обновление существующей услуги партнера
        const response = await fetch('/api/partner-services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingPartnerService.id,
            ...partnerFormData
          })
        });
        
        if (response.ok) {
          await fetchPartnerServices();
          setShowPartnerForm(false);
          setEditingPartnerService(null);
          resetPartnerForm();
        }
      } else {
        // Создание новой услуги партнера
        const response = await fetch('/api/partner-services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partnerFormData)
        });
        
        if (response.ok) {
          await fetchPartnerServices();
          setShowPartnerForm(false);
          resetPartnerForm();
        }
      }
    } catch (error) {
      console.error('Ошибка при сохранении услуги партнера:', error);
    }
  };

  const handlePartnerEdit = (service: PartnerService) => {
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
    setShowPartnerForm(true);
  };

  const handlePartnerDelete = async (id: string) => {
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

  const resetPartnerForm = () => {
    setPartnerFormData({
      name: "",
      price: "",
      icon: "",
      partnerName: "",
      description: "",
      isAvailable: true,
      imageUrl: "",
      link: ""
    });
  };

  const handlePartnerCancel = () => {
    setShowPartnerForm(false);
    setEditingPartnerService(null);
    resetPartnerForm();
  };

  // Orders functions
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
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
        body: JSON.stringify({
          id: orderId,
          status: newStatus
        })
      });
      
      if (response.ok) {
        await fetchOrders();
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса заказа:', error);
    }
  };

  const handleOrderDelete = async (orderId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
      try {
        const response = await fetch(`/api/orders?id=${orderId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchOrders();
        }
      } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
      }
    }
  };

  const handleOrderView = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (loading || partnerLoading || partnersLoading || partnerOrdersLoading || usersLoading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Админ панель</h1>
          <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-4 w-full sm:w-auto">
            <Button 
              onClick={() => setActiveTab('services')}
              color={activeTab === 'services' ? 'secondary' : 'primary'}
              variant={activeTab === 'services' ? 'contained' : 'outlined'}
              size="small"
              className="text-xs sm:text-sm"
            >
              Услуги
            </Button>
            <Button 
              onClick={() => setActiveTab('partnerServices')}
              color={activeTab === 'partnerServices' ? 'secondary' : 'primary'}
              variant={activeTab === 'partnerServices' ? 'contained' : 'outlined'}
              size="small"
              className="text-xs sm:text-sm"
            >
              Парт. услуги
            </Button>
            <Button 
              onClick={() => setActiveTab('partners')}
              color={activeTab === 'partners' ? 'secondary' : 'primary'}
              variant={activeTab === 'partners' ? 'contained' : 'outlined'}
              size="small"
              className="text-xs sm:text-sm"
            >
              Партнеры
            </Button>
            <Button 
              onClick={() => setActiveTab('partnerOrders')}
              color={activeTab === 'partnerOrders' ? 'secondary' : 'primary'}
              variant={activeTab === 'partnerOrders' ? 'contained' : 'outlined'}
              size="small"
              className="text-xs sm:text-sm"
            >
              Заказы парт.
            </Button>
            <Button 
              onClick={() => setActiveTab('users')}
              color={activeTab === 'users' ? 'secondary' : 'primary'}
              variant={activeTab === 'users' ? 'contained' : 'outlined'}
              size="small"
              className="text-xs sm:text-sm"
            >
              Пользователи
            </Button>
            <Button 
              onClick={() => setActiveTab('orders')}
              color={activeTab === 'orders' ? 'secondary' : 'primary'}
              variant={activeTab === 'orders' ? 'contained' : 'outlined'}
              size="small"
              className="text-xs sm:text-sm"
            >
              Заказы
            </Button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {activeTab === 'services' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-end items-center">
                <Button onClick={() => setShowForm(true)} color="secondary" size="small" className="text-xs">
                  + Добавить
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Название
                      </th>
                      <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Категория
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Цена
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={service.image} 
                              alt={service.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover mr-2 sm:mr-3"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                {service.name}
                              </div>
                              <div className="hidden sm:block text-xs sm:text-sm text-gray-500">
                                {service.description.substring(0, 50)}...
                              </div>
                              <div className="sm:hidden text-xs text-gray-500">
                                {service.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {service.category}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {service.price}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <Button
                              onClick={() => handleEdit(service)}
                              variant="outlined"
                              size="small"
                              color="secondary"
                              className="text-xs"
                            >
                              Изменить
                            </Button>
                            <Button
                              onClick={() => handleDelete(service.id)}
                              variant="outlined"
                              size="small"
                              color="primary"
                              className="text-xs"
                            >
                              Удалить
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'partnerServices' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-end items-center">
                <Button onClick={() => setShowPartnerForm(true)} color="secondary" size="small" className="text-xs">
                  + Добавить
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Название
                      </th>
                      <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Партнер
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Цена
                      </th>
                      <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {partnerServices.map((service) => (
                      <tr key={service.id}>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={service.imageUrl} 
                              alt={service.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover mr-2 sm:mr-3"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                {service.name}
                              </div>
                              <div className="hidden sm:block text-xs sm:text-sm text-gray-500">
                                {service.description.substring(0, 50)}...
                              </div>
                              <div className="sm:hidden text-xs text-gray-500">
                                {service.partnerName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {service.partnerName}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {service.price}
                        </td>
                        <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            service.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {service.isAvailable ? 'Доступен' : 'Недоступен'}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <Button
                              onClick={() => handlePartnerEdit(service)}
                              variant="outlined"
                              size="small"
                              color="secondary"
                              className="text-xs"
                            >
                              Изменить
                            </Button>
                            <Button
                              onClick={() => handlePartnerDelete(service.id)}
                              variant="outlined"
                              size="small"
                              color="primary"
                              className="text-xs"
                            >
                              Удалить
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-end items-center">
                <Button onClick={() => setShowPartnerCreateForm(true)} color="secondary" size="small">
                  Добавить партнера
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Партнер
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Описание
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
                    {partners.map((partner) => (
                      <tr key={partner.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={partner.logo} 
                              alt={partner.name}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {partner.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {partner.bannerTitle}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {partner.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {partner.description.substring(0, 50)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            partner.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {partner.isActive ? 'Активен' : 'Неактивен'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handlePartnerCreateEdit(partner)}
                              variant="outlined"
                              size="small"
                              color="secondary"
                            >
                              Редактировать
                            </Button>
                            <Button
                              onClick={() => handlePartnerCreateDelete(partner.id)}
                              variant="outlined"
                              size="small"
                              color="primary"
                            >
                              Удалить
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'partnerOrders' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Заказы партнеров</h2>
              </div>
              
              <div className="overflow-x-auto">
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
                        Партнер
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
                        Дата создания
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {partnerOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-xs">{order.customerEmail}</div>
                            <div className="text-xs">{order.customerPhone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-medium text-purple-600">{order.partnerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div className="font-medium">{order.serviceName}</div>
                            <div className="text-xs text-gray-400 max-w-xs truncate">
                              {order.message}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.totalPrice.toLocaleString()} ₽
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => handlePartnerOrderStatusUpdate(order.id, e.target.value as Order['status'])}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">В ожидании</option>
                            <option value="paid">Оплачен</option>
                            <option value="in_progress">В работе</option>
                            <option value="completed">Завершен</option>
                            <option value="cancelled">Отменен</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            onClick={() => handlePartnerOrderView(order)}
                            variant="outlined"
                            color="secondary"
                            size="small"
                          >
                            Просмотр
                          </Button>
                          <Button
                            onClick={() => handlePartnerOrderDelete(order.id)}
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
                
                {partnerOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Заказов партнеров пока нет
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-end items-center">
                <Button onClick={() => setShowUserForm(true)} color="secondary" size="small">
                  Добавить пользователя
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Пользователь
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Телефон
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата регистрации
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-gray-700">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Активен' : 'Неактивен'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleUserEdit(user)}
                              variant="outlined"
                              size="small"
                              color="secondary"
                            >
                              Редактировать
                            </Button>
                            <Button
                              onClick={() => handleUserDelete(user.id)}
                              variant="outlined"
                              size="small"
                              color="primary"
                            >
                              Удалить
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Заказы</h2>
            </div>
            
            <div className="overflow-x-auto">
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
                      Дата создания
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
                        #{order.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-xs">{order.customerEmail}</div>
                          <div className="text-xs">{order.customerPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium">{order.serviceName}</div>
                          <div className="text-xs text-gray-400 max-w-xs truncate">
                            {order.message}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.totalPrice.toLocaleString()} ₽
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value as Order['status'])}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">В ожидании</option>
                          <option value="paid">Оплачен</option>
                          <option value="in_progress">В работе</option>
                          <option value="completed">Завершен</option>
                          <option value="cancelled">Отменен</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          onClick={() => handleOrderView(order)}
                          variant="outlined"
                          color="secondary"
                          size="small"
                        >
                          Просмотр
                        </Button>
                        <Button
                          onClick={() => handleOrderDelete(order.id)}
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
              
              {orders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Заказов пока нет
                </div>
                            )}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Service Form Dialog */}
      <Dialog open={showForm} onClose={handleCancel}>
        <div className="p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
            {editingService ? 'Редактировать услугу' : 'Добавить услугу'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Название услуги *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Категория *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите категорию</option>
                <option value="Приложения">Приложения</option>
                <option value="Сервисы">Сервисы</option>
                <option value="Финансы">Финансы</option>
                <option value="Технологии">Технологии</option>
                <option value="Функции">Функции</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Безопасность">Безопасность</option>
                <option value="Пользователи">Пользователи</option>
                <option value="Отзывы">Отзывы</option>
                <option value="Поддержка">Поддержка</option>
                <option value="Дизайн">Дизайн</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Цена *
              </label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="100 000 ₽ +"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                URL изображения
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="/images/service.png"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Функции (через запятую)
              </label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
                placeholder="Функция 1, Функция 2, Функция 3"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2 sm:space-x-3 pt-3 sm:pt-4">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outlined"
                color="secondary"
                className="text-xs"
              >
                Отмена
              </Button>
              <Button type="submit" color="secondary" className="text-xs">
                {editingService ? 'Обновить' : 'Создать'}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Partner Create Form Dialog */}
      <Dialog open={showPartnerCreateForm} onClose={handlePartnerCreateCancel}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingPartner ? 'Редактировать партнера' : 'Добавить партнера'}
          </h3>
          
          <form onSubmit={handlePartnerCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название партнера *
              </label>
              <input
                type="text"
                required
                value={partnerCreateFormData.name}
                onChange={(e) => setPartnerCreateFormData({...partnerCreateFormData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={partnerCreateFormData.email}
                onChange={(e) => setPartnerCreateFormData({...partnerCreateFormData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль *
              </label>
              <input
                type="password"
                required
                value={partnerCreateFormData.password}
                onChange={(e) => setPartnerCreateFormData({...partnerCreateFormData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={partnerCreateFormData.description}
                onChange={(e) => setPartnerCreateFormData({...partnerCreateFormData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL логотипа
              </label>
              <input
                type="text"
                value={partnerCreateFormData.logo}
                onChange={(e) => setPartnerCreateFormData({...partnerCreateFormData, logo: e.target.value})}
                placeholder="/images/logo.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Заголовок баннера
              </label>
              <input
                type="text"
                value={partnerCreateFormData.bannerTitle}
                onChange={(e) => setPartnerCreateFormData({...partnerCreateFormData, bannerTitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подзаголовок баннера
              </label>
              <input
                type="text"
                value={partnerCreateFormData.bannerSubtitle}
                onChange={(e) => setPartnerCreateFormData({...partnerCreateFormData, bannerSubtitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL изображения баннера
              </label>
              <input
                type="text"
                value={partnerCreateFormData.bannerImage}
                onChange={(e) => setPartnerCreateFormData({...partnerCreateFormData, bannerImage: e.target.value})}
                placeholder="/images/banner.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={partnerCreateFormData.isActive}
                onChange={(e) => setPartnerCreateFormData({...partnerCreateFormData, isActive: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Партнер активен
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={handlePartnerCreateCancel}
                variant="outlined"
                color="secondary"
              >
                Отмена
              </Button>
              <Button type="submit" color="secondary">
                {editingPartner ? 'Обновить' : 'Создать'}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Partner Service Form Dialog */}
      <Dialog open={showPartnerForm} onClose={handlePartnerCancel}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingPartnerService ? 'Редактировать услугу партнера' : 'Добавить услугу партнера'}
          </h3>
          
          <form onSubmit={handlePartnerSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название услуги *
              </label>
              <input
                type="text"
                required
                value={partnerFormData.name}
                onChange={(e) => setPartnerFormData({...partnerFormData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название партнера *
              </label>
              <input
                type="text"
                required
                value={partnerFormData.partnerName}
                onChange={(e) => setPartnerFormData({...partnerFormData, partnerName: e.target.value})}
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
                value={partnerFormData.price}
                onChange={(e) => setPartnerFormData({...partnerFormData, price: e.target.value})}
                placeholder="от 50.000 ₽"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={partnerFormData.description}
                onChange={(e) => setPartnerFormData({...partnerFormData, description: e.target.value})}
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
                value={partnerFormData.imageUrl}
                onChange={(e) => setPartnerFormData({...partnerFormData, imageUrl: e.target.value})}
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
                value={partnerFormData.icon}
                onChange={(e) => setPartnerFormData({...partnerFormData, icon: e.target.value})}
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
                value={partnerFormData.link}
                onChange={(e) => setPartnerFormData({...partnerFormData, link: e.target.value})}
                placeholder="/partner-services/1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                checked={partnerFormData.isAvailable}
                onChange={(e) => setPartnerFormData({...partnerFormData, isAvailable: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                Услуга доступна
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={handlePartnerCancel}
                variant="outlined"
                color="secondary"
              >
                Отмена
              </Button>
              <Button type="submit" color="secondary">
                {editingPartnerService ? 'Обновить' : 'Создать'}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* User Form Dialog */}
      <Dialog open={showUserForm} onClose={handleUserCancel}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
          </h3>
          
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя пользователя *
              </label>
              <input
                type="text"
                required
                value={userFormData.name}
                onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={userFormData.email}
                onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон *
              </label>
              <input
                type="tel"
                required
                value={userFormData.phone}
                onChange={(e) => setUserFormData({...userFormData, phone: e.target.value})}
                placeholder="+7 (999) 999-99-99"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="userIsActive"
                checked={userFormData.isActive}
                onChange={(e) => setUserFormData({...userFormData, isActive: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="userIsActive" className="text-sm font-medium text-gray-700">
                Пользователь активен
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={handleUserCancel}
                variant="outlined"
                color="secondary"
              >
                Отмена
              </Button>
              <Button type="submit" color="secondary">
                {editingUser ? 'Обновить' : 'Создать'}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Partner Order Details Dialog */}
      <Dialog open={showPartnerOrderDetails} onClose={() => setShowPartnerOrderDetails(false)}>
        {selectedPartnerOrder && (
          <div className="p-6 max-w-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Детали заказа партнера #{selectedPartnerOrder.id.slice(-8)}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Клиент:</label>
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-semibold">{selectedPartnerOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedPartnerOrder.customerEmail}</p>
                  <p className="text-sm text-gray-600">{selectedPartnerOrder.customerPhone}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Партнер:</label>
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-semibold text-purple-600">{selectedPartnerOrder.partnerName}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Услуга:</label>
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-semibold">{selectedPartnerOrder.serviceName}</p>
                  <p className="text-lg font-bold text-purple-600">
                    {selectedPartnerOrder.totalPrice.toLocaleString()} ₽
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Статус:</label>
                <div className="bg-gray-50 rounded p-3">
                  <select
                    value={selectedPartnerOrder.status}
                    onChange={(e) => handlePartnerOrderStatusUpdate(selectedPartnerOrder.id, e.target.value as Order['status'])}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="pending">В ожидании</option>
                    <option value="paid">Оплачен</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Завершен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Даты:</label>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm">
                    <span className="font-medium">Создан:</span> {new Date(selectedPartnerOrder.createdAt).toLocaleString('ru-RU')}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Обновлен:</span> {new Date(selectedPartnerOrder.updatedAt).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
            </div>
            
            {selectedPartnerOrder.message && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Детали заказа:</label>
                <div className="bg-gray-50 rounded p-3 max-h-60 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">{selectedPartnerOrder.message}</pre>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-6">
              <Button
                onClick={() => setShowPartnerOrderDetails(false)}
                variant="outlined"
                color="secondary"
              >
                Закрыть
              </Button>
              <Button
                onClick={() => {
                  setShowPartnerOrderDetails(false);
                  handlePartnerOrderDelete(selectedPartnerOrder.id);
                }}
                variant="outlined"
                color="primary"
              >
                Удалить заказ
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onClose={() => setShowOrderDetails(false)}>
        {selectedOrder && (
          <div className="p-6 max-w-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Детали заказа #{selectedOrder.id.slice(-8)}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Клиент:</label>
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-semibold">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Услуга:</label>
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-semibold">{selectedOrder.serviceName}</p>
                  <p className="text-lg font-bold text-purple-600">
                    {selectedOrder.totalPrice.toLocaleString()} ₽
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Статус:</label>
                <div className="bg-gray-50 rounded p-3">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleOrderStatusUpdate(selectedOrder.id, e.target.value as Order['status'])}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="pending">В ожидании</option>
                    <option value="paid">Оплачен</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Завершен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Даты:</label>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm">
                    <span className="font-medium">Создан:</span> {new Date(selectedOrder.createdAt).toLocaleString('ru-RU')}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Обновлен:</span> {new Date(selectedOrder.updatedAt).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
            </div>
            
            {selectedOrder.message && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Детали заказа:</label>
                <div className="bg-gray-50 rounded p-3 max-h-60 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">{selectedOrder.message}</pre>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-6">
              <Button
                onClick={() => setShowOrderDetails(false)}
                variant="outlined"
                color="secondary"
              >
                Закрыть
              </Button>
              <Button
                onClick={() => {
                  setShowOrderDetails(false);
                  handleOrderDelete(selectedOrder.id);
                }}
                variant="outlined"
                color="primary"
              >
                Удалить заказ
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default AdminPage; 