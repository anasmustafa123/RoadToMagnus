import React, { useState, useContext, Suspense } from 'react';
import { UserContext } from '../contexts/UserContext';
import styles from '../styles/SignUp.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from '../scripts/toast';
import {
  Await,
  Link,
  Navigate,
  useLoaderData
} from 'react-router-dom';
import { validateEmail, validatePassword } from '../scripts/validate';
import { OldUser } from '../types/User';
import { db } from '../api/Indexed';
const Login = () => {
  const { loader_data } = useLoaderData() as any;
  console.log(loader_data);
  const {
    setUser
  } = useContext(UserContext);
  const [passwordInputType, setPasswordInputType] = useState('password');
  const [data, setData] = useState({
    email: '1245l4l@dasf.com',
    password: 'anassanas',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const loginReq = async (obj: OldUser) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/auth`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(obj),
        },
      );
      return res.json();
    } catch (e) {
      throw new Error(`catched: error`);
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [event.target.name]: event.target.value });
    return event.target.value;
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (errors.email == '' && errors.password == '') {
      loginReq(data).then((res) => {
        if (res.ok) {
          setUser({
            key: res.data.userId,
            username: `${res.data['chess.com'] ? res.data['chess.com'] : ''}-${res.data['lichess'] ? res.data['lichess'] : ''}`,
            lichessdate: 0,
            chessdate: 0,
          });
          db.users.add({
            key: res.data.userId,
            username: `${res.data['chess.com'] ? res.data['chess.com'] : ''}-${res.data['lichess'] ? res.data['lichess'] : ''}`,
            lichessdate: 0,
            chessdate: 0,
          })
          notify(
            `${res.data.name} you logged to your account successfully`,
            'success',
          );
        } else notify(res.message, 'error');
      });
    }
  };

  return (
    <Suspense
      fallback={
        <>
          <img
            style={{
              width: '100vw',
              position: 'absolute',
            }}
            src="/background/loadingPage.png"
          />
        </>
      }
    >
      <Await resolve={loader_data} errorElement={<Navigate to="/profile" />}>
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
                    let newerrors = '';
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
              {errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
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
                    let newerrors = '';
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
                    if (passwordInputType == 'password') {
                      setPasswordInputType('text');
                    } else {
                      setPasswordInputType('password');
                    }
                  }}
                  className={
                    passwordInputType == 'password'
                      ? 'bx bxs-lock'
                      : 'bx bxs-lock-open'
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
                  color: 'white',
                  textAlign: 'center',
                  display: 'inline-block',
                  width: '100%',
                  fontWeight: '700',
                }}
              >
                Don't have a account? <Link to="/register">Create account</Link>
              </span>
            </div>
          </form>
          <ToastContainer />
        </div>
      </Await>
    </Suspense>
  );
};

export default Login;
