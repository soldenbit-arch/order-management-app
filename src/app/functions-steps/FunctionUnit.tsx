import React from "react";

interface FunctionUnitProps {
    selected?: boolean;
    onClick?: () => void;
    price: string;
    description: string;
    title: string;
    details: string;
    thumb: string;
}

function FunctionUnit({
    selected,
    onClick,
    price,
    description,
    title,
    details,
    thumb,
}: FunctionUnitProps) {
    return (
        <div
            onClick={onClick}
            className={`rounded-2xl bg-[rgb(229,_230,_250)] border-2 relative z-0 ${
                selected
                    ? "border-2 border-[rgb(111,_53,_255)]"
                    : "border-[rgb(214,_213,_244)]"
            }`}
            role="button"
        >
            {selected && (
                <div className="rounded-[100px] bg-[rgb(111,_53,_255)] p-1 flex items-center justify-center size-8 absolute top-2 right-2 z-20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M7 12.9L10.1429 16.5L18 7.5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            )}
            <div className="flex p-3.5 pb-0">
                <div className="flex-grow max-w-[230px]">
                    <span className="font-medium text-center text-xs text-uppercase text-[rgb(43,_30,_151)] pt-1.5 px-2.5 pb-2 rounded-[100px] bg-[rgb(177,_180,_254)] inline-block font-druk-text-wide-cyr mb-2">
                        {price}
                    </span>
                    <div className="rounded-xl bg-[rgba(255,_255,_255,_0.30)] border-[1px solid rgba(255, 255, 255, 0.20)] backdrop-blur-sm p-2.5 relative z-10">
                        <p className="font-bold text-md -tracking-normal text-neutral-950">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="flex-shrink-0 absolute right-0 top-0">
                    <img src={thumb} alt="" />
                </div>
            </div>
            <div className="p-4 pt-3">
                <b className="font-extrabold text-3xl text-[rgb(50,_42,_119)] mb-1">
                    {title}
                </b>
                <p className="text-md text-neutral-950">{details}</p>
            </div>
        </div>
    );
}

export default FunctionUnit;
