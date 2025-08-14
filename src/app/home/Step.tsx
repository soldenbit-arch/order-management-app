import React from "react";

const steps = [
    {
        imgSrc: "/images/Linear  Notes  Document Add.svg",
        stepNumber: "01",
        description: "Выберете желаемое",
    },
    {
        imgSrc: "/images/Linear Messages, Conversation  Dialog.svg",
        stepNumber: "02",
        description: "Обсуждение проекта",
    },
    {
        imgSrc: "/images/Linear Electronic, Devices Smartphone.svg",
        stepNumber: "03",
        description: "Старт работ по проекту",
    },
];

function Step() {
    return (
        <div className="shadow-3xl rounded-2xl bg-white p-3 pt-4 box-border gap-4 mb-6 -mt-16 relative">
            <section className="flex flex-row px-2.5 text-center text-4xl text-neutral-900 font-manrope mb-4">
                <div className="flex flex-col gap-2">
                    <h4 className="relative font-semibold text-inherit">
                        Создайте приложение под ваши задачи
                    </h4>
                    <p className="text-md tracking-[0.01em]">
                        Выберите тип, добавьте функции и настройте под ваш бренд. Мы
                        позаботимся о простоте разработки и успешном запуске!
                    </p>
                </div>
            </section>
            <div className="flex items-center justify-center gap-2 text-center text-white">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="shadow-lg rounded-2xl bg-primary-dark flex flex-col p-2.5"
                    >
                        <div className="flex flex-row gap-1 mb-2.5">
                            <div className="flex items-center justify-center bg-white size-9 rounded-xl">
                                <img
                                    className="size-6 relative rounded-lg flex-shrink-0"
                                    loading="lazy"
                                    alt=""
                                    src={step.imgSrc}
                                />
                            </div>
                            <i className="inline-block font-extrabold bg-gradient-to-b font-gilroy from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0.05)] bg-clip-text text-transparent text-6xl leading-none pr-1">
                                {step.stepNumber}
                            </i>
                        </div>
                        <b className="text-xs font-manrope inline-block text-left">
                            {step.description}
                        </b>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Step;
