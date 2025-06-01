# BueaFit

뷰티샵 원장님을 위한 예약 및 매출 관리 웹 애플리케이션입니다.  
고객 관리, 시술 관리, 예약 등록, 매출 통계 기능을 통합하여  
샵 운영의 효율성을 높이는 데 목적이 있습니다.

## 주요 기능

- JWT 기반 회원 인증 및 초대 코드 회원가입
- 예약 등록 및 FullCalendar 기반 스케줄 시각화
- 고객 및 시술 항목 관리
- 일 매출 및 시술별 매출 통계 확인 (개발 중)

## 기술 스택

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Zustand
- **Backend**: FastAPI
- **Auth**: JWT + Refresh Token
- **Calendar**: FullCalendar

## 로컬 실행 방법

```bash
# 1. 레포지토리 클론
git clone https://github.com/S2SIONS2/bueafit.git
cd bueafit

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
