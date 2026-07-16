import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchListScreen from './screens/MatchListScreen';
import ScoringScreen from './screens/ScoringScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="MatchList" 
          component={MatchListScreen}
          options={{ title: 'Gaelic Live' }}
        />
        <Stack.Screen 
          name="Scoring" 
          component={ScoringScreen}
          options={{
            title: 'Gaelic Live',
            headerStyle: {
              backgroundColor: '#13131f',
            },
            headerTintColor: '#ffffff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              color: '#8888aa',
              fontWeight: '600',
              letterSpacing: 1,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}