import { SimpleResponse } from "../types/Response";
const validatePassword = (password: string):SimpleResponse => {
  if (!password) {
    return { ok: 0, message: 'Password is Required' };
  } else if (!(password.length >= 6)) {
    return { ok: 0, message: 'Password needs to be 6 character or more' };
  }
  return { ok: 1, message: 'success' };
};
const validateEmail = (email: string):SimpleResponse => {
  if (!email) {
    return { ok: 0, message: 'Email is Required!' };
  } else if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      String(email).toLowerCase(),
    )
  ) {
    return { ok: 0, message: 'Email address is invalid!' };
  }
  return { ok: 1, message: 'success' };
};
export { validateEmail, validatePassword };
