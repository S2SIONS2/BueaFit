import Link from "next/link";

export default function LoginNav() {
    return (
        <nav className="flex items-center justify-between pl-2 pr-2 gap-3 h-[60px] border-b border-gray-200">
            <Link href={'/'} className="text-[20px] font-bold">BueaFit</Link>
            <div className="flex gap-3">
                <Link href={'/login'}>Login</Link>
                <Link href={'/signup'}>Sign Up</Link>
            </div>
        </nav>
    )
}