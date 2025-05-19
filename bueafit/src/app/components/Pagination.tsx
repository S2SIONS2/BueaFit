'use client';

import { useEffect, useState } from 'react';

type Props = {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ current, total, onPageChange }: Props) {
  const [visibleRange, setVisibleRange] = useState(5);

  // 화면 크기에 따라 visibleRange 설정
  useEffect(() => {
    const updateRange = () => {
      const width = window.innerWidth;
      if (width < 400) setVisibleRange(3);
      else if (width < 768) setVisibleRange(5);
      else setVisibleRange(7);
    };

    updateRange();
    window.addEventListener('resize', updateRange);
    return () => window.removeEventListener('resize', updateRange);
  }, []);

  // 시작 ~ 끝 범위 계산
  const getPageNumbers = () => {
    const half = Math.floor(visibleRange / 2);
    let start = Math.max(1, current - half);
    const end = Math.min(total, start + visibleRange - 1);

    if (end - start + 1 < visibleRange) {
      start = Math.max(1, end - visibleRange + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center gap-1 mt-6 flex-wrap">
      {/* 이전 버튼 */}
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="px-3 py-1 text-sm border rounded disabled:opacity-40 cursor-pointer"
      >
        이전
      </button>

      {/* 페이지 버튼 */}
      {getPageNumbers().map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1 text-sm border rounded cursor-pointer ${
            num === current
              ? 'bg-violet-400 text-white font-semibold'
              : 'hover:bg-gray-100'
          }`}
        >
          {num}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        className="px-3 py-1 text-sm border rounded disabled:opacity-40 cursor-pointer"
      >
        다음
      </button>
    </div>
  );
} 
