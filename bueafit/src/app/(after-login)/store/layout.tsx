import MainNav from "@/app/components/MainNav"

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="flex">
        <MainNav />
        <main className="w-[calc(100%-350px)]">
          {children}
        </main>
      </div>
    )
  }