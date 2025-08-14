"use client";
import Button from "@/components/common/Button";
import {useRouter} from "next/navigation";
import React, {useState} from "react";

function Signup() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    const handleContinue = async () => {
        if (!phoneNumber) return;
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phoneNumber,
                    message: 'Регистрация пользователя'
                })
            });

            if (response.ok) {
                router.push("/verification");
            } else {
                alert('Ошибка при отправке данных. Попробуйте еще раз.');
            }
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            alert('Ошибка при отправке данных. Попробуйте еще раз.');
        }
    };

    return (
        <div className="pb-12">
            <div className="flex w-full justify-center pt-14">
                <img className="" src="/images/002 Black.png" alt="" />
            </div>
            <span className="w-[445px] h-[228px] left-1/2 -translate-x-1/2 bg-[#837FDF] block absolute top-[-100px] -z-20 rounded-full blur-[150px]" />
            <img
                src="/images/Frame 166.svg"
                className="absolute -z-10 top-0 left-1/2 -translate-x-1/2"
                alt=""
            />
            <div className="sm:w-[65%] mx-auto mt-14" role="form">
                <h1 className="font-semibold text-center text-5xl text-neutral-950 mb-8">
                    Регистрация
                </h1>

                <div>
                    <div className="mb-5 mx-1">
                        <b className="text-sm font-normal text-neutral-950 block mb-2">
                            Номер телефона
                        </b>
                        <input
                            type="text"
                            placeholder="+7 (999) 999 99 99"
                            className="text-base shadow-4xl rounded-[10px] p-3.5 placeholder:text-[#0d0d0d]/40 text-[#0d0d0d] w-full"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                        />
                    </div>
                    <p className="text-center text-sm text-neutral-950 mb-20">
                        Для подтверждения, мы вышлем СМС-код на указанный номер
                    </p>
                    <div className="px-2.5 flex justify-center">
                        <Button
                            className="w-full sm:w-[65%] flex-grow mx-auto"
                            disabled={!phoneNumber}
                            onClick={handleContinue}
                        >
                            Продолжить
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
