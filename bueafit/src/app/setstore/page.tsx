'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function StoreRegistrationPage() {
    // router
    const router = useRouter();

    // ux - step
    // 1: 인트로, 2: 가게 등록 안내, 3: 가게 등록 폼, 4: 추가 정보 안내, 5: 추가 정보 폼, 6: 완료
    const [step, setStep] = useState(1);

    // 가게 등록 정보
    const [storeName, setStoreName] = useState('');
    const [address, setAddress] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [phone, setPhone] = useState('');
    const [businessNumber, setBusinessNumber] = useState('');

    // 가게 등록 조건 체크
    const checkRequired = () => {
        if (!storeName || !address) {
            alert('가게 이름과 주소 작성은 필수입니다.');
            return false;
        }
        return true;
    };

    // 가게 등록
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(confirm('가게를 등록하시겠습니까?')) {    
            // 등록 조건 체크 생략 가능
            const response = await fetch(`/api/shop/post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                name: storeName,
                address,
                address_detail: addressDetail,
                phone,
                business_number: businessNumber,
            }),
        });

            const data = response;

            if(data.status === 201) {
                setStep(6);
            }
        }
    };

    const renderIntroSteps = () => (
        <div className="absolute inset-0 bg-gray-50 bg-opacity-40 flex items-center justify-center z-10">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full text-center">
                {step === 1 && (
                    <>
                    <h2 className="text-xl font-bold mb-4">안녕하세요 사장님! 👋</h2>
                    <p className="text-gray-600 mb-6">BueaFit 사용이 처음이시군요!</p>
                    <button
                        onClick={() => setStep(2)}
                        className="bg-violet-400 text-white px-6 py-2 rounded-lg hover:bg-violet-600 transition cursor-pointer"
                    >
                        다음
                    </button>
                    </>
                )}
                {step === 2 && (
                    <>
                    <h2 className="text-xl font-bold mb-4">등록된 가게 정보가 없어요.</h2>
                    <p className="text-gray-600 mb-6">가게 등록을 위한 작성을 부탁드려요.</p>
                    <button
                        onClick={() => setStep(3)}
                        className="bg-violet-400 text-white px-6 py-2 rounded-lg hover:bg-violet-600 transition cursor-pointer"
                    >
                        작성하러 가기
                    </button>
                    </>
                )}
            </div>
        </div>
    );

    const renderStep3Form = () => (
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">가게 등록</h2>
            <form className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    <span className="text-red-900">*</span> 가게 이름
                </label>
                <input
                    type="text"
                    placeholder="가게 이름"
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400"
                />

                <label className="block text-sm font-medium text-gray-700">
                    <span className="text-red-900">*</span> 가게 주소
                </label>
                <input
                    type="text"
                    placeholder="가게 주소"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400"
                />

                <button
                    type="button"
                    onClick={() => checkRequired() && setStep(4)}
                    className="w-full bg-violet-400 text-white px-6 py-2 rounded-lg hover:bg-violet-600 transition cursor-pointer"
                >
                    다음
                </button>
            </form>
        </div>
    );

    const renderStep4Modal = () => (
        <div className="absolute inset-0 bg-gray-50 bg-opacity-40 flex items-center justify-center z-10">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full text-center">
            <div className='w-full text-left mb-4'>
                <button onClick={() => setStep(3)} className='text-sm hover:text-base transition cursor-pointer'>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="text-gray-600 ml-1">뒤로가기</span>
                </button>
            </div>
            <h2 className="text-xl font-bold mb-4">아직 기록할 수 있는 정보가 남아있어요.</h2>
            <p className="text-gray-600 mb-6">BueaFit의 원활한 사용을 위해 남겨주세요.</p>

            <button
                onClick={() => setStep(5)}
                className="w-full mb-4 bg-violet-400 text-white px-6 py-3 rounded-lg hover:bg-violet-600 transition cursor-pointer"
            >
                추가 등록하기
            </button>
            <button
                onClick={handleSubmit}
                className="w-full bg-gray-400 text-white font-semibold py-3 rounded-lg hover:bg-gray-500 transition cursor-pointer"
            >
                건너뛰기
            </button>
            </div>
        </div>
    );

    const renderStep5Form = () => (
        <div className="absolute inset-0 bg-gray-50 bg-opacity-40 flex items-center justify-center z-10">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">상세 주소</label>
                <input
                type="text"
                placeholder="상세 주소"
                value={addressDetail}
                onChange={e => setAddressDetail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400"
                />

                <label className="block text-sm font-medium text-gray-700">전화번호</label>
                <input
                type="text"
                placeholder="전화번호"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400"
                />

                <label className="block text-sm font-medium text-gray-700">사업자 등록번호</label>
                <input
                type="text"
                placeholder="사업자 등록번호"
                value={businessNumber}
                onChange={e => setBusinessNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400"
                />

                <button
                type="submit"
                className="w-full bg-violet-400 text-white font-semibold py-3 rounded-lg hover:bg-violet-400 transition cursor-pointer"
                >
                등록
                </button>
            </form>
            </div>
        </div>
    );

    const renderStep6Complete = () => (
        <div className="absolute inset-0 bg-gray-50 bg-opacity-40 flex items-center justify-center z-10">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full text-center">
                <h2 className="text-xl font-bold mb-4">가게 등록이 완료되었습니다! 🎉</h2>
                <p className="text-gray-600 mb-6">BueaFit을 통해 가게를 관리해보세요!</p>
                <button
                    onClick={() => router.push('/selectstore')}
                    className="w-full bg-violet-400 text-white mb-4 px-6 py-2 rounded-lg hover:bg-violet-600 transition cursor-pointer"
                >
                    확인
                </button>
                <button
                    onClick={() => router.refresh()}
                    className="w-full bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
                >
                    추가 등록하기
                </button>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-50 p-4">
            {step < 3 && renderIntroSteps()}
            {step === 3 && renderStep3Form()}
            {step === 4 && renderStep4Modal()}
            {step === 5 && renderStep5Form()}
            {step === 6 && renderStep6Complete()}
        </div>
    );
}
