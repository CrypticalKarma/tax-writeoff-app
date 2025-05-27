"use client"

import Image from "next/image"
import { createClient } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [parsedData, setParsedData] = useState<any>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("document", file)

    setUploading(true)
    try {
      const response = await fetch("/api/scan-receipt", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      setParsedData(result)
    } catch (error) {
      console.error("❌ Error uploading file:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-2xl">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {/* Login status */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          {user ? `Logged in as: ${user.email}` : "Not logged in."}
        </p>

        {/* File upload */}
        {user && (
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">Upload a receipt</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
            />
            {uploading && <p className="mt-2 text-sm text-blue-500">Uploading and scanning...</p>}
          </div>
        )}

        {/* Parsed response preview */}
        {parsedData && (
          <div className="w-full mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-semibold mb-2">🧾 Receipt Preview</h3>
            <pre className="text-sm whitespace-pre-wrap break-words overflow-x-auto">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </div>
        )}
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  )
}
