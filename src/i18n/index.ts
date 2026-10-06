import { useState } from 'react';

export type Language = 'en' | 'hi' | 'mr';

export const useI18n = () => {
  const [lang] = useState<Language>('en');

  return {
    lang,
  };
};