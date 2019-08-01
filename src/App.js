import React, { useState, useEffect, useRef } from "react";

import ReactGA from "react-ga";
import firebase from "firebase";

import { BrowserRouter as Router, Route } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import TodoList from "./components/TodoList";
import TodoInput from "./components/TodoInput";
import SortingOptions from "./components/SortingOptions";

import { randomBackgroundImage } from "./utils";
import { messaging } from "./utils/init-fcm";

import "./App.css";

ReactGA.initialize(process.env.REACT_APP_GA_ID);
ReactGA.event({
  category: "App",
  action: "Page view"
});

ReactGA.ga("send", "pageview", "/");

messaging.onTokenRefresh(() => {
  messaging.getToken().then((refreshedToken) => {
    console.log('Token refreshed.', refreshedToken);
    // Indicate that the new Instance ID token has not yet been sent to the
    // app server.
    // setTokenSentToServer(false);
    // Send Instance ID token to app server.
    // sendTokenToServer(refreshedToken);
    // ...
  }).catch((err) => {
    console.log('Unable to retrieve refreshed token ', err);
    // showToken('Unable to retrieve refreshed token ', err);
  });
});

messaging.onMessage((payload) => console.log('Message received. ', payload));

function App() {
  const [filter, setFilter] = useState(null);
  const [hitCount, setHitCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [newTodoBody, setNewTodoItem] = useState("");
  const [allTodos, setAllTodos] = useState([]);
  const ref = useRef(firebase.firestore().collection("todos"));
  const [currentUser, setCurrentUser] = useState({ uid: "", email: "" });
  let userRef = useRef(currentUser);
  const [bgImage, setBgImage] = useState({
    backgroundImage: `url(${randomBackgroundImage()})`
  });

  const refreshTodos = querySnapshot => {
    const todos = [];
    querySnapshot.forEach(doc => {
      const isCurrentUserTodo = doc.data().uid === userRef.current.uid;
      if (isCurrentUserTodo) {
        todos.push({
          id: doc.id,
          ...doc.data()
        });
      }
    });
    save(todos);
  };

  const getHits = async () => {
    let ref = firebase.database().ref('/');
    ref.on('value', snapshot => {
    const newHitCount = snapshot.val();
    setHitCount(newHitCount.hit_counter + 1)
    })
  }

  const setupApp = () => {
    getHits()
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email
        });
        userRef.current = {
          uid: user.uid,
          email: user.email
        };
        const db = firebase.firestore();
        const todosRef = db.collection("todos");
        const query = todosRef
          .where("uid", "==", user.uid)
          .orderBy("createdAt", "desc");

        query
          .get()
          .then(refreshTodos)
          .catch(error => {
            ReactGA.exception({
              fatal: true,
              description: "An error ocurred fetching todos"
            });
            console.log("Error getting document:", error);
          });
      } else {
        setCurrentUser({ uid: "" });
      }
      setLoading(false);
    });
    ref.current.onSnapshot(refreshTodos);
  };

  useEffect(() => {
    setupApp();
  }, []);

  const save = list => {
    const todos = list.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    setTodos(todos);
    setAllTodos(todos);
  };

  const onSignIn = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        setCurrentUser({
          uid: user.uid,
          email: user.user.email
        });

        ReactGA.event({
          uid: user.uid,
          category: "User",
          action: "Signed in",
          label: user.user.uid
        });
      })
      .catch(error => {
        console.log("Account not found, creating a new one!");
        createUserAccount(email, password);
        ReactGA.exception({
          fatal: true,
          description: "Account not found"
        });
      });
  };

  const createUserAccount = (email, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        setCurrentUser({
          uid: user.uid,
          email: user.user.email
        });
        ReactGA.event({
          category: "User",
          email: user.user.email,
          action: "Created an account"
        });
      })
      .catch(error => {
        ReactGA.exception({
          fatal: true,
          description: "Failed to create account"
        });
        console.log("Failed to create new account!");
      });
  };

  const onSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(
        () => {
          console.log("Signed Out");
          ReactGA.event({
            category: "User",
            action: "Signed out"
          });
          setCurrentUser({ uid: "" });
          save([]);
        },
        error => {
          console.error("Sign Out Error", error);
          ReactGA.exception({
            fatal: true,
            description: "An error ocurred signing out"
          });
        }
      );
  };

  const submitTodo = (body, id) => {
    const isEditing = id !== undefined;
    isEditing ? editTodo(id, body) : createNewTodo(body);
  };

  const createNewTodo = body => {
    ReactGA.event({
      category: "User",
      action: "Created a todo"
    });
    const newTodo = {
      body: body,
      status: "Active",
      uid: currentUser.uid,
      createdAt: new Date().toUTCString()
    };

    setNewTodoItem("");
    saveToFireStore(newTodo);
    setBgImage({
      backgroundImage: `url(${randomBackgroundImage()})`
    });
  };

  const editTodo = (id, body) => {
    const updatedTodo = todos.find(todo => todo.id === id);
    const foundIndex = todos.findIndex(todo => todo.id === id);

    updatedTodo.body = body;
    todos[foundIndex] = updatedTodo;

    ReactGA.event({
      value: id,
      category: "User",
      action: "Edited a todo"
    });

    saveToFireStore(id);
  };

  const saveToFireStore = id => {
    const db = firebase.firestore().collection("todos");

    const isUpdatingTodo = typeof id === "string";

    if (isUpdatingTodo) {
      const newTodo = todos.find(todo => todo.id === id);
      db.doc(id).set(newTodo);
    } else {
      const newTodo = id;
      db.doc().set(newTodo);
    }
  };

  const keyPress = e => {
    if (e.keyCode === 13) submitTodo(newTodoBody, undefined);
  };

  const onToggleTodo = id => {
    const newTodo = todos.find(todo => todo.id === id);
    const foundIndex = todos.findIndex(todo => todo.id === id);

    newTodo.status = newTodo.status === "Done" ? "Active" : "Done";
    todos[foundIndex] = newTodo;
    ReactGA.event({
      value: id,
      category: "User",
      action: "Edited a todo"
    });
    saveToFireStore(id);
  };

  const setNewFilter = type => {
    setFilter(type);
    if (type === null) return setTodos(allTodos);
    const todos = allTodos.filter(todo => todo.status === type);
    setTodos(todos);
  };

  const onDeleteTodo = id => {
    const db = firebase.firestore().collection("todos");
    ReactGA.event({
      value: id,
      category: "User",
      action: "Deleted a todo"
    });
    db.doc(id)
      .delete()
      .then()
      .catch(error => {
        console.error("Error removing document: ", error);
        ReactGA.exception({
          fatal: true,
          description: "An error ocurred deleting a"
        });
      });
  };

  return (
    <div className="App" style={bgImage}>
      <Navbar
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        currentUser={currentUser}
      />
      <TodoInput
        keyPress={keyPress}
        newTodoBody={newTodoBody}
        currentUser={currentUser}
        setNewTodoItem={setNewTodoItem}
      />
      <SortingOptions
        filter={filter}
        allTodos={allTodos}
        setNewFilter={setNewFilter}
      />
      <TodoList
        todos={todos}
        loading={loading}
        currentUser={currentUser}
        submitEditTodo={submitTodo}
        onToggleTodo={onToggleTodo}
        onDeleteTodo={id => onDeleteTodo(id)}
      />
      <Footer hitCount={hitCount} />
    </div>
  );
}

const Routes = () => (
  <Router>
    <Route path="/" component={App} />
  </Router>
);

export default Routes;



