// myApp/App.tsx

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import all screens
import Home from "./pages/home";
import History from "./pages/history";
import Login from "./pages/login";
import Register from "./pages/register";
import AddTransaction from "./pages/addTransaction";
import Report from "./pages/report";
import Accounts from "./pages/accounts";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Auth Screens */}
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />

          {/* Main Screens */}
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="AddTransaction" component={AddTransaction} />
          <Stack.Screen name="Report" component={Report} />
          <Stack.Screen name="Accounts" component={Accounts} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
