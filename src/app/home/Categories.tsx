"use client";
import React, {useState, useEffect} from "react";
import ScrollContainer from "react-indiana-drag-scroll";
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
    const [categories, setCategories] = useState<string[]>([]);
    const [servicesByCategory, setServicesByCategory] = useState<Service[][]>([]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/services');
            const data = await response.json();
            setServices(data);
            
            // Группируем услуги по категориям
            const uniqueCategories = [...new Set(data.map((service: Service) => service.category))] as string[];
            setCategories(uniqueCategories);
            
            const groupedServices = uniqueCategories.map(category => 
                data.filter((service: Service) => service.category === category)
            );
            setServicesByCategory(groupedServices);
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

    const handleConfigureService = async (service: Service) => {
        setOpen(0);
        window.location.href = `/functions-steps?service=${service.id}`;
    };



    // Skeleton для загрузки
    if (loading) {
        return (
            <div>
                <h4 className="font-semibold text-4xl text-neutral-950 mb-4">Категории</h4>
                <div className="tabs-system overflow-hidden mb-8">
                    {/* Skeleton для табов */}
                    <div className="flex gap-4 mb-2.5">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded-lg animate-pulse w-32"></div>
                        ))}
                </div>
                    {/* Skeleton для карточек */}
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col justify-end items-center text-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-lg mb-2.5 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                        ))}
            </div>
                </div>
            </div>
    );
    }

    return (
        <div>
            <h4 className="font-semibold text-4xl text-neutral-950 mb-4">Категории</h4>
            <div className="tabs-system overflow-hidden mb-8">
                <ScrollContainer>
                    <div className="react-tabs__tab-list mb-2.5">
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
                </ScrollContainer>
                <div className="">
                    <SwipeableTabs index={activeTab} onChangeIndex={setActiveTab}>
                        {servicesByCategory.map((categoryServices, index) => (
                            <div key={index}>
                                <div className="grid grid-cols-2 gap-4">
                                    {categoryServices.map((service) => (
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
                            </div>
                        ))}
                    </SwipeableTabs>
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
                                    Настроить
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
