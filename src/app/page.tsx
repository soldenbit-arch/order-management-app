"use client";
import React from "react";
import Step from "./home/Step";
import Categories from "./home/Categories";
import Link from "next/link";

function CreateApplication() {
    return (
        <div className="">
            <div className="relative z-0">
                <div className="flex w-full justify-center pt-14">
                    <img className="" src="/images/002 Black.png" alt="" />
                </div>
                <span className="w-[445px] h-[228px] left-1/2 -translate-x-1/2 bg-[#837FDF] block absolute top-[-100px] -z-20 rounded-full blur-[150px]" />
                <img
                    src="/images/Frame 166.svg"
                    className="absolute -z-10 top-0 w-full"
                    alt=""
                />
                <Link href="/myprofile" className="absolute top-14 right-0">
                    <img
                        src="/images/user-demo profile.svg"
                        className="size-11 rounded-full"
                        alt=""
                    />
                </Link>
            </div>
            <Step />
            <Categories />
        </div>
    );
}

export default CreateApplication;
