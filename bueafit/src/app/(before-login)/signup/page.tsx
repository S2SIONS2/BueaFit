'use client';

import Link from "next/link"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"

export default function Page() {
    const [email, setEmail] = useState<string>(''); // email
    const [pw, setPw] = useState<string>(''); // password
    const [checkPw, setCheckPw] = useState<string>(''); // 비밀번호 확인
    const [checkPwText, setCheckPwText] = useState<string>(''); // 비밀번호 확인 틀릴시 문구
    const [name, setName] = useState<string>(''); // name

    const router = useRouter();

    const [checkEmailText, setCheckEmailText] = useState('') // 이메일 중복 체크
    const [emailExists, setEmailExists] = useState(Boolean)

    // email onChange
    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }
    // password onChange
    const handlePw = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPw(e.target.value)
    }
    // check password onChange
    const handleCheckPw = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckPw(e.target.value)
    }
    // name onChange
    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    // 비밀번호 확인
    useEffect(() => {
        if(pw !== checkPw) {
            setCheckPwText('비밀번호가 일치하지 않습니다.');
        }
        if(pw === checkPw) {
            setCheckPwText('');
        }
    }, [checkPw])
    
    // 이메일 중복 확인
    const checkEmail = async () => {
        // 1. 이메일 유효성 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setCheckEmailText('올바른 이메일 형식이 아닙니다.');
            setEmailExists(true);
            return;
        }
    
        // 2. 유효한 이메일이면 서버에 중복 체크 요청
        try {
            const res = await fetch(`http://175.212.136.236:3001/users/exists/email?email=${email}`);
            const data = await res.json();
    
            if (data.exists === false) {
                setCheckEmailText('');
                setEmailExists(false);
            }
            if (data.exists === true) {
                setCheckEmailText('이미 사용중인 이메일입니다.');
                setEmailExists(true);
            }
        } catch (error) {
            console.error(error);
        }
    };    
    
    // 회원가입 - post
    const SignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // 비밀번호 확인 체크하기
        e.preventDefault()
        if (pw !== checkPw) {
            alert('비밀번호가 일치하지 않습니다.')
            return
        }
        
        try{
            const res = await fetch(`http://175.212.136.236:3001/users/`, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    "name": name,
                    "email": email,
                    "password": pw,
                    "role": "ADMIN"
                })
            });
            
            // 이메일 중복시
            if(res.status === 409){
                alert('중복된 이메일입니다.')
            }
            if(res.status === 201){
                alert('회원가입이 완료되었습니다.');
                router.push('/login');
            }
            console.log(res);
        }catch(error){
            console.error(error)
        }

    }

  return (
    <section className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            <span className="text-red-900">*</span>
            이메일 [예시: id@email.com]
          </label>
          <p className="text-red-900 mb-2 text-sm">{checkEmailText}</p>
          <input
            type="email"
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2                
                ${emailExists === true ? 'border-red-500 focus:ring-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.3)]' : 'border-gray-300'}
            `}
            value={email}
            onChange={handleEmail}
            onBlur={() => checkEmail()}
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
            onChange={handlePw}
          />
        </div>
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
                <span className="text-red-900">*</span>
                비밀번호 확인
            </label>
            <p className="text-red-900 mb-2 text-sm">{checkPwText}</p>
            <input
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                value={checkPw}
                onChange={handleCheckPw}
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
            value={name}
            onChange={handleName}
          />
        </div>
        <div className="pt-4">
          <button
            type="button"
            className="w-full bg-violet-400 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
            onClick={SignUp}
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