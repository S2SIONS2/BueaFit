'use client'

import SearchComponent from "@/app/components/Search";
import CustomerSkeleton from "@/app/components/skeleton/customer-skeleton";
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { useSearchStore } from "@/store/useSearchStore";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface customerType {
  id: string;
  group_name: string;
  name: string;
  phone_number: string;
  memo: string;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [customerList, setCustomerList] = useState<customerType[]>([]);
  const route = useRouter();

  const word = useSearchStore((state) => state.searchParam);

  const getList = async () => {
    setLoading(true);
    try {
      const res = await fetchInterceptors(
        `${process.env.NEXT_PUBLIC_BUEAFIT_API}/phonebooks?search=${word}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        const data = await res.json();
        setCustomerList(data.items);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, [word]);

  return (
    <div className="p-6 space-y-6 bg-white">
      <section className="flex items-center justify-between pb-4">
        <h2 className="text-2xl font-bold text-gray-800">고객 관리</h2>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <SearchComponent
          className={"grow h-[36px]"}
          placeholder="고객명 혹은 전화번호 혹은 그룹 혹은 메모"
        />

        <Link
          href="/store/customer/add"
          className="bg-violet-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-600 transition"
        >
          고객 추가
        </Link>
      </section>

      <section className="mt-6">
        <ul className="w-full grid grid-cols-10 bg-gray-100 text-sm font-semibold text-gray-700 px-4 py-2 rounded-t">
          <li className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="text-gray-500" />
          </li>
          <li className="col-span-2">그룹</li>
          <li className="col-span-2">고객명</li>
          <li className="col-span-3">전화번호</li>
          <li className="col-span-2">메모</li>
        </ul>

        <ul className="rounded-b">
          {loading ? (
            <>
              <CustomerSkeleton />
              <CustomerSkeleton />
              <CustomerSkeleton />
            </>
          ) : (
            customerList.map((customer) => (
              <li
                key={customer.id}
                className="w-full grid grid-cols-10 px-4 py-3 items-center text-sm hover:bg-gray-50 border border-gray-200 mt-2 rounded-lg cursor-pointer"
                onClick={() =>
                  route.push(
                    `/store/customer/detail/${encodeURIComponent(customer.id)}`
                  )
                }
              >
                <div>
                  <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                </div>
                <div className="truncate text-ellipsis col-span-2">
                  {customer.group_name}
                </div>
                <div className="truncate text-ellipsis col-span-2">
                  {customer.name}
                </div>
                <div className="truncate text-ellipsis col-span-3">
                  {customer.phone_number}
                </div>
                <div className="truncate text-ellipsis col-span-2">
                  {customer.memo}
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
