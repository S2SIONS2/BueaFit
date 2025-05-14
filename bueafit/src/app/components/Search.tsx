'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSearchStore } from "@/store/useSearchStore"; // zustand 경로 맞게 수정

interface searchProps {
  className?: string;
  placeholder?: string;
}

export default function SearchComponent({ className = '', placeholder = '' }: searchProps) {
  const searchParam = useSearchStore(state => state.searchParam);
  const setSearchParam = useSearchStore(state => state.setSearchParam);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParam(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="grow">
      <label className={`rounded-[20px] border border-gray-300 flex items-center justify-between min-w-[300px] pl-[10px] pr-[10px] ${className}`}>
        <input
          type="text"
          value={searchParam ?? ""}
          onChange={handleChange}
          placeholder={placeholder}
          className="grow focus:outline-none appearance-none text-[14px] p-1"
        />
        <button type="submit" className="cursor-pointer text-gray-700">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </label>
    </form>
  );
}
