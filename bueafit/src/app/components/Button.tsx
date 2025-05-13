'use client';

import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

type ButtonProps = {
    type?: 'button' | 'submit' | 'reset';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: () => Promise<any> | void
    children: string | React.ReactNode
    // loadingComponent?: React.ReactNode
    className?: string
}

export default function Button({
    type = 'button',
    onClick,
    children,
    // loadingComponent,
    className = '',
}: ButtonProps): React.ReactElement {
    const [isLoading, setIsLoading] = useState(false);
    const [lock, setLock] = useState(false);

    const handleClick = async (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
        if(lock || isLoading) return;
        setLock(true);
        e.preventDefault();
        e.stopPropagation();

        try {
            const result = await onClick();
            if (result instanceof Promise) {
                setIsLoading(true);
                await result;
            }
        }finally {
            setIsLoading(false);
            setLock(false);
        }
    }

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={isLoading}
            className={`
                w-full
                bg-violet-400 hover:bg-violet-600
                text-white font-semibold
                py-2 px-4
                transition duration-200
                cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {isLoading
                ? <LoadingSpinner className="w-5 h-5" />
                : children
            }
        </button>
    )
}