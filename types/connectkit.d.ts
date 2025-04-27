declare module 'connectkit' {
  export interface ConnectKitButtonProps {
    isConnected?: boolean;
    show?: () => void;
    hide?: () => void;
    truncatedAddress?: string;
    ensName?: string;
  }

  export const ConnectKitProvider: React.FC<{
    theme?: string;
    customTheme?: Record<string, string>;
    options?: {
      hideNoWalletCTA?: boolean;
      hideQuestionMarkCTA?: boolean;
      hideRecentBadge?: boolean;
    };
    children: React.ReactNode;
  }>;

  export interface ConnectKitButtonComponent extends React.FC {
    Custom: React.FC<{
      children: (props: ConnectKitButtonProps) => React.ReactNode;
    }>;
  }

  export const ConnectKitButton: ConnectKitButtonComponent;

  export const useModal: () => {
    open: boolean;
    setOpen: (open: boolean) => void;
  };
} 