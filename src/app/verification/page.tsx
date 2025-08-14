"use client";
import Button from "@/components/common/Button";
import React, {useState} from "react";
import OtpInput from "react-otp-input";
import Countdown from "react-countdown";

function Verification() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const isValidOtp = otp.length === 5;

    const handleSubmit = async () => {
        if (!isValidOtp) return;
        
        setLoading(true);
        try {
            // Здесь можно добавить проверку OTP через API
            // Пока просто симулируем успешную верификацию
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Перенаправляем на главную страницу после успешной верификации
            window.location.href = '/';
        } catch (error) {
            console.error('Ошибка при верификации:', error);
            alert('Ошибка при верификации. Попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="device-container px-3 pb-12">
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
                <div className="">
                    <p className="text-sm text-neutral-950 text-center mb-3">СМС-код</p>
                    <div className="mb-24">
                        <div className="mb-5">
                            <OtpInput
                                containerStyle={{justifyContent: "space-between"}}
                                value={otp}
                                onChange={setOtp}
                                numInputs={5}
                                renderInput={({className, placeholder, ...props}) => (
                                    <input
                                        className={` py-2.5 px-3.5 inline-flex gap-2.5 items-center justify-center !w-11 !h-12 rounded-[10px] bg-white shadow-4xl font-medium text-5xl placeholder:text-[#0d0d0d]/40 text-[#0d0d0d] flex-shrink-0`}
                                        placeholder="0"
                                        {...props}
                                    />
                                )}
                            />
                        </div>
                        <p className="text-center text-sm text-neutral-900/40">
                            Код действует:{" "}
                            <b className="font-bold text-sm text-neutral-950">
                                <Countdown
                                    renderer={({hours, minutes, seconds, completed}) => {
                                        if (completed) {
                                            return <span>истекший</span>;
                                        } else {
                                            return (
                                                <span>
                                                    {minutes.toString().padStart(2, "0")}:
                                                    {seconds.toString().padStart(2, "0")}
                                                </span>
                                            );
                                        }
                                    }}
                                    date={Date.now() + 150000}
                                />
                            </b>
                        </p>
                    </div>
                    <div className="px-2.5 flex justify-center">
                        <Button
                            className="w-full sm:w-[65%] flex-grow mx-auto"
                            disabled={!isValidOtp || loading}
                            onClick={handleSubmit}
                        >
                            {loading ? 'Проверка...' : 'Продолжить'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Verification;
