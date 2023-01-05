import { fetchBugs } from './fetchBugs.js';

/**
 * a function that takes a bug id as a parameter and runs a fetch request with user auth
 * to delete bug from database
 * if no error on delete request then run fetchBugs()
 * else alert error received from server side
 *
 * @param {string} id Database ID of bug
 * @returns only if fetch call res.ok is false
 */
export const deleteBug = async function (id, activeUser) {
  const res = await fetch(`/bugs/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${activeUser.token}`,
    },
  });

  const data = await res.json();
  if (data.error) return alert(`${data.error}`);

  fetchBugs();
};
