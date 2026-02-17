export declare global {
  interface Window {
    TelegramWebviewProxy?: {
      postEvent: (eventName: string, eventData: unknown) => void;
    };
    Telegram?: {
      WebApp?: {
        ready: () => void;
        close: () => void;
        initData?: string;
        initDataUnsafe?: {
          query_id?: string;
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}
