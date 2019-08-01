import * as firebase from "firebase/app";
import "firebase/messaging";

const firebaseConfig = {
  storageBucket: "",
  appId: process.env.REACT_APP_APP_ID,
  apiKey: process.env.REACT_APP_API_KEY,
  projectId: process.env.REACT_APP_PROJECT_ID,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.usePublicVapidKey(process.env.REACT_APP_USE_PUBLIC_V_API_KEY);

Notification.requestPermission().then(async (permission) => {
  if (permission === 'granted') {
    const token = await messaging.getToken();
    console.log('tokentoken', token)
    // TODO: Implement token refresh on server.
    // sendTokenToServer(token);
    // updateUIForPushEnabled(token);
  } else {
    console.log('Unable to get permission to notify.');
    // updateUIForPushPermissionRequired();
    // setTokenSentToServer(false);
  }
});


export { messaging };