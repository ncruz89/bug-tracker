'use strict';

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
const loginBtn = document.querySelector('.login-btn');
const createUserBtn = document.querySelector('.createUser-btn');
const bugAssignSelect = document.querySelector('.assign-input');
const assignUserPlaceholder = document.querySelector(
  '#assign-user-placeholder'
);

// variables
let activeUser;
let users = [];

/**
 * save bug function. creates object of retrieved form data from new bug form.
 * sends fetch request to server with login auth and bug object as body
 * if no errors and bug saved server side then reset & hide bug form
 * run fetch bugs function
 */
const saveBug = async function () {
  const dataArray = [...new FormData(form)];
  const bug = Object.fromEntries(dataArray);
  bug.createdBy = activeUser.user.username;

  try {
    const res = await fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${activeUser.token}`,
      },
      body: JSON.stringify({
        bug: bug,
      }),
    });
    const data = await res.json();

    document.querySelector('.bug-form').reset();

    formContentContainer.classList.toggle('hidden');
    formContentContainer.style.display = 'none';

    fetchBugs();
  } catch (err) {
    console.log(err);
  }
};

/**
 *  a function that takes a bug id as a parameter and runs a fetch request with user auth
 *  to change the status of a bug to close
 *  sends off updated status as body
 * if no error on patch request then run fetchBugs()
 *
 * @param {string} id Database ID of bug
 * @returns only if fetch call res.ok is false
 */

const closeBug = async function (id) {
  const res = await fetch(`/bugs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${activeUser.token}`,
    },
    body: JSON.stringify({
      status: 'Closed',
    }),
  });

  const data = await res.json();
  if (data.error) return alert(`${data.error}`);

  fetchBugs();
};

/**
 * a function that takes a bug id as a parameter and runs a fetch request with user auth
 * to delete bug from database
 * if no error on delete request then run fetchBugs()
 * else alert error received from server side
 *
 * @param {string} id Database ID of bug
 * @returns only if fetch call res.ok is false
 */
const deleteBug = async function (id) {
  const res = await fetch(`/bugs/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${activeUser.token}`,
    },
  });

  console.log(res.ok);

  const data = await res.json();
  if (data.error) return alert(`${data.error}`);

  fetchBugs();
};

/**
 * function that sends a get request to retrieve all the bugs from the server
 * takes data from server, assigns it to variables and creates a list item to populate page for each bug retrieved from server
 * Note** stores bug database id from server as dataset on bug list items
 *
 * inserts list items into bug lists in index.html
 *
 * @returns only if there aren't any bugs in the database yet.
 */
const fetchBugs = async function () {
  const res = await fetch('/bugs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  const bugs = await res.json();

  if (!bugs) return;

  bugsList.innerHTML = '';

  bugs.forEach((bug) => {
    const createdBy = bug.createdBy;
    const date = new Date(bug.createdAt);
    const createdOn = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
    const desc = bug.desc;
    const priority = bug.priority;
    const assign = bug.assignTo;
    const status = bug.status;
    const id = bug._id;
    bugsList.insertAdjacentHTML(
      'afterbegin',
      `<li class="bug-item">
        <h6>Created By: ${createdBy} on ${createdOn}</h6>
        <p><span class="label label-info" data-status='${status}'>${status}</span></p>
        <h3>${desc}</h3>
        <p class='details priority'><img src='./img/priority-thumb.png' class='icon' alt='priority icon'>${priority}</p>
        <p class='details user'><img src='./img/user-thumb.png' class='icon' alt='user icon'> ${assign} </p>
        <button class="bug-list-btn btn-close" data-id=${id}>Close</button>
        <button class="bug-list-btn btn-delete" data-id=${id}>Delete</button>
      </li>`
    );
  });
};

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
    closeBug(id);
  }
  if (btn.classList.contains('btn-delete')) {
    if (window.confirm('Are you sure you want to delete this bug?'))
      deleteBug(id);
  }
};

/*  event listener for new bug form
    if no activeUser then return alert
    if active user then run saveBug()
*/
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!activeUser) return alert('Please Login.');
  saveBug();
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
  if (window.confirm('Are you sure you want to logout?'))
    await userLogout(activeUser);
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

/**
 * a function that retrieves all created users from database
 * once users retrieved. pushes all users into users array
 * creates option element for each user to be added in the 'new bug' form 'assign to' option select
 */
const getUsers = async function () {
  try {
    const res = await fetch('/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();

    data.forEach((user) => {
      const username = user.username;

      if (users.includes(username)) return;
      users.push(username);
      const el = document.createElement('option');
      el.text = username;
      el.value = username;
      bugAssignSelect.appendChild(el);
    });
  } catch (err) {
    throw err;
  }
};

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
const userLogin = async function (userData) {
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

/**
 * a function that takes userData retrieved from login form
 * sends data off to server in request body and resets login form
 * if no error creating user data and storing in database then run getUsers() and return updated user data
 * else return alert that user creation failed
 *
 * @param {object} userData an object containing user data
 * @returns updated user data as object
 */
const createUser = async function (userData) {
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

/**
 * a function that takes user data from activeUser variable and sends a fetch request with user auth and user data as request body
 * if logout successful. alerts user logout successful. sets activeUser variable to undefined
 * replaces logout button with login button. removes welcome message at top of page.
 * hides add new button form if open and resets form.
 *
 * @param {object} user object containing user data
 */
const userLogout = async function (user) {
  try {
    const res = await fetch('/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        user: user.user,
      }),
    });
    const data = await res.text();
    if (!res.ok) return alert('Logout failed.');
    alert(`${data}`);
    activeUser = undefined;
    openModal.style.display = 'block';
    logoutBtn.style.display = 'none';
    const element = document.querySelector('#welcome-container');
    element.remove();
    formContentContainer.classList.add('hidden');
    formContentContainer.style.display = 'none';
    form.reset();
  } catch (err) {
    throw err;
  }
};

// runs fetchBugs() on app initial load
await fetchBugs();
