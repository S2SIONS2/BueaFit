import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
    // 액세스 토큰
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    // 가게 선택
    const response = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${accessToken}`

        },
        credentials: 'include'
    })
    const data = await response.json();

    // 선택할 가게가 없을 때
    if (data.length === 0) {
        return redirect('/setstore')
    }
    
    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                    관리하실 가게를 선택해주세요.
                </h2>
                <ul className="space-y-4">
                    <li>
                        <Link
                            href={`/store/${encodeURIComponent('buealine')}`}
                            className="block w-full text-center bg-violet-300 hover:bg-violet-400 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
                        >
                            BUEALINE
                        </Link>
                    </li>
                    {/* <li>
                        <Link
                            href="/store/anotherstore"
                            className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
                        >
                            ANOTHER STORE
                        </Link>
                    </li> */}
                </ul>
            </div>
        </section>
    );
}
