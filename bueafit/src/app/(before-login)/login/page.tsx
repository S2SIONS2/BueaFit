'use client'

import Button from "@/app/components/Button";
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    // route 
    const route = useRouter();

    // zustand 메모리 담기
    const { setToken } = useAuthStore.getState();

    useEffect(() => {
        // 로그인 됐을 때 페이지 못오게 이동
        if (typeof window !== "undefined") {
            // 리프레시 토큰 재발급
            const fetchRefresh = async () => {
                const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/refresh`, {
                    method: "POST",
                    credentials: "include",
                })
                const data = await res.json()

                if(res.status === 200) {
                    setToken(data.access_token)
                    route.push('/store/main')
                }
            }

            fetchRefresh();
        }
    }, []);

    const [email, setEmail] = useState('solee9802@gmail.com'); // 이메일 기본 등록
    const [pw, setPw] = useState('123456'); // 비밀번호 기본 등록

    

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/login`, {
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

              // 리프레시 토큰 저장 안되는 것 방지
              await new Promise((res) => setTimeout(res, 0));

              route.push('/store/main');
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