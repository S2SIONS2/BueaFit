import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops`, {
    method: "GET",
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const shops = await res.json();

  if (shops.length === 0) {
    return redirect("/setstore");
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          관리하실 가게를 선택해주세요.
        </h2>
        <ul className="space-y-4">
          {shops.length > 0 && shops.map((shop: { id: string; name: string }) => (
            <li key={shop.id}>
              <Link
                href={`/store/${encodeURIComponent(shop.name)}`}
                className="block w-full text-center bg-violet-300 hover:bg-violet-400 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
              >
                {shop.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>      
    </section>
  );
}
