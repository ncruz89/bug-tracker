import { fetchBugs } from './fetchBugs.js';

const formContentContainer = document.querySelector('.form-content-container');
const form = document.querySelector('.bug-form');

/**
 * save bug function. creates object of retrieved form data from new bug form.
 * sends fetch request to server with login auth and bug object as body
 * if no errors and bug saved server side then reset & hide bug form
 * run fetch bugs function
 */
export const saveBug = async function (activeUser) {
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
