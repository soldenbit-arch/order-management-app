import React from "react";
import {AnimatePresence, motion} from "framer-motion";

interface DialogProps {
    children?: React.ReactNode;
    open?: boolean;
    onClose?: () => void;
}

function Dialog(props: DialogProps) {
    const {children, onClose, open} = props;

    return (
        <AnimatePresence mode="wait">
            {open && (
                <div aria-label="dialog">
                    <div className="fixed inset-0 z-40 flex items-center">
                        <motion.div
                            onClick={onClose}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[2px] select-none"
                        />
                        <motion.div
                            initial={{scale: 0}}
                            animate={{scale: 1}}
                            exit={{scale: 0}}
                            className="device-container relative z-50"
                        >
                            <div className="rounded-xl bg-white shadow-4xl p-3.5">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default Dialog;
