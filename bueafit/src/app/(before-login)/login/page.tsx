'use client'

import Button from "@/app/components/Button";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const [email, setEmail] = useState('solee9802@gmail.com'); // 이메일 기본 등록
    const [pw, setPw] = useState('123456'); // 비밀번호 기본 등록

    // zustand set token
    const setToken = useAuthStore((state) => state.setToken)

    // route 
    const route = useRouter();

    // email handler
    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }
    // password handler
    const handlePw = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPw(e.target.value);
    }

    // 로그인 구현
    const login = async () => {
        try{
            const response = await fetch('/api/auth/login', {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    "username" : email,
                    "password" : pw,
                    "grant_type" : "password"
                }),                
            });
            const data = response;
            const jsonData = await data.json();

            // 아이디나 비밀번호 안적었을 때
            if(!email || !pw){
                alert('이메일이나 비밀번호를 적어주세요.')
                return;
            }

            if(data.status === 200) {
              // zustand 메모리에 액세스 토큰 저장
              const access_token = jsonData.access_token;
              setToken(access_token);
              route.push('/selectstore');

              // refresh token local storage에 저장
              const refresh_token = jsonData.refresh_token
              localStorage.setItem('refresh_token', refresh_token);

            }
            if(data.status === 401) {
                alert('이메일이나 비밀번호가 틀렸습니다.')            
            }

        }catch(error){
            console.error(error)
        }
    }

    // 엔터키로 로그인 추가
    const enterLogin = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            login()
        }
    }

    return(
    <section className="w-full h-[calc(100%-120px)] mx-auto flex flex-col items-center justify-center">
      <div className="min-w-md p-6 bg-white rounded-2xl shadow-md">
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
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300`}
              value={email}
              placeholder="solee9802@gmail.com"
              onKeyDown={(e) => enterLogin(e)}
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
              onKeyDown={(e) => enterLogin(e)}
              onChange={handlePw}
            />
          </div>
          <div className="pt-4">
            <Button type="button" className="w-full" onClick={login}>로그인</Button>
          </div>
        </form>
        <Link href={'/signup'}>
          <p className="mt-[30px] text-sm text-gray-800 underline pb-[1px]">
              계정이 없으신가요? 회원가입하러 가기
          </p>
        </Link>
      </div>
    </section>
    )
}