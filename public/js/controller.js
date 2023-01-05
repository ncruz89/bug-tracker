'use strict';

// function imports
import { saveBug } from './BugMethods/saveBug.js';
import { closeBug } from './BugMethods/closeBug.js';
import { deleteBug } from './BugMethods/deleteBug.js';
import { fetchBugs } from './BugMethods/fetchBugs.js';
import { createUser } from './UserMethods/createUser.js';
import { userLogin } from './UserMethods/userLogin.js';
import { userLogout } from './UserMethods/userLogout.js';

// html element cache
const form = document.querySelector('.bug-form');
const bugsList = document.querySelector('.bug-list');
const formBtn = document.querySelector('.form-button');
const newBugAndLoginBtnContainer = document.querySelector(
  '.bug-form-container'
);
const formContentContainer = document.querySelector('.form-content-container');
const openModal = document.querySelector('.login-button');
const logoutBtn = document.querySelector('.logout-button');
const modal = document.querySelector('.login-modal');
const closeModal = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const loginForm = document.querySelector('.modal-login-form');
const loginFormSubmitContainer = document.querySelector('.modal-btn-container');

// variables
let activeUser;

/* click handler for bug list items
   returns alert if no activeUser logged on
   checks if click was on button element and not surround divs etc...

   retrieves id from dataset on list element

   then checks class list of button to distinguish which button was clicked
   runs closeBug(id) if closed button clicked and deleteBug(id) if delete button clicked

*/
const bugListClickHandler = function (e) {
  e.preventDefault();

  if (!activeUser) return alert('Please Login.');

  const btn = e.target.closest('.bug-list-btn');
  if (!btn) return;

  const { id } = btn.dataset;

  if (btn.classList.contains('btn-close')) {
    btn.disabled = true;
    closeBug(id, activeUser);
  }
  if (btn.classList.contains('btn-delete')) {
    if (window.confirm('Are you sure you want to delete this bug?'))
      deleteBug(id, activeUser);
  }
};

/*  event listener for new bug form
    if no activeUser then return alert
    if active user then run saveBug()
*/
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!activeUser) return alert('Please Login.');
  saveBug(activeUser);
});

bugsList.addEventListener('click', bugListClickHandler);

/* add click event listener on add new bug button
   if no activeUser then return alert
   toggle visibilty of form depending on classlist
*/
formBtn.addEventListener('click', function () {
  if (!activeUser) return alert('Please Login to begin adding bugs.');
  {
    formContentContainer.classList.toggle('hidden');
    if (formContentContainer.classList.contains('hidden')) {
      formContentContainer.style.display = 'none';
      form.reset();
    } else {
      formContentContainer.style.display = 'block';
    }
  }
});

// add click listener to login button
openModal.addEventListener('click', () => {
  modal.showModal();
});

// add click listener to close modal also resets login form
closeModal.addEventListener('click', () => {
  modal.close();
  loginForm.reset();
});

// add click listener to cancel button in login modal. closes modal and resets form
cancelBtn.addEventListener('click', () => {
  modal.close();
  loginForm.reset();
});

// add click listener to close modal if click outside of modal window. resets form.
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.close();
    loginForm.reset();
  }
});

// add click listener to logout button. alerts user to confirm logout. runs userLogout(activeUser)
logoutBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (window.confirm('Are you sure you want to logout?')) {
    try {
      await userLogout(activeUser);
      activeUser = undefined;
    } catch (err) {
      throw err;
    }
  }
});

/*
  adds click event listener to login form login button
  if not clicked on button then return

  creates object containing user data from form
  initial sanitizing of username and password

  if button clicked contains login then run userLogin(data) else run createUser(data) store return from functions in activeUser variable

  if login/user creation successful and activeUser.user exists then close login modal, replace login button with logout button and add welcome message for active user

*/
loginFormSubmitContainer.addEventListener('click', async (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  const dataArray = [...new FormData(loginForm)];
  const data = Object.fromEntries(dataArray);
  data.username = data.username.split(' ').join('').trim();
  data.password = data.password.split(' ').join('').trim();
  activeUser =
    e.target.innerText === 'Login'
      ? await userLogin(data)
      : await createUser(data);
  if (!activeUser) return;
  if (activeUser.user) {
    openModal.style.display = 'none';
    logoutBtn.style.display = 'block';
    const html = `<div id='welcome-container'> Welcome ${activeUser.user.username}!</div>`;
    newBugAndLoginBtnContainer.insertAdjacentHTML('beforebegin', html);
  }
});

// runs fetchBugs() on app initial load
await fetchBugs();
