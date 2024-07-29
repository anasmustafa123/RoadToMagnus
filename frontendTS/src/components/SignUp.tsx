import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import styles from '../styles/SignUp.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { notify } from '../scripts/toast.ts';
import { validateEmail, validatePassword } from '../scripts/validate.ts';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo as lichessVerify } from '../api/lichessApiAccess.ts';
import { getUserInfo as chessVerify } from '../api/chessApiAccess.ts';
import { NewUser } from '../types/User';
const SignUp = () => {
  const navigate = useNavigate();
  const {
    setChessDCUsername,
    setChessDCAvatarLink,
    setUserLicehessname,
  } = useContext(UserContext);

  const [passwordInputType, setPasswordInputType] = useState('password');
  const [confirmPasswordInputType, setconfirmPasswordInputType] =
    useState('password');
  //0: no loading, 1: loading
  const [loading, setloading] = useState({ 'chess.com': 0, lichess: 0 });
  const [data, setData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    IsAccepted: false,
    lichess: '',
    'chess.com': '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    IsAccepted: '',
    lichess: '',
    'chess.com': '',
  });

  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): string => {
    setData({ ...data, [event.target.name]: event.target.value });
    return event.target.value;
  };

  const register = async (obj:NewUser) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      },
    );
    return res.json();
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      data.email != '' &&
      errors.name == '' &&
      errors.email == '' &&
      errors.password == '' &&
      errors.confirmPassword == '' &&
      errors.IsAccepted == '' &&
      data.IsAccepted == true
    ) {
      if (!data.lichess && !data['chess.com']) {
        notify(
          'U have to add either chess.com or lichess usernames, or both',
          'error',
        );
      } else {
        register({
          email: data.email,
          password: data.password,
          lichess: data.lichess ? data.lichess : '',
          "chess.com": data['chess.com'] ? data['chess.com'] : '',
        }).then((response) => {
          console.log({ response });
          navigate('/');
          response.ok
            ? notify('user credintials added successfully', 'success')
            : notify(response.message, 'error');
        });
      }
    } else {
      notify('Complete  info', 'error');
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
                      old.email = '';
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
                      old.password = '';
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
                    old.confirmPassword = 'Confirm the Password';
                    return old;
                  });
                } else if (newconfirm !== data.password) {
                  setErrors((old) => {
                    old.confirmPassword = 'Password is not match!';
                    return old;
                  });
                } else {
                  setErrors((old) => {
                    old.confirmPassword = '';
                    return old;
                  });
                }
              }}
              autoComplete="off"
            />
            <i
              onClick={() => {
                if (confirmPasswordInputType == 'password') {
                  setconfirmPasswordInputType('text');
                } else {
                  setconfirmPasswordInputType('password');
                }
              }}
              className={
                confirmPasswordInputType == 'password'
                  ? 'bx bxs-lock'
                  : 'bx bxs-lock-open'
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
                  if (data.lichess == '') {
                    setErrors((old) => {
                      const copy = { ...old };
                      copy.lichess = 'empty lichess username';
                      return copy;
                    });
                    notify('empty lichess username', 'error');
                  } else {
                    lichessVerify(data.lichess).then((res) => {
                      console.log({ res });
                      if (res.ok) {
                        setUserLicehessname(res.data.username);
                        notify('lichess verified', 'success');
                        setErrors((old) => {
                          const copy = { ...old };
                          copy.lichess = '';
                          return copy;
                        });
                        setloading((old) => {
                          const copy = { ...old };
                          copy.lichess = 2;
                          return copy;
                        });
                      } else {
                        notify('wrong lichess username', 'error');
                        setloading((old) => {
                          const copy = { ...old };
                          copy.lichess = 0;
                          return copy;
                        });
                        setErrors((old) => {
                          const copy = { ...old };
                          copy.lichess = 'wrong lichess username';
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
              !data['chess.com']
                ? styles.unCompleted
                : errors['chess.com'] || loading['chess.com'] != 2
                  ? styles.unCompleted_error
                  : styles.completed
            }
          >
            <input
              name="chess.com"
              value={data['chess.com']}
              onChange={(e) => {
                setloading((old) => {
                  const copy = { ...old };
                  copy['chess.com'] = 0;
                  return copy;
                });
                changeHandler(e);
              }}
              type="text"
              placeholder="Enter chess.com username"
            />
            <img src="/logos/chess.com.png" alt="chess.com logo" />
            {!loading['chess.com'] ? (
              <button
                type="button"
                onClick={() => {
                  if (data['chess.com'] == '') {
                    setErrors((old) => {
                      const copy = { ...old };
                      copy['chess.com'] = 'empty chess.com username';
                      return copy;
                    });
                    notify('empty chess.com username', 'error');
                  } else {
                    chessVerify(
                      data['chess.com'] ? data['chess.com'] : '',
                    ).then((res) => {
                      console.log(res);
                      if (res.ok) {
                        console.log(typeof setChessDCAvatarLink);
                        setChessDCAvatarLink(res.data.avatar);
                        setChessDCUsername(res.data.username);
                        console.log({ playeravatar: res.data.avatar });
                        notify('chess.com verified', 'success');
                        setErrors((old) => {
                          const copy = { ...old };
                          copy['chess.com'] = '';
                          return copy;
                        });
                        setloading((old) => {
                          const copy = { ...old };
                          old['chess.com'] = 2;
                          return copy;
                        });
                      } else {
                        notify('wrong chess.com username', 'error');
                        setloading((old) => {
                          const copy = { ...old };
                          old['chess.com'] = 0;
                          return copy;
                        });
                        setErrors((old) => {
                          const copy = { ...old };
                          copy['chess.com'] = 'wrong lichess username';
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
              loading['chess.com'] == 1 && (
                <img
                  className={styles.loading}
                  src="/login/loading.gif"
                  alt=""
                />
              )
            )}
          </div>
          {errors['chess.com'] && (
            <span className={styles.error}>{errors['chess.com']}</span>
          )}
        </div>
        <div>
          <div className={styles.terms}>
            <input
              type="checkbox"
              name="IsAccepted"
              value={data.IsAccepted ? 1 : 0}
              id="accept"
              onChange={(event) => {
                setData({ ...data, [event.target.name]: event.target.checked });
                return event.target.checked;
              }}
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
              color: 'var(--secondary-color)',
              textAlign: 'center',
              display: 'inline-block',
              width: '100%',
            }}
          >
            Already have a account?{' '}
            <Link style={{ fontWeight: '700' }} to="/login">
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
