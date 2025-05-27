'use server';

import { createServerAction } from 'zsa';
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const scanReceipt = createServerAction(async (_input, formData) => {
  const file: File | null = formData.get('file') as unknown as File;

  if (!file) return { error: 'No file uploaded' };

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const response = await fetch(
    'https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict',
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${process.env.MINDEE_API_KEY}`,
      },
      body: (() => {
        const form = new FormData();
        form.append('document', new Blob([buffer]), file.name);
        return form;
      })(),
    }
  );

  const data = await response.json();

  const doc = data?.document?.inference?.prediction;

  const receiptData = {
    date: doc?.date?.value || null,
    vendor: doc?.supplier?.value || null,
    total: doc?.total_incl?.value || null,
    tax: doc?.taxes?.[0]?.value || null,
    category: doc?.category?.value || null,
  };

  const { error } = await supabase.from('receipts').insert(receiptData);

  if (error) {
    return { error: 'Failed to save to database' };
  }

  return receiptData;
});
