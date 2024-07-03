import React, { useState } from "react";
import styles from "../styles/SignUp.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { notify } from "../scripts/toast";
import { Link } from "react-router-dom";
import axios from "axios";
import { validateEmail, validatePassword } from "../scripts/validate";
const SignUp = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    IsAccepted: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    IsAccepted: false,
  });

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
    if (
      errors.name == "" &&
      errors.email == "" &&
      errors.password == "" &&
      errors.confirmPassword == "" &&
      errors.IsAccepted == ""
    ) {
      // Pushing data to database usuing PHP script
      const urlApi = `https://lightem.senatorhost.com/login-react/index.php?email=${data.email.toLowerCase()}&password=${
        data.password
      }&register=true`;
      const pushData = async () => {
        const responseA = axios.get(urlApi);
        const response = await toast.promise(responseA, {
          pending: "Check your data",
          success: "Checked!",
          error: "Something went wrong!",
        });
        if (response.data.ok) {
          notify("You signed Up successfully", "success");
        } else {
          notify(
            "You have already registered, log in to your account",
            "warning"
          );
        }
      };
      pushData();
    } else {
      notify("Complete your info", "error");
    }
  };

  return (
    <div className={styles.container}>
      <form
        className={styles.formLogin}
        onSubmit={submitHandler}
        autoComplete="off"
      >
        <h2>Sign Up</h2>
        <div>
          <div className={errors.name ? styles.unCompleted : styles.completed}>
            <input
              type="text"
              name="name"
              value={data.name}
              placeholder="Name"
              onChange={(e) => {
                let newname = changeHandler(e);
                if (!newname.trim()) {
                  setErrors((old) => {
                    old.name = "Username is Required!";
                    return old;
                  });
                }
              }}
              autoComplete="off"
            />
            <i className="bx bx-user-circle"></i>
          </div>
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        <div>
          <div className={errors.email ? styles.unCompleted : styles.completed}>
            <input
              type="text"
              name="email"
              value={data.email}
              placeholder="E-mail"
              onChange={(e) => {
                const newemail = changeHandler(e);
                let res = validateEmail(newemail);
                !res.ok
                  ? setErrors((old) => {
                      old.email = res.message;
                      return old;
                    })
                  : setErrors((old) => {
                      old.email = "";
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
          <div
            className={errors.password ? styles.unCompleted : styles.completed}
          >
            <input
              type="password"
              name="password"
              value={data.password}
              placeholder="Password"
              onChange={(e) => {
                const newpass = changeHandler(e);
                let res = validatePassword(newpass);
                console.log({ res });
                !res.ok
                  ? setErrors((old) => {
                      old.password = res.message;
                      return old;
                    })
                  : setErrors((old) => {
                      old.password = "";
                      return old;
                    });
              }}
              autoComplete="off"
            />
            <i className="bx bxs-lock"></i>
          </div>
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </div>
        <div>
          <div
            className={
              errors.confirmPassword ? styles.unCompleted : styles.completed
            }
          >
            <input
              type="password"
              name="confirmPassword"
              value={data.confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => {
                const newconfirm = changeHandler(e);
                if (!newconfirm) {
                  setErrors((old) => {
                    old.confirmPassword = "Confirm the Password";
                    return old;
                  });
                } else if (newconfirm !== data.password) {
                  setErrors((old) => {
                    old.confirmPassword = "Password is not match!";
                    return old;
                  });
                } else {
                  setErrors((old) => {
                    old.confirmPassword = "";
                    return old;
                  });
                }
              }}
              autoComplete="off"
            />
            <i className="bx bxs-lock"></i>
          </div>
          {errors.confirmPassword && (
            <span className={styles.error}>{errors.confirmPassword}</span>
          )}
        </div>
        <div>
          <div className={styles.terms}>
            <input
              type="checkbox"
              name="IsAccepted"
              value={data.IsAccepted}
              id="accept"
              onChange={changeHandler}
            />
            <label htmlFor="accept">I accept terms of privacy policy</label>
          </div>
          {errors.IsAccepted && (
            <span className={styles.error}>{errors.IsAccepted}</span>
          )}
        </div>
        <div>
          <button type="submit">Create Account</button>
          <span
            style={{
              color: "#a29494",
              textAlign: "center",
              display: "inline-block",
              width: "100%",
            }}
          >
            Already have a account? <Link to="/login">Log In</Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
