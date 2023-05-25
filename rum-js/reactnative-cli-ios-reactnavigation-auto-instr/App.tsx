import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// added for backend networking call
import {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';

// added for splunk-otel-react-native
import { OtelWrapper, ReactNativeConfiguration, startNavigationTracking } from '@splunk/otel-react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen({ navigation }) {
  // added for calling backend resources
  type Movie = {
    id: string;
    title: string;
    releaseYear: string;
  };

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Movie[]>([]);

  const getMovies = async () => {
    try {
      const response = await fetch('https://reactnative.dev/movies.json');
      const json = await response.json();
      setData(json.movies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);
  // end of addition for calling backend resources

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <FlatList
        data={data}
        keyExtractor={({id}) => id}
        renderItem={({item}) => (
          <Text>
            {item.title}, {item.releaseYear}
          </Text>
        )}
      />
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Details')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {

  // added for
  const RumConfig: ReactNativeConfiguration = {
    realm: 'usN',
    applicationName: 'jekReactNativev2',
    rumAccessToken: 'XXXXXXXXXXXXXXX',
  };

  const navigationRef = useNavigationContainerRef();
  return (
    <OtelWrapper configuration={RumConfig}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          startNavigationTracking(navigationRef);
        }}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </OtelWrapper>
  );
}

export default App;
