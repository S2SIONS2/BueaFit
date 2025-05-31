import Link from "next/link";

export default function LogOutNav() {
    const logout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })            
            
            return response;
        }catch(e) {
            console.error(e);
        }finally {
            window.location.href = '/login';   
        }
    }

    return (
        <nav className="w-full h-[50px] flex items-center pl-2 pr-2 bg-white shadow-sm">
            <div className="w-full flex justify-between space-x-2 text-[18px]">
                <Link href={'/selectstore'} className="font-bold">BueaFit</Link>
                <div className="space-x-3">
                    <Link href={'/setstore'} className="text-gray-800 hover:text-violet-500 cursor-pointer text-[15px]">가게 추가</Link>
                    <button
                        onClick={logout}
                        className={`
                            text-gray-800 hover:bg-gray-100 cursor-pointer text-[15px]
                        `}
                    >
                        로그아웃
                    </button>
                </div>
            </div>       
        </nav>
    )
}