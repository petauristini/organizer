import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegister from "./components/Login-Register/LoginRegister";
import ToDoList from "./components/todolist/ToDoList";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" >
        <Route index element={<ToDoList />} />
        <Route path="login" element={<LoginRegister role="Login" />} />
        <Route path="register" element={<LoginRegister role="Register" />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
