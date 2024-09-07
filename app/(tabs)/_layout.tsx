import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Iconify } from 'react-native-iconify';
import { Link, Tabs, useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import BigButton from '@/components/BigButton';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarActiveTintColor: '#57D0FF',
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        //headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 90, // Increase this value to make the tab bar taller
          backgroundColor: '#000000',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Iconify icon="akar-icons:home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <Iconify icon="tabler:heart-bolt" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="postThread"
        options={{
          tabBarIcon: ({ color }) => (
            <Link href={`/signUp`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <BigButton onPress={() => { /* handle press */ }} />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Tab Three',
          tabBarIcon: ({ color }) => <Iconify icon="mingcute:music-3-line" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: 'Tab Four',
          tabBarIcon: ({ color }) => <Iconify icon="humbleicons:user" size={40} color={color} />,
        }}
      />
    </Tabs>
  );
}
