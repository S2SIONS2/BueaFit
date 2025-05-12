import SearchComponent from "@/app/components/Search";
import Link from "next/link";

export default function Page() {
    return (
        <div>
            <section className="flex items-center justify-between">
                <div className="flex items-center">
                    <h2>고객 관리</h2>
                </div>
                <div className="flex items-center">
                    <SearchComponent />
                    <Link href={'/store/customer/add'}>고객 추가</Link>
                </div>
            </section>
            <section>

            </section>
        </div>
    )
}