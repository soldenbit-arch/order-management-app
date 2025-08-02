"use client";
import Button from "@/components/common/Button";
import Dialog from "@/components/common/Dialog";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface UserOrder {
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

function MyProfile() {
    const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail') || 'client@example.com';
        const userPhone = localStorage.getItem('userPhone') || '+7 (999) 999-99-99';
        fetchUserOrders(userEmail, userPhone);
    }, []);

    const fetchUserOrders = async (email: string, phone: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/user-orders?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`);
            if (response.ok) {
                const orders = await response.json();
                setUserOrders(orders);
            }
        } catch (error) {
            console.error('Error fetching user orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status: UserOrder['status']) => {
        switch (status) {
            case 'pending': return 'Ожидает оплаты';
            case 'paid': return 'Оплачен';
            case 'in_progress': return 'В работе';
            case 'completed': return 'Завершен';
            case 'cancelled': return 'Отменен';
            default: return status;
        }
    };

    const getStatusColor = (status: UserOrder['status']) => {
        switch (status) {
            case 'pending': return 'text-yellow-600';
            case 'paid': return 'text-green-600';
            case 'in_progress': return 'text-blue-600';
            case 'completed': return 'text-green-600';
            case 'cancelled': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const handleShowOrderDetails = (order: UserOrder) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handleCloseOrderDetails = () => {
        setSelectedOrder(null);
        setShowOrderDetails(false);
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
                
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : userOrders.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {userOrders
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((order) => (
                            <div
                                key={order.id}
                                className="rounded-2xl bg-white shadow-4xl p-4 pt-3 flex justify-between gap-2 items-center"
                            >
                                <div className="flex-1">
                                    <b className="font-semibold text-2xl text-neutral-950 block mb-1">
                                        {order.serviceName}
                                    </b>
                                    <p className={`font-semibold text-md ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </p>
                                    <p className="font-medium text-sm text-neutral-600 mt-1">
                                        {order.totalPrice.toLocaleString()} ₽
                                    </p>
                                    {order.status === 'paid' && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-xs text-green-600 font-medium">Оплачено</span>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => handleShowOrderDetails(order)}
                                    className="rounded-[100px] bg-primary-dark shadow-5xl size-10 grid place-content-center"
                                >
                                    <img
                                        src="/images/Linear  Arrows Alt Arrow Right.svg"
                                        alt=""
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
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
                        <Link href="/">
                            <Button>Заказать!</Button>
                        </Link>
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 pb-4 left-0 right-0 bg-[#F9F9F9] py-2">
                <div className="flex justify-between device-container px-4">
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

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <Dialog open={showOrderDetails} onClose={handleCloseOrderDetails}>
                    <div className="p-4 md:p-6 w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Детали заказа #{selectedOrder.id}</h3>
                        
                        <div className="grid grid-cols-1 gap-3 md:gap-6 mb-4 md:mb-6">
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
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            selectedOrder.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                                            selectedOrder.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                                            selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
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

                        {selectedOrder.message && (
                            <div className="mb-4 md:mb-6">
                                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">Сообщение</h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-700">{selectedOrder.message}</p>
                                </div>
                            </div>
                        )}

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
                        </div>

                        <div className="flex justify-end">
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
    );
}

export default MyProfile;
