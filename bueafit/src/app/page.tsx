import { redirect } from "next/navigation";
import LoginNav from "./components/LoginNav";
import { cookies } from "next/headers";
import Image from "next/image";

// 이미지 경로
import main from '../../public/BueaFit.png'

export default async function Home() {
  // 액세스 토큰 or 리프레시 토큰이 있을 때 로그인, 소개, 회원가입 페이지 못오게
  const refresh_token = (await (cookies())).get('refresh_token')
  if(refresh_token) {
      redirect('/store/main');
  }
  
  return (
    <div className="w-full h-full">
      <LoginNav />
      <section className="flex flex-col md:flex-row items-center justify-between px-6 py-12 bg-white">
        {/* Left Image */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <Image
            src={main}
            alt="뷰티샵 인테리어"
            width={800}
            height={500}
            className="rounded-2xl shadow-lg w-full h-auto object-cover border border-black border-5"
          />
        </div>

        {/* Right Text */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-4 px-4">
          <h1 className="text-4xl font-bold text-gray-800 ">
            <span className="text-violet-400">뷰</span>티 전문 사장님에게 <br />
            <span className="text-violet-400">핏</span>한 가게 관리 시스템
          </h1>
          <p className="text-lg text-gray-600">
            BueaFit은 뷰티 전문 사장님을 위한 맞춤형 가게 관리 솔루션입니다.
          </p>
          <p className="text-base text-gray-500">
            예약부터 매출, 고객 관리까지 한눈에, 손쉽게.
          </p>
          {/* <button className="mt-4 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition">
            지금 시작하기
          </button> */}
        </div>
      </section>
      <section>
        <h2>뷰핏의 주요 기능</h2>
        <ul>{/* 박스(카드) 형태로 */}
          <li>
            {/* {이미지} */}
            <p>예약 관리</p>
          </li>
          <li>
            {/* {이미지} */}
            <p>매출 확인 및 관리</p>
          </li>
          <li>
            {/* {이미지} */}
            <p>고객 관리</p>
          </li>
          <li>
            {/* {이미지} */}
            <p>가게 관리</p>
          </li>
        </ul>
      </section>
    </div>
  );
}
