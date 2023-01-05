const bugAssignSelect = document.querySelector('.assign-input');

/**
 * a function that retrieves all created users from database
 * once users retrieved. pushes all users into users array
 * creates option element for each user to be added in the 'new bug' form 'assign to' option select
 */
let users = [];

export const getUsers = async function () {
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
