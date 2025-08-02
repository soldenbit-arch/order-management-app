import React, { useState, useEffect } from "react";
import PricingTable from "./PricingTable";
import Button from "@/components/common/Button";
import { useFunctions } from "./FunctionsContext";

interface PricingItem {
    itemLabel: string;
    priceLabel: string;
    price: number;
    notRemoveable?: boolean;
    selected?: boolean;
}

interface TabTotalPriceProps {
    serviceId: number;
}

function TabTotalPrice({ serviceId }: TabTotalPriceProps) {
    const { selectedFunctions, totalPrice, getBasePrice } = useFunctions();
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

    // Функция для получения функций в зависимости от типа сервиса
    const getServiceFunctions = (serviceId: number) => {
        const baseFunctions = [
            {
                itemLabel: "Регистрация и авторизация",
                priceLabel: "от 15 000 ₽",
                price: 15000,
                selected: true
            },
            {
                itemLabel: "Навигация и главная страница",
                priceLabel: "от 15 000 ₽",
                price: 15000,
                selected: true
            }
        ];

        const additionalFunctions = [
            {
                itemLabel: "Push-уведомления",
                priceLabel: "от 10 000 ₽",
                price: 10000,
                selected: false
            },
            {
                itemLabel: "Отзывы и рейтинги",
                priceLabel: "от 12 000 ₽",
                price: 12000,
                selected: false
            },
            {
                itemLabel: "Поиск по каталогу",
                priceLabel: "от 10 000 ₽",
                price: 10000,
                selected: false
            },
            {
                itemLabel: "Геолокация и отслеживание",
                priceLabel: "от 20 000 ₽",
                price: 20000,
                selected: false
            },
            {
                itemLabel: "Интеграция с платежными системами",
                priceLabel: "от 30 000 ₽",
                price: 30000,
                selected: false
            }
        ];

        const designFunctions = [
            {
                itemLabel: "Кастомизированный дизайн",
                priceLabel: "50 000 ₽",
                price: 50000,
                notRemoveable: true,
                selected: true
            }
        ];

        // Базовые цены для разных типов приложений
        const basePrices = {
            1: { name: "Фудтех-приложение", price: 100000 },
            2: { name: "Интернет-магазин", price: 80000 },
            3: { name: "Социальная сеть", price: 120000 },
            4: { name: "Образовательная платформа", price: 90000 },
            5: { name: "Система бронирования", price: 70000 },
            6: { name: "Сервис доставки", price: 85000 }
        };

        const baseService = basePrices[serviceId as keyof typeof basePrices] || basePrices[1];

        return {
            [baseService.name]: [
                {
                    itemLabel: baseService.name,
                    priceLabel: `от ${baseService.price.toLocaleString()} ₽`,
                    price: baseService.price,
                    notRemoveable: true,
                    selected: true
                }
            ],
            "Базовые функции": baseFunctions,
            "Дополнительные функции": additionalFunctions,
            "Дизайн": designFunctions
        };
    };

    // Определяем все доступные функции с ценами
    const allItems: { [category: string]: PricingItem[] } = getServiceFunctions(serviceId);

    // Инициализируем выбранные элементы
    useEffect(() => {
        const initialSelected: { [key: string]: boolean } = {};
        Object.values(allItems).flat().forEach(item => {
            if (item.selected) {
                initialSelected[item.itemLabel] = true;
            }
        });
        setSelectedItems(initialSelected);
    }, []);

    // Инициализируем выбранные элементы на основе контекста
    useEffect(() => {
        const initialSelected: { [key: string]: boolean } = {};
        selectedFunctions.forEach(func => {
            initialSelected[func.title] = true;
        });
        setSelectedItems(initialSelected);
    }, [selectedFunctions]);

    const handleItemToggle = (itemLabel: string) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemLabel]: !prev[itemLabel]
        }));
    };

    const handlePayment = () => {
        // Отправляем заявку на сервер
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Клиент',
                email: 'client@example.com',
                phone: '+7 (999) 999-99-99',
                message: 'Заказ с настройкой функций',
                service: serviceId,
                totalPrice: `${totalPrice.toLocaleString()} ₽`
            })
        }).then((response) => {
            if (response.ok) {
                // Переходим на страницу успешного заказа
                window.location.href = `/order-created?service=${serviceId}&configured=true&total=${totalPrice}`;
            } else {
                console.error('Ошибка при создании заказа');
                alert('Ошибка при создании заказа');
            }
        }).catch((error) => {
            console.error('Ошибка при создании заказа:', error);
            alert('Ошибка при создании заказа');
        });
    };

    return (
        <div>
            <div className="flex flex-col gap-5 mb-[150px]">
                {Object.entries(allItems).map(([category, items]) => (
                    <PricingTable
                        key={category}
                        categoryLabel={category}
                        items={items.map(item => ({
                            ...item,
                            selected: selectedItems[item.itemLabel] || false
                        }))}
                        onItemToggle={handleItemToggle}
                    />
                ))}
            </div>
            <div className="fixed bottom-0 left-0 right-0">
                <div className="rounded-t-[28px] bg-white shadow-6xl pt-5 px-4 pb-7 device-container">
                    <h4 className="font-semibold text-center text-4xl text-neutral-950 mb-5">
                        Итого: {totalPrice.toLocaleString()} ₽
                    </h4>
                    <Button className="w-full" onClick={handlePayment}>Перейти к оплате</Button>
                </div>
            </div>
        </div>
    );
}

export default TabTotalPrice;
