import React, { useEffect, useState, useRef } from 'react';
import MapView, {Marker} from 'react-native-maps'
import { Button, View } from 'react-native'; 
import { styles } from './styles';
import { requestForegroundPermissionsAsync,  
         getCurrentPositionAsync,            
         LocationObject,                     
         watchPositionAsync,
         LocationAccuracy
        } from 'expo-location'


export default function App() {
  // State para armazenar a localização atual do usuário
  const [location , setLocation] = useState<LocationObject | null>(null);
  //referencia ao mapview para acessar o animateCamera
  const mapRef = useRef<MapView>(null);

  //função para solicitar permissão de localização
  async function requestPermissionLocation() {
    const { granted } = await requestForegroundPermissionsAsync();

    if(granted){
      //obter a posição atual e definir no estado
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
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
          <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          />
        </MapView>
      }
      <Button title="Calcular Rota" />
    </View>
  );
}

