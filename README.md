# App-Geo
App em react native, integração com APIs de dados do Dados Recife e utilização de recursos como exibição de dados na tela e rastreamento de localização do usuário.

O ExpoBike pega os dados de localização de estações de bikes de Recife e os dados da sua localização atual, com isso ele mostra um mapa com as estações de bike e ao clicar no ícone das estações, ele gera uma rota baseado na sua localização.

Instalações necessárias para dar start no ExpoBike:

-npx expo install expo-location // para pegar a localização do usuário em tempo real


-npx expo install react-native-maps // Marker para marcar as posições do usuário e das estações de bike


-npm install react-native-maps-directions // MapViewDirections para criar rotas com a api do google
