// Data structure for name days
export interface NameDay {
  month: number;
  day: number;
  names: string[];
}

// Import all locale data files
const localeData = {
  sk: () => import('./data/sk.json', { with: { type: 'json' } }),
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

export type Locale = keyof typeof localeData;

type JsonData = { [key: string]: string[] };

const convert = (data: JsonData): NameDay[] =>
  Object.entries(data).map(([key, names]) => {
    const [month, day] = key.split('-').map(Number);
    return { month, day, names };
  });

// Cache for loaded data
const dataCache = new Map<Locale, NameDay[]>();

// Helper function to load locale data
async function getLocaleData(locale: Locale): Promise<NameDay[]> {
  if (dataCache.has(locale)) {
    return dataCache.get(locale)!;
  }

  try {
    const module = await localeData[locale]();
    const data = convert(module.default as JsonData);
    dataCache.set(locale, data);
    return data;
  } catch (error) {
    throw new Error(`Failed to load locale data for ${locale}: ${error}`);
  }
}

// Helper function to normalize string for comparison (remove diacritics)
const removeDiacritics = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

// Function to validate locale
const isValidLocale = (locale: string): locale is Locale => {
  return locale in localeData;
};

export const findNamesByDateLocale = async (locale: Locale, month: number, day: number): Promise<string[]> => {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}. Supported locales are: ${Object.keys(localeData).join(', ')}`);
  }
  
  const data = await getLocaleData(locale);
  const found = data.find(d => d.month === month && d.day === day);
  return found ? found.names : [];
};

export const findDateByNameLocale = async (locale: Locale, name: string): Promise<{ month: number; day: number } | null> => {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}. Supported locales are: ${Object.keys(localeData).join(', ')}`);
  }
  
  const data = await getLocaleData(locale);
  const normalizedSearchName = removeDiacritics(name.toLowerCase());
  
  for (const item of data) {
    const found = item.names.find(n => removeDiacritics(n.toLowerCase()) === normalizedSearchName);
    if (found) {
      return { month: item.month, day: item.day };
    }
  }
  return null;
};

export const getTodayNameDaysLocale = async (locale: Locale): Promise<{ names: string[]; date: string }> => {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}. Supported locales are: ${Object.keys(localeData).join(', ')}`);
  }
  
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const names = await findNamesByDateLocale(locale, month, day);
  
  // Format date in a simple way for all locales
  return { names, date: `${day}.${month}.` };
};
