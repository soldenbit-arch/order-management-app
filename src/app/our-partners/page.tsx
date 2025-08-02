"use client";
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
  imageUrl: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

function OurPartners() {
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

    // Группируем услуги по партнерам
    const partners = partnerServices.reduce((acc, service) => {
        if (!acc[service.partnerName]) {
            acc[service.partnerName] = {
                name: service.partnerName,
                services: [],
                servicesCount: 0
            };
        }
        acc[service.partnerName].services.push(service);
        acc[service.partnerName].servicesCount++;
        return acc;
    }, {} as Record<string, { name: string; services: PartnerService[]; servicesCount: number }>);

    const partnerList = Object.values(partners);

    if (loading) {
        return (
            <div>
                <Menubar back="/">Наши партнёры</Menubar>
                <div className="">
                    <div className="flex flex-col gap-6">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="flex justify-center rounded-2xl bg-[linear-gradient(90deg,_#E5E6FA_0%,_#BABDFF_100%)] mb-2.5 min-h-[140px] items-center">
                                    <div className="w-20 h-20 bg-white/20 rounded-lg"></div>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-64"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Menubar back="/">Наши партнёры</Menubar>
            <div className="">
                <div className="flex flex-col gap-6">
                    {partnerList.map((partner, index) => {
                        const firstService = partner.services[0];
                        return (
                            <div key={partner.name}>
                                {firstService.link ? (
                                    <a 
                                        href={firstService.link.startsWith('http') ? firstService.link : `/${firstService.link}`}
                                        target={firstService.link.startsWith('http') ? "_blank" : "_self"}
                                        rel={firstService.link.startsWith('http') ? "noopener noreferrer" : ""}
                                        className="block cursor-pointer transition-transform hover:scale-[1.02]"
                                    >
                                        <div className="flex justify-center rounded-2xl bg-[linear-gradient(90deg,_#E5E6FA_0%,_#BABDFF_100%)] mb-2.5 min-h-[140px] items-center">
                                            <img
                                                src={firstService.imageUrl || "/images/Remove-bg.ai_1732383936587 1.png"}
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <b className="font-semibold text-3xl text-neutral-950">
                                                {partner.name}
                                            </b>
                                            <p className="font-medium text-md text-neutral-900/60">
                                                {partner.services.map(s => s.name).join(', ')}
                                            </p>
                                        </div>
                                    </a>
                                ) : (
                                    <>
                            <div className="flex justify-center rounded-2xl bg-[linear-gradient(90deg,_#E5E6FA_0%,_#BABDFF_100%)] mb-2.5 min-h-[140px] items-center">
                                <img
                                                src={firstService.imageUrl || "/images/Remove-bg.ai_1732383936587 1.png"}
                                    alt=""
                                />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <b className="font-semibold text-3xl text-neutral-950">
                                                {partner.name}
                                </b>
                                <p className="font-medium text-md text-neutral-900/60">
                                                {partner.services.map(s => s.name).join(', ')}
                                </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                    
                    {partnerList.length === 0 && (
                        <div className="text-center py-8">
                            <div className="text-gray-500 text-lg">Партнеров пока нет</div>
                            <div className="text-gray-400 text-sm mt-2">Добавьте услуги партнеров в админке</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OurPartners;
