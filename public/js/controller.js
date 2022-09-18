'use strict';

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
let activeUser;
let users = [];

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
  if (data.error) alert(`${data.error}`);

  if (!res.ok) return;

  fetchBugs();
};

const deleteBug = async function (id) {
  console.log(id);
  const res = await fetch(`/bugs/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${activeUser.token}`,
    },
  });

  const data = await res.json();
  if (data.error) alert(`${data.error}`);

  fetchBugs();
};

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

const bugListClickHandler = function (e) {
  e.preventDefault();
  if (!activeUser) return alert('Please Login.');
  const btn = e.target.closest('.bug-list-btn');
  if (!btn) return;

  const { id } = btn.dataset;
  const classes = btn.className;
  if (btn.classList.contains('btn-close')) {
    btn.disabled = true;
    closeBug(id);
  }
  if (btn.classList.contains('btn-delete')) {
    if (window.confirm('Are you sure you want to delete this bug?'))
      deleteBug(id);
  }
};
// add bug
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!activeUser) return alert('Please Login.');
  saveBug();
});
bugsList.addEventListener('click', bugListClickHandler);

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

openModal.addEventListener('click', () => {
  modal.showModal();
});
closeModal.addEventListener('click', () => {
  modal.close();
  loginForm.reset();
});
cancelBtn.addEventListener('click', () => {
  modal.close();
  loginForm.reset();
});
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.close();
    loginForm.reset();
  }
});
logoutBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (window.confirm('Are you sure you want to logout?'))
    await userLogout(activeUser);
});

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
  if (activeUser.user) {
    openModal.style.display = 'none';
    logoutBtn.style.display = 'block';
    const html = `<div id='welcome-container'> Welcome ${activeUser.user.username}!</div>`;
    newBugAndLoginBtnContainer.insertAdjacentHTML('beforebegin', html);
  }
});

const getUsers = async function () {
  try {
    const res = await fetch('/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    console.log(data);

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
    if (!res.ok) alert('Login failed.');
    loginForm.reset();
    getUsers();
    return data;
  } catch (err) {
    throw err;
  }
};

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
    if (!res.ok) alert('Username already exists');
    loginForm.reset();
    getUsers();
    return data;
  } catch (err) {
    throw err;
  }
};

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
    if (!res.ok) alert('Logout failed');
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

await fetchBugs();
