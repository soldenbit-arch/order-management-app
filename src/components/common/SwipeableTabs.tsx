"use client";
import React, {useEffect, useRef, useState} from "react";
import {motion, AnimatePresence, PanInfo} from "framer-motion";

interface SwipeableTabsProps {
    index: number;
    onChangeIndex: (index: number) => void;
    children: React.ReactNode;
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number): number =>
    Math.abs(offset) * velocity;

function SwipeableTabs({index, onChangeIndex, children}: SwipeableTabsProps) {
    const prevIndexRef = useRef<number | null>(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const direction: number =
        prevIndexRef.current == null ? 0 : index > prevIndexRef.current ? 1 : -1;

    useEffect(() => {
        prevIndexRef.current = index;
    }, [index]);

    // Calculate the maximum height of the children
    useEffect(() => {
        const childrenArray = React.Children.toArray(children);
        const childHeights = childrenArray.map((child) => {
            const element = document.getElementById(
                `child-${childrenArray.indexOf(child)}`
            );
            return element ? element.clientHeight : 0;
        });
        const maxHeight = Math.max(...childHeights);
        setContainerHeight(maxHeight);
    }, [children, index]);

    const childrenArray = React.Children.toArray(children);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
        }),
        center: {
            x: "0%",
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
        }),
    };

    return (
        <div
            className="relative overflow-hidden duration-200"
            style={{height: containerHeight}}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={index}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        duration: 0.35,
                        ease: [0.4, 0.0, 0.2, 1],
                    }}
                    drag="x"
                    dragConstraints={{left: 0, right: 0}}
                    onDragEnd={(
                        event: MouseEvent | TouchEvent | PointerEvent,
                        info: PanInfo
                    ) => {
                        const swipe = swipePower(info.offset.x, info.velocity.x);
                        if (swipe < -swipeConfidenceThreshold) {
                            const newIndex = Math.min(
                                index + 1,
                                childrenArray.length - 1
                            );
                            onChangeIndex(newIndex);
                        } else if (swipe > swipeConfidenceThreshold) {
                            const newIndex = Math.max(index - 1, 0);
                            onChangeIndex(newIndex);
                        }
                    }}
                    className="absolute w-full"
                >
                    {React.cloneElement(
                        childrenArray[index] as React.ReactElement<{id: string}>,
                        {
                            id: `child-${index}`,
                        }
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default SwipeableTabs;
