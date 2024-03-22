import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WalletProvider } from "./utils/WalletContext";
import Home from "./screens/Home";
import Create from "./screens/Create";
import Generate from "./screens/Generate";
import Approve from "./screens/Approve";
import Dashboard from "./screens/Dashboard";
import Login from "./screens/Login";
import Networks from "./screens/Networks";
import SendTransaction from "./screens/SendTransaction";
import AddToken from "./screens/AddToken";
import Settings from "./screens/Settings";
import Import from "./screens/Import";
import SendToken from "./screens/SendToken";
import Verify2FA from "./screens/Verify2FA";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <WalletProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
          />
          <Stack.Screen
            name="Create"
            component={Create}
          />
          <Stack.Screen
            name="Login"
            component={Login}
          />
          <Stack.Screen
            name="Import"
            component={Import}
          />
          <Stack.Screen
            name="Generate"
            component={Generate}
          />
          <Stack.Screen
            name="Approve"
            component={Approve}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
          />
          <Stack.Screen
            name="Networks"
            component={Networks}
          />
          <Stack.Screen
            name="SendTransaction"
            component={SendTransaction}
          />
          <Stack.Screen
            name="SendToken"
            component={SendToken}
          />
          <Stack.Screen
            name="AddToken"
            component={AddToken}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
          />
          <Stack.Screen
            name="Verify2FA"
            component={Verify2FA}
          />
        </Stack.Navigator>
      </WalletProvider>
    </NavigationContainer>
  );
}
