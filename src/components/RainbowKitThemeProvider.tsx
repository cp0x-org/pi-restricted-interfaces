import { ReactNode } from 'react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import useConfig from 'hooks/useConfig';
import { getRainbowKitTheme } from 'themes/rainbowkit-theme';

interface RainbowKitThemeProviderProps {
  children: ReactNode;
}

const RainbowKitThemeProvider = ({ children }: RainbowKitThemeProviderProps) => {
  const { mode, i18n } = useConfig();

  const customTheme = getRainbowKitTheme(mode);

  return (
    <RainbowKitProvider theme={customTheme} modalSize="compact" locale={i18n === 'zh' ? 'zh-CN' : 'en-US'}>
      {children}
    </RainbowKitProvider>
  );
};

export default RainbowKitThemeProvider;
