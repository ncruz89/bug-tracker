import { getUsers } from './getUsers.js';

const loginForm = document.querySelector('.modal-login-form');

/**
 * a function that takes userData retrieved from login form
 * sends data off to server in request body
 *
 * if no error and user data and passwords exists and match in server then user logged in
 * run getUsers() and return updated user data
 * else return alert that login failed
 *
 * @param {object} userData an object containing user data
 * @returns updated user data as object
 */
export const userLogin = async function (userData) {
  try {
    const res = await fetch(`/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        user: userData,
      }),
    });

    const data = await res.json();
    loginForm.reset();
    if (!res.ok) return alert('Login failed.');
    getUsers();
    return data;
  } catch (err) {
    throw err;
  }
};
