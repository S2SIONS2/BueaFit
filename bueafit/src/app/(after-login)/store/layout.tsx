import MainNav from "@/app/components/MainNav"

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="flex w-screen h-screen overflow-hidden">
        <MainNav />
        <main className="w-[calc(100%-350px)] overflow-auto">
          {children}
        </main>
      </div>
    )
  }