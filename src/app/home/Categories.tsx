"use client";
import React, {useState, useEffect} from "react";
import Link from "next/link";
import SwipeableTabs from "@/components/common/SwipeableTabs";
import Dialog from "@/components/common/Dialog";
import Button from "@/components/common/Button";

interface Service {
    id: number;
    name: string;
    category: string;
    price: string;
    description: string;
    image: string;
    features: string[];
}

function Categories() {
    const [activeTab, setActiveTab] = useState(0);
    const [open, setOpen] = useState<number>(0);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<Service | null>(null);


    useEffect(() => {
        fetchServices();
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

    const handleServiceClick = (service: Service) => {
        setSelectedService(service);
        setOpen(service.id);
    };

    const handleConfigureService = (service: Service) => {
        // Просто перенаправляем на страницу конфигурации без создания заказа
        // Заказ будет создан только в финале при нажатии "Перейти к оплате"
        setOpen(0);
        window.location.href = `/functions-steps?service=${service.id}`;
    };



    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-lg">Загрузка услуг...</div>
            </div>
        );
    }

    // Группируем услуги по категориям
    const categories = [...new Set(services.map(service => service.category))];
    const servicesByCategory = categories.map(category => 
        services.filter(service => service.category === category)
    );

    return (
        <div>
            <h4 className="font-semibold text-4xl text-neutral-950 mb-4">Категории</h4>
            <div className="tabs-system overflow-hidden mb-8">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="react-tabs__tab-list mb-2.5 flex whitespace-nowrap">
                        {categories.map((category, index) => (
                            <div
                                className={`react-tabs__tab ${
                                    activeTab === index ? "react-tabs__tab--selected" : ""
                                }`}
                                onClick={() => setActiveTab(index)}
                                key={index}
                            >
                                {category}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="">
                    {/* Всегда отображаем активную категорию */}
                    {servicesByCategory[activeTab] && (
                        <div>
                            <div className="grid grid-cols-2 gap-4">
                                {servicesByCategory[activeTab].slice(0, 4).map((service) => (
                                    <div
                                        key={service.id}
                                        role="button"
                                        onClick={() => handleServiceClick(service)}
                                        className="flex flex-col justify-end items-center text-center"
                                    >
                                        <img
                                            className="mb-2.5"
                                            src={service.image}
                                            alt={service.name}
                                        />
                                        <p className="font-extrabold text-md text-neutral-950">
                                            {service.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {servicesByCategory[activeTab].length > 4 && (
                                <div className="mt-4">
                                    {/* ScrollContainer removed, replaced with simple div */}
                                    <div className="flex gap-4 pb-4">
                                        {servicesByCategory[activeTab].slice(4).map((service) => (
                                            <div
                                                key={service.id}
                                                role="button"
                                                onClick={() => handleServiceClick(service)}
                                                className="flex flex-col justify-end items-center text-center w-36 flex-shrink-0"
                                            >
                                                <img
                                                    className="mb-2.5 w-28 h-28 object-contain"
                                                    src={service.image}
                                                    alt={service.name}
                                                />
                                                <p className="font-extrabold text-md text-neutral-950 text-center break-words">
                                                    {service.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-2xl bg-[linear-gradient(90deg,_#E5E6FA_0%,_#BABDFF_100%)] flex gap-5 p-4 pr-0 relative">
                <div className="">
                    <h3 className="font-bold text-4xl text-neutral-950 mb-2">
                        Услуги партнёров
                    </h3>
                    <p className="font-medium text-md text-neutral-950">
                        Вы можете обратиться не только к нам, но ещё и к нашим партнёрам
                    </p>
                </div>
                <div className="">
                    <img src="/images/aliva-bg.png" alt="" />
                </div>
                <Link
                    href="/our-partners"
                    className="w-9 h-9 drop-shadow-sm bg-white absolute top-2.5 right-2.5 rounded-full grid place-content-center"
                >
                    <img src="/images/Vector 1.svg" alt="" />
                </Link>
            </div>

            <Dialog open={open !== 0} onClose={() => setOpen(0)}>
                {selectedService && (
                    <>
                        <div className="mb-3 flex gap-4">
                            <div className="flex-grow">
                                <h5 className="font-extrabold text-lg text-neutral-950 mb-1">
                                    {selectedService.name}
                                </h5>
                                <p className="text-xs tracking-[0.01em] text-neutral-950">
                                    {selectedService.description}
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <img src={selectedService.image} alt={selectedService.name} />
                            </div>
                        </div>
                        

                        
                        <div className="flex items-center gap-4">
                            <b className="font-bold text-4xl text-[rgb(111,_53,_255)]">{selectedService.price}</b>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleConfigureService(selectedService)}
                                    variant="outlined"
                                    color="secondary"
                                    size="small"
                                >
                                    Заказать
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Dialog>
        </div>
    );
}

export default Categories;
