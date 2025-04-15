import SearchComponent from "@/components/search";

export default function Page() {
    return (
        <div className="Main flex flex-col p-[20px]">
            <div className="flex items-center justify-between items-center mb-[20px]">
                <SearchComponent />
                <button type="button" className="p-1 rounded-[5px] border border-gray-300 text-gray-700 cursor-pointer text-[15px]">신규 고객 등록</button>
            </div>
            <section>
                고객 관리 리스트
            </section>
        </div>
    )
}