import React, {Component} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
}              from 'react-native';
import MapView from "react-native-maps";

const Images = [
  { uri: "https://www.praiasdenatal.com.br/wp-content/uploads/2015/02/Praia-de-Genipabu.jpg" },
  { uri: "http://promocoesdepassagens.org/wp-content/uploads/2018/07/Forte-dos-Reis-Magos1-830x450.jpg" },
  { uri: "http://partiupelomundo.com/wp-content/uploads/2016/04/Maior-Cajueiro-Mundo-Natal-e1460435900889.jpg" },
  { uri: "http://mangai.com.br/wp-content/uploads/2015/07/MANGAI-PN-Carlos-Ubarana-Jr-28-e1534338369815.jpg" },
]

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 3;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class App extends Component {

  static navigationOptions = {
    header: null
  };  

  state = {
    markers: [
      {
        id: 1,
        coordinate: {
          latitude: -5.694919,
          longitude: -35.2000358,
        },
        title: "Praia Genipabú",
        description: "Entre as diversas maravilhas do Rio Grande do Norte, a visita à Praia de Genipabu é uma das mais proveitosas para passeio.\n\n A paisagem ecológica natural do local chama a atenção de todos os turistas que visitam a região.\n\nO oásis em meio ao deserto, disposto a partir das dunas brancas que cercam a praia e as lagoas de água doce, faz da paisagem a mais exótica e variada do Rio Grande do Norte.\n\nVeja porque a praia com as dunas mais altas do Brasil não pode ficar de fora dos seus passeios ao Rio Grande do Norte.",
        image: Images[0],
      },
      {
        id: 2,
        coordinate: {
          latitude: -5.7563711,
          longitude: -35.1970967,
        },
        title: "O Forte dos Reis Magos",
        description: "Em formato de estrela, a fortaleza foi construída pelos colonizadores portugueses em 1598, nas proximidades do encontro do Oceano Atlântico com o Rio Potengi.\n\nEm 1633, apesar da localização estratégica, não impediu a invasão dos holandeses.\n\nAnos mais tarde, os portugueses conseguiram retomar a cidade e o forte.\n\nO monumento ainda preserva os canhões - expostos na parte superior do prédio, capela com poço de água doce e alojamentos.",
        image: Images[1],
      },
      {
        id: 3,
        coordinate: {
          latitude: -5.9696033,
          longitude: -35.1303126,
        },
        title: "Praia de Pirangi do Norte",
        description: "Conheça o Maior Cajueiro do Mundo, segundo o Guinness Book. Este Cajueiro sofre de uma anomalia chamada gigantismo e seu tamanho, é de impressionantes 8500 metros quadrados. Seu período de produção vai de novembro a janeiro e a safra é de 70 a 80 mil cajus",
        image: Images[2],
      },
      {
        id: 4,
        coordinate: {
          latitude: -5.819761,
          longitude: -35.2144267,
        },
        title: "Restaurante Mangai",
        description: 'Em 1989, na cidade de João Pessoa, Leneide Maia Tavares, Dona Parea como é conhecida, trazia rapadura de sua terra natal, Catolé do Rocha, cidade interiorana da Paraíba, e as vendia em feiras livres em João Pessoa. Verificando que seria possível montar sua própria “bodega”, resolveu conversar com sua mãe, Leopodina, sobre a ideia: – “ Mãe, vou abrir uma bodega pra vender rapadura” – Sua mãe, por sua vez, disse: “ Não criei minha filha pra ser Mangaieira” - Ela gostaria que a filha fosse " doutora" – Mangaieira é a pessoa que trabalha no Mangai. Dessa conversa surgiu o nome da bodega de Dona Parea, o Mangai, que logo, contou com o apoio do marido e filhos.',
        image: Images[3],
      },
    ],

    region: {
      latitude: -5.8396659,
      longitude: -35.2163253,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },

  };

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  componentDidMount() {
    // Verificar se o scrool (rolagem) parou
    // se o index for menor que 0, então força ficar
    // no elemento 0.
    //
    this.animation.addListener(({ value }) => {
      // Criar o efeito e animação o scrool (rolagem) em 30% 
      // para o proximo item.
      let index = Math.floor(value / CARD_WIDTH + 0.3);
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  showDetails = (marker) => {
    this.props.navigation.navigate('Details', { marker });
  }

  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });

    return (
      <View style={styles.container}>
        <MapView ref={map => this.map = map} initialRegion={this.state.region} style={styles.map}>

          <MapView.Marker 
            coordinate={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude,
              
            }} 
            pinColor="red" 
          />
          {this.state.markers.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            return (
              <MapView.Marker key={index} coordinate={marker.coordinate}>
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles.ring, scaleStyle]} />
                  <View style={styles.marker} />
                </Animated.View>
              </MapView.Marker>
            );
          })}
        </MapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {this.state.markers.map((marker, index) => (
            <View style={styles.card} key={index}>

              <Image
                source={marker.image}
                style={styles.cardImage}
                resizeMode="cover"
              />

              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
              </View>

              <TouchableOpacity onPress={() => {this.showDetails(marker)}}>
                <View style={styles.buttonStyle}>
                  <Text style={{color:'#fff'}}>Detalhe</Text>
                </View>
              </TouchableOpacity>

            </View>
          ))}
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH -30,
  },
  card: {
    flex:1,
    flexDirection: 'column',
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardImage: {
    // flex: 3,
    // padding:10,
    width: "100%",
    height: "85%",
    alignSelf: "center",
  },
  textContent: {
    // flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
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
	map:{
		...StyleSheet.absoluteFillObject
	}  
});
