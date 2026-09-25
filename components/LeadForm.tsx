'use client';

import { useState } from 'react';

export default function LeadForm({ placeId }: { placeId: string }) {
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
      <p className="text-green-600 text-sm mt-3">
        Заявка отправлена! Мы свяжемся с вами в ближайшее время.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <input
        type="text"
        placeholder="Ваше имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="Телефон или Telegram"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
      <textarea
        placeholder="Комментарий (необязательно)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
        rows={2}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-black text-white rounded-lg py-2 text-sm hover:bg-gray-800 disabled:opacity-50"
      >
        {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
      </button>
      {status === 'error' && (
        <p className="text-red-500 text-sm">Что-то пошло не так, попробуйте ещё раз</p>
      )}
    </form>
  );
}
