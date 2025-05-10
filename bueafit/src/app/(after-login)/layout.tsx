import LoadingSpinner from "@/components/LoadingSpinner";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { cookies } from "next/headers";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value;
  // const refresh_token = (await cookieStore).get("refresh_token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    console.log(1)
    redirect('/auth/refreshing')
    // const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/refresh`, {    
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${refresh_token}`,
    //   },
    //   cache: "no-store",
    // });

    // if (refreshRes.status === 401) {
    //   redirect("/login");
    // }
  }

  console.log(2)

  return (
    <Suspense fallback={<div className="w-dvw h-dvh"> <LoadingSpinner /> </div>}>
      <div>
        {children}
      </div>
    </Suspense>
  );
}