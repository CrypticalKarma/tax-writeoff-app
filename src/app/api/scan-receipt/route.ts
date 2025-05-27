// src/app/api/scan-receipt/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const mindeeRes = await fetch("https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.MINDEE_API_KEY}`,
    },
    body: (() => {
      const body = new FormData();
      body.append("document", new Blob([buffer]), file.name);
      return body;
    })(),
  });

  const json = await mindeeRes.json();

  return NextResponse.json(json);
}
