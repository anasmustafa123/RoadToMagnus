import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import styles from "../styles/SignUp.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "../scripts/toast";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../scripts/validate";
const Login = () => {
  const navigate = useNavigate();
  const {
    isUser,
    setIsUser,
    setChessDCUsername,
    setUsername,
    setUserLicehessname,
  } = useContext(UserContext);
  const [passwordInputType, setPasswordInputType] = useState("password");
  const [data, setData] = useState({
    email: "anasanas@gma.com",
    password: "anasanas@gma.com",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isUser) navigate("/games");
  }, [isUser]);

  const loginReq = async (obj) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/auth`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      }
    );
    return res.json();
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
      loginReq(data).then((res) => {
        console.log(res);
        console.log(res.data["chess.com"])
        if (res.ok) {
          setIsUser(1);
          res.data["chess.com"] ? setChessDCUsername(res.data["chess.com"]) : "";
          res.data["lichess"] ? setUserLicehessname(res.data["lichess"]) : "";
          setUsername(res.data.name);
          notify("You login to your account successfully", "success");
        } else notify(data.message, "error");
      });
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
              className={
                passwordInputType == "password"
                  ? "bx bxs-lock"
                  : "bx bxs-lock-open"
              }
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
              color: "white",
              textAlign: "center",
              display: "inline-block",
              width: "100%",
              fontWeight: "700",
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