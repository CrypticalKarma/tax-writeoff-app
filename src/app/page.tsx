// src/app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/scan-receipt', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setResponse(data);
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-xl mx-auto flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">Scan Receipt</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      >
        {loading ? 'Scanning...' : 'Upload Receipt'}
      </button>

      {response && (
        <pre className="bg-gray-100 p-4 rounded w-full text-sm overflow-x-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
