'use client'

import { redirect } from "next/navigation";
import LoginNav from "./components/LoginNav";
import Image from "next/image";
import { useEffect, useRef } from "react";

// gsap
import gsap from "gsap";

// 이미지 경로
import main from '../../public/BueaFit.png'
import reserve from '../../public/ReserveImage.png'
import chart from '../../public/chart.png'
import customer from '../../public/CustomerImage.png'
import menu from '../../public/MenuImage.png'
import code from '../../public/CodeImage.png'

export default function Home() {
    // 로그인 됐을 때 페이지 못오게 이동
    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = sessionStorage.getItem("refresh_token");
            if (token) {
                redirect("/selectstore");
            }
        }
    }, []);

    // gsap 애니메이션
    const bounceRef1 = useRef<HTMLSpanElement>(null); // "뷰"
    const bounceRef2 = useRef<HTMLDivElement>(null);  // "티 전문 사장님에게"
    const bounceRef3 = useRef<HTMLSpanElement>(null); // "핏"
    const bounceRef4 = useRef<HTMLDivElement>(null);  // "한 가게 관리 시스템"

    const introText = useRef<HTMLDivElement>(null)
    const introText2 = useRef<HTMLDivElement>(null)
    const introText3 = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // 뷰
        gsap.fromTo(
            bounceRef1.current,
            { y: 0 },
            { y: -30, duration: 0.3, ease: 'power2.out' }
        );
        gsap.to(
            bounceRef1.current,
            { y: 0, duration: 0.4, ease: 'bounce.out', delay: 0.3 }
        );

        // 티 전문 사장님에게
        if (bounceRef2.current) {
            const spans = bounceRef2.current.querySelectorAll('span');
            spans.forEach((el, i) => {
                gsap.fromTo(
                    el,
                    { y: 20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.4,
                        ease: 'bounce.out',
                        delay: 0.8 + i * 0.05,
                    }
                );
            });
        }

        // 핏
        gsap.fromTo(
            bounceRef3.current,
            { y: 0 },
            {
                y: -30,
                duration: 0.3,
                ease: 'power2.out',
                delay: 2,
            }
        );
        gsap.to(
            bounceRef3.current,
            {
                y: 0,
                duration: 0.4,
                ease: 'bounce.out',
                delay: 2.3,
            }
        );

        // 한 가게 관리 시스템
        if (bounceRef4.current) {
            const spans = bounceRef4.current.querySelectorAll('span');
            spans.forEach((el, i) => {
                gsap.fromTo(
                    el,
                    { y: 20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.4,
                        ease: 'bounce.out',
                        delay: 2.8 + i * 0.05,
                    }
                );
            });
        }

        const tl = gsap.timeline({delay: 3.55});
        
        if (introText.current) {
            tl.to(introText.current.querySelectorAll("span"), {opacity: 1, duration: 0.7, stagger: 0.03});
        }
        if (introText2.current) {
            tl.to(introText2.current.querySelectorAll("span"), {opacity: 1, duration: 0.7, stagger: 0.03})
        }
        if (introText3.current) {
            tl.to(introText3.current.querySelectorAll("span"), {opacity: 1, duration: 0.7, stagger: 0.03})
        }
    }, []);

    return (
        <div className="w-full h-full bg-white">
            <LoginNav />

            {/* 메인 소개 영역 */}
            <section className="flex flex-col items-center justify-evenly md:flex-row px-6 py-12 w-full h-screen">
                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                    <Image
                        src={main}
                        alt="뷰티샵 메인 이미지"
                        width={800}
                        height={500}
                        className="rounded-2xl shadow-lg w-full h-auto object-cover border border-black"
                    />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left space-y-4 px-4">
                    <h1 className="text-4xl font-bold text-gray-800 leading-snug">
                        <div className="flex md:justify-center">
                            <span ref={bounceRef1} className="text-violet-400 inline-block">뷰</span>
                            <div ref={bounceRef2}>
                                {"티 전문 사장님에게".split("").map((char, index) => (
                                    <span key={index} style={{ display: 'inline-block' }}>
                                        {char === " " ? "\u00a0" : char}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex">
                            <span ref={bounceRef3} className="text-violet-400 inline-block">핏</span>
                            <div ref={bounceRef4}>
                                {"한 가게 관리 시스템".split("").map((char, index) => (
                                    <span key={index} style={{ display: 'inline-block' }}>
                                        {char === " " ? "\u00a0" : char}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </h1>
                    <p className="text-lg text-gray-600" ref={introText}>
                        {"BueaFit은 뷰티샵 운영을 더 쉽고 똑똑하게 만들어주는 올인원 솔루션입니다.".split("").map((char, index) => (
                            <span key={index} style={{ display: 'inline-block' }} className="opacity-0">
                                {char === " " ? "\u00a0" : char}
                            </span>
                        ))}
                    </p>
                    <p className="text-base text-gray-500" ref={introText2}>
                        {"예약, 매출, 고객 관리까지 한눈에 확인하고, 더 나은 경영에 집중하세요.".split("").map((char, index) => (
                            <span key={index} style={{ display: 'inline-block' }} className="opacity-0">
                                {char === " " ? "\u00a0" : char}
                            </span>
                        ))}
                    </p>
                </div>
            </section>
            <section className="h-[50vh] flex items-center flex-col justify-center">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    &quot;BueaFit, 뷰티샵 사장님을 위한 Perfect Fit&ldquo;
                </h2>
                <p className="font-xl text-center">뷰티샵에 딱 맞춘 기능으로, 사장님이 운영에만 집중할 수 있게 도와드려요.</p>
            </section>

            {/* 기능 소개 영역 */}
            <article className="px-6 pb-20 mt-20 w-full md:w-3/4 m-[auto]">
                <section className="flex flex-col md:flex-row items-center gap-6 mb-16">
                <div className="w-full md:w-1/2">
                    <Image
                        src={reserve}
                        alt="예약 관리 이미지"
                        width={800}
                        height={500}
                        className="rounded-2xl shadow-lg w-full h-auto object-cover border border-black"
                    />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-3xl font-semibold mt-4 mb-2 text-gray-800">스케줄 예약 관리</h3>
                    <p className="text-gray-600 text-base">
                        한눈에 보이는 UI로 <strong>월/주/일 단위 예약 스케줄</strong>을 직관적으로 확인하고, 효율적으로 관리하세요.
                    </p>
                </div>
                </section>

                <section className="flex flex-col md:flex-row items-center gap-6 mb-16">
                <div className="w-full md:w-1/2">
                    <Image
                        src={chart}
                        alt="매출 확인 등 차트 이미지"
                        width={800}
                        height={500}
                        className="rounded-2xl shadow-lg w-full h-auto object-cover border border-black"
                    />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-3xl font-semibold mt-6 mb-2 text-gray-800">매출 분석</h3>
                    <p className="text-gray-600 text-base">
                        <strong>일별·기간별 매출</strong>을 시각화된 차트로 확인하며, 수익 흐름을 빠르게 파악할 수 있습니다.
                    </p>
                </div>
                </section>

                <section className="flex flex-col md:flex-row items-center gap-6 mb-16">
                <div className="w-full md:w-1/2">
                    <Image
                        src={customer}
                        alt="고객 관리 이미지"
                        width={800}
                        height={500}
                        className="rounded-2xl shadow-lg w-full h-auto object-cover border border-black"
                    />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-3xl font-semibold mt-6 mb-2 text-gray-800">고객 정보 관리</h3>
                    <p className="text-gray-600 text-base">
                        간편하게 고객을 등록하고 <strong>시술 내역과 방문 기록</strong>을 빠르게 확인할 수 있습니다.
                    </p>
                </div>
                </section>

                <section className="flex flex-col md:flex-row items-center gap-6 mb-16">
                <div className="w-full md:w-1/2">
                    <Image
                        src={code}
                        alt="직원 등록 이미지"
                        width={800}
                        height={500}
                        className="rounded-2xl shadow-lg w-full h-auto object-cover border border-black"
                    />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-3xl font-semibold mt-6 mb-2 text-gray-800">직원 초대</h3>
                    <p className="text-gray-600 text-base">
                        <strong>초대 코드</strong>를 통해 직원 등록을 간편하게. 보안은 철저하게.
                    </p>
                </div>
                </section>

                <section className="flex flex-col md:flex-row items-center gap-6 mb-16">
                <div className="w-full md:w-1/2">
                    <Image
                        src={menu}
                        alt="시술 메뉴 이미지"
                        width={800}
                        height={500}
                        className="rounded-2xl shadow-lg w-full h-auto object-cover border border-black"
                    />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-3xl font-semibold mt-6 mb-2 text-gray-800">시술 메뉴 관리</h3>
                    <p className="text-gray-600 text-base">
                        다양한 시술 항목을 등록하고, 예약 시 빠르게 <strong>고객 맞춤 메뉴</strong>를 선택할 수 있습니다.
                    </p>
                </div>
                </section>
            </article>
        </div>
    );
}