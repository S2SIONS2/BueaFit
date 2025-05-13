import SearchComponent from "@/app/components/Search";
import Link from "next/link";

export default function Page() {
    return (
        <div className="p-3">
            <section className="flex items-center justify-between">
                <div className="flex items-center">
                    <h2>고객 관리</h2>
                </div>
            </section>
            <section className="flex items-center">
                <div className="flex items-center">
                    <SearchComponent />
                    {/* <Link href={'/store/customer/'}>그룹 셋팅</Link> */}
                    <select>
                        <option disabled>고객 그룹</option>
                        <option>그룹1</option>
                        <option>그룹2</option>
                        <option>그룹3</option>
                    </select>
                    <Link href={'/store/customer/add'}>고객 추가</Link>
                </div>
            </section>
            <section>

            </section>
        </div>
    )
}