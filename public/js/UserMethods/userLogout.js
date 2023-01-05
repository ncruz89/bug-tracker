// html element cache

const openModal = document.querySelector('.login-button');
const logoutBtn = document.querySelector('.logout-button');
const formContentContainer = document.querySelector('.form-content-container');
const form = document.querySelector('.bug-form');

/**
 * a function that takes user data from activeUser variable and sends a fetch request with user auth and user data as request body
 * if logout successful. alerts user logout successful. sets activeUser variable to undefined
 * replaces logout button with login button. removes welcome message at top of page.
 * hides add new button form if open and resets form.
 *
 * @param {object} user object containing user data
 */
export const userLogout = async function (user) {
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
