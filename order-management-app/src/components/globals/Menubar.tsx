import Link from "next/link";
import React from "react";

interface MenubarProps {
    children: React.ReactNode;
    back: string;
}

function Menubar({children, back}: MenubarProps) {
    return (
        <div className="py-5">
            <Link href={back} className="flex items-center gap-1">
                <span className="size-6">
                    <img src="/images/Linear  Arrows  Alt Arrow Left.svg" alt="" />
                </span>
                <span className="font-semibold text-4xl text-neutral-950">
                    {children}
                </span>
            </Link>
        </div>
    );
}

export default Menubar;
