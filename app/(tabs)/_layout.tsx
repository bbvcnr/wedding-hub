import { useTheme } from '@/src/components/theme/theme-provider'
import { ThemedText } from '@/src/components/theme/themed-view'
import { icons } from '@/src/constants/icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, ImageBackground, StyleSheet, View } from 'react-native'
import { BlurView } from 'expo-blur'
import { images } from '../../src/constants/images'

interface TabIconProps {
  focused: boolean;
  icon: any;
  title: string;
}

const TabIcon = ({ focused, icon, title }: TabIconProps) => {
  if (focused) {
  return (
    <ImageBackground
      source={images.highlight}
      className='flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden'
    >
    <Image source={icon} tintColor={'white'} className='size-5' />
      <ThemedText 
        className="text-base font-semibold ml-2"
        style={{ color: 'white' }}
      >
        {title}
      </ThemedText>
    </ImageBackground>
  )
  } else {
    return (
      <View className='size-full justify-center items-center mt-4 rounded-full'>
        <Image source={icon} tintColor={'gray'} className='size-5' />
      </View>
  )
  }
}

export default function Layout() {
  const { isDark } = useTheme();

  return (
    <Tabs screenOptions={{ 
      tabBarShowLabel: false, 
      tabBarBackground: () => (
        <BlurView
          tint={isDark ? 'dark' : 'light'}
          intensity={20}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: isDark ? 'rgba(31,31,31,0.9)' : 'rgba(248,250,252,0.9)' },
          ]}
        />
      ),
      tabBarItemStyle: {
        width: '100%', 
        height: '100%',
        justifyContent: 'center', 
        alignItems: 'center'
      },
      tabBarStyle: { 
      backgroundColor: 'transparent', 
        borderRadius: 50, 
        marginHorizontal: 20,
        marginBottom: 20,
        height: 52,
        position: 'absolute',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: isDark ? '#333333' : 'white',
      }
    }}>
          <Tabs.Screen
            name="index"
            options={{ headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon 
                  focused={focused} 
                  icon={icons.home} 
                  title="Home" />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{ headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon 
                  focused={focused} 
                  icon={icons.person} 
                  title="Profile" />
              ),
            }}
          />
            <Tabs.Screen
            name="search"
            options={{ headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon 
                  focused={focused} 
                  icon={icons.search} 
                  title="Search" />
              ),
            }}
          />
            <Tabs.Screen
            name="saved"
            options={{ headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon 
                  focused={focused} 
                  icon={icons.save} 
                  title="Saved" />
              ),
            }}
          />
        </Tabs>
  );
}
