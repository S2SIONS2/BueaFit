import { redirect } from "next/navigation";
import LoginNav from "./components/LoginNav";
import { cookies } from "next/headers";

export default async function Home() {
  // 액세스 토큰 or 리프레시 토큰이 있을 때 로그인, 소개, 회원가입 페이지 못오게
  const refresh_token = (await (cookies())).get('refresh_token')
  if(refresh_token) {
      redirect('/store/main');
  }
  
  return (
    <div>
      <LoginNav />
      소개페이지
    </div>
  );
}
