import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full h-[60px] flex items-center justify-center gap-5 bg-gray-100 pl-2 pr-2">
            <Link href={'/service'}>이용 약관</Link>
            <Link href={'/service/privacy'}>개인정보 처리방침</Link>
        </footer>
    )
}