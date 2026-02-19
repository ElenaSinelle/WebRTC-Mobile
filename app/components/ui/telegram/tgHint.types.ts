// Типы для переводов
export interface Translation {
  dir?: 'ltr' | 'rtl';
  title: string;
  body: string;
  disable: string;
  disable_ios: string;
  disable_and: string;
  ok: string;
  cancel: string;
}

export interface Translations {
  [key: string]: Translation;
}

export type LanguageCode =
  | 'en'
  | 'ru'
  | 'es'
  | 'pt'
  | 'fr'
  | 'de'
  | 'ar'
  | 'zh'
  | 'hi'
  | 'id'
  | 'it'
  | 'ja'
  | 'ko'
  | 'tr';

export interface TelegramWindow extends Window {
  Telegram?: {
    WebApp?: {
      close?: () => void;
      ready?: () => void;
      expand?: () => void;
    };
  };
  TelegramWebviewProxy?: unknown;
  TelegramWebview?: unknown;
}
