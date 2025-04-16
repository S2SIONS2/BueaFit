import LoginNav from "@/components/loginNav";
import { ReactNode, Suspense } from "react";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
        <LoginNav />
        <Suspense fallback={<div>Loading ...</div>}>
            {children}
        </Suspense>
    </div>
  );
}