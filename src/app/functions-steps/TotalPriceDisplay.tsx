import React from "react";
import { useFunctions } from "./FunctionsContext";

function TotalPriceDisplay() {
    const { totalPrice, selectedFunctions } = useFunctions();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="rounded-t-[28px] bg-white shadow-6xl pt-5 px-4 pb-7 device-container">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-lg text-neutral-950">
                        Выбранные функции: {selectedFunctions.length}
                    </h4>
                    <h4 className="font-semibold text-2xl text-neutral-950">
                        Итого: {totalPrice.toLocaleString()} ₽
                    </h4>
                </div>
                {selectedFunctions.length > 0 && (
                    <div className="max-h-20 overflow-y-auto mb-3">
                        <div className="flex flex-wrap gap-1">
                            {selectedFunctions.map((func, index) => (
                                <span 
                                    key={index}
                                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                >
                                    {func.title} ({func.price.toLocaleString()} ₽)
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TotalPriceDisplay; 