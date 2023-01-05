import { fetchBugs } from './fetchBugs.js';

/**
 *  a function that takes a bug id as a parameter and runs a fetch request with user auth
 *  to change the status of a bug to close
 *  sends off updated status as body
 * if no error on patch request then run fetchBugs()
 *
 * @param {string} id Database ID of bug
 * @returns only if fetch call res.ok is false
 */

export const closeBug = async function (id, activeUser) {
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
