import { useTheme } from '@/src/components/theme/theme-provider'
import { ThemedText } from '@/src/components/theme/themed-view'
import { useAuth } from '@/src/context/AuthContext'
import { icons } from '@/src/constants/icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, ImageBackground, StyleSheet, View } from 'react-native'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import { images } from '../../src/constants/images'

interface TabIconProps {
  focused: boolean;
  icon?: any;
  ionIcon?: keyof typeof Ionicons.glyphMap;
  title: string;
  isOrganizer?: boolean;
}

const TabIcon = ({ focused, icon, ionIcon, title, isOrganizer = false }: TabIconProps) => {
  if (focused) {
  return (
    <ImageBackground
      source={images.highlight}
      style={{
        flexDirection: 'row',
        width: '100%',
        flex: 1,
        minWidth: isOrganizer ? 98 : 112,
        minHeight: isOrganizer ? 56 : 64,
        marginTop: isOrganizer ? 8 : 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
        overflow: 'hidden',
      }}
    >
    {ionIcon ? (
      <Ionicons name={ionIcon} size={20} color={'white'} />
    ) : (
      <Image source={icon} tintColor={'white'} className='size-5' />
    )}
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
      <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', marginTop: isOrganizer ? 8 : 16, borderRadius: 999 }}>
        {ionIcon ? (
          <Ionicons name={ionIcon} size={20} color={'gray'} />
        ) : (
          <Image source={icon} tintColor={'gray'} className='size-5' />
        )}
      </View>
  )
  }
}

export default function Layout() {
  const { isDark } = useTheme();
  const { accountType } = useAuth();
  const isOrganizer = accountType === 'ORGANIZER';

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
        flex: 1,
        height: '100%',
        justifyContent: 'center', 
        alignItems: 'center'
      },
      tabBarStyle: { 
      backgroundColor: 'transparent', 
        borderRadius: 50,
        marginHorizontal: 20,
        marginBottom: 20,
        height: isOrganizer ? 60 : 52,
        position: 'absolute',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: isDark ? '#333333' : 'white',
      }
    }}>
          <Tabs.Screen
            name="index"
            options={{ headerShown: false,
              href: isOrganizer ? ('/(organizer)/dashboard' as any) : undefined,
              tabBarIcon: ({ focused }) => (
                <TabIcon 
                  focused={focused} 
                  ionIcon={isOrganizer ? 'arrow-back-outline' : undefined}
                  icon={isOrganizer ? undefined : icons.home}
                  title={isOrganizer ? 'Back' : 'Home'}
                  isOrganizer={isOrganizer}
                />
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
                  title="Profile"
                  isOrganizer={isOrganizer}
                />
              ),
            }}
          />
            <Tabs.Screen
            name="search"
            options={{ headerShown: false,
              href: undefined,
              tabBarIcon: ({ focused }) => (
                <TabIcon 
                  focused={focused} 
                  icon={icons.search} 
                  title={isOrganizer ? 'Vendors' : 'Search'}
                  isOrganizer={isOrganizer}
                />
              ),
            }}
          />
            <Tabs.Screen
            name="saved"
            options={{ headerShown: false,
              href: isOrganizer ? null : undefined,
              tabBarIcon: ({ focused }) => (
                <TabIcon 
                  focused={focused} 
                  icon={icons.save} 
                  title="Saved"
                  isOrganizer={isOrganizer}
                />
              ),
            }}
          />
        </Tabs>
  );
}
