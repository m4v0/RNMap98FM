import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

// import the different screens
import Main    from './src/scenes/Main';
import Details from './src/scenes/Details';

const AppStackNavigator = createStackNavigator(
  {
    Main,
    Details
  }, 
  {
    initialRouteName: 'Main',
    navigationOptions: {
      gesturesEnabled: false,
    },    
  }
);

export default class App extends Component {
  render() {
    return (
      <AppStackNavigator />
    );
  }
}
