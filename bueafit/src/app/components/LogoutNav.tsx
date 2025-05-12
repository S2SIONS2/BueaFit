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
        <nav>
            <div className="flex flex-col space-y-2 text-[18px]">
                <button
                    onClick={logout}
                    className={`
                        text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md transition-all cursor-pointer
                    `}
                >
                    로그아웃
                </button>
            </div>       
        </nav>
    )
}