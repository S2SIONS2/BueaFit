'use client';

import { useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

type ButtonProps = {
    type?: 'button' | 'submit' | 'reset';
    onClick: () => Promise<any> | void;
    children: string | React.ReactNode;
    className?: string;
    };

    export default function Button({
    type = 'button',
    onClick,
    children,
    className = '',
}: ButtonProps): React.ReactElement {
    const [isLoading, setIsLoading] = useState(false);
    const lockRef = useRef(false);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (lockRef.current || isLoading) return;

        lockRef.current = true; // 중복 클릭 방지 락
        setIsLoading(true);
        e.preventDefault();
        e.stopPropagation();

        try {
            await onClick();
        } finally {
            setIsLoading(false);

        // 2초 뒤 락 해제 (debounce)
        setTimeout(() => {
            lockRef.current = false;
        }, 2000);
    }
};

return (
    <button
        type={type}
        onClick={handleClick}
        disabled={isLoading || lockRef.current}
        className={`                
            bg-violet-400 hover:bg-violet-600
            text-white font-semibold
            py-2 px-4
            transition duration-200
            cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center
            ${className}
        `}
    >
    {isLoading
        ? <LoadingSpinner className="w-5 h-5" />
        : children}
    </button>
);
}
