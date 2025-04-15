'use client'

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react";

export default function Header() {
    const path = usePathname();
    
    const [currentLocation, setCurrentLocation] = useState('');
    useEffect(() => {
        const whatIsCurrent = () => {
            if(path === '/main') {
                setCurrentLocation('메인')            
            }
            if(path === '/customer') {
                setCurrentLocation('고객 관리')
            }
            if(path === '/mypage') {
                setCurrentLocation('마이페이지')
            }
        };
        whatIsCurrent();
    }, [path])
    return (
        <header className="Header h-[50px] border-b border-gray-300 flex items-center pl-[20px]">
            <div className="font-bold">
                { currentLocation }
            </div>
        </header>
    )
}