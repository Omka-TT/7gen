import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { place_id, user_name, user_contact, message } = body;

    if (!user_name || !user_contact) {
      return NextResponse.json(
        { error: 'Заполните имя и контакт' },
        { status: 400 }
      );
    }

    const { error: dbError } = await supabase.from('leads').insert({
      place_id,
      user_name,
      user_contact,
      message,
    });

    if (dbError) {
      console.error('Ошибка сохранения в базу:', dbError);
      return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 });
    }

    const telegramText = `🔔 Новая заявка!\n\nИмя: ${user_name}\nКонтакт: ${user_contact}\nСообщение: ${message || 'не указано'}`;

    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: telegramText,
        }),
      }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Ошибка обработки заявки:', err);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}