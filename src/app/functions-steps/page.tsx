"use client";
import React, {useState, useEffect, Suspense} from "react";
import FunctionUnit from "./FunctionUnit";
import TabTotalPrice from "./TabTotalPrice";
import SwipeableTabs from "@/components/common/SwipeableTabs";
import { useSearchParams } from "next/navigation";

function FunctionsStepsContent() {
    const [currentStep, setCurrentStep] = useState(0);
    const searchParams = useSearchParams();

    const [selectedBasicFunctions, setSelectedBasicFunctions] = useState<number[]>([1]);
    const [selectedAdditionalFunctions, setSelectedAdditionalFunctions] = useState<number[]>([]);
    const [selectedDesignOption, setSelectedDesignOption] = useState<number | null>(null);
    const [selectedPartnerFunctions, setSelectedPartnerFunctions] = useState<string[]>([]);

    // Состояния для партнерских услуг
    const [partnerService, setPartnerService] = useState<{
        partner: string | null;
        service: string | null;
        price: string | null;
        serviceId: string | null;
    }>({
        partner: null,
        service: null,
        price: null,
        serviceId: null
    });

    useEffect(() => {
        // Читаем параметры партнерской услуги из URL
        const partner = searchParams.get('partner');
        const service = searchParams.get('service');
        const price = searchParams.get('price');
        const serviceId = searchParams.get('serviceId');
        
        if (partner && service && price && serviceId) {
            // Получаем полную информацию о партнерской услуге
            fetchPartnerServiceDetails(serviceId);
        }
    }, [searchParams]);

    const fetchPartnerServiceDetails = async (serviceId: string) => {
        try {
            const response = await fetch('/api/partner-services');
            const services = await response.json();
            const fullService = services.find((s: any) => s.id === serviceId);
            
            if (fullService) {
                setPartnerService({
                    partner: fullService.partnerName,
                    service: fullService.name,
                    price: fullService.price,
                    serviceId: fullService.id
                });
            }
        } catch (error) {
            console.error('Ошибка при загрузке партнерской услуги:', error);
            // Fallback к параметрам URL
            const partner = searchParams.get('partner');
            const service = searchParams.get('service');
            const price = searchParams.get('price');
            const serviceId = searchParams.get('serviceId');
            
            if (partner && service && price && serviceId) {
                setPartnerService({
                    partner,
                    service,
                    price,
                    serviceId
                });
            }
        }
    };

    const basicFunctions = [
        {
            price: "от 15 000 ₽",
            description:
                "Легкий вход для ваших клиентов — повышение конверсии и лояльности.",
            title: "Регистрация и авторизация",
            details:
                "Функция позволяет пользователям регистрироваться и входить через почту, соцсети или номер телефона.",
            thumb: "/images/register-and-authorization.png",
        },
        {
            price: "от 10 000 ₽",
            description:
                "Каждый профиль помогает лучше узнать потребности  клиента и удержать его.",
            title: "Профиль пользователя",
            details:
                "Позволяет пользователям настроить свои данные, загрузить фото и  контактную информацию.",
            thumb: "/images/user-profile.png",
        },
        {
            price: "от 10 000 ₽",
            description:
                "Легкий доступ к важной информации — пользователи  оценят удобство",
            title: "Навигация и главная страница",
            details:
                "Интуитивная система навигации и понятный главный экран с  быстрым доступом к основным функциям.",
            thumb: "/images/home-icon.png",
        },
        {
            price: "от 15 000 ₽",
            description: "Ваши клиенты будут оформлять заказы быстрее и с  удовольствием",
            title: "Корзина и оформление заказа",
            details: "Функция корзины, подходящая для e-commerce и фудтех приложений.",
            thumb: "/images/cart-checkout.png",
        },
    ];

    const additionalFunctions = [
        {
            price: "15 000 ₽",
            description:
                "Удерживайте клиентов с помощью напоминаний —  они будут возвращаться к вам!",
            title: "Push-уведомления",
            details: "Позволяют уведомлять клиентов о новых заказах, акциях, скидках",
            thumb: "/images/push-notification.png",
        },
        {
            price: "10 000 ₽",
            description: "Повышает user expirience",
            title: "Поиск по каталогу",
            details: "",
            thumb: "/images/search-the-catelog.png",
        },
        {
            price: "12 000 ₽",
            description: "Помогите клиентам получить ответы — это повышает лояльность",
            title: "Отзывы и рейтинги",
            details: "Встроенный чат для общения с клиентской поддержкой",
            thumb: "/images/reviews-and-rating.png",
        },
        {
            price: "20 000 ₽",
            description:
                "Отслеживание курьера — повышенная уверенность клиентов и удобство",
            title: "Геолокация и отслеживание",
            details: "Отслеживание местоположения курьера в режиме реального времени.",
            thumb: "/images/geo-location-tracking.png",
        },
        {
            price: "30 000 ₽",
            description: "Сделайте оплату легкой и удобной — клиенты оценят удобство",
            title: "Интеграция с платежными системами",
            details: "Поддержка оплаты через банковские карты, электронные кошельки",
            thumb: "/images/payment-system.png",
        },
    ];

    const tabContentTitle = [
        "Базовые функции",
        "Дополнительные функции",
        "Дизайн",
        "Финальная стоимость",
    ];
    
    const total = tabContentTitle.length;

    return (
        <div>
            <div className="mb-4">
                {/* Simple custom stepper */}
                <div className="flex justify-center items-center mb-4">
                    {[...Array(total)].map((_, index) => (
                        <React.Fragment key={index}>
                            <div 
                                className={`w-4 h-4 rounded-full relative z-10 ${
                                    index <= currentStep 
                                        ? 'bg-[#6F35FF]' 
                                        : 'bg-[#EFEFEF]'
                                }`}
                            />
                            {index < total - 1 && (
                                <div 
                                    className={`w-8 h-1.5 ${
                                        index < currentStep 
                                            ? 'bg-[#6F35FF]' 
                                            : 'bg-[#EFEFEF]'
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <p className="font-semibold text-center text-4xl text-neutral-950">
                    {tabContentTitle[currentStep]}
                </p>
            </div>
            <SwipeableTabs onChangeIndex={() => void 0} index={currentStep}>
                <div>
                    <div className="flex flex-col gap-3 pb-9">
                        {basicFunctions.map((basicFunction, index) => (
                            <FunctionUnit
                                onClick={() =>
                                    setSelectedBasicFunctions((prev: number[]) =>
                                        prev.includes(index)
                                            ? prev.filter((item: number) => item !== index)
                                            : [...prev, index]
                                    )
                                }
                                key={index}
                                selected={selectedBasicFunctions.includes(index)}
                                price={basicFunction.price}
                                description={basicFunction.description}
                                title={basicFunction.title}
                                details={basicFunction.details}
                                thumb={basicFunction.thumb}
                            />
                        ))}
                    </div>
                    <div className="fixed bottom-4 left-0 right-0 justify-center flex">
                        <button
                            onClick={() => setCurrentStep((v) => v + 1)}
                            className="pt-2.5 px-2.5 pb-3 flex gap-2.5 items-center justify-center min-w-60 min-h-12 rounded-xl bg-[rgb(111,_53,_255)]"
                        >
                            <span className="font-extrabold text-center text-lg text-white">
                                Готово
                            </span>
                        </button>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col gap-3 pb-9">
                        {additionalFunctions.map((additionalFunction, index) => (
                            <FunctionUnit
                                onClick={() =>
                                    setSelectedAdditionalFunctions((prev: number[]) =>
                                        prev.includes(index)
                                            ? prev.filter((item: number) => item !== index)
                                            : [...prev, index]
                                    )
                                }
                                key={index}
                                selected={selectedAdditionalFunctions.includes(index)}
                                price={additionalFunction.price}
                                description={additionalFunction.description}
                                title={additionalFunction.title}
                                details={additionalFunction.details}
                                thumb={additionalFunction.thumb}
                            />
                        ))}
                    </div>
                    <div className="fixed bottom-4 left-0 right-0 justify-center flex">
                        <button
                            onClick={() => setCurrentStep((v) => v + 1)}
                            className="pt-2.5 px-2.5 pb-3 flex gap-2.5 items-center justify-center min-w-60 min-h-12 rounded-xl bg-[rgb(111,_53,_255)]"
                        >
                            <span className="font-extrabold text-center text-lg text-white">
                                Готово
                            </span>
                        </button>
                    </div>
                </div>

                <div>
                    <div className="flex flex-col gap-3 pb-9">
                        <div
                            role="button"
                            onClick={() => setSelectedDesignOption(selectedDesignOption === 0 ? null : 0)}
                            className={`rounded-2xl bg-white shadow-4xl border-2 relative ${
                                selectedDesignOption === 0 
                                    ? "border-[rgb(111,_53,_255)]" 
                                    : "border-transparent"
                            }`}
                        >
                            {selectedDesignOption === 0 && (
                                <div className="rounded-[100px] bg-[rgb(111,_53,_255)] p-1 flex items-center justify-center size-8 absolute top-2 right-2 z-20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M7 12.9L10.1429 16.5L18 7.5"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                            <div className="flex">
                                <div className="pl-4 pt-3.5">
                                    <h4 className="font-extrabold text-4xl text-neutral-950 mb-1.5">
                                        Шаблонный дизайн
                                    </h4>
                                    <p className="text-md text-neutral-950">
                                        Стандартный, но профессиональный дизайн, быстро
                                        адаптируемый.
                                    </p>
                                </div>
                                <img src="/images/template-design.png" alt="" />
                            </div>
                            <div className="flex items-center gap-3 justify-between px-3.5 pb-3.5">
                                <div className="rounded-lg bg-[rgba(111,_53,_255,_0.10)] p-2">
                                    <p className="font-extrabold text-xs tracking-[0.01em] text-[rgb(111,_53,_255)]">
                                        Быстро и стильно — ваш бренд в минималистичном
                                        дизайне!
                                    </p>
                                </div>
                                <b className="font-medium font-druk-text-wide-cyr text-center text-md text-uppercase text-[rgb(43,_30,_151)] flex-shrink-0">
                                    30 000 ₽
                                </b>
                            </div>
                        </div>
                        <div
                            role="button"
                            onClick={() => setSelectedDesignOption(selectedDesignOption === 1 ? null : 1)}
                            className={`rounded-2xl bg-[rgb(229,_230,_250)] shadow-4xl border-2 relative ${
                                selectedDesignOption === 1 
                                    ? "border-[rgb(111,_53,_255)]" 
                                    : "border-[rgb(214,_213,_244)]"
                            }`}
                        >
                            {selectedDesignOption === 1 && (
                                <div className="rounded-[100px] bg-[rgb(111,_53,_255)] p-1 flex items-center justify-center size-8 absolute top-2 right-2 z-20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M7 12.9L10.1429 16.5L18 7.5"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                            <div className="flex">
                                <div className="pl-4 pt-3.5">
                                    <h4 className="font-extrabold text-4xl text-[rgb(50,_42,_119)] mb-1.5">
                                        Кастомизированный дизайн
                                    </h4>
                                    <p className="text-md text-neutral-950">
                                        Настроенный под фирменный стиль заказчика.
                                    </p>
                                </div>
                                <img src="/images/customized-design.png" alt="" />
                            </div>
                            <div className="flex items-center gap-3 justify-between px-3.5 pb-3.5">
                                <div className="rounded-lg bg-[rgba(111,_53,_255,_0.10)] p-2">
                                    <p className="font-extrabold text-xs tracking-[0.01em] text-[rgb(111,_53,_255)]">
                                        Отразите ваш бренд — дизайн, который запоминается
                                        клиентам
                                    </p>
                                </div>
                                <b className="font-medium font-druk-text-wide-cyr text-center text-md text-uppercase text-[rgb(43,_30,_151)] flex-shrink-0">
                                    50 000 ₽
                                </b>
                            </div>
                        </div>
                        <div
                            role="button"
                            onClick={() => setSelectedDesignOption(selectedDesignOption === 2 ? null : 2)}
                            className={`rounded-2xl bg-primary-dark shadow-lg border-2 relative ${
                                selectedDesignOption === 2 
                                    ? "border-[rgb(111,_53,_255)]" 
                                    : "border-transparent"
                            }`}
                        >
                            {selectedDesignOption === 2 && (
                                <div className="rounded-[100px] bg-white p-1 flex items-center justify-center size-8 absolute top-2 right-2 z-20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M7 12.9L10.1429 16.5L18 7.5"
                                            stroke="rgb(111, 53, 255)"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                            <div className="flex">
                                <div className="pl-4 pt-3.5">
                                    <h4 className="font-extrabold text-4xl text-white mb-1.5">
                                        Уникальный дизайн с нуля
                                    </h4>
                                    <p className="text-md text-white">
                                        Полный дизайн-пакет с разработкой индивидуального
                                        стиля
                                    </p>
                                </div>
                                <img
                                    className="-mb-2"
                                    src="/images/unique-design.png"
                                    alt=""
                                />
                            </div>
                            <div className="flex items-center gap-3 justify-between px-3.5 pb-3.5">
                                <p className="font-extrabold text-4xl text-white pr-3">
                                    Уникальный дизайн с нуля
                                </p>
                                <b className="font-medium font-druk-text-wide-cyr text-center text-md text-uppercase text-white flex-shrink-0">
                                    80 000 ₽
                                </b>
                            </div>
                        </div>
                    </div>
                    <div className="fixed bottom-4 left-0 right-0 justify-center flex">
                        <button
                            onClick={() => setCurrentStep((v) => v + 1)}
                            disabled={selectedDesignOption === null}
                            className="pt-2.5 px-2.5 pb-3 flex gap-2.5 items-center justify-center min-w-60 min-h-12 rounded-xl bg-[rgb(111,_53,_255)] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <span className="font-extrabold text-center text-lg text-white">
                                Готово
                            </span>
                        </button>
                    </div>
                </div>
                <TabTotalPrice 
                    selectedBasicFunctions={selectedBasicFunctions.map((index: number) => basicFunctions[index]).filter(Boolean)}
                    selectedAdditionalFunctions={selectedAdditionalFunctions.map((index: number) => additionalFunctions[index]).filter(Boolean)}
                    selectedDesignOption={selectedDesignOption}
                    designOptions={[
                        { name: "Шаблонный дизайн", price: 30000 },
                        { name: "Кастомизированный дизайн", price: 50000 },
                        { name: "Уникальный дизайн с нуля", price: 80000 }
                    ]}
                    onStepChange={setCurrentStep}
                    partnerService={partnerService}
                />
            </SwipeableTabs>
            {/* {currentStep === 0 && (
                <div>
                    <div className="flex flex-col gap-3 pb-9">
                        {basicFunctions.map((basicFunction, index) => (
                            <FunctionUnit
                                onClick={() =>
                                    setSelectedCard((prev) =>
                                        prev.includes(index)
                                            ? prev.filter((item) => item !== index)
                                            : [...prev, index]
                                    )
                                }
                                key={index}
                                selected={selectedCard.includes(index)}
                                price={basicFunction.price}
                                description={basicFunction.description}
                                title={basicFunction.title}
                                details={basicFunction.details}
                                thumb={basicFunction.thumb}
                            />
                        ))}
                    </div>
                    <div className="fixed bottom-4 left-0 right-0 justify-center flex">
                        <button
                            onClick={() => setCurrentStep((v) => v + 1)}
                            className="pt-2.5 px-2.5 pb-3 flex gap-2.5 items-center justify-center min-w-60 min-h-12 rounded-xl bg-[rgb(111,_53,_255)]"
                        >
                            <span className="font-extrabold text-center text-lg text-white">
                                Готово
                            </span>
                        </button>
                    </div>
                </div>
            )}
            {currentStep === 1 && (
                <div>
                    <div className="flex flex-col gap-3 pb-9">
                        {additionalFunctions.map((additionalFunction, index) => (
                            <FunctionUnit
                                onClick={() =>
                                    setSelectedCard((prev) =>
                                        prev.includes(index)
                                            ? prev.filter((item) => item !== index)
                                            : [...prev, index]
                                    )
                                }
                                key={index}
                                selected={selectedCard.includes(index)}
                                price={additionalFunction.price}
                                description={additionalFunction.description}
                                title={additionalFunction.title}
                                details={additionalFunction.details}
                                thumb={additionalFunction.thumb}
                            />
                        ))}
                    </div>
                    <div className="fixed bottom-4 left-0 right-0 justify-center flex">
                        <button
                            onClick={() => setCurrentStep((v) => v + 1)}
                            className="pt-2.5 px-2.5 pb-3 flex gap-2.5 items-center justify-center min-w-60 min-h-12 rounded-xl bg-[rgb(111,_53,_255)]"
                        >
                            <span className="font-extrabold text-center text-lg text-white">
                                Готово
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div>
                    <div className="flex flex-col gap-3 pb-9">
                        <div
                            role="button"
                            onClick={() => setSelectedDesignOption(selectedDesignOption === 0 ? null : 0)}
                            className={`rounded-2xl bg-white shadow-4xl border-2 ${
                                selectedDesignOption === 0 
                                    ? "border-[rgb(111,_53,_255)]" 
                                    : "border-transparent"
                            }`}
                        >
                            {selectedDesignOption === 0 && (
                                <div className="rounded-[100px] bg-[rgb(111,_53,_255)] p-1 flex items-center justify-center size-8 absolute top-2 right-2 z-20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M7 12.9L10.1429 16.5L18 7.5"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                            <div className="flex">
                                <div className="pl-4 pt-3.5">
                                    <h4 className="font-extrabold text-4xl text-neutral-950 mb-1.5">
                                        Шаблонный дизайн
                                    </h4>
                                    <p className="text-md text-neutral-950">
                                        Стандартный, но профессиональный дизайн, быстро
                                        адаптируемый.
                                    </p>
                                </div>
                                <img src="/images/template-design.png" alt="" />
                            </div>
                            <div className="flex items-center gap-3 justify-between px-3.5 pb-3.5">
                                <div className="rounded-lg bg-[rgba(111,_53,_255,_0.10)] p-2">
                                    <p className="font-extrabold text-xs tracking-[0.01em] text-[rgb(111,_53,_255)]">
                                        Быстро и стильно — ваш бренд в минималистичном
                                        дизайне!
                                    </p>
                                </div>
                                <b className="font-medium font-druk-text-wide-cyr text-center text-md text-uppercase text-[rgb(43,_30,_151)] flex-shrink-0">
                                    30 000 ₽
                                </b>
                            </div>
                        </div>
                        <div
                            role="button"
                            onClick={() => setSelectedDesignOption(selectedDesignOption === 1 ? null : 1)}
                            className={`rounded-2xl bg-[rgb(229,_230,_250)] shadow-4xl border-2 ${
                                selectedDesignOption === 1 
                                    ? "border-[rgb(111,_53,_255)]" 
                                    : "border-[rgb(214,_213,_244)]"
                            }`}
                        >
                            {selectedDesignOption === 1 && (
                                <div className="rounded-[100px] bg-[rgb(111,_53,_255)] p-1 flex items-center justify-center size-8 absolute top-2 right-2 z-20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M7 12.9L10.1429 16.5L18 7.5"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                            <div className="flex">
                                <div className="pl-4 pt-3.5">
                                    <h4 className="font-extrabold text-4xl text-[rgb(50,_42,_119)] mb-1.5">
                                        Кастомизированный дизайн
                                    </h4>
                                    <p className="text-md text-neutral-950">
                                        Настроенный под фирменный стиль заказчика.
                                    </p>
                                </div>
                                <img src="/images/customized-design.png" alt="" />
                            </div>
                            <div className="flex items-center gap-3 justify-between px-3.5 pb-3.5">
                                <div className="rounded-lg bg-[rgba(111,_53,_255,_0.10)] p-2">
                                    <p className="font-extrabold text-xs tracking-[0.01em] text-[rgb(111,_53,_255)]">
                                        Отразите ваш бренд — дизайн, который запоминается
                                        клиентам
                                    </p>
                                </div>
                                <b className="font-medium font-druk-text-wide-cyr text-center text-md text-uppercase text-[rgb(43,_30,_151)] flex-shrink-0">
                                    50 000 ₽
                                </b>
                            </div>
                        </div>
                        <div
                            role="button"
                            onClick={() => setSelectedDesignOption(selectedDesignOption === 2 ? null : 2)}
                            className={`rounded-2xl bg-primary-dark shadow-lg border-2 relative ${
                                selectedDesignOption === 2 
                                    ? "border-[rgb(111,_53,_255)]" 
                                    : "border-transparent"
                            }`}
                        >
                            {selectedDesignOption === 2 && (
                                <div className="rounded-[100px] bg-white p-1 flex items-center justify-center size-8 absolute top-2 right-2 z-20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M7 12.9L10.1429 16.5L18 7.5"
                                            stroke="rgb(111, 53, 255)"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                            <div className="flex">
                                <div className="pl-4 pt-3.5">
                                    <h4 className="font-extrabold text-4xl text-white mb-1.5">
                                        Уникальный дизайн с нуля
                                    </h4>
                                    <p className="text-md text-white">
                                        Полный дизайн-пакет с разработкой индивидуального
                                        стиля
                                    </p>
                                </div>
                                <img
                                    className="-mb-2"
                                    src="/images/unique-design.png"
                                    alt=""
                                />
                            </div>
                            <div className="flex items-center gap-3 justify-between px-3.5 pb-3.5">
                                <p className="font-extrabold text-4xl text-white pr-3">
                                    Уникальный дизайн с нуля
                                </p>
                                <b className="font-medium font-druk-text-wide-cyr text-center text-md text-uppercase text-white flex-shrink-0">
                                    80 000 ₽
                                </b>
                            </div>
                        </div>
                    </div>
                    <div className="fixed bottom-4 left-0 right-0 justify-center flex">
                        <button
                            onClick={() => setCurrentStep((v) => v + 1)}
                            disabled={selectedDesignOption === null}
                            className="pt-2.5 px-2.5 pb-3 flex gap-2.5 items-center justify-center min-w-60 min-h-12 rounded-xl bg-[rgb(111,_53,_255)] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <span className="font-extrabold text-center text-lg text-white">
                                Готово
                            </span>
                        </button>
                    </div>
                </div>
            )}
            {currentStep === 3 && <TabTotalPrice />} */}
        </div>
    );
}

export default function FunctionsSteps() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center py-8">
                <div className="text-lg">Загрузка...</div>
            </div>
        }>
            <FunctionsStepsContent />
        </Suspense>
    );
}
