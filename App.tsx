import { useColorScheme } from 'react-native';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import Home from './app/screens/Home';
import Login from './app/screens/Login';
import { Provider } from 'react-redux';
import store from './app/redux/Store';



export default function App() {

  return (
    <AuthProvider>
      <Layout></Layout>
    </AuthProvider>
  );
}


export const Layout = () => {
  const { authState } = useAuth()
  const theme = useColorScheme();
  console.log(authState?.authenticated)
  return (<Provider store={store}>
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      {authState?.authenticated ? (<Home />) : (<Login />)}
    </NavigationContainer>
  </Provider>
  );
}