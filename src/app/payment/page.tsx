"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

function PaymentContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  const configured = searchParams.get('configured');
  const total = searchParams.get('total');
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchService = async () => {
    try {
      const response = await fetch('/api/services');
      const services = await response.json();
      const foundService = services.find((s: Service) => s.id === parseInt(serviceId!));
      setService(foundService || null);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId) {
      fetchService();
    } else {
      setLoading(false);
    }
  }, [serviceId]);

  const handleDownloadInvoice = () => {
    // Здесь будет логика скачивания счета
    alert('Счет будет скачан в формате PDF');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] relative overflow-hidden">
      {/* Purple gradient background */}
      <div className="absolute w-[445px] h-[243px] -left-[35px] -top-[103px] bg-[#837FDF] blur-[150px]"></div>
      
      {/* Background pattern */}
      <img
        src="/images/Frame 166.svg"
        className="absolute -z-10 top-0 w-full"
        alt=""
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Success Icon */}
        <div className="w-[92px] h-[92px] bg-[#6F35FF] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[inset_0px_4px_12px_2px_rgba(255,255,255,0.25)]">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Main Title */}
        <h1 className="text-[20px] font-semibold text-[#0D0D0D] mb-8 text-center">
          Заказ успешно сформирован
        </h1>

        {/* What's Next Section */}
        <div className="mb-8">
          <h2 className="text-[24px] font-extrabold text-[#0D0D0D] mb-6 text-center">
            Что дальше?
          </h2>
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="w-[355px] h-[52px] bg-white rounded-xl shadow-[0px_26px_16px_rgba(0,0,0,0.01),0px_12px_12px_rgba(0,0,0,0.02),0px_3px_6px_rgba(0,0,0,0.02)] flex items-center px-4">
              <div className="w-[44px] h-[44px] bg-[#2C1E4F] rounded-lg flex items-center justify-center mr-4 shadow-[inset_0px_4px_20px_4px_rgba(255,255,255,0.2)]">
                <span className="text-[28px] font-extrabold italic text-white">01</span>
              </div>
              <span className="text-[16px] font-semibold text-[#0D0D0D]">Скачайте счёт на оплату</span>
            </div>
            
            {/* Step 2 */}
            <div className="w-[355px] h-[52px] bg-white rounded-xl shadow-[0px_26px_16px_rgba(0,0,0,0.01),0px_12px_12px_rgba(0,0,0,0.02),0px_3px_6px_rgba(0,0,0,0.02)] flex items-center px-4">
              <div className="w-[44px] h-[44px] bg-[#2C1E4F] rounded-lg flex items-center justify-center mr-4 shadow-[inset_0px_4px_20px_4px_rgba(255,255,255,0.2)]">
                <span className="text-[28px] font-extrabold italic text-white">02</span>
              </div>
              <span className="text-[16px] font-semibold text-[#0D0D0D]">Оплатите счёт</span>
            </div>
            
            {/* Step 3 */}
            <div className="w-[355px] h-[52px] bg-white rounded-xl shadow-[0px_26px_16px_rgba(0,0,0,0.01),0px_12px_12px_rgba(0,0,0,0.02),0px_3px_6px_rgba(0,0,0,0.02)] flex items-center px-4">
              <div className="w-[44px] h-[44px] bg-[#2C1E4F] rounded-lg flex items-center justify-center mr-4 shadow-[inset_0px_4px_20px_4px_rgba(255,255,255,0.2)]">
                <span className="text-[28px] font-extrabold italic text-white">03</span>
              </div>
              <span className="text-[16px] font-semibold text-[#0D0D0D]">Мы свяжемся с вами в течение дня</span>
            </div>
          </div>
        </div>

        {/* Chat Icon */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-[58px] h-[58px] border border-[#2C1E4F] rounded-full flex items-center justify-center mb-2 shadow-[inset_0px_4px_20px_4px_rgba(255,255,255,0.2)]">
            <div className="w-[50px] h-[50px] bg-[#2C1E4F] rounded-full flex items-center justify-center shadow-[0px_0px_4px_4px_rgba(47,29,179,0.25),inset_0px_4px_20px_4px_rgba(255,255,255,0.2)]">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <p className="text-[16px] font-medium text-[#0D0D0D] text-center">
            Остались вопросы? Мы ответим!
          </p>
        </div>

        {/* Download Button */}
        <Button 
          onClick={handleDownloadInvoice}
          className="w-[343px] h-[52px] bg-[#2C1E4F] text-white rounded-xl font-semibold text-[16px] shadow-[inset_0px_4px_20px_4px_rgba(255,255,255,0.2)]"
        >
          Скачать счёт
        </Button>

        {/* Back to Home Button */}
        <Button 
          onClick={() => window.location.href = '/'}
          variant="outlined"
          className="w-[343px] h-[52px] mt-4 border-[#2C1E4F] text-[#2C1E4F] hover:bg-[#2C1E4F] hover:text-white rounded-xl font-semibold text-[16px]"
        >
          Вернуться на главную
        </Button>
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]"><div className="text-xl">Loading...</div></div>}>
      <PaymentContent />
    </Suspense>
  );
} 