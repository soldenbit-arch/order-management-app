"use client";
import React, {useState, useEffect, Suspense} from "react";
import dynamic from "next/dynamic";
import FunctionUnit from "./FunctionUnit";
import TabTotalPrice from "./TabTotalPrice";
import SwipeableTabs from "@/components/common/SwipeableTabs";
import {useSearchParams} from "next/navigation";
import {FunctionsProvider, useFunctions} from "./FunctionsContext";

const Stepper = dynamic(() => import("react-form-stepper").then((mod) => mod.Stepper), {
    ssr: false,
});
const Step = dynamic(() => import("react-form-stepper").then((mod) => mod.Step), {
    ssr: false,
});

function FunctionsStepsContent() {
    const [currentStep, setCurrentStep] = useState(0);
    const total = 4;
    const searchParams = useSearchParams();
    const serviceId = searchParams.get('service') || '1';

    const [selectedCard, setSelectedCard] = useState<number[]>([1]);

    const basicFunctions = [
        {
            price: "от 15 000 ₽",
            description:
                "Легкий вход для ваших клиентов — повышение конверсии и лояльности.",
            title: "Регистрация и авторизация",
            details:
                "Функция позволяет пользователям регистрироваться и входить через почту, соцсети или номер телефона.",
            thumb: "/images/register-and-authorization.png",
            category: "Базовые функции",
        },
        {
            price: "от 10 000 ₽",
            description:
                "Каждый профиль помогает лучше узнать потребности  клиента и удержать его.",
            title: "Профиль пользователя",
            details:
                "Позволяет пользователям настроить свои данные, загрузить фото и  контактную информацию.",
            thumb: "/images/user-profile.png",
            category: "Базовые функции",
        },
        {
            price: "от 10 000 ₽",
            description:
                "Легкий доступ к важной информации — пользователи  оценят удобство",
            title: "Навигация и главная страница",
            details:
                "Интуитивная система навигации и понятный главный экран с  быстрым доступом к основным функциям.",
            thumb: "/images/home-icon.png",
            category: "Базовые функции",
        },
        {
            price: "от 15 000 ₽",
            description: "Ваши клиенты будут оформлять заказы быстрее и с  удовольствием",
            title: "Корзина и оформление заказа",
            details: "Функция корзины, подходящая для e-commerce и фудтех приложений.",
            thumb: "/images/cart-checkout.png",
            category: "Базовые функции",
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
            category: "Дополнительные функции",
        },
        {
            price: "10 000 ₽",
            description: "Повышает user expirience",
            title: "Поиск по каталогу",
            details: "",
            thumb: "/images/search-the-catelog.png",
            category: "Дополнительные функции",
        },
        {
            price: "12 000 ₽",
            description: "Помогите клиентам получить ответы — это повышает лояльность",
            title: "Отзывы и рейтинги",
            details: "Встроенный чат для общения с клиентской поддержкой",
            thumb: "/images/reviews-and-rating.png",
            category: "Дополнительные функции",
        },
        {
            price: "20 000 ₽",
            description:
                "Отслеживание курьера — повышенная уверенность клиентов и удобство",
            title: "Геолокация и отслеживание",
            details: "Отслеживание местоположения курьера в режиме реального времени.",
            thumb: "/images/geo-location-tracking.png",
            category: "Дополнительные функции",
        },
        {
            price: "30 000 ₽",
            description: "Сделайте оплату легкой и удобной — клиенты оценят удобство",
            title: "Интеграция с платежными системами",
            details: "Поддержка оплаты через банковские карты, электронные кошельки",
            thumb: "/images/payment-system.png",
            category: "Дополнительные функции",
        },
    ];

    const tabContentTitle = [
        "Базовые функции",
        "Дополнительные функции",
        "Дизайн",
        "Финальная стоимость",
    ];

    return (
        <div>
            <div className="mb-4">
                <Stepper
                    connectorStyleConfig={{
                        size: 6,
                        stepSize: 8,
                        activeColor: "#6F35FF",
                        style: "solid",
                        completedColor: "#6F35FF",
                        disabledColor: "#EFEFEF",
                    }}
                    connectorStateColors
                    activeStep={currentStep}
                    className="[&_#RFS-Connector]:translate-y-1 [&_#RFS-StepMain]:relative [&_#RFS-StepMain]:z-10"
                >
                    {[...Array(total)].map((_, index) => (
                        <Step
                            className="[&:not(.active)]:bg-[#EFEFEF] [&.active]:!bg-[#6F35FF] [&.completed]:!bg-[#6F35FF] [&_>*]:hidden !size-4"
                            key={index}
                        />
                    ))}
                </Stepper>
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
                                category={basicFunction.category}
                            />
                        ))}
                    </div>
                </div>
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
                                category={additionalFunction.category}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div
                        role="button"
                        onClick={() => setCurrentStep((v) => v + 1)}
                        className="rounded-2xl bg-white shadow-4xl"
                    >
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
                        onClick={() => setCurrentStep((v) => v + 1)}
                        className="rounded-2xl bg-[rgb(229,_230,_250)] shadow-4xl border border-[rgb(214,_213,_244)]"
                    >
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
                        onClick={() => setCurrentStep((v) => v + 1)}
                        className="rounded-2xl bg-primary-dark shadow-lg"
                    >
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
                <TabTotalPrice serviceId={parseInt(serviceId)} />
            </SwipeableTabs>
            
            {/* Кнопки "Готово" для каждого шага */}
            {currentStep === 0 && (
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
            )}
            {currentStep === 1 && (
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
            )}
        </div>
    );
}

function FunctionsStepsWithParams() {
    const searchParams = useSearchParams();
    const serviceId = parseInt(searchParams.get('service') || '1');

    return (
        <FunctionsProvider serviceId={serviceId}>
            <FunctionsStepsContent />
        </FunctionsProvider>
    );
}

function FunctionsSteps() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FunctionsStepsWithParams />
        </Suspense>
    );
}

export default FunctionsSteps;
