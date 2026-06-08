import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { ThemedText } from './themed-view';

interface ThemedButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  color?: 'pink' | 'blue' | 'green' | 'neutral';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function ThemedButton({ 
  title, 
  variant = 'primary',
  size = 'md',
  color = 'pink', // Pink by default!
  leftIcon,
  rightIcon,
  className = '',
  ...props 
}: ThemedButtonProps) {
  const getColorStyles = () => {
    // All backgrounds handled by inline styles now
    return '';
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    };
    
    return sizes[size];
  };

  const getTextColor = () => {
    return (variant === 'primary' || variant === 'secondary') ? 'text-white' : '';
  };

  const getTextSize = () => {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };
    
    return sizes[size];
  };

  return (
    <TouchableOpacity 
      className={`
        ${getSizeStyles()} 
        ${getColorStyles()} 
        rounded-lg 
        ${className}
      `}
      style={{
        // Fallback colors using inline styles to ensure they work
        backgroundColor: 
          variant === 'primary' && color === 'pink' ? '#EC4899' :
          variant === 'primary' && color === 'blue' ? '#3B82F6' :
          variant === 'primary' && color === 'green' ? '#14B8A6' :
          variant === 'secondary' ? '#6B7280' : undefined, // Grey for secondary
        borderColor:
          variant === 'outline' && color === 'pink' ? '#EC4899' :
          variant === 'outline' && color === 'blue' ? '#3B82F6' :
          variant === 'outline' && color === 'green' ? '#14B8A6' :
          variant === 'outline' && color === 'neutral' ? '#9CA3AF' : undefined,
        borderWidth: variant === 'outline' ? 1 : undefined, // Only outline has border
      }}
      {...props}
    >
      <View className="flex-row items-center justify-center">
        {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
        <ThemedText 
          className={`text-center font-semibold ${getTextColor()} ${getTextSize()}`}
          style={{
            color: (variant === 'primary' || variant === 'secondary') ? '#FFFFFF' : 
                   variant === 'outline' && color === 'pink' ? '#EC4899' :
                   variant === 'outline' && color === 'blue' ? '#3B82F6' :
                   variant === 'outline' && color === 'green' ? '#14B8A6' :
                   variant === 'outline' && color === 'neutral' ? '#9CA3AF' : undefined
          }}
        >
          {title}
        </ThemedText>
        {rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
      </View>
    </TouchableOpacity>
  );
}