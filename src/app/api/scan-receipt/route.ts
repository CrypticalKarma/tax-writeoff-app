import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const mindeeForm = new FormData();
  mindeeForm.append('document', file);

  const mindeeRes = await fetch('https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict', {
    method: 'POST',
    headers: {
      Authorization: `Token be6329d6214fe70beaf4d63823277b8e`,
    },
    body: mindeeForm,
  });

  const result = await mindeeRes.json();

  return NextResponse.json(result);
}
