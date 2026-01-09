import type { ReactNode } from "react"
import { TelegramProvider } from "@/components/telegram/telegram-provider"
import { BottomNav } from "@/components/mini-app/bottom-nav"
import Script from "next/script"

export default function MiniAppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      <TelegramProvider>
        <div className="min-h-screen bg-background pb-20">
          <main className="mx-auto max-w-lg">{children}</main>
          <BottomNav />
        </div>
      </TelegramProvider>
    </>
  )
}
