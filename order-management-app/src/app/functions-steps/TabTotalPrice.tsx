import React from "react";
import PricingTable from "./PricingTable";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";

interface SelectedFunction {
    price: string;
    title: string;
    description: string;
    details: string;
    thumb: string;
}

interface DesignOption {
    name: string;
    price: number;
}

interface PartnerService {
    partner: string | null;
    service: string | null;
    price: string | null;
    serviceId: string | null;
}

interface TabTotalPriceProps {
    selectedBasicFunctions: SelectedFunction[];
    selectedAdditionalFunctions: SelectedFunction[];
    selectedDesignOption: number | null;
    designOptions: DesignOption[];
    onStepChange?: (step: number) => void;
    partnerService?: PartnerService;
}

function TabTotalPrice({ 
    selectedBasicFunctions, 
    selectedAdditionalFunctions, 
    selectedDesignOption, 
    designOptions, 
    onStepChange,
    partnerService
}: TabTotalPriceProps) {
    const router = useRouter();

    // Функция для извлечения числа из строки цены
    const extractPrice = (priceStr: string): number => {
        const match = priceStr.match(/\d+/);
        return match ? parseInt(match[0]) * 1000 : 0; // умножаем на 1000 так как цены в тысячах
    };

    // Подсчет общей стоимости
    const basicTotal = selectedBasicFunctions.reduce((sum, func) => sum + extractPrice(func.price), 0);
    const additionalTotal = selectedAdditionalFunctions.reduce((sum, func) => sum + extractPrice(func.price), 0);
    const designTotal = selectedDesignOption !== null ? designOptions[selectedDesignOption]?.price || 0 : 0;
    const baseAppPrice = 100000; // Базовая стоимость приложения
    const partnerServicePrice = partnerService?.price ? parseInt(partnerService.price.replace(/[^\d]/g, '')) : 0;
    
    const totalPrice = baseAppPrice + basicTotal + additionalTotal + designTotal + partnerServicePrice;

    const handlePaymentRedirect = async () => {
        try {
            // Формируем детальное описание заказа
            const selectedFunctions = [
                ...selectedBasicFunctions.map(func => func.title),
                ...selectedAdditionalFunctions.map(func => func.title)
            ];
            
            const designName = selectedDesignOption !== null 
                ? designOptions[selectedDesignOption]?.name 
                : 'Не выбран';
            
            const orderDescription = `
${partnerService?.service ? `Заказ услуги партнера: ${partnerService.service} от ${partnerService.partner}` : 'Заказ сконфигурированного приложения:'}

${partnerService?.service ? `Партнерская услуга: ${partnerService.service} (${partnerService.price})` : ''}
${selectedFunctions.length > 0 ? `Базовые функции: ${selectedFunctions.join(', ')}` : ''}
${selectedDesignOption !== null ? `Дизайн: ${designName}` : ''}
Общая стоимость: ${totalPrice.toLocaleString()} ₽

Состав заказа:
${partnerService?.service ? `- ${partnerService.service}: ${partnerService.price}` : '- Базовое приложение: 100 000 ₽'}
${selectedBasicFunctions.map(func => `- ${func.title}: ${func.price}`).join('\n')}
${selectedAdditionalFunctions.map(func => `- ${func.title}: ${func.price}`).join('\n')}
${selectedDesignOption !== null ? `- ${designName}: ${designOptions[selectedDesignOption]?.price.toLocaleString()} ₽` : ''}
            `.trim();

            // Создаем заказ через API
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
                    serviceName: partnerService?.service 
                        ? `${partnerService.service} (${partnerService.partner})` 
                        : 'Сконфигурированное приложение',
                    totalPrice: totalPrice,
                    partnerName: partnerService?.partner || null,
                    partnerId: partnerService?.partner || null
                })
            });

            if (response.ok) {
                const order = await response.json();
                // Перенаправляем на страницу оплаты с ID заказа
                router.push(`/payment?order=${order.id}`);
            } else {
                console.error('Error creating order');
                // Всё равно перенаправляем на оплату
                router.push('/payment');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            // В случае ошибки всё равно перенаправляем
            router.push('/payment');
        }
    };

    const handleEditBasicFunctions = () => {
        if (onStepChange) {
            onStepChange(0); // Переход к этапу "Базовые функции"
        }
    };

    const handleEditAdditionalFunctions = () => {
        if (onStepChange) {
            onStepChange(1); // Переход к этапу "Дополнительные функции"
        }
    };

    const handleEditDesign = () => {
        if (onStepChange) {
            onStepChange(2); // Переход к этапу "Дизайн"
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-5 mb-[150px]">
                <PricingTable
                    categoryLabel={partnerService?.service ? "Услуга партнера" : "Категория"}
                    items={[
                        {
                            itemLabel: partnerService?.service 
                                ? `${partnerService.service} (${partnerService.partner})`
                                : "Фудтех приложение",
                            priceLabel: partnerService?.price || "100 000 ₽",
                            notRemoveable: true,
                        },
                    ]}
                />
                
                {selectedBasicFunctions.length > 0 && (
                    <PricingTable
                        categoryLabel="Базовые функции"
                        items={selectedBasicFunctions.map(func => ({
                            itemLabel: func.title,
                            priceLabel: func.price,
                        }))}
                        onEdit={handleEditBasicFunctions}
                    />
                )}
                
                {selectedAdditionalFunctions.length > 0 && (
                    <PricingTable
                        categoryLabel="Дополнительные функции"
                        items={selectedAdditionalFunctions.map(func => ({
                            itemLabel: func.title,
                            priceLabel: func.price,
                        }))}
                        onEdit={handleEditAdditionalFunctions}
                    />
                )}
                
                {selectedDesignOption !== null && (
                    <PricingTable
                        categoryLabel="Дизайн"
                        items={[
                            {
                                itemLabel: designOptions[selectedDesignOption]?.name || "Дизайн",
                                priceLabel: `${designOptions[selectedDesignOption]?.price.toLocaleString()} ₽`,
                                notRemoveable: true,
                            },
                        ]}
                        onEdit={handleEditDesign}
                    />
                )}


            </div>
            <div className="fixed bottom-0 left-0 right-0">
                <div className="rounded-t-[28px] bg-white shadow-6xl pt-5 px-4 pb-7 device-container">
                    <h4 className="font-semibold text-center text-4xl text-neutral-950 mb-5">
                        Итого: {totalPrice.toLocaleString()} ₽
                    </h4>
                    <Button className="w-full" onClick={handlePaymentRedirect}>Перейти к оплате</Button>
                </div>
            </div>
        </div>
    );
}

export default TabTotalPrice;
