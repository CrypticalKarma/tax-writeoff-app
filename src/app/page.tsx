'use client';

import { useState } from 'react';
import { uploadReceipt } from './actions';

export default function Home() {
  const [receiptData, setReceiptData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const data = await uploadReceipt(formData);
    setReceiptData(data);
    setLoading(false);
  }

  const fields = receiptData?.document?.inference?.prediction;

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Receipt</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" name="file" accept="image/*,application/pdf" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Scanning...' : 'Scan Receipt'}
        </button>
      </form>

      {fields && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Scanned Data</h2>
          <ul className="space-y-1">
            <li><strong>Date:</strong> {fields.date?.value || 'N/A'}</li>
            <li><strong>Vendor:</strong> {fields.supplier?.value || 'N/A'}</li>
            <li><strong>Total:</strong> ${fields.total_incl?.value || 'N/A'}</li>
            <li><strong>Category:</strong> {fields.category?.value || 'N/A'}</li>
            <li><strong>Tax:</strong> ${fields.total_tax?.value || 'N/A'}</li>
          </ul>
        </div>
      )}
    </main>
  );
}
