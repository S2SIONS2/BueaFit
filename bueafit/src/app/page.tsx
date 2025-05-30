'use client'

import { useRouter } from "next/navigation";
import LoginNav from "./components/LoginNav";
import Image from "next/image";
import { useEffect, useRef } from "react";

// gsap
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 이미지 경로
import main from '../../public/BueaFit.png'
import reserve from '../../public/ReserveImage.png'
import chart from '../../public/chart.png'
import customer from '../../public/CustomerImage.png'
import menu from '../../public/MenuImage.png'
import code from '../../public/CodeImage.png'
import Footer from "./components/Footer";

export default function Home() {
    const route = useRouter();

    // 로그인 됐을 때 페이지 못오게 이동
    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = sessionStorage.getItem("refresh_token");
            if (token) {
                route.back();
            }
        }
    }, []);

    // gsap 애니메이션
    const bounceRef1 = useRef<HTMLSpanElement>(null); // "뷰"
    const bounceRef2 = useRef<HTMLDivElement>(null);  // "티 전문 사장님에게"
    const bounceRef3 = useRef<HTMLSpanElement>(null); // "핏"
    const bounceRef4 = useRef<HTMLDivElement>(null);  // "한 가게 관리 시스템"

    const introText = useRef<HTMLDivElement>(null) // 인트로 문장
    const introText2 = useRef<HTMLDivElement>(null) // 인트로 문장

    const appearanceText = useRef<HTMLDivElement>(null) 
    const appearanceText2 = useRef<HTMLDivElement>(null) 

    // 기능 설명
    const sections = useRef<NodeListOf<Element> | null>(null);
    
    // 스크롤 트리거
    gsap.registerPlugin(ScrollTrigger);

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
                        duration: 0.3,
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
                        duration: 0.3,
                        ease: 'bounce.out',
                        delay: 2.8 + i * 0.04,
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

        // BueaFit, 뷰티샵 사장님을 위한 Perfect Fit ~~~
        if (appearanceText.current) {
            gsap.fromTo(
                appearanceText.current,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: appearanceText.current,
                        start: "top 60%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }

        if (appearanceText2.current) {
            gsap.fromTo(
                appearanceText2.current,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: appearanceText2.current,
                        start: "top 30%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }

    }, []);

    useEffect(() => {
        // const ctx: gsap.Context | null = null;
        // let scrollTriggerInstance: ScrollTrigger | null = null;

        const initGsap = () => {
            const allSections = document.querySelectorAll(".feature-slide");
            sections.current = allSections;

            // 첫 섹션은 보이도록
            if (allSections[0]) {
                const el = allSections[0] as HTMLElement;
                el.style.opacity = '1';
                el.classList.remove("opacity-0");
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".features-wrapper",
                    start: "top top",
                    end: "+=" + window.innerHeight * (allSections.length - 1),
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                    id: "feature-scroll",
                },
            });

            allSections.forEach((section, i) => {
                tl.to(section, { opacity: 0, duration: 0.3 }, i);
                if (i + 1 < allSections.length) {
                    tl.fromTo(
                        allSections[i + 1],
                        { opacity: 0 },
                        { opacity: 1, duration: 0.3 },
                        i + 0.3
                    );
                }
            });

            // const scrollTriggerInstance = tl.scrollTrigger!;
        };

        const killGsap = () => {
            ScrollTrigger.getById("feature-scroll")?.kill(true);
            gsap.killTweensOf(".feature-slide");
            sections.current?.forEach((el) => {
                (el as HTMLElement).style.opacity = "1";
            });
        };

        const handleResize = () => {
            if (window.innerWidth >= 768) {
                if (!ScrollTrigger.getById("feature-scroll")) {
                    initGsap();
                }
            } else {
                killGsap();
            }
        };

        if (typeof window !== "undefined") {
            // 최초 실행
            handleResize();

            // 창 크기 변경 대응
            window.addEventListener("resize", handleResize);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            killGsap();
        };
    }, []);

    // 하단 가입 권유 섹션 애니메이션
    const ctaWrapperRef = useRef<HTMLDivElement>(null);
    const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
    const ctaParagraphRef = useRef<HTMLParagraphElement>(null);
    const ctaButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!ctaWrapperRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ctaWrapperRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });

        tl.fromTo(
            ctaWrapperRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        )
        .fromTo(
            ctaHeadingRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.4"
        )
        .fromTo(
            ctaParagraphRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.3"
        )
        .fromTo(
            ctaButtonRef.current,
            { opacity: 0, scale: 0.8 },
            { 
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "bounce.out",
                onComplete: () => {
                    gsap.to(ctaButtonRef.current, {
                        boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)",
                        repeat: -1,
                        yoyo: true,
                        duration: 1.2,
                        ease: "power1.inOut",
                    });
                }
            },
            "-=0.2"
        );
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
                        className="rounded-2xl shadow-lg w-full h-auto object-cover border-5 border-black"
                    />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left space-y-4 px-4">
                    <h1 className="text-4xl font-bold text-gray-800 leading-snug">
                        <div className="flex md:justify-start sm:justify-center">
                            <span ref={bounceRef1} className="text-violet-400 inline-block">뷰</span>
                            <div ref={bounceRef2}>
                                {"티 전문 사장님에게".split("").map((char, index) => (
                                    <span key={index} style={{ display: 'inline-block', opacity: 0}}>
                                        {char === " " ? "\u00a0" : char}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex md:justify-start sm:justify-center">
                            <span ref={bounceRef3} className="text-violet-400 inline-block">핏</span>
                            <div ref={bounceRef4}>
                                {"한 가게 관리 시스템".split("").map((char, index) => (
                                    <span key={index} style={{ display: 'inline-block', opacity: 0 }}>
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
            <section className="h-[50vh] flex items-center flex-col justify-center opacity-[0]" ref={appearanceText}>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    &quot;BueaFit, 뷰티샵 사장님을 위한 Perfect Fit&ldquo;
                </h2>
                <p className="font-xl text-center">뷰티샵에 딱 맞춘 기능으로, 사장님이 운영에만 집중할 수 있게 도와드려요.</p>
            </section>

            {/* 기능 소개 영역 */}
            <section className="h-[50vh] flex items-center flex-col justify-center opacity-[0]" ref={appearanceText2}>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    이 모든 기능, 하나의 시스템으로
                </h2>
            </section>
            <article className="features-wrapper px-6 pb-20 mt-20 w-full min-h-screen md:w-1/1 lg:w-3/4 mx-auto md:relative">
                <div className="w-full h-full md:relative">
                    {[
                        { img: reserve, title: "스케줄 예약 관리", desc: "한눈에 보이는 UI로 월/주/일 단위 예약 스케줄을 직관적으로 확인하고, 효율적으로 관리하세요." },
                        // { img: reserveWeek, title: "스케줄 예약 관리", desc: "한눈에 보이는 UI로 월/주/일 단위 예약 스케줄을 직관적으로 확인하고, 효율적으로 관리하세요." },
                        // { img: reserveDay, title: "스케줄 예약 관리", desc: "한눈에 보이는 UI로 월/주/일 단위 예약 스케줄을 직관적으로 확인하고, 효율적으로 관리하세요." },
                        { img: chart, title: "매출 분석", desc: "일별·기간별 매출을 시각화된 차트로 확인하며, 수익 흐름을 빠르게 파악할 수 있습니다." },
                        { img: customer, title: "고객 정보 관리", desc: "간편하게 고객을 등록하고 시술 내역과 방문 기록을 빠르게 확인할 수 있습니다." },
                        { img: code, title: "직원 초대", desc: "초대 코드를 통해 직원 등록을 간편하게. 보안은 철저하게." },
                        { img: menu, title: "시술 메뉴 관리", desc: "다양한 시술 항목을 등록하고, 예약 시 빠르게 고객 맞춤 메뉴를 선택할 수 있습니다." }
                    ].map((item, i) => (
                        <section key={i} className="feature-slide top-0 left-0 w-full h-full flex flex-col md:flex-row items-center gap-6 min-h-screen px-4 md:absolute md:opacity-0">
                            <div className="w-full md:w-1/2 sm:flex sm:items-center sm:justify-center">
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    width={800}
                                    height={500}
                                    className="rounded-2xl shadow-lg w-full h-auto object-cover border-5 border-black sm:w-2/3 md:w-1/1 lg: w-1/1 "
                                />
                            </div>
                            <div className="w-full md:w-1/2 text-center md:text-left">
                                <h3 className="text-3xl font-semibold mt-4 mb-2 text-gray-800 sm:text-2xl">{item.title}</h3>
                                <p className="text-gray-600 text-base">{item.desc}</p>
                            </div>
                        </section>
                    ))}
                </div>
            </article>

            <section
                ref={ctaWrapperRef}
                className="bg-gradient-to-br from-violet-100 to-white py-20 px-6 text-center rounded-t-3xl shadow-inner"
                >
                <h2
                    ref={ctaHeadingRef}
                    className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6"
                >
                    지금 바로 BueaFit 시작해보세요
                </h2>
                <p
                    ref={ctaParagraphRef}
                    className="text-lg md:text-xl text-gray-600 mb-10"
                >
                    뷰티샵 운영에 딱 맞는 스마트한 시스템으로<br />
                    고객 관리부터 매출까지 한 번에 해결하세요.
                </p>
                <button
                    ref={ctaButtonRef}
                    className="bg-violet-500 text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:bg-violet-600 transition transform hover:scale-105 duration-300 cursor-pointer"
                    onClick={() => route.push("/signup")}
                >
                    무료로 시작하기
                </button>
                </section>

            <Footer />
        </div>
    );
}