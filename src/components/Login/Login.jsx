import axios from "axios";
import React, { useState } from "react";

const Login = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [status, setStatus] = useState({});
  let formdata = new FormData();
  formdata.append("email", email);
  formdata.append("password", password);
  function handleSubmit(e) {
    e.preventDefault(e);
    axios
      .post(
        "http://localhost:4000/api/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-type": "application/json",
          },
        }
      )
      .then((rep) => {
        console.log(rep.data);
        setStatus(rep.data);
      })
      .catch((err) => {
        setStatus(err.message);
        console.log(err.message);
      });
  }
  return (
    <div className="Login">
      <h1>Please Login </h1>
      <div className="form">
        <form onSubmit={(e) => handleSubmit(e)}>
          {/* email input */}
          <div className="email">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="email-err"> {status.email} </div>
          {/* password input */}
          <div className="password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="password-err">{status.password}</div>

          <div className="btns">
            <div className="err">{status.error}</div>
            <button>Login Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
