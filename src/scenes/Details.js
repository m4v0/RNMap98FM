import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

export default class Details extends Component {
  
  static navigationOptions = {
    header: null
  };

  state = {
    marker: [],
  }

  componentWillMount() {
    this.setState({ 
      marker: this.props.navigation.state.params.marker,
    });
  }

  goBackMain = () => {
    this.props.navigation.navigate('Main');
  }

  render() {
    const { marker } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        { marker &&
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: '700'}}>{marker.title}</Text>            
          </View>
        }
        <View style={{ padding: 10 }}>
          <Image
            source={marker.image}
            style={{height: 220, width: 300}}
            resizeMode="cover"
          />
        </View>
        { marker &&
          <View style={{ padding: 10 }}>
            <View style={{ padding: 10, backgroundColor: 'rgba(92, 72, 143, 0.1)', }}>
              <Text numberOfLines={20}>{marker.description}</Text>         
            </View>   
          </View>
        }
        <TouchableOpacity onPress={() => {this.goBackMain()}}>
          <View style={styles.buttonStyle}>
            <Text style={{color:'#fff'}}>Fechar</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center',
  },
  buttonStyle: {
    padding: 10,
    height: 38,
    width: 140,
    backgroundColor: '#6dc066',
    marginTop: 5,
    marginBottom: 50,
    alignItems: 'center',
    borderRadius: 5
  },  
});
