"use client";
import React, { useState, useEffect } from "react";
import Step from "./home/Step";
import Categories from "./home/Categories";
import Dialog from "@/components/common/Dialog";
import Link from "next/link";

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

function CreateApplication() {
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
            <div className="relative z-0">
                <div className="flex w-full justify-center pt-14">
                    <img className="" src="/images/002 Black.png" alt="" />
                </div>
                <span className="w-[445px] h-[228px] left-1/2 -translate-x-1/2 bg-[#837FDF] block absolute top-[-100px] -z-20 rounded-full blur-[150px]" />
                <img
                    src="/images/Frame 166.svg"
                    className="absolute -z-10 top-0 w-full"
                    alt=""
                />
                <Link href="/myprofile" className="absolute top-14 right-0">
                    <img
                        src="/images/user-demo profile.svg"
                        className="size-11 rounded-full"
                        alt=""
                    />
                </Link>
                
                {/* Заказы пользователя (оплаченные и в работе) - перекрывают изображение */}
                {!loading && (userOrders.filter(order => order.status === 'paid').length > 0 || userOrders.filter(order => order.status === 'in_progress').length > 0) && (
                    <div className="absolute bottom-[-50px] left-0 right-0 px-4 z-10">
                        <div>
                            {/* Сначала показываем оплаченные заказы */}
                            {userOrders.filter(order => order.status === 'paid').map((order, index) => (
                                <div key={order.id} className={`relative w-full max-w-[500px] h-[75px] mx-auto bg-white rounded-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.1)] ${index > 0 ? 'mt-3' : ''}`}>
                                    <div className="flex items-center justify-between h-full px-6 py-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-[#0D0D0D] leading-[25px] mb-1">
                                                Ваш заказ №{order.id}
                                            </h3>
                                            <p className="text-sm text-[rgba(13,13,13,0.5)] font-medium">
                                                Статус: оплачен • {order.totalPrice.toLocaleString()} ₽
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => handleShowOrderDetails(order)}
                                            className="w-[39px] h-[39px] bg-[#2C1E4F] rounded-full flex items-center justify-center shadow-[inset_0px_2px_12px_2px_rgba(255,255,255,0.2)]"
                                        >
                                            <svg className="w-[20px] h-[20px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Затем показываем заказы в работе */}
                            {userOrders.filter(order => order.status === 'in_progress').map((order, index) => (
                                <div key={order.id} className={`relative w-full max-w-[500px] h-[75px] mx-auto bg-white rounded-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.1)] ${userOrders.filter(order => order.status === 'paid').length > 0 || index > 0 ? 'mt-3' : ''}`}>
                                    <div className="flex items-center justify-between h-full px-6 py-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-[#0D0D0D] leading-[25px] mb-1">
                                                Ваш заказ №{order.id}
                                            </h3>
                                            <p className="text-sm text-[rgba(13,13,13,0.5)] font-medium">
                                                Статус: в работе • {order.totalPrice.toLocaleString()} ₽
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => handleShowOrderDetails(order)}
                                            className="w-[39px] h-[39px] bg-[#6F35FF] rounded-full flex items-center justify-center shadow-[inset_0px_2px_12px_2px_rgba(255,255,255,0.2)]"
                                        >
                                            <svg className="w-[20px] h-[20px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className={!loading && (userOrders.filter(order => order.status === 'paid').length > 0 || userOrders.filter(order => order.status === 'in_progress').length > 0) ? "mt-20" : "-mt-10"}>
                <Step />
            </div>
            <Categories />

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
                                            {selectedOrder.status === 'pending' ? 'Ожидает оплаты' :
                                             selectedOrder.status === 'paid' ? 'Оплачен' :
                                             selectedOrder.status === 'in_progress' ? 'В работе' :
                                             selectedOrder.status === 'completed' ? 'Завершен' :
                                             selectedOrder.status === 'cancelled' ? 'Отменен' :
                                             selectedOrder.status}
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

export default CreateApplication;
