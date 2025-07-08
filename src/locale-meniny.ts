import { NameDay, MENINY_DATA, findNamesByDate, findDateByName, getTodayNameDays } from './meniny-data.js';
import czData from './data/cz.json' with { type: 'json' };
import huData from './data/hu.json' with { type: 'json' };
import bgData from './data/bg.json' with { type: 'json' };
import plData from './data/pl.json' with { type: 'json' };
import atData from './data/at.json' with { type: 'json' };
import hrData from './data/hr.json' with { type: 'json' };
import ruData from './data/ru.json' with { type: 'json' };
import grData from './data/gr.json' with { type: 'json' };
import frData from './data/fr.json' with { type: 'json' };
import itData from './data/it.json' with { type: 'json' };

export type Locale =
  | 'sk'
  | 'cz'
  | 'pl'
  | 'hu'
  | 'at'
  | 'hr'
  | 'bg'
  | 'ru'
  | 'gr'
  | 'fr'
  | 'it';

type JsonData = Record<string, string[]>;

const convert = (data: JsonData): NameDay[] =>
  Object.entries(data).map(([key, names]) => {
    const [month, day] = key.split('-').map(Number);
    return { month, day, names };
  });

const DATA_MAP: Record<Locale, NameDay[]> = {
  sk: MENINY_DATA,
  cz: convert(czData as JsonData),
  pl: convert(plData as JsonData),
  hu: convert(huData as JsonData),
  at: convert(atData as JsonData),
  hr: convert(hrData as JsonData),
  bg: convert(bgData as JsonData),
  ru: convert(ruData as JsonData),
  gr: convert(grData as JsonData),
  fr: convert(frData as JsonData),
  it: convert(itData as JsonData),
};

export const findNamesByDateLocale = (locale: Locale, month: number, day: number): string[] => {
  if (locale === 'sk') return findNamesByDate(month, day);
  const data = DATA_MAP[locale];
  const found = data.find(d => d.month === month && d.day === day);
  return found ? found.names : [];
};

export const findDateByNameLocale = (locale: Locale, name: string): { month: number; day: number } | null => {
  if (locale === 'sk') return findDateByName(name);
  const data = DATA_MAP[locale];
  for (const item of data) {
    if (item.names.some(n => n.toLowerCase() === name.toLowerCase())) {
      return { month: item.month, day: item.day };
    }
  }
  return null;
};

export const getTodayNameDaysLocale = (locale: Locale): { names: string[]; date: string } => {
  if (locale === 'sk') return getTodayNameDays();
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  return { names: findNamesByDateLocale(locale, month, day), date: `${day}.${month}.` };
};
