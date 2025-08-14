"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SelectedFunction {
    title: string;
    price: number;
    category: string;
}

interface FunctionsContextType {
    selectedFunctions: SelectedFunction[];
    totalPrice: number;
    addFunction: (func: SelectedFunction) => void;
    removeFunction: (title: string) => void;
    clearFunctions: () => void;
    getBasePrice: (serviceId: number) => number;
}

const FunctionsContext = createContext<FunctionsContextType | undefined>(undefined);

export function FunctionsProvider({ children, serviceId }: { children: React.ReactNode; serviceId: number }) {
    const [selectedFunctions, setSelectedFunctions] = useState<SelectedFunction[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // Базовые цены для разных типов приложений
    const basePrices = {
        1: 100000, // Фудтех-приложение
        2: 80000,  // Интернет-магазин
        3: 120000, // Социальная сеть
        4: 90000,  // Образовательная платформа
        5: 70000,  // Система бронирования
        6: 85000   // Сервис доставки
    };

    const getBasePrice = (serviceId: number) => {
        return basePrices[serviceId as keyof typeof basePrices] || basePrices[1];
    };

    // Вычисляем общую стоимость
    useEffect(() => {
        const basePrice = getBasePrice(serviceId);
        const functionsPrice = selectedFunctions.reduce((sum, func) => sum + func.price, 0);
        setTotalPrice(basePrice + functionsPrice);
    }, [selectedFunctions, serviceId]);

    const addFunction = (func: SelectedFunction) => {
        setSelectedFunctions(prev => {
            // Проверяем, не выбран ли уже элемент с таким названием
            if (prev.some(f => f.title === func.title)) {
                return prev;
            }
            return [...prev, func];
        });
    };

    const removeFunction = (title: string) => {
        setSelectedFunctions(prev => prev.filter(f => f.title !== title));
    };

    const clearFunctions = () => {
        setSelectedFunctions([]);
    };

    return (
        <FunctionsContext.Provider value={{
            selectedFunctions,
            totalPrice,
            addFunction,
            removeFunction,
            clearFunctions,
            getBasePrice
        }}>
            {children}
        </FunctionsContext.Provider>
    );
}

export function useFunctions() {
    const context = useContext(FunctionsContext);
    if (context === undefined) {
        throw new Error('useFunctions must be used within a FunctionsProvider');
    }
    return context;
} 