import React from "react";
import {tv} from "tailwind-variants";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "contained" | "outlined";
    color?: "primary" | "secondary";
    size?: "small" | "medium" | "large";
    children?: React.ReactNode;
    onClick?: () => void;
}

const buttonStyles = tv({
    base: "rounded-xl font-semibold transition-all duration-200 disabled:bg-[rgb(233,_233,_233)] disabled:shadow-lg text-center disabled:text-neutral-400 disabled:cursor-not-allowed box-border",
    variants: {
        variant: {
            contained: "shadow-lg",
            outlined: "border",
        },
        color: {
            primary: "",
            secondary: "",
        },
        size: {
            small: "font-extrabold text-md pt-2 px-3.5 pb-2.5",
            medium: "font-semibold text-lg pt-3.5 px-16 pb-4 font-semibold px-10",
            large: "",
        },
    },
    compoundVariants: [
        {
            variant: "contained",
            color: "primary",
            className: "bg-primary-dark text-white hover:bg-primary-dark/90",
        },
        {
            variant: "contained",
            color: "secondary",
            className:
                "bg-[rgb(111,_53,_255)] text-white hover:bg-[rgb(111,_53,_255)]/90",
        },
        {
            variant: "outlined",
            color: "primary",
            className: "border-primary-dark text-primary-dark hover:bg-primary-dark/10",
        },
        {
            variant: "outlined",
            color: "secondary",
            className:
                "border-[rgb(111,_53,_255)] text-[rgb(111,_53,_255)] hover:bg-[rgb(111,_53,_255)]/10",
        },
    ],
});

function Button({
    variant = "contained",
    color = "primary",
    size = "medium",
    children,
    onClick,
    className,
    ...rest
}: ButtonProps) {
    return (
        <button
            {...rest}
            className={`${buttonStyles({variant, color, size})} ${className || ""}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;
