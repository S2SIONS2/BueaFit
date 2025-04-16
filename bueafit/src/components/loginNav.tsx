import Link from "next/link";

export default function LoginNav() {
    return (
        <nav className="flex items-center justify-between pl-2 pr-2 gap-3 h-[60px]">
            <Link href={'/'}>BueaFit</Link>
            <div className="flex gap-3">
                <Link href={'/login'}>Login</Link>
                <Link href={'/signup'}>Sign Up</Link>
            </div>
        </nav>
    )
}