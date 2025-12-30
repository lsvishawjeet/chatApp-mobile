import {Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={
       {
        tabBarActiveBackgroundColor: "#434323"
       }
      }
    >
      <Tabs.Screen name="index" options={{
        title: "Home",
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        )
      }} />
      <Tabs.Screen name="about" options={{
        title: "About",
        tabBarIcon: ({color, focused}) => (
          <Ionicons name={focused ? 'book-sharp' : 'book-outline'} color={color} size={24} />
        )
      }} />
    </Tabs>
  )
}
