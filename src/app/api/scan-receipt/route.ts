import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge" // enables faster serverless execution

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("document") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  try {
    const buffer = await file.arrayBuffer()

    const mindeeResponse = await fetch("https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.MINDEE_API_KEY}`,
      },
      body: buffer,
    })

    if (!mindeeResponse.ok) {
      const errorText = await mindeeResponse.text()
      return NextResponse.json({ error: "Mindee error", details: errorText }, { status: 500 })
    }

    const result = await mindeeResponse.json()

    return NextResponse.json(result)
  } catch (err) {
    console.error("Mindee upload error:", err)
    return NextResponse.json({ error: "Failed to scan receipt" }, { status: 500 })
  }
}
