import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainPage } from "./src/screens/MainPage";
import { MasterPage } from "./src/screens/MasterPage";
import { DetailPage } from "./src/screens/DetailPage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainPage}
          options={{ title: "Movil Primero" }}
        />
        <Stack.Screen
          name="Master"
          component={MasterPage}
          options={{ title: "Catálogo (Maestro)" }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailPage}
          options={{ title: "Detalle" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
