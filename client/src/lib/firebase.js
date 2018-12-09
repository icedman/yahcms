import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyCHIgoOPVJvlABRtJEp_LPweNceVRrak-k',
  authDomain: 'appsmart-contracts.firebaseapp.com',
  databaseURL: 'https://appsmart-contracts.firebaseio.com',
  projectId: 'appsmart-contracts',
  storageBucket: 'appsmart-contracts.appspot.com',
  messagingSenderId: '178298224563',
  dbVersion: 1
}

firebase.initializeApp(config)

export default firebase
