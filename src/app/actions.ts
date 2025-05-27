'use server';

export async function uploadReceipt(formData: FormData) {
  const file = formData.get('file') as File;

  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  const res = await fetch('https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict', {
    method: 'POST',
    headers: {
      Authorization: 'Token be6329d6214fe70beaf4d63823277b8e',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      document: base64,
    }),
  });

  const data = await res.json();
  return data;
}
