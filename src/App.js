import React, { useState, useEffect } from "react";

import firebase from "firebase";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Footer from "./components/Footer";
import TodoList from "./components/TodoList";
import TodoInput from "./components/TodoInput";
import Navigation from "./components/Navigation";
import FilterButton from "./components/FilterButton";

import "./App.css";
const IMAGES = [
  'https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_769,f_auto/w_80,x_15,y_15,g_south_west,l_klook_water/activities/jvlq5g5bokihkxwmxj2f/AoDaiShowTicketinHue.jpg',
  'https://images5.alphacoders.com/324/324310.jpg',
  'https://cdn.wallpapersafari.com/84/87/qUcZf8.jpg',
  'https://cdn.wallpapersafari.com/86/35/yRkorx.jpg',
  'https://cdn.wallpapersafari.com/14/39/3dmw0N.jpg',
  'https://cdn.wallpapersafari.com/75/11/9p5exb.jpg',
  'https://cdn.wallpapersafari.com/60/77/6DsTgo.jpg',
  'https://cdn.wallpapersafari.com/20/42/TV57dP.jpg',
  'https://cdn.wallpapersafari.com/60/36/3qsjr1.jpg',
  'https://cdn.wallpapersafari.com/18/90/iNWHCZ.jpg',
  'https://cdn.wallpapersafari.com/83/29/JZlAdc.jpg',
  'https://cdn.wallpapersafari.com/18/30/SsH8Tf.jpg',
  'https://cdn.wallpapersafari.com/17/92/QmSeLj.jpg',
  'https://cdn.wallpapersafari.com/66/84/j91dOS.jpg',
  'https://bestwallpapers.in/wp-content/uploads/2018/04/abstract-pattern-colorful-4k-wallpaper-3840x2160.jpg',
  'https://cdn.cnn.com/cnnnext/dam/assets/171222140328-03-plastic-straws-stock-full-169.jpg'
]

const randomBackgroundImage = () => IMAGES[Math.floor(Math.random() * IMAGES.length)];

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
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [newTodoBody, setNewTodoItem] = useState("");
  const [allTodoItems, setAllTodoItems] = useState([]);
  const [currentUser, setCurrentUser] = useState({ uid: "", email: "" });

  useEffect(() => {
    const setupApp = () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email
          });

          const db = firebase.firestore();
          const todosRef = db.collection("todos");
          const query = todosRef
            .where("uid", "==", user.uid)
            .orderBy("createdAt", "asc");

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
              save(todos);
            })
            .catch(error => {
              console.log("Error getting document:", error);
            });
        } else {
          setCurrentUser({ uid: "" });
        }
        setLoading(false);
      });
    };
    setupApp();
  }, [newTodoBody]);

  const save = list => {
    setAllTodoItems(list);
    setTodoList(list);
  };

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

  const submitTodo = (body, idx) => {
    if (idx !== undefined) {
      editTodo(idx, body);
    } else {
      createNewTodo(body);
    }
  };

  const createNewTodo = body => {
    const db = firebase.firestore();
    const newTodo = {
      body: body,
      status: "active",
      uid: currentUser.uid,
      createdAt: new Date()
    };

    const jsonTodo = JSON.parse(JSON.stringify(newTodo));
    db.collection("todos")
      .add(jsonTodo)
      .then(docRef => {
        newTodo.id = docRef.id;
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
    const newTodoList = [...todoList, newTodo];
    save(newTodoList);
    setNewTodoItem("");
  };

  const editTodo = (id, body) => {
    const updatedTodo = todoList.find(todo => todo.id === id);
    updatedTodo.body = body;
    const foundIndex = todoList.findIndex(todo => todo.id === id);
    todoList[foundIndex] = updatedTodo;
    const newTodoList = [...todoList];
    save(newTodoList);
    saveToFireStore(id);
  };

  const saveToFireStore = id => {
    const db = firebase.firestore();
    const newTodo = todoList.find(todo => todo.id === id);
    const jsonTodo = JSON.parse(JSON.stringify(newTodo));
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
    save(newTodoList);
    saveToFireStore(id);
  };

  const setNewFilter = type => {
    if (type === null) return setTodoList(allTodoItems);
    const filteredTodoList = allTodoItems.filter(todo => todo.status === type);
    setTodoList(filteredTodoList);
  };

  const renderPrompt = () => {
    const isSignedIn =
      currentUser.email !== "" && currentUser.email !== undefined;
    if (isSignedIn && todoList.length === 0) {
      return <h1 className="Prompt">So many todos, so little time...</h1>;
    } else if (currentUser.email !== "" && todoList.length === 0) {
      return <h1 className="Prompt">Signin to save your todos</h1>;
    }
  };

  const onDeleteTodo = id => {
    const db = firebase.firestore();
    const todoRef = db.collection("todos");
    todoRef
      .doc(id)
      .delete()
      .then(() => {
        const newTodoList = todoList.filter(todo => todo.id !== id);
        save(newTodoList);
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

  const rdmBgImage = {
    backgroundImage: `url(${randomBackgroundImage()})`
  }
  return (
    <div className="App" style={rdmBgImage}>
      <Navigation
        email={email}
        password={password}
        onSignIn={onSignIn}
        setEmail={setEmail}
        onSignOut={onSignOut}
        setPassword={setPassword}
        currentUser={currentUser}
      />
      <TodoInput
        keyPress={keyPress}
        newTodoBody={newTodoBody}
        currentUser={currentUser}
        setNewTodoItem={setNewTodoItem}
      />
      <div className="SortingButtons">
        <FilterButton
          prompt="All"
          count={allTodoItemsCount}
          setNewFilter={() => setNewFilter(null)}
        />
        <FilterButton
          prompt="Done"
          count={doneTodoItemsCount}
          setNewFilter={() => setNewFilter("done")}
        />
        <FilterButton
          prompt="Active"
          count={activeTodoItemsCount}
          setNewFilter={() => setNewFilter("active")}
        />
      </div>
      <div className="TodoContainer">
        {loading && <div className="loader" />}
        {renderPrompt()}
        <TodoList
          todoList={todoList}
          onKeyDown={keyPress}
          submitEditTodo={submitTodo}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
        />
      </div>
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
