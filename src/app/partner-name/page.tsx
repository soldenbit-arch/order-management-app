import Button from "@/components/common/Button";
import Menubar from "@/components/globals/Menubar";
import React, { useState, useEffect } from "react";

interface PartnerService {
  id: string;
  name: string;
  price: string;
  icon: string;
  partnerName: string;
  description: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

function PartnerName() {
    const [partnerServices, setPartnerServices] = useState<PartnerService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPartnerServices();
    }, []);

    const fetchPartnerServices = async () => {
        try {
            const response = await fetch('/api/partner-services');
            const data = await response.json();
            setPartnerServices(data);
        } catch (error) {
            console.error('Error loading partner services:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Menubar back="/">Наши партнёры</Menubar>
                <div className="flex flex-col gap-3">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="rounded-2xl bg-white shadow-4xl p-2 animate-pulse">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gray-200 rounded-[10px]"></div>
                                <div className="h-6 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="flex items-center gap-3 justify-between pl-2 pr-1">
                                <div className="h-6 bg-gray-200 rounded w-24"></div>
                                <div className="h-8 bg-gray-200 rounded w-32"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <Menubar back="/">Наши партнёры</Menubar>
            <div className="flex flex-col gap-3">
                {partnerServices.filter(service => service.isAvailable).map((service) => (
                    <div key={service.id} className="rounded-2xl bg-white shadow-4xl p-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 flex items-center justify-center w-10 h-10 rounded-[10px] bg-primary-dark shadow-5xl">
                                <img
                                    src={service.icon}
                                    alt=""
                                />
                            </div>
                            <b className="font-semibold text-lg text-neutral-950">
                                {service.name}
                            </b>
                        </div>
                        <div className="flex items-center gap-3 justify-between pl-2 pr-1">
                            <b className="font-extrabold text-lg text-neutral-950">
                                {service.price}
                            </b>
                            <Button disabled={!service.isAvailable}>
                                Добавить в заказ
                            </Button>
                        </div>
                    </div>
                ))}
                
                {partnerServices.filter(service => service.isAvailable).length === 0 && (
                    <div className="text-center py-8">
                        <div className="text-gray-500 text-lg">Услуг партнеров пока нет</div>
                        <div className="text-gray-400 text-sm mt-2">Обратитесь к администратору</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PartnerName;
