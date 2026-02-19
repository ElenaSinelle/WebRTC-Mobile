'use client';

import { useEffect } from 'react';
import { LanguageCode, TelegramWindow, Translation } from './tgHint.types';
import { translations } from './translations';

export const TgHintLoader = (): null => {
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const initTgHint = (): void => {
      const tgWindow = window as TelegramWindow;

      if (
        !(
          tgWindow.Telegram?.WebApp ||
          tgWindow.TelegramWebviewProxy ||
          tgWindow.TelegramWebview ||
          /(Telegram-Android|Telegram\/|TDesktop|TWeb)/i.test(navigator.userAgent)
        )
      ) {
        if (isDev) console.log('Not in Telegram, tg-hint skipped');
        return;
      }

      // detect browser language
      const browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
      const validLanguages: LanguageCode[] = Object.keys(translations) as LanguageCode[];
      const defaultLang: LanguageCode = validLanguages.includes(browserLang as LanguageCode)
        ? (browserLang as LanguageCode)
        : 'en';

      let overlayElement: HTMLElement | null = null;

      // create overlay html
      const createOverlayHTML = (langData: Translation): string => {
        const dirAttribute = langData.dir ? `dir="${langData.dir}"` : '';
        return `
                  <div id="tgHint" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);display:flex;justify-content:center;align-items:center;z-index:2147483647;">
                    <div style="background-color:var(--bg-card);border-radius:6px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.1);max-width:320px;width:90%;border:1px solid var(--border-secondary);" ${dirAttribute}>
                      <div style="padding:24px;">
                        <select id="tgLang" style="float:right;margin:-6px 0 8px 0;background-color:var(--bg-input);color:var(--text-primary);border:1px solid var(--border-secondary);border-radius:6px;padding:4px 8px;font-size:12px;outline:none;font-family:inherit;">
                          ${(Object.keys(translations) as LanguageCode[])
                            .map((lang) => `<option value="${lang}">${lang.toUpperCase()}</option>`)
                            .join('')}
                        </select>
                        <h3 style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:var(--text-primary);">${langData.title}</h3>
                        <p style="color:var(--text-secondary);margin-bottom:16px;line-height:1.5;font-size:14px;">${langData.body}</p>
                        <details style="margin:16px 0;color:var(--text-secondary);font-size:14px;">
                          <summary style="cursor:pointer;font-weight:500;color:var(--text-primary);margin-bottom:8px;">${langData.disable}</summary>
                          <p style="margin:8px 0 0 12px;font-size:13px;color:var(--text-secondary);">${langData.disable_ios}</p>
                          <p style="margin:8px 0 0 12px;font-size:13px;color:var(--text-secondary);">${langData.disable_and}</p>
                        </details>
                        <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:20px;">
                          <button id="tgOk" style="background-color:var(--bg-input);color:var(--text-primary);border:1px solid var(--border-secondary);border-radius:6px;padding:8px 16px;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.2s ease;font-family:inherit;">
                            ${langData.cancel}
                          </button>
                          <button id="tgOpenBrowser" style="background-color:var(--danger);color:white;border:none;border-radius:6px;padding:8px 16px;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.2s ease;font-family:inherit;">
                            ${langData.ok}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
      };

      // hint function
      const showHint = (langCode: LanguageCode): void => {
        if (overlayElement) {
          overlayElement.remove();
        }

        const langData = translations[langCode];
        document.body.insertAdjacentHTML('afterbegin', createOverlayHTML(langData));

        overlayElement = document.getElementById('tgHint');

        if (!overlayElement) {
          console.error('Failed to create tg-hint element');
          return;
        }

        const langSelect = overlayElement.querySelector<HTMLSelectElement>('#tgLang');
        if (langSelect) {
          langSelect.value = langCode;
          langSelect.onchange = (event: Event) => {
            const target = event.target as HTMLSelectElement;
            showHint(target.value as LanguageCode);
          };
        }

        const cancelButton = overlayElement.querySelector<HTMLButtonElement>('#tgOk');
        if (cancelButton) {
          cancelButton.onclick = () => {
            overlayElement?.remove();
            overlayElement = null;
            if (isDev) console.log('tg-hint closed');
          };
        }

        const openBrowserButton = overlayElement.querySelector<HTMLButtonElement>('#tgOpenBrowser');
        if (openBrowserButton) {
          openBrowserButton.onclick = () => {
            const currentUrl = window.location.href;

            if (/Android/i.test(navigator.userAgent)) {
              const intentUrl = `intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;package=com.android.chrome;end`;
              window.location.href = intentUrl;

              setTimeout(() => {
                window.close();
                if (isDev) console.log('Attempted to close Telegram window');
              }, 500);
            } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
              const safariUrl = currentUrl.replace(/^https?:\/\//, '');
              window.location.href = safariUrl;

              if (tgWindow.Telegram?.WebApp && typeof tgWindow.Telegram.WebApp.close === 'function') {
                tgWindow.Telegram.WebApp.close();
              } else {
                setTimeout(() => window.close(), 500);
              }
            } else {
              navigator.clipboard.writeText(currentUrl).then(() => {
                alert('Link copied! Please open in your browser');
              });
            }

            if (isDev) console.log('Attempting to open in external browser');
          };
        }

        if (isDev) console.log('tg-hint shown with language:', langCode);
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => showHint(defaultLang));
      } else {
        showHint(defaultLang);
      }
    };

    initTgHint();

    // Cleanup function
    return (): void => {
      const existingHint = document.getElementById('tgHint');
      if (existingHint) {
        existingHint.remove();
        if (isDev) console.log('tg-hint cleaned up');
      }
    };
  }, [isDev]);

  return null;
};
