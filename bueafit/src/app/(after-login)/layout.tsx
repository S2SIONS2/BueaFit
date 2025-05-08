import Header from "@/components/header";
import LoadingSpinner from "@/components/LoadingSpinner";

import Nav from "@/components/nav";
import { ReactNode, Suspense } from "react";

export default async function Layout({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <div className="flex min-h-screen">
        <Nav />
        <Suspense fallback={<div className="w-dvw h-dvh"> <LoadingSpinner /> </div>}>
            <div className="flex flex-col w-[calc(100vw-350px)]">
                <Header />
                <main>
                    {children}
                </main>
            </div>
        </Suspense>
    </div>
  );
}