import Header from "@/components/header";
import Nav from "@/components/nav";
import { ReactNode, Suspense } from "react";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
        <Nav />
        <Suspense fallback={<div>Loading ...</div>}>
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