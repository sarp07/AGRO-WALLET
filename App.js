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
            options={{ title: "Agro Wallet" }}
          />
          <Stack.Screen
            name="Create"
            component={Create}
            options={{ title: "Create Wallet" }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: "Login Wallet" }}
          />
          <Stack.Screen
            name="Import"
            component={Import}
            options={{ title: "Import Wallet" }}
          />
          <Stack.Screen
            name="Generate"
            component={Generate}
            options={{ title: "Generate Wallet" }}
          />
          <Stack.Screen
            name="Approve"
            component={Approve}
            options={{ title: "Approve Wallet" }}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ title: "Dashboard" }}
          />
          <Stack.Screen
            name="Networks"
            component={Networks}
            options={{ title: "Networks" }}
          />
          <Stack.Screen
            name="SendTransaction"
            component={SendTransaction}
            options={{ title: "SendTransaction" }}
          />
          <Stack.Screen
            name="SendToken"
            component={SendToken}
            options={{ title: "SendToken" }}
          />
          <Stack.Screen
            name="AddToken"
            component={AddToken}
            options={{ title: "AddToken" }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ title: "Settings" }}
          />
          <Stack.Screen
            name="Verify2FA"
            component={Verify2FA}
            options={{ title: "Verify2FA" }}
          />
        </Stack.Navigator>
      </WalletProvider>
    </NavigationContainer>
  );
}
