// app/store/[name]/page.tsx
interface StorePageProps {
    params: { name: string };
}

export default async function StorePage({ params }: StorePageProps) {
    const storeName = (await params).name;

    return (
        <div>
            <h1>{storeName} 가게 관리 페이지입니다.</h1>
        </div>
    );
}
