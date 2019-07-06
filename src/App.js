import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";

import TodoItem from "./components/TodoItem";
import SignInForm from "./components/SignInForm";
import Footer from "./components/Footer";

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
  const [currentUser, setCurrentUser] = useState({ uid: "", email: "" });

  useEffect(() => {
    function setupApp() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email
          });

          const db = firebase.firestore();
          const todosRef = db.collection("todos");
          const query = todosRef.where("uid", "==", user.uid);

          const todos = [];

          query
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                const todo = {
                  ...doc.data(),
                  id: doc.id
                };
                todos.push(todo);
              });

              setTodoList(todos);
              setAllTodoItems(todos);
            })
            .catch(error => {
              console.log("Error getting document:", error);
            });
        } else {
          setCurrentUser({ uid: "" });
        }
      });
    }
    setupApp();
  }, []);

  const onSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        setCurrentUser({
          uid: user.uid,
          email: user.user.email
        });
        setPassword("");
        setEmail("");
      })
      .catch(error => {
        console.log("Account not found, creating a new one!");
        createUserAccount();
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
          setAllTodoItems([]);
          setTodoList([]);
        },
        error => {
          console.error("Sign Out Error", error);
        }
      );
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
      .catch(error => {
        console.log("Failed to create new account!");
      });
  };

  const createNewTodo = body => {
    const db = firebase.firestore();
    const newTodo = {
      body: body,
      status: "active",
      uid: currentUser.uid
    };

    const jsonTodo = JSON.parse(JSON.stringify(newTodo));
    db.collection("todos")
      .doc()
      .set(jsonTodo);

    const newTodoList = [...todoList, newTodo];
    setTodoList(newTodoList);
    setAllTodoItems(newTodoList);
    setNewTodoItem("");
  };

  const editTodo = (id, body) => {
    const updatedTodo = todoList.find(todo => todo.id === id);
    updatedTodo.body = body;

    let foundIndex = todoList.findIndex(todo => todo.id === id);

    todoList[foundIndex] = updatedTodo;

    const newTodoList = [...todoList];
    setTodoList(newTodoList);
    setAllTodoItems(newTodoList);
    saveToFireStore(id);
  };

  const submitTodo = (body, idx) => {
    if (idx !== undefined) {
      editTodo(idx, body);
    } else {
      createNewTodo(body);
    }
  };

  const saveToFireStore = id => {
    const db = firebase.firestore();
    const newTodo = todoList.find(todo => todo.id === id);
    const jsonTodo = JSON.parse(JSON.stringify(newTodo));
    console.log('saveToFireStore', id)
    if (id) {
      db.collection("todos")
        .doc(id)
        .set(jsonTodo);
    } else {
      db.collection("todos")
        .doc()
        .set(jsonTodo);
    }
  };

  const keyPress = e => {
    if (e.keyCode === 13) submitTodo(newTodoBody);
  };

  const onToggleTodo = id => {
    const newTodo = todoList.find(todo => todo.id === id);

    if (newTodo.status === "done") {
      newTodo.status = "active";
    } else {
      newTodo.status = "done";
    }

    let foundIndex = todoList.findIndex(todo => todo.id === id);
    todoList[foundIndex] = newTodo;

    const newTodoList = [...todoList];

    setTodoList(newTodoList);
    setAllTodoItems(newTodoList);
    saveToFireStore(id);
  };

  const setNewFilter = type => {
    if (type === null) return setTodoList(allTodoItems);
    const filteredTodoList = allTodoItems.filter(todo => todo.status === type);
    setTodoList(filteredTodoList);
  };

  const onDeleteTodo = id => {
    const db = firebase.firestore();
    const todoRef = db.collection("todos");
    todoRef
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  };

  const allTodoItemsCount = allTodoItems.length;
  const doneTodoItemsCount = allTodoItems.filter(todo => todo.status === "done")
    .length;
  const activeTodoItemsCount = allTodoItems.filter(
    todo => todo.status === "active"
  ).length;

  return (
    <div
      className="App"
      style={{
        backgroundImage:
          "url(" +
          "https://c.pxhere.com/photos/fe/10/sunset_day_summer_sky_beauty_blue_sky_sunny_day_nature-634629.jpg!d" +
          ")",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="Navigation">
        {process.env.REACT_APP_TEST}
        {currentUser.uid !== "" ? (
          <button className="" onClick={onSignOut}>
            Sign Out
          </button>
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
      <h1 className="Prompt">Get Job Todo List</h1>
      <input
        autoFocus
        value={newTodoBody}
        onKeyDown={keyPress}
        className="NewTodoInput"
        placeholder={`Enter todo here ${
          currentUser.email !== undefined ? currentUser.email : ""
        }`}
        onChange={e => {
          setNewTodoItem(e.target.value);
        }}
      />
      <div className="SortingButtons">
        <button className="Btn" onClick={() => setNewFilter(null)}>
          All {allTodoItemsCount}
        </button>
        <button className="Btn" onClick={() => setNewFilter("done")}>
          Done {doneTodoItemsCount}
        </button>
        <button className="Btn" onClick={() => setNewFilter("active")}>
          Active {activeTodoItemsCount}
        </button>
      </div>
      <div className="TodoContainer">
        {todoList.map((todo, idx) => {
          return (
            <TodoItem
              idx={idx}
              todo={todo}
              id={todo.id}
              key={todo.id}
              onKeyDown={keyPress}
              submitEditTodo={submitTodo}
              onToggleTodo={onToggleTodo}
              onDeleteTodo={onDeleteTodo}
            />
          );
        })}
      </div>
      <div />
      <Footer />
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
