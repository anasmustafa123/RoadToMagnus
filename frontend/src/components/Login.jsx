import React, { useState, useEffect } from "react";
import styles from "../styles/SignUp.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "../scripts/toast";
import { Link } from "react-router-dom";
import axios from "axios";
import { validateEmail, validatePassword } from "../scripts/validate";
const Login = () => {
  const [passwordInputType, setPasswordInputType] = useState("password");
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const chaeckData = (obj) => {
    const { email, password } = obj;
    const res = fetch(`${import.meta.env.VITE_BACKEND_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify()
    });
    const urlApi = `https://lightem.senatorhost.com/login-react/index.php?email=${email.toLowerCase()}&password=${password}`;
    const api = axios
      .get(urlApi)
      .then((response) => response.data)
      .then((data) =>
        data.ok
          ? notify("You login to your account successfully", "success")
          : notify("Your password or your email is wrong", "error")
      );
    toast.promise(api, {
      pending: "Loading your data...",
      success: false,
      error: "Something went wrong!",
    });
  };

  const changeHandler = (event) => {
    if (event.target.name === "IsAccepted") {
      setData({ ...data, [event.target.name]: event.target.checked });
      return event.target.checked;
    } else {
      setData({ ...data, [event.target.name]: event.target.value });
      return event.target.value;
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (errors.email == "" && errors.password == "") {
      chaeckData(data);
    } else {
      console.log("fuck");
    }
  };

  return (
    <div className={styles.container}>
      <form
        className={styles.formLogin}
        onSubmit={submitHandler}
        autoComplete="off"
      >
        <h2>Sign In</h2>
        <div>
          <div>
            <input
              type="text"
              name="email"
              value={data.email}
              placeholder="E-mail"
              onChange={(e) => {
                let newemail = changeHandler(e);
                const res = validateEmail(newemail);
                let newerrors = "";
                if (!res.ok) {
                  newerrors = res.message;
                }
                setErrors((old) => {
                  old.email = newerrors;
                  return old;
                });
              }}
              autoComplete="off"
            />
            <i className="bx bxl-gmail"></i>
          </div>
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>
        <div>
          <div>
            <input
              type={passwordInputType}
              name="password"
              value={data.password}
              placeholder="Password"
              onChange={(e) => {
                let newpass = changeHandler(e);
                const res = validatePassword(newpass);
                let newerrors = "";
                if (!res.ok) {
                  newerrors = res.message;
                }
                setErrors((old) => {
                  old.password = newerrors;
                  return old;
                });
              }}
              autoComplete="off"
            />
            <i
              onClick={() => {
                if (passwordInputType == "password") {
                  setPasswordInputType("text");
                } else {
                  setPasswordInputType("password");
                }
              }}
              className="bx bxs-lock"
            ></i>
          </div>
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </div>

        <div>
          <button type="submit">Login</button>
          <span
            style={{
              color: "#a29494",
              textAlign: "center",
              display: "inline-block",
              width: "100%",
            }}
          >
            Don't have a account? <Link to="/register">Create account</Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
