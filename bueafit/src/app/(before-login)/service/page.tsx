export default function Page() {
    return (
        <div className="w-full h-[calc(100%-120px)] mx-auto flex flex-col items-center">
            <div className="w-[80%] p-10">
                <h1 className="font-bold text-2xl mb-5">이용약관</h1>
                <div className="flex flex-col space-y-2">
                    <p>
                        본 서비스는 무료로 제공되며, 누구나 이메일과 별명을 통해 회원 가입할 수 있습니다.
                    </p>
                    <p>
                        운영자는 서비스의 일부 또는 전부를 사전 통보 없이 변경하거나 종료할 수 있으며, 서비스 종료 시 사용자의 데이터는 파기 또는 요청 시 반환됩니다.
                    </p>
                    <p>
                        사용자는 언제든지 자신의 정보를 열람, 수정, 삭제할 수 있으며, 본 약관은 향후 필요에 따라 수정될 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    )
}