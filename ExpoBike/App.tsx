import React, { useEffect, useState, useRef } from 'react';
import MapView, {Marker} from 'react-native-maps'
import { View } from 'react-native'; 
import { styles } from './styles';
import MapViewDirections from 'react-native-maps-directions';
import config from './config/index.json';
import { requestForegroundPermissionsAsync,  
         getCurrentPositionAsync,            
         LocationObject,                     
         watchPositionAsync,
         LocationAccuracy
        } from 'expo-location'


 async function dados(){
  const resposta = await fetch ("http://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=e6e4ac72-ff15-4c5a-b149-a1943386c031").then((res)=>res.json())
  //console.log(resposta.result.records[0])
  let teste = []
  for (let i=0; i<resposta.result.records.length; i++){
    teste.push({latitude: resposta.result.records[i].latitude,longitude:resposta.result.records[i].longitude})
  //console.log(resposta.result.records[i].latitude)
  }
  return teste
}

export default function App() {
  // State para armazenar a localização atual do usuário
  const [location , setLocation] = useState<LocationObject | null>(null);
  const [coordinates, setCoordinates] = useState([]) //para obter coordenadas assincronas
  //referencia ao mapview para acessar o animateCamera
  const mapRef = useRef<MapView>(null);
    const origin = {latitude:-8.05263 , longitude:-34.88515};
    const [destination, setDestination] = useState ({latitude: -8.06011, longitude: -34.88528});

  //função para solicitar permissão de localização
  async function requestPermissionLocation() {
    const { granted } = await requestForegroundPermissionsAsync();

    if(granted){
      //obter a posição atual e definir no estado
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
   //console.log(await dados())
  }
  //ao montar o componente, solicitar permissão de localização
  useEffect(() => {
    requestPermissionLocation();
  },[]);
  //assistir a alteração de posição e animar no mapa
  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval:1000,
      distanceInterval: 1
    }, (response) => {
      //atualizar o estado com a nova posição
       setLocation(response);
      //animar a camera do mapa para a nova posição
       mapRef.current?.animateCamera({
        pitch: 100,
        center: response.coords
       })
    });
  }, []);

  useEffect(() => {
    async function fetchData() { //busca as coordenadas dos dados da api
      const coordinates = await dados();
      setCoordinates(coordinates) //atualiza os dados com as coordenadas obtidas
    }
    fetchData();
  }, []);

    //renderizar mapview com a localização do usuário e um marcador
  return (
    <View style={styles.container}>
      {
        location &&
        <MapView 
          ref={mapRef}
          style ={styles.map} 
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005, //0.005 determina a distancia da visualização do mapa
            longitudeDelta: 0.005
          }}
        >
        <MapViewDirections
          origin={origin} 
          destination={destination}
          apikey={config.googleApi} // insert your API Key here
          strokeWidth={4}
          mode='WALKING' //tipo de rota que será traçada
          strokeColor="#111111"
        />
          <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          />
           {coordinates.map(marker => (
            <Marker 
              coordinate={marker}
              onPress={()=> setDestination(marker)} //Ao clicar no ícone,chama a função onPress que atualiza com as novas coordenadas e renderiza uma rota
              image = {require('./assets/bicicleta.png')}
            />
           ))}
        </MapView>
      }
    </View>
  );
}

