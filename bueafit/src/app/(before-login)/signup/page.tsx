'use client';

import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    const [emailExists, setEmailExists] = useState(false)

    const [step, setStep] = useState(1);
    const [inviteCode, setInviteCode] = useState('')

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/users/exists/email?email=${email}`);
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
    
    // 사장님 회원가입 - post
    const SignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // 비밀번호 확인 체크하기
        e.preventDefault()
        if (pw !== checkPw) {
            alert('비밀번호가 일치하지 않습니다.')
            return
        }
        
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/users/`, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    "name": name,
                    "email": email,
                    "password": pw,
                    "role": "MASTER"
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
        }catch(error){
            console.error(error)
        }
    }

    // 직원 회원가입 - post
    const SignUpManager = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // 비밀번호 확인 체크하기
        e.preventDefault()
        if (pw !== checkPw) {
            alert('비밀번호가 일치하지 않습니다.')
            return
        }
        
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/users/`, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    "name": name,
                    "email": email,
                    "password": pw,
                    "role": "MANAGER",
                    "invite_code": inviteCode
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
        }catch(error){
            console.error(error)
        }
    }

  const renderIntroSteps = () => (
    <div className="bg-gray-50 bg-opacity-40 flex items-center justify-center z-10">            
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full text-center">
            {step === 1 &&(
                <>
                <h2 className="text-xl font-bold mb-4">안녕하세요. 환영합니다.</h2>
                <p className="text-gray-600 mb-6">사장님이신가요?</p>
                <button
                    onClick={() => setStep(2)}
                    className="w-full border border-gray-300 text-black px-6 py-2 rounded-lg hover:bg-violet-400 hover:text-white transition cursor-pointer mb-2"
                >
                    네, 사장입니다.
                </button>
                <button
                    onClick={() => setStep(3)}
                    className="w-full border border-gray-300 text-black px-6 py-2 rounded-lg hover:bg-violet-400 hover:text-white transition cursor-pointer"
                >
                    아니오, 직원입니다.
                </button>
                </>
            )}
        </div>
    </div>
  );
  
  // 사장님 회원가입
  const renderBossSignUp = () => (
    <div className="min-w-md p-6 bg-white rounded-2xl shadow-md overflow-auto">
      <button
          type="button"
          onClick={() => setStep(1)}
          className="flex items-center gap-2 text-gray-600 hover:text-violet-500 text-sm cursor-pointer"
      >
          <FontAwesomeIcon icon={faCircleLeft} />
          <span>이전으로</span>
      </button>
        <h2 className="text-2xl font-bold mb-6 text-center">사장님 회원가입</h2>
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
    </div>
  )
  // 직원 회원가입
  const renderManagerSignUp= () => (
    <div className="min-w-md p-6 bg-white rounded-2xl shadow-md overflow-auto">
      <button
          type="button"
          onClick={() => setStep(1)}
          className="flex items-center gap-2 text-gray-600 hover:text-violet-500 text-sm cursor-pointer"
      >
          <FontAwesomeIcon icon={faCircleLeft} />
          <span>이전으로</span>
      </button>
        <h2 className="text-2xl font-bold mb-6 text-center">직원 회원가입</h2>
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
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              <span className="text-red-900">*</span>
              초대 코드
              </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
          </div>
          <div className="pt-4">
            <button
              type="button"
              className="w-full bg-violet-400 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
              onClick={SignUpManager}
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
    </div>
  )

  return (
    <section className="w-full h-[calc(100%-120px)] mx-auto flex flex-col items-center justify-center p-3">
      {
        step === 1 && renderIntroSteps()
      }
      {
        step === 2 && renderBossSignUp()
      }
      {
        step === 3 && renderManagerSignUp()
      }
      
    </section>
  )
}