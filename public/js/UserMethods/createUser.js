import { getUsers } from './getUsers.js';

const loginForm = document.querySelector('.modal-login-form');

/**
 * a function that takes userData retrieved from login form
 * sends data off to server in request body and resets login form
 * if no error creating user data and storing in database then run getUsers() and return updated user data
 * else return alert that user creation failed
 *
 * @param {object} userData an object containing user data
 * @returns updated user data as object
 */
export const createUser = async function (userData) {
  try {
    const res = await fetch('/user', {
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
    if (!res.ok) return alert('Username already exists');
    getUsers();
    return data;
  } catch (err) {
    throw err;
  }
};
