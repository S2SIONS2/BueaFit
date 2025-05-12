import { Suspense } from "react";
import LoginNav from "../components/LoginNav";

export default function Layout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen">
            <Suspense>
                <LoginNav />
                {children}
            </Suspense>
        </div>
    )
}