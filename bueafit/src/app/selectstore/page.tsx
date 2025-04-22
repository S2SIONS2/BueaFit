import Link from "next/link";

export default function Page() {
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
                    {/* 다른 가게들 추가할 수 있음 */}
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
