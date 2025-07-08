import { NameDay, NAMEDAY_DATA, findNamesByDate, findDateByName, getTodayNameDays } from './nameday-data.js';

// Import all locale data files
const localeData = {
  cz: () => import('./data/cz.json', { with: { type: 'json' } }),
  hu: () => import('./data/hu.json', { with: { type: 'json' } }),
  bg: () => import('./data/bg.json', { with: { type: 'json' } }),
  pl: () => import('./data/pl.json', { with: { type: 'json' } }),
  at: () => import('./data/at.json', { with: { type: 'json' } }),
  hr: () => import('./data/hr.json', { with: { type: 'json' } }),
  ru: () => import('./data/ru.json', { with: { type: 'json' } }),
  gr: () => import('./data/gr.json', { with: { type: 'json' } }),
  fr: () => import('./data/fr.json', { with: { type: 'json' } }),
  it: () => import('./data/it.json', { with: { type: 'json' } }),
} as const;

export type Locale = 'sk' | keyof typeof localeData;

type JsonData = Record<string, string[]>;

const convert = (data: JsonData): NameDay[] =>
  Object.entries(data).map(([key, names]) => {
    const [month, day] = key.split('-').map(Number);
    return { month, day, names };
  });

// Cache for loaded data
const dataCache = new Map<Locale, NameDay[]>();

// Initialize Slovak data
dataCache.set('sk', NAMEDAY_DATA);

// Helper function to load locale data
async function getLocaleData(locale: Locale): Promise<NameDay[]> {
  if (dataCache.has(locale)) {
    return dataCache.get(locale)!;
  }

  if (locale === 'sk') {
    return NAMEDAY_DATA;
  }

  try {
    const module = await localeData[locale as keyof typeof localeData]();
    const data = convert(module.default as JsonData);
    dataCache.set(locale, data);
    return data;
  } catch (error) {
    throw new Error(`Failed to load locale data for ${locale}: ${error}`);
  }
}

// Helper function to validate locale
const isValidLocale = (locale: string): locale is Locale => {
  return locale === 'sk' || locale in localeData;
};

export const findNamesByDateLocale = async (locale: Locale, month: number, day: number): Promise<string[]> => {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}. Supported locales are: sk, ${Object.keys(localeData).join(', ')}`);
  }
  
  if (locale === 'sk') {
    return findNamesByDate(month, day);
  }
  
  const data = await getLocaleData(locale);
  const found = data.find(d => d.month === month && d.day === day);
  return found ? found.names : [];
};

export const findDateByNameLocale = async (locale: Locale, name: string): Promise<{ month: number; day: number } | null> => {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}. Supported locales are: sk, ${Object.keys(localeData).join(', ')}`);
  }
  
  if (locale === 'sk') {
    return findDateByName(name);
  }
  
  const data = await getLocaleData(locale);
  for (const item of data) {
    if (item.names.some(n => n.toLowerCase() === name.toLowerCase())) {
      return { month: item.month, day: item.day };
    }
  }
  return null;
};

export const getTodayNameDaysLocale = async (locale: Locale): Promise<{ names: string[]; date: string }> => {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}. Supported locales are: sk, ${Object.keys(localeData).join(', ')}`);
  }
  
  if (locale === 'sk') {
    return getTodayNameDays();
  }
  
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const names = await findNamesByDateLocale(locale, month, day);
  return { names, date: `${day}.${month}.` };
};
