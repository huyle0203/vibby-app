import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Iconify } from 'react-native-iconify';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import BigButton from '@/components/BigButton';
import NewThreadModal from '@/components/NewThreadModal';
import { createRandomUser } from '@/utils/generate-dommy-data';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = createRandomUser();

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
            // listeners: ({ navigation }) => ({
            //   tabPress: (e) => {
            //     if (navigation.isFocused()) {
            //       // Prevent default behavior
            //       e.preventDefault();
            //       // Scroll to top
            //       navigation.emit({
            //         type: 'tabPress',
            //         target: navigation.getState().routes[0].key,
            //         canPreventDefault: true,
            //       });
            //     }
            //   },
            // }),
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
      <NewThreadModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        userPhoto={user.photo}
        username={user.username}
      />
    </>
  );
}