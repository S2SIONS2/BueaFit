'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const [email, setEmail] = useState('solee9802@gmail.com'); // 이메일 기본 등록
    const [pw, setPw] = useState('123456'); // 비밀번호 기본 등록

    const route = useRouter();

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }
    const handlePw = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPw(e.target.value);
    }

    const login = async () => {
        const response = await fetch(`http://175.212.136.236:3001/auth/login`, {
            method: "POST",
            // body: formData
            body: new URLSearchParams({
                "username" : email,
                "password" : pw,
                "grant_type" : "password"
            })            
        });
        const data = response;
        if(data.status === 200) {
            route.push('/selectstore')
        }
        if(data.status === 401) {
            alert('이메일이나 비밀번호가 틀렸습니다.')            
        }
    }

    return(
    <section className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            <span className="text-red-900">*</span>
            이메일
          </label>
          <input
            type="email"
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2`}
            value={email}
            placeholder="solee9802@gmail.com"
            onChange={handleEmail}
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
            value={pw}
            placeholder="123456"
            onChange={handlePw}
          />
        </div>
        <div className="pt-4">
          <button
            type="button"
            className="w-full bg-violet-400 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
            onClick={login}
          >
            로그인
          </button>
        </div>
      </form>
      <Link href={'/signup'}>
        <p className="mt-[30px] text-sm text-gray-800 underline pb-[1px]">
            계정이 없으신가요? 회원가입하러 가기
        </p>
      </Link>
    </section>
    )
}