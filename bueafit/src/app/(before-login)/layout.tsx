import { Suspense } from "react";
import LoginNav from "../components/LoginNav";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Footer from "../components/Footer";

export default async function Layout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    // 액세스 토큰 or 리프레시 토큰이 있을 때 로그인, 회원가입 페이지 못오게
    const refresh_token = (await (cookies())).get('refresh_token')
    if(refresh_token) {
        redirect('/store/main');
    }
    
    return (
        <div className="min-h-screen w-full h-full">
            <Suspense>
                <LoginNav />
                {children}
                <Footer />
            </Suspense>
        </div>
    )
}