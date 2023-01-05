const bugsList = document.querySelector('.bug-list');

/**
 * function that sends a get request to retrieve all the bugs from the server
 * takes data from server, assigns it to variables and creates a list item to populate page for each bug retrieved from server
 * Note** stores bug database id from server as dataset on bug list items
 *
 * inserts list items into bug lists in index.html
 *
 * @returns exits function only if there aren't any bugs in the database yet.
 */
export const fetchBugs = async function () {
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
