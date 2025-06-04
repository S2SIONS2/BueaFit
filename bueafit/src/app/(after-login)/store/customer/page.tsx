'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SearchComponent from '@/app/components/Search';
import { fetchInterceptors } from '@/app/utils/fetchInterceptors';
import { useSearchStore } from '@/store/useSearchStore';
import Pagination from '@/app/components/Pagination';
import useDebounce from '@/app/utils/useDebounce';
import CustomerSkeleton from '@/app/components/skeleton/customer-skeleton';

interface CustomerType {
  id: string;
  group_name: string;
  name: string;
  phone_number: string;
  memo: string;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [customerList, setCustomerList] = useState<CustomerType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  const word = useSearchStore((state) => state.searchParam);
  const debouncedWord = useDebounce(word);

  useEffect(() => {
    const updatePageSize = () => {
      const height = window.innerHeight;

      if (height < 600) setPageSize(5);
      else if (height < 800) setPageSize(7);
      else if (height < 1000) setPageSize(10);
      else setPageSize(12);
    };

    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  const getList = async (page = 1) => {
    try {
      const res = await fetchInterceptors(
        `${process.env.NEXT_PUBLIC_BUEAFIT_API}/phonebooks?page=${page}&size=${pageSize}&search=${debouncedWord || ''}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setCustomerList(data.items);
        setTotalPages(data.pages);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedWord]);

  useEffect(() => {
    getList(page);
  }, [page, debouncedWord, pageSize]);


  return (
    <div className="h-full p-4 sm:p-6 flex flex-col space-y-6 bg-white">
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pb-2 sm:pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">고객 관리</h2>
      </section>

      <section className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
        <SearchComponent
          className="w-full sm:grow sm:h-[36px]"
          placeholder="고객명 혹은 전화번호 혹은 그룹 혹은 메모"
        />
        <Link
          href="/store/customer/add"
          className="bg-violet-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-600 transition text-center"
        >
          고객 추가
        </Link>
      </section>

      <section className="mt-4 sm:mt-6 min-h-[414px] grow overflow-x-auto">
        <ul className="w-full min-w-[600px] grid grid-cols-10 bg-gray-100 text-sm font-semibold text-gray-700 px-4 py-2 rounded-t">
          <li className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="text-gray-500" size="sm" />
          </li>
          <li className="col-span-2">그룹</li>
          <li className="col-span-2">고객명</li>
          <li className="col-span-3">전화번호</li>
          <li className="col-span-2">메모</li>
        </ul>

        <ul className="rounded-b">
          {
            loading ? (
              <>
                <CustomerSkeleton />
                <CustomerSkeleton />
                <CustomerSkeleton />
              </>
            ) : (
              customerList.map((customer) => (
                <li
                  key={customer.id}
                  className="w-full min-w-[600px] h-[45px] grid grid-cols-10 px-4 py-3 items-center text-sm hover:bg-gray-50 border border-gray-200 mt-2 rounded-lg cursor-pointer"
                  onClick={() =>
                    router.push(`/store/customer/detail/${encodeURIComponent(customer.id)}`)
                  }
                >
                  <div>
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" size="sm" />
                  </div>
                  <div className="truncate col-span-2">{customer.group_name}</div>
                  <div className="truncate col-span-2">{customer.name}</div>
                  <div className="truncate col-span-3">{customer.phone_number}</div>
                  <div className="truncate col-span-2">{customer.memo}</div>
                </li>
              ))
            )
          }
        </ul>
      </section>

      <Pagination
        current={page}
        total={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}