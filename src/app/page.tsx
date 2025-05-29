'use client';

import { useState, FormEvent } from 'react';
import { scanReceipt } from './actions';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    date: string;
    vendor: string;
    total: string;
    tax: string;
    category: string;
  }>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file') as File;

    if (!file) return alert('Please select a file.');

    setLoading(true);

    const res = await scanReceipt(file);
    setResult(res);
    setLoading(false);
  }

  return (
    <main style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Upload Receipt</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" name="file" accept="image/*" />
        <button type="submit" style={{ marginLeft: 12 }}>
          {loading ? 'Scanning...' : 'Scan Receipt'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 30 }}>
          <h2>Scanned Data</h2>
          <p>Date: {result.date}</p>
          <p>Vendor: {result.vendor}</p>
          <p>Total: {result.total}</p>
          <p>Tax: {result.tax}</p>
          <p>Category: {result.category}</p>
        </div>
      )}
    </main>
  );
}
