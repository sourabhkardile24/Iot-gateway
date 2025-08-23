import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { ColorValue, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface CardProps {
  title?: string;
  children: ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  gradient?: boolean;
  gradientColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
}

export function Card({ 
  title, 
  children, 
  style, 
  titleStyle, 
  gradient = true, 
  gradientColors 
}: CardProps) {
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  // Use a light color for the border since 'border' is not available in the Colors
  const borderColor = useThemeColor({ light: '#e5e5ea', dark: '#38383a' }, 'background');
  
  // Default gradient colors for light theme - darker and more pronounced
  const defaultGradientColors = ['#ffffff', '#f2f2f7', '#e5e5ea'] as readonly [ColorValue, ColorValue, ColorValue];
  
  if (gradient) {
    return (
      <LinearGradient
        colors={gradientColors || defaultGradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderColor: borderColor + '33' }, style]}
      >
        {title && (
          <Text style={[styles.title, { color: textColor }, titleStyle]}>
            {title}
          </Text>
        )}
        <View style={styles.content}>{children}</View>
      </LinearGradient>
    );
  }
  
  return (
    <View style={[styles.card, { backgroundColor, borderColor: borderColor + '33' }, style]}>
      {title && (
        <Text style={[styles.title, { color: textColor }, titleStyle]}>
          {title}
        </Text>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: '100%', // Make card full width of container
    alignSelf: 'stretch',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  content: {
    padding: 16,
    paddingTop: 8,
    width: '100%', // Ensure content fills the card
    flexGrow: 1,
  },
});
