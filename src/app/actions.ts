'use server';

import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import path from 'path';
import { writeFile } from 'fs/promises';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MINDEE_API_KEY = process.env.MINDEE_API_KEY!;

export async function scanReceipt(file: File) {
  // Save file locally
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name}`;
  const filePath = path.join('/tmp', filename);

  await writeFile(filePath, buffer);

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error('Failed to upload file to Supabase.');
  }

  // Send to Mindee
  const mindeeRes = await fetch('https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict', {
    method: 'POST',
    headers: {
      Authorization: `Token ${MINDEE_API_KEY}`,
    },
    body: (() => {
      const form = new FormData();
      form.append('document', buffer, file.name);
      return form;
    })(),
  });

  const json = await mindeeRes.json();
  const doc = json?.document?.inference?.prediction;

  return {
    date: doc?.date?.value ?? 'N/A',
    vendor: doc?.supplier?.value ?? 'N/A',
    total: doc?.total_incl?.value ? `$${doc.total_incl.value}` : '$N/A',
    tax: doc?.taxes?.[0]?.value ? `$${doc.taxes[0].value}` : '$N/A',
    category: doc?.category?.value ?? 'miscellaneous',
  };
}
