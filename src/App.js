import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";

import TodoItem from "./components/TodoItem";
import SignInForm from "./components/SignInForm";

const firebaseConfig = {
  storageBucket: "",
  projectId: process.env.REACT_APP_PROJECT_ID,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  appId: process.env.REACT_APP_APP_ID,
  apiKey: process.env.REACT_APP_API_KEY,
  databaseURL: process.env.REACT_APP_DATABASE_URL
};

firebase.initializeApp(firebaseConfig);




function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [newTodoBody, setNewTodoItem] = useState("");
  const [allTodoItems, setAllTodoItems] = useState([]);
  const [currentUser, setCurrentUser] = useState({ uid: '', email: '' });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email
        })

        const db = firebase.firestore();
        const todosRef = db.collection("todos");
        const query = todosRef.where("uid", "==", user.uid);

        const todos = [];

        query
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              todos.push(doc.data());
            });

            setTodoList(todos);
            setAllTodoItems(todos);
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
          });
      } else {
        setCurrentUser({ uid: "" });
      }
    });
  }, []);

  const onSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(
        function() {
          console.log("Signed Out");
          setCurrentUser({ uid: "" });
          setAllTodoItems([]);
          setTodoList([]);
        },
        function(error) {
          console.error("Sign Out Error", error);
        }
      );
  };

  const onSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        console.log("user", user);
        setCurrentUser({
          uid: user.uid,
          email: user.user.email
        });
        setPassword("");
        setEmail("");
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Account not found, creating.");
        createUserAccount();
      });
  };

  const createUserAccount = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        setCurrentUser({
          uid: user.uid,
          email: user.user.email
        });
        setPassword("");
        setEmail("");
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  };

  const submitNewTodoItem = (body, idx) => {
    let newTodoList;

    if (idx !== undefined) {
      const updatingTodoItem = todoList[idx];
      updatingTodoItem.body = body;
      todoList[idx] = updatingTodoItem;
      newTodoList = [ ...todoList ]
    } else {
      const newItem = {
        status: "active",
        uid: currentUser.uid,
        body: newTodoBody || body,
      };
      
      newTodoList = [...todoList, newItem];
      
      const db = firebase.firestore();
      let go = JSON.parse(JSON.stringify(newItem))
      db.collection("todos")
        .doc()
        .set(go)
        .then(la => {
          console.log('lalal', la)
        });
      setNewTodoItem("");
    }
    setTodoList(newTodoList);
    setAllTodoItems(newTodoList);
  };

  const keyPress = (e) => {
    if (e.keyCode === 13) submitNewTodoItem();
  };

  const onToggleTodo = idx => {
    const newTodo = todoList[idx];
    if (newTodo.status === "done") {
      newTodo.status = "active";
    } else {
      newTodo.status = "done";
    }

    todoList[idx] = newTodo;
    const newTodoList = [...todoList];
    setTodoList(newTodoList);
  };

  const setNewFilter = type => {
    if (type === null) return setTodoList(allTodoItems);
    const filteredTodoList = allTodoItems.filter(todo => todo.status === type);
    setTodoList(filteredTodoList);
  };

  const onEditTodo = idx => {
    const newTodoItem = {
      ...todoList[idx],
      isEditing: !todoList[idx].isEditing
    };

    todoList[idx] = newTodoItem;
    const newTodoList = [...todoList];
    setTodoList(newTodoList);
  };

  const allTodoItemsCount = allTodoItems.length;
  const doneTodoItemsCount = allTodoItems.filter(todo => todo.status === "done")
    .length;
  const activeTodoItemsCount = allTodoItems.filter(
    todo => todo.status === "active"
  ).length;

  

  return (
    <div className="App">
      <div className="Navigation">
        {process.env.REACT_APP_TEST}
        {currentUser.uid !== "" ? (
          <button onClick={onSignOut}>Sign Out</button>
        ) : (
          <SignInForm
            email={email}
            password={password}
            onSignIn={onSignIn}
            setEmail={setEmail}
            setPassword={setPassword}
          />
        )}
      </div>
      <h1>Todo App</h1>
      <input
        autoFocus
        value={newTodoBody}
        onKeyDown={keyPress}
        className="NewTodoInput"
        placeholder={`Enter todo here ${currentUser.email !== undefined ? currentUser.email : ''}`}
        onChange={e => {
          setNewTodoItem(e.target.value);
        }}
      />
      <div className="SortingButtons">
        <button onClick={() => setNewFilter(null)}>
          All {allTodoItemsCount}
        </button>
        <button onClick={() => setNewFilter("done")}>
          Done {doneTodoItemsCount}
        </button>
        <button onClick={() => setNewFilter("active")}>
          Active {activeTodoItemsCount}
        </button>
      </div>
      {todoList.map((todo, idx) => {
        return (
          <TodoItem
            idx={idx}
            todo={todo}
            key={todo.body}
            onKeyDown={keyPress}
            onEditTodo={onEditTodo}
            submitNewTodoItem={submitNewTodoItem}
            onToggleTodo={onToggleTodo}
          />
        );
      })}
      <div />
    </div>
  );
}

const LaApp = () => (
  <Router>
    {/* here's a div */}
    <div>
      {/* here's a Route */}
      <Route path="/" component={App} />
    </div>
  </Router>
);

export default LaApp;
