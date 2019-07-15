import React, { useState, useEffect, useRef } from "react";

import firebase from "firebase";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import TodoList from "./components/TodoList";
import TodoInput from "./components/TodoInput";
import SortingOptions from "./components/SortingOptions";

import { randomBackgroundImage } from "./utils";

import "./App.css";

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

function App() {
  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [newTodoBody, setNewTodoItem] = useState("");
  const [allTodoItems, setAllTodoItems] = useState([]);
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

  const setupApp = () => {
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
    setAllTodoItems(todos);
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
      })
      .catch(error => {
        console.log("Account not found, creating a new one!");
        createUserAccount(email, password);
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
      })
      .catch(error => {
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
          setCurrentUser({ uid: "" });
          save([]);
        },
        error => {
          console.error("Sign Out Error", error);
        }
      );
  };

  const submitTodo = (body, id) => {
    const isEditing = id !== undefined;
    isEditing ? editTodo(id, body) : createNewTodo(body);
  };

  const createNewTodo = body => {
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

    saveToFireStore(id);
  };

  const saveToFireStore = id => {
    const db = firebase.firestore().collection("todos");

    let jsonTodo;
    const isUpdatingTodo = typeof id === "string";

    if (isUpdatingTodo) {
      const newTodo = todos.find(todo => todo.id === id);
      jsonTodo = JSON.parse(JSON.stringify(newTodo));
      db.doc(id).set(jsonTodo);
    } else {
      jsonTodo = JSON.parse(JSON.stringify(id));
      db.doc().set(jsonTodo);
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

    saveToFireStore(id);
  };

  const setNewFilter = type => {
    setFilter(type);
    if (type === null) return setTodos(allTodoItems);
    const todos = allTodoItems.filter(todo => todo.status === type);
    setTodos(todos);
  };

  const onDeleteTodo = id => {
    const db = firebase.firestore().collection("todos");
    db.doc(id)
      .delete()
      .then()
      .catch(error => {
        console.error("Error removing document: ", error);
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
        allTodoItems={allTodoItems}
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
      <Footer />
    </div>
  );
}

const RoutedApp = () => (
  <Router>
    <Route path="/" component={App} />
  </Router>
);

export default RoutedApp;
