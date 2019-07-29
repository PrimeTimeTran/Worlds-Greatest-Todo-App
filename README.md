# [Worlds Greatest Todo 📋💻📱 App](https://worldsgreatesttodoapp.com/)
Open source project working on building the best todo app ever.

![Intro](./intro.gif)

## Setup

1. Clone repo.
2. Run `npm install`.
3. Create a new `.env` file in project root.
4. Create a personal [firebase app](https://firebase.google.com/) to get environment variables for the `.env` file we just made.
5. Run app with `npm start`.

```js
// ./.env
// Replace corresponding values with those from new firebase app.
REACT_APP_API_KEY="something"
REACT_APP_GA_ID="UA-something-1"
REACT_APP_PROJECT_ID="todo-something"
REACT_APP_MESSAGING_SENDER_ID="something"
REACT_APP_APP_ID="1:something:web:something"
REACT_APP_AUTH_DOMAIN="something.firebaseapp.com"
REACT_APP_DATABASE_URL="https://todo-something.firebaseio.com"
```

## Todo

* [ ] Write a good README.md
