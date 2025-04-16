'use client'

import Link from "next/link"

export default function Page() {
  return (
    <section className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            <span className="text-red-900">*</span>
            이메일
          </label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            <span className="text-red-900">*</span>
            비밀번호
            </label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            <span className="text-red-900">*</span>
            비밀번호 확인
            </label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            <span className="text-red-900">*</span>
            이름
            </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-violet-400 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            가입하기
          </button>
        </div>
      </form>
      <Link href={'/login'}>
        <p className="mt-[30px] text-sm text-gray-800 underline pb-[1px]">
            계정이 있으신가요?
        </p>
      </Link>
    </section>
  )
}