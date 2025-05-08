"use client";

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import LoadingSpinner from "@/components/LoadingSpinner";

export default function RefreshingPage() {
  const router = useRouter()
  const params = useSearchParams()
  const to = params.get("to") || "/"

  useEffect(() => {
    fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    })
    .then(res => {
        if (res.ok) {
          router.replace(to)
        } else {
          router.replace("/login")
        }
      })
      .catch(() => {
        router.replace("/login")
      })
  }, [router, to])

  return (
    <div className="w-dvw h-dvh flex items-center justify-center">
      <LoadingSpinner className="w-15 h-15"/>
    </div>
  )
}
