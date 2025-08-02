import Link from "next/link";
import React from "react";

interface PricingItem {
    itemLabel: string;
    priceLabel: string;
    price: number;
    notRemoveable?: boolean;
    selected?: boolean;
}

interface PricingTableProps {
    categoryLabel: string;
    items: PricingItem[];
    onItemToggle?: (itemLabel: string) => void;
}

function PricingTable({categoryLabel, items, onItemToggle}: PricingTableProps) {
    return (
        <div>
            <div className="flex items-center gap-2 justify-between mb-2.5 px-1">
                <b className="font-semibold text-md tracking-[0.02em] text-uppercase text-neutral-950">
                    {categoryLabel}
                </b>
                <Link
                    className="font-bold text-md tracking-[0.02em] text-[rgb(111,_53,_255)] flex items-center gap-0.5"
                    href="/"
                >
                    <span>Изменить</span>
                    <img src="/images/Linear Arrows Alt Arrow Right-blue.svg" alt="" />
                </Link>
            </div>
            <div className="flex flex-col gap-2">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div 
                            className={`rounded-[10px] bg-white shadow-4xl p-3.5 inline-flex items-center justify-between flex-grow cursor-pointer transition-all ${
                                item.selected ? 'ring-2 ring-[#6F35FF]' : ''
                            }`}
                            onClick={() => onItemToggle && onItemToggle(item.itemLabel)}
                        >
                            <b className="font-extrabold text-md text-neutral-950 line-clamp-1">
                                {item.itemLabel}
                            </b>
                            <span className="font-extrabold text-center text-xs text-uppercase text-neutral-950 whitespace-nowrap">
                                {item.priceLabel}
                            </span>
                        </div>
                        {!item?.notRemoveable && onItemToggle && (
                            <button 
                                className="size-6 rounded-full shadow-4xl flex-shrink-0"
                                onClick={() => onItemToggle(item.itemLabel)}
                            >
                                <img src="/images/remove-icon.svg" alt="" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PricingTable;
