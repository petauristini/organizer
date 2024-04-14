import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import checkAuth from "../../utils/checkAuth";
import "./Login-Register.css";

function LoginRegister(props) {
  const navigate = useNavigate();
  const [loginHover, setLoginHover] = useState(false);
  const [registerHover, setRegisterHover] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    const checkAuthentication = async () => {
      const result = await checkAuth();
      if (result) {
        navigate("/");
      }
    };
  
    checkAuthentication();
  }, [navigate]);
  

  async function handleSubmit (event) {
    event.preventDefault();
    try {
      await axios.post((props.role === "Login") ? "/api/login" : "/api/register", { username: credentials.username, email: credentials.email, password: credentials.password });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="login-register-container">
      <h1 className="heading">{props.role}</h1>
      <form onSubmit={handleSubmit}>
        <input type="username" name="username" placeholder="Username" onChange={(e) => setCredentials({...credentials, username: e.target.value})} value={credentials.username}/>
        {(props.role === "Login") ? null : <input type="email" name="email" placeholder="Email" onChange={(e) => setCredentials({...credentials, email: e.target.value})} value={credentials.email}/>}
        <input type="password" name="password" placeholder="Password" onChange={(e) => setCredentials({...credentials, password: e.target.value})} value={credentials.password}/>
        <div className="submit-area">
          <button
            className="submit-button"
            type="submit"
            value="Submit"
            onMouseOver={() => setLoginHover(true)}
            onMouseOut={() => setLoginHover(false)}
            style={loginHover ? { backgroundColor: "#5c0a8f" } : {}}
          >
            {props.role}
          </button>
          <button
            className="submit-button"
            onClick={() => navigate((props.role === "Login") ? "/register" : "/login")}
            onMouseOver={() => setRegisterHover(true)}
            onMouseOut={() => setRegisterHover(false)}
            style={registerHover ? { backgroundColor: "#5c0a8f" } : {}}
          >
            {(props.role === "Login") ? "Register" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginRegister;
