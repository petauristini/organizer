import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegister from "./components/Login-Register/LoginRegister";
import ToDo from "./pages/ToDo";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Header />
      <div className="main-container">
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<ToDo />} />
              <Route path="login" element={<LoginRegister role="Login" />} />
              <Route
                path="register"
                element={<LoginRegister role="Register" />}
              />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
    </div>
  );
}

export default App;
