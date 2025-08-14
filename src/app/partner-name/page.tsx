import Button from "@/components/common/Button";
import Menubar from "@/components/globals/Menubar";
import React from "react";

function PartnerName() {
    return (
        <div>
            <Menubar back="/">Наши партнёры</Menubar>
            <div className="flex flex-col gap-3">
                {[...Array(10)].map((_, index) => (
                    <div key={index} className="rounded-2xl bg-white shadow-4xl p-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 flex items-center justify-center w-10 h-10 rounded-[10px] bg-primary-dark shadow-5xl">
                                <img
                                    src="/images/Linear Video, Audio, Sound  Gallery.svg"
                                    alt=""
                                />
                            </div>
                            <b className="font-semibold text-lg text-neutral-950">
                                Название услуги
                            </b>
                        </div>
                        <div className="flex items-center gap-3 justify-between pl-2 pr-1">
                            <b className="font-extrabold text-lg text-neutral-950">
                                от 20.000 ₽
                            </b>
                            <Button disabled={index % 2 != 0 ? true : false}>
                                Добавить в заказ
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PartnerName;
