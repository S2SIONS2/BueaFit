import Link from "next/link";

export default function LogOutNav() {
    const logout = async () => {
        try {
            const response = await fetch(`/api/auth/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })            
            if (response.status === 200) {
                if(confirm('로그아웃 하시겠습니까?')) {    
                    window.location.href = '/login';   
                };
            } else {
                console.error("로그아웃 실패", response);
            }
            return response;
        }catch(e) {
            console.error(e);
        }
    }

    return (
        <nav className="w-full h-[50px] flex items-center pl-2 pr-2 bg-white shadow-sm">
            <div className="w-full flex justify-between space-x-2 text-[18px]">
                <Link href={'/selectstore'} className="font-bold">BueaFit</Link>
                <button
                    onClick={logout}
                    className={`
                        text-gray-800 hover:bg-gray-100 cursor-pointer text-xm
                    `}
                >
                    로그아웃
                </button>
            </div>       
        </nav>
    )
}