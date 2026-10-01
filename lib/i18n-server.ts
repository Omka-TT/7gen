import { cookies } from 'next/headers';
import { LANGS, type Lang } from './i18n';

export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get('lang')?.value;
  return LANGS.includes(value as Lang) ? (value as Lang) : 'ru';
}