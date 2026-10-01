'use client';

import { useState } from 'react';

type Labels = {
  name: string;
  contact: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
};

export default function LeadForm({ placeId, labels }: { placeId: string; labels: Labels }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          place_id: placeId,
          user_name: name,
          user_contact: contact,
          message,
        }),
      });

      if (!res.ok) throw new Error();

      setStatus('success');
      setName('');
      setContact('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <p className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">{labels.success}</p>
    );
  }

  const inputClass =
    'w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-red-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder={labels.name}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={inputClass}
      />
      <input
        type="text"
        placeholder={labels.contact}
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
        className={inputClass}
      />
      <textarea
        placeholder={labels.message}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={inputClass}
        rows={3}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg disabled:opacity-50"
      >
        {status === 'loading' ? labels.sending : labels.submit}
      </button>
      {status === 'error' && <p className="text-sm text-red-600">{labels.error}</p>}
    </form>
  );
}

