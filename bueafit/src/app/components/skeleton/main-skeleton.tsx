import dayjs from "dayjs"

export default function MainSkeleton() {
    const today = dayjs(new Date()).format("YYYY-MM-DD");
    
    return (
        <div className="w-full min-h-full">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">금일 현황</h1>
                <p className="text-sm font-bold text-gray-500">{today}</p>
            </header>

             <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg p-4 h-[92px] shadow">
                    <h3 className="text-sm font-medium"></h3>
                    <p className="text-3xl font-bold mt-1"></p>
                </div>
                <div className="bg-white rounded-lg p-4 h-[92px] shadow">
                    <h3 className="text-sm font-medium"></h3>
                    <p className="text-3xl font-bold mt-1"></p>
                </div>
                <div className="bg-white rounded-lg p-4 h-[92px] shadow">
                    <h3 className="text-sm font-medium"></h3>
                    <p className="text-3xl font-bold mt-1"></p>
                </div>
            </section>
            <section className="gap-6 mb-8">
                <div className="h-[152px] grid grid-cols-1 lg:grid-cols-3 space-y-6 gap-4">
                    <div className="h-full bg-white rounded-xl p-4 shadow">
                        <h3 className="text-lg font-semibold mb-3 lg:col-span-1"></h3>
                    </div>

                    <div className="h-full bg-white rounded-xl p-4 shadow lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-3"></h3>
                            <div className="border-b border-gray-200 py-2">
                                <p className="font-semibold"></p>
                                <p className="text-gray-500"></p>
                            </div>
                            <p className="text-gray-500"></p>   
                    </div>
                </div>
            </section>
            <section className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-xl p-4 shadow">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2"></h3>
                    <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400"></div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2"></h3>
                    <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400"></div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2"></h3>
                    <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400"></div>
                </div>
            </section>
        </div>
    )
}