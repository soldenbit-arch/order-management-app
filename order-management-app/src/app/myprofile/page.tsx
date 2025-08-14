"use client";
import Button from "@/components/common/Button";
import Dialog from "@/components/common/Dialog";
import Link from "next/link";
import React, { useState, useEffect } from "react";

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

function MyProfile() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    const fetchUserOrders = async () => {
        try {
            // Используем номер телефона пользователя для поиска заказов
            const response = await fetch('/api/user-orders?phone=%2B7%20(999)%20999-99-99');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const getStatusText = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'В ожидании';
            case 'paid': return 'Оплачен';
            case 'in_progress': return 'В разработке';
            case 'completed': return 'Завершен';
            case 'cancelled': return 'Отменен';
            default: return status;
        }
    };

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };



    return (
        <div className="">
            <div className="fixed top-0 left-0 right-0 z-30 pt-4">
                <div className="device-container flex px-4">
                    <Link
                        href="/"
                        className="rounded-full bg-white font-bold text-center text-md text-neutral-950 px-3.5 py-2 block"
                    >
                        Назад
                    </Link>
                </div>
            </div>
            <div className="relative z-0 mb-10">
                <span className="w-[445px] h-[228px] left-1/2 -translate-x-1/2 bg-[#837FDF] block absolute top-[-100px] -z-20 rounded-full blur-[150px]" />
                <img
                    src="/images/Frame 166.svg"
                    className="absolute -z-10 -top-8 w-full"
                    alt=""
                />
                <div className="mt-8 mb-8">
                    <div className="flex justify-center mb-5">
                        <div className="rounded-[100px] bg-[rgb(111,_53,_255)] shadow-[0px_4px_12px_2px_rgba(255,_255,_255,_0.25)_inset] size-[92px] grid place-content-center">
                            <img src="/images/user-profile.svg" alt="" />
                        </div>
                    </div>
                    <p className="font-semibold text-center text-4xl text-neutral-950 mb-2.5">
                        Мой профиль
                    </p>
                    <b className="font-semibold block text-center text-4xl text-neutral-950">
                        +7 (999) 999 99 99
                    </b>
                </div>
                <div className="flex flex-col gap-3">
                    {loading && (
                        <div className="text-center py-8">
                            <div className="text-lg">Загрузка заказов...</div>
                        </div>
                    )}
                    

                    
                    {!loading && orders.length > 0 &&
                        orders.map((order) => (
                            <div
                                className="rounded-2xl bg-white shadow-4xl p-4 pt-3 flex justify-between gap-2 items-center"
                                key={order.id}
                            >
                                <div className="flex-1">
                                    <b className="font-semibold text-3xl text-neutral-950 block mb-1">
                                        Заказ #{order.id.slice(-6)}
                                    </b>
                                    <p className="font-semibold text-md text-neutral-900/50">
                                        {order.serviceName} - {getStatusText(order.status)}
                                    </p>
                                    {order.partnerName && (
                                        <p className="text-sm text-purple-600 font-medium">
                                            Партнер: {order.partnerName}
                                        </p>
                                    )}
                                    <p className="text-sm text-neutral-700">
                                        {order.totalPrice.toLocaleString()} ₽
                                    </p>
                                </div>
                                <button 
                                    onClick={() => handleOrderClick(order)}
                                    className="rounded-[100px] bg-primary-dark shadow-5xl size-10 grid place-content-center"
                                    title="Подробнее"
                                >
                                    <img
                                        src="/images/Linear  Arrows Alt Arrow Right.svg"
                                        alt="Подробнее"
                                    />
                                </button>
                            </div>
                        ))}

                    {!loading && orders.length === 0 && (
                        <div className="flex flex-col items-center mx-auto max-w-[180px] mt-16">
                            <div className="mb-4">
                                <img
                                    src="/images/Bold Faces, Emotions, Stickers Sleeping Circle.svg"
                                    alt=""
                                />
                            </div>
                            <p className="font-semibold text-center text-lg text-neutral-950 mb-8">
                                Вы пока не сделали ни одного заказа
                            </p>
                            <Button>Заказать!</Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 pb-4 left-0 right-0 bg-[#F9F9F9] py-2">
                <div className="device-container px-4 space-y-3">
                    {/* Кнопка для партнеров */}
                    <div className="flex justify-center">
                        <Link
                            href="/partner-login"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors flex items-center gap-2"
                        >
                            <span>Стать партнером</span>
                            <img src="/images/Linear Arrows Alt Arrow Right.svg" alt="" className="w-4 h-4 filter invert" />
                        </Link>
                    </div>
                    
                    {/* Существующие кнопки */}
                    <div className="flex justify-between">
                        <div role="button" className="flex items-center gap-1.5">
                            <img src="/images/Linear  Arrows ALogout 2.svg" alt="" />
                            <span className="font-semibold text-lg text-neutral-950">
                                Выйти
                            </span>
                        </div>
                        <div role="button" className="flex items-center gap-1.5">
                            <img
                                src="/images/Linear  Essentional, UI Trash Bin Trash.svg"
                                alt=""
                            />
                            <span className="font-semibold text-lg text-[rgb(221,_72,_58)]">
                                Удалить аккаунт
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Dialog */}
            <Dialog open={showOrderDetails} onClose={() => setShowOrderDetails(false)}>
                {selectedOrder && (
                    <div className="p-6 max-w-md">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Детали заказа #{selectedOrder.id.slice(-6)}
                        </h3>
                        
                        <div className="space-y-4">
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
                            
                            {selectedOrder.partnerName && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Партнер:</label>
                                    <p className="text-lg font-semibold text-purple-600">{selectedOrder.partnerName}</p>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Статус:</label>
                                <p className="text-lg">{getStatusText(selectedOrder.status)}</p>
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

export default MyProfile;
