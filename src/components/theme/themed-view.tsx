import { Text, TextProps, View, ViewProps } from 'react-native';
import { useTheme } from './theme-provider';

interface ThemedViewProps extends ViewProps {
  variant?: 'background' | 'surface' | 'card' | 'pinksurface' | 'greensurface';
  debug?: boolean;
  className?: string;
}

export function ThemedView({ 
  variant = 'background', 
  debug = false,
  className = '', 
  style,
  ...props 
}: ThemedViewProps) {
  const { colors } = useTheme();
  
  const getVariantStyle = () => {
    const variantMap = {
      background: colors.background,
      surface: colors.surface,
      card: colors.card,
      pinksurface: colors.accent.pink,
      greensurface: colors.accent.green,
    };
    return { backgroundColor: variantMap[variant] };
  };

  if (debug) {
    const resolved = getVariantStyle().backgroundColor;
    // eslint-disable-next-line no-console
    console.log('[ThemedView]', { variant, resolved });
  }

  return (
    <View 
      className={className}
      style={[style, getVariantStyle()]}
      {...props} 
    />
  );
}

interface ThemedTextProps extends TextProps {
  variant?: 'primary' | 'secondary' | 'muted' | 'accentPink' | 'accentGreen' | 'accentBlue';
  className?: string;
}

export function ThemedText({
  variant = 'primary',
  className = '',
  style: styleProp,
  ...props
}: ThemedTextProps) {
  const { colors } = useTheme();

  const getTextStyle = () => {
    const variantMap = {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      muted: colors.text.muted,
      accentPink: colors.accent.pink,
      accentGreen: colors.accent.green,
      accentBlue: colors.accent.blue,
    };
    const color = variantMap[variant];
    return { color, opacity: variant === 'muted' ? 0.7 : 1 };
  };

  return (
    <Text
      className={className}
      style={[getTextStyle(), styleProp]}
      {...props}
    />
  );
}
