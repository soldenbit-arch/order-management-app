"use client";
import Menubar from "@/components/globals/Menubar";
import React, { useState, useEffect } from "react";
import Link from "next/link";

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

interface Partner {
  name: string;
  services: PartnerService[];
  description: string;
  logo: string;
  bannerTitle: string;
  bannerSubtitle: string;
}

function OurPartners() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            // Получаем данные партнеров
            const partnersResponse = await fetch('/api/partners');
            const partnersData = await partnersResponse.json();
            
            // Получаем услуги партнеров
            const servicesResponse = await fetch('/api/partner-services');
            const services = await servicesResponse.json();
            
            // Объединяем данные партнеров с их услугами
            const partnersWithServices = partnersData
                .filter((partner: any) => partner.isActive)
                .map((partner: any) => {
                    const partnerServices = services.filter((service: PartnerService) => 
                        service.partnerName === partner.name && service.isAvailable
                    );
                    
                    return {
                        name: partner.name,
                        services: partnerServices,
                        description: partner.description,
                        logo: partner.bannerImage,
                        bannerTitle: partner.bannerTitle,
                        bannerSubtitle: partner.bannerSubtitle
                    };
                });

            setPartners(partnersWithServices);
        } catch (error) {
            console.error('Ошибка при загрузке партнеров:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Menubar back="/">Наши партнёры</Menubar>
                <div className="text-center py-8">
                    <div className="text-lg">Загрузка партнеров...</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Menubar back="/">Наши партнёры</Menubar>
            <div className="">
                <div className="flex flex-col gap-6">
                    {partners.length > 0 ? (
                        partners.map((partner, index) => (
                            <Link 
                                key={index}
                                href={`/partner/${encodeURIComponent(partner.name)}`}
                                className="block"
                            >
                                <div className="flex justify-center rounded-2xl bg-[linear-gradient(90deg,_#E5E6FA_0%,_#BABDFF_100%)] mb-2.5 min-h-[140px] items-center">
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                    />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <b className="font-semibold text-3xl text-neutral-950">
                                        {partner.bannerTitle || partner.name}
                                    </b>
                                    <p className="font-medium text-md text-neutral-900/60">
                                        {partner.bannerSubtitle || `${partner.services.length} услуг - ${partner.description}`}
                                    </p>
                                    <p className="text-sm text-purple-600">
                                        Нажмите для просмотра услуг →
                                    </p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>Партнеры пока не добавили свои услуги</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OurPartners;
