import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Iconify } from 'react-native-iconify';
import { Tabs } from 'expo-router';

import { useColorScheme } from '@/components/useColorScheme';
import BigButton from '@/components/BigButton';
import NewThreadModal from '@/components/NewThreadModal';
import { useAuth } from '@/context/AuthContext';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useAuth();

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#57D0FF',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            height: 90,
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
            tabBarIcon: () => (
              <BigButton onPress={handleOpenModal} />
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
      {user && (
        <NewThreadModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          userPhoto={user.profile_picture || 'profile_vibbyBlue'}
          username={user.name || 'User'}
        />
      )}
    </>
  );
}