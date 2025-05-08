export default function LogOutNav() {
    const logout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })            
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
                        text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md transition-all
                    `}
                >
                    로그아웃
                </button>
            </div>       
        </nav>
    )
}