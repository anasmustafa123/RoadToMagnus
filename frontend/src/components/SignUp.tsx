import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { notify } from "../scripts/toast";
import { validateEmail, validatePassword } from "../scripts/validate";
import { Link, useNavigate } from "react-router-dom";
import { getUserInfo as lichessVerify } from "../api/lichessApiAccess";
import { getUserInfo as chessVerify } from "../api/chessApiAccess";
const SignUp = () => {
  const navigate = useNavigate();
  const {
    setChessDCUsername,
    setChessDCAvatarLink,
    setUserLicehessname,
    setUsername,
  } = useContext(UserContext);
  const [passwordInputType, setPasswordInputType] = useState("password");
  const [confirmPasswordInputType, setconfirmPasswordInputType] =
    useState("password");
  //0: no loading, 1: loading
  const [loading, setloading] = useState({ chessdotcom: 0, lichess: 0 });
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    IsAccepted: false,
    lichess: "",
    chessdotcom: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    IsAccepted: "",
    lichess: "",
    chessdotcom: "",
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

  const register = async (obj) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      }
    );
    return res.json();
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (
      data.name !== "" &&
      data.email != "" &&
      errors.name == "" &&
      errors.email == "" &&
      errors.password == "" &&
      errors.confirmPassword == "" &&
      errors.IsAccepted == "" &&
      data.IsAccepted == true
    ) {
      if (!data.lichess && !data.chessdotcom) {
        notify(
          "U have to add either chess.com or lichess usernames, or both",
          "error"
        );
      } else {
        register({
          name: data.name,
          email: data.email,
          password: data.password,
          lichessUsername: data.lichess ? data.lichess : "",
          chessUsername: data.chessdotcom ? data.chessdotcom : "",
        }).then((response) => {
          setUsername(data.name);
          console.log({ response });
          navigate('/')
          response.ok
            ? notify("user credintials added successfully", "success")
            : notify(response.message, "error");
        });
      }
    } else {
      notify("Complete  info", "error");
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
          <div
            className={
              !data.name
                ? styles.unCompleted
                : errors.name
                ? styles.unCompleted_error
                : styles.completed
            } 
          >
            <input
              type="text"
              name="name"
              value={data.name}
              placeholder="Name"
              onChange={(e) => {
                let newname = changeHandler(e);
                let newerr = "";
                if (!newname.trim()) {
                  newerr = "Username is Required!";
                }
                setErrors((old) => {
                  old.name = newerr;
                  return old;
                });
              }}
              autoComplete="off"
            />
            <i className="bx bx-user-circle"></i>
          </div>
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        <div>
          <div
            className={
              !data.email
                ? styles.unCompleted
                : errors.email
                ? styles.unCompleted_error
                : styles.completed
            }
          >
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
            className={
              !data.password
                ? styles.unCompleted
                : errors.password
                ? styles.unCompleted_error
                : styles.completed
            }
          >
            <input
              type={passwordInputType}
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
          <div
            className={
              !data.confirmPassword
                ? styles.unCompleted
                : errors.confirmPassword
                ? styles.unCompleted_error
                : styles.completed
            }
          >
            <input
              type={confirmPasswordInputType}
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
            <i
              onClick={() => {
                if (confirmPasswordInputType == "password") {
                  setconfirmPasswordInputType("text");
                } else {
                  setconfirmPasswordInputType("password");
                }
              }}
              className={
                confirmPasswordInputType == "password"
                  ? "bx bxs-lock"
                  : "bx bxs-lock-open"
              }
            ></i>
          </div>
          {errors.confirmPassword && (
            <span className={styles.error}>{errors.confirmPassword}</span>
          )}
        </div>
        <div>
          <div
            className={
              !data.lichess
                ? styles.unCompleted
                : errors.lichess || loading.lichess != 2
                ? styles.unCompleted_error
                : styles.completed
            }
          >
            <input
              name="lichess"
              value={data.lichess}
              onChange={(e) => {
                setloading((old) => {
                  const copy = { ...old };
                  copy.lichess = 0;
                  return copy;
                });
                changeHandler(e);
              }}
              type="text"
              placeholder="Enter lichess.org username"
            />
            <img src="/logos/lichess.png" alt="lichess logo" />
            {!loading.lichess ? (
              <button
                onClick={() => {
                  if (data.lichess == "") {
                    setErrors((old) => {
                      const copy = { ...old };
                      copy.lichess = "empty lichess username";
                      return copy;
                    });
                    notify("empty lichess username", "error");
                  } else {
                    lichessVerify(data.lichess).then((res) => {
                      console.log({ res });
                      if (res.ok) {
                        setUserLicehessname(res.data.username);
                        notify("lichess verified", "success");
                        setErrors((old) => {
                          const copy = { ...old };
                          copy.lichess = "";
                          return copy;
                        });
                        setloading((old) => {
                          const copy = { ...old };
                          old.lichess = 2;
                          return copy;
                        });
                      } else {
                        notify("wrong lichess username", "error");
                        setloading((old) => {
                          const copy = { ...old };
                          old.lichess = 0;
                          return copy;
                        });
                        setErrors((old) => {
                          const copy = { ...old };
                          copy.lichess = "wrong lichess username";
                          return copy;
                        });
                      }
                    });
                  }
                }}
                type="button"
                className={styles.verifyButtonLichess}
              >
                verify
              </button>
            ) : (
              loading.lichess == 1 && (
                <img
                  className={styles.loading}
                  src="/login/loading.gif"
                  alt=""
                />
              )
            )}
          </div>
          {errors.lichess && (
            <span className={styles.error}>{errors.lichess}</span>
          )}
        </div>
        <div>
          <div
            className={
              !data.chessdotcom
                ? styles.unCompleted
                : errors.chessdotcom || loading.chessdotcom != 2
                ? styles.unCompleted_error
                : styles.completed
            }
          >
            <input
              name="chessdotcom"
              value={data.chessdotcom}
              onChange={(e) => {
                setloading((old) => {
                  const copy = { ...old };
                  copy.chessdotcom = 0;
                  return copy;
                });
                changeHandler(e);
              }}
              type="text"
              placeholder="Enter chess.com username"
            />
            <img src="/logos/chessdotcom.png" alt="chess.com logo" />
            {!loading.chessdotcom ? (
              <button
                type="button"
                onClick={(e) => {
                  if (data.chessdotcom == "") {
                    setErrors((old) => {
                      const copy = { ...old };
                      copy.chessdotcom = "empty chess.com username";
                      return copy;
                    });
                    notify("empty chess.com username", "error");
                  } else {
                    chessVerify(data.chessdotcom).then((res) => {
                      console.log(res);
                      if (res.ok) {
                        console.log(typeof setChessDCAvatarLink);
                        setChessDCAvatarLink(res.data.avatar);
                        setChessDCUsername(res.data.username);
                        console.log({ playeravatar: res.data.avatar });
                        notify("chess.com verified", "success");
                        setErrors((old) => {
                          const copy = { ...old };
                          copy.chessdotcom = "";
                          return copy;
                        });
                        setloading((old) => {
                          const copy = { ...old };
                          old.chessdotcom = 2;
                          return copy;
                        });
                      } else {
                        notify("wrong chess.com username", "error");
                        setloading((old) => {
                          const copy = { ...old };
                          old.chessdotcom = 0;
                          return copy;
                        });
                        setErrors((old) => {
                          const copy = { ...old };
                          copy.chessdotcom = "wrong lichess username";
                          return copy;
                        });
                      }
                    });
                  }
                }}
                className={styles.verifyButtonChessdotcom}
              >
                verify
              </button>
            ) : (
              loading.chessdotcom == 1 && (
                <img
                  className={styles.loading}
                  src="/login/loading.gif"
                  alt=""
                />
              )
            )}
          </div>
          {errors.chessdotcom && (
            <span className={styles.error}>{errors.chessdotcom}</span>
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
              color: "var(--secondary-color)",
              textAlign: "center",
              display: "inline-block",
              width: "100%",
            }}
          >
            Already have a account?{" "}
            <Link style={{ fontWeight: "700" }} to="/login">
              Log In
            </Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUp;