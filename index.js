const select = (selector) => document.querySelector(selector);
const create = (tag) => document.createElement(tag);

const wrapper = select(".wrapper1");
const wrapperExt = select(".wrapper2")
const modalLogin = select(".modal_login");
const modalSignin = select(".modal_signin");
const mBtn = select(".modal_login_form-button");
const sBtn = select(".modal_signin_form-button");
const toSignin = select(".to_sign_in");
const toLogin = select(".to_log_in");
const dashboard = select(".main__inner");

const filterSelect = create('select');
filterSelect.innerHTML = `
  <option value="all">All Tasks</option>
  <option value="current">Current Tasks</option>
  <option value="completed">Completed Tasks</option>
`;

wrapperExt.appendChild(filterSelect);

filterSelect.addEventListener('change', async () => {
  const selectedValue = filterSelect.value;
  await filterTasks(selectedValue);
});

dashboard.addEventListener('click', async (event) => {
  const selectedFilter = filterSelect.value;

  if (selectedFilter === 'all') {
    if (event.target.classList.contains('mark_btn')) {
      const taskId = event.target.dataset.taskId;
      const completed = event.target.dataset.completed === 'true';

      await markTaskAsCompleted(taskId, idshnik, !completed);
      dashboard.innerHTML = "";
      await appendDash();
    } else if (event.target.classList.contains('todo_btn')) {
      const taskId = event.target.dataset.taskId;

      await editTask(taskId, idshnik);
    } else if (event.target.classList.contains('delete_btn')) {
      const taskId = event.target.dataset.taskId;
      await deleteTask(taskId, idshnik);
    }
  }
});

async function filterTasks(filterType) {
  dashboard.innerHTML = "";

  let allTasks = await toShowTasks(idshnik);

  if (filterType === 'current') {
    let currentTasks = allTasks.filter(item => !item.completed);
    renderTasks(currentTasks);
  } else if (filterType === 'completed') {
    let completedTasks = allTasks.filter(item => item.completed);
    renderTasks(completedTasks);
  } else {
    renderTasks(allTasks);
  }

  const markButtons = document.querySelectorAll('.mark_btn');
  markButtons.forEach((button) => {
    button.style.display = filterType === 'all' ? 'block' : 'none';
  });
}

function renderTasks(tasks) {
  tasks.forEach((item) => {
    let newModel = create("div");
    newModel.classList.add("todo");
    newModel.innerHTML = `<h3>${item.title}</h3>
                          <p>${item.body}</p>`;

    if (filterSelect.value === 'all') {
      newModel.innerHTML += `<button class="todo_btn" data-task-id="${item.id}">edit</button>
                             <button class="delete_btn" data-task-id="${item.id}">delete</button>`;
    }

    newModel.innerHTML += `<button class="mark_btn" data-task-id="${item.id}" data-completed="${item.completed}">
                            ${item.completed ? 'Mark as Undone' : 'Marked as Done'}
                          </button>`;

    dashboard.append(newModel);
  });
}

async function getData() {
  try {
    const response = await fetch("https://656c49aee1e03bfd572e26bd.mockapi.io/aalam/todo/users_tasks");
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function toShowTasks(id) {
  try {
    const response = await fetch(`https://656c49aee1e03bfd572e26bd.mockapi.io/aalam/todo/users_tasks/${id}/tasks`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

async function createTask(title, body, id) {
  const data = {
    title: title.value,
    body: body.value
  };
  try {
    const response = await fetch(`https://656c49aee1e03bfd572e26bd.mockapi.io/aalam/todo/users_tasks/${id}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    console.log('Success:', responseData);
  } catch (error) {
    console.error('Error:', error);
  }
}

const wLogin = () => {
  modalLogin.style.display = "flex";
  modalSignin.style.display = "none";
  wrapper.style.display = "none";
  clearErrorMessages();
}

wLogin();

const wSignin = () => {
  modalLogin.style.display = "none";
  modalSignin.style.display = "flex";
  wrapper.style.display = "none";
  clearErrorMessages();
}

const wWrapper = () => {
  modalLogin.style.display = "none";
  modalSignin.style.display = "none";
  wrapper.style.display = "block";
  clearErrorMessages();
}

let idshnik = 0;

async function appendDash() {
  let newData = await toShowTasks(idshnik);

  newData.map((item) => {
    let newModel = create("div");
    newModel.classList.add("todo");
    newModel.innerHTML = `<h3>${item.title}</h3>
                              <p>${item.body}</p>
                              <button class="todo_btn" data-task-id="${item.id}">edit</button>
                              <button class="delete_btn" data-task-id="${item.id}">delete</button>
                              <button class="mark_btn" data-task-id="${item.id}" data-completed="${item.completed}">
                                ${item.completed ? 'Mark as Undone' : 'Marked as Done'}
                              </button>`;

    dashboard.append(newModel);
  });

  dashboard.addEventListener('click', async (event) => {
    if (event.target.classList.contains('mark_btn')) {
      const taskId = event.target.dataset.taskId;
      const completed = event.target.dataset.completed === 'true';

      await markTaskAsCompleted(taskId, idshnik, !completed);
    }
  });
}

async function markTaskAsCompleted(id, userId, completed) {
  const data = {
    completed: completed,
  };
  try {
    const response = await fetch(`https://656c49aee1e03bfd572e26bd.mockapi.io/aalam/todo/users_tasks/${userId}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    console.log('Mark as Completed Success:', responseData);

    const taskElement = document.querySelector(`.todo[data-task-id="${id}"]`);
    if (taskElement) {
      let markBtn = taskElement.querySelector('.mark_btn');
      if (markBtn) {
        markBtn.textContent = completed ? 'Mark as Undone' : 'Marked as Done';
        markBtn.dataset.completed = completed;
      } else {
        markBtn = create("button");
        markBtn.classList.add("mark_btn");
        markBtn.dataset.taskId = id;
        markBtn.dataset.completed = completed;
        markBtn.textContent = completed ? 'Mark as Undone' : 'Marked as Done';
        taskElement.appendChild(markBtn);
      }
    }
  } catch (error) {
    console.error('Mark as Completed Error:', error);
  }
}

async function deleteTask(id, userId) {
  try {
    const response = await fetch(`https://656c49aee1e03bfd572e26bd.mockapi.io/aalam/todo/users_tasks/${userId}/tasks/${id}`, {
      method: 'DELETE',
    });

    const responseData = await response.json();
    console.log('Delete Success:', responseData);
  } catch (error) {
    console.error('Delete Error:', error);
  }

  dashboard.innerHTML = "";
  await appendDash();
}

dashboard.addEventListener('click', async (event) => {
  if (event.target.classList.contains('todo_btn')) {
    const taskId = event.target.dataset.taskId;
    await editTask(taskId, idshnik);
  }
});

const mInpLogin = select(".modal_login_form-input1");
const mInpPassword = select(".modal_login_form-input2");

let WORK = async () => {
  const data = await getData();
  let answer = 0;
  await data.map((item) => {
    if (item.email == mInpLogin.value && item.password == mInpPassword.value) {
      answer = item;
      idshnik = item.id;
    }
  });

  if (answer !== 0) {
    wWrapper();
  } else {
    displayErrorMessage("login-error-message", "Неправильный логин или пароль. Пожалуйста, попробуйте снова.");
  }
  await appendDash();
}

mBtn.onclick = () => {
  WORK();
}

toSignin.onclick = () => {
  wSignin();
}

toLogin.onclick = () => {
  wLogin();
}

const sInpEmail = select(".modal_signin_form-input1");
const sInpPassw = select(".modal_signin_form-input2");

sBtn.onclick = async () => {
  if (!sInpPassw.value) {
    displayErrorMessage("signin-error-message", "Введите пароль.");
  } else {
    // Остальной код
  }
};

const creaInp1 = select(".newTaskInp1");
const creaInp2 = select(".newTaskInp2");
const creaBtn = select(".newTaskBtn");

creaBtn.onclick = async () => {
  await createOrUpdateTask(creaInp1, creaInp2, idshnik);
}

const creaInp3 = select(".newTaskInp3");
const creaEditBtn = select(".newTaskEditBtn");

creaEditBtn.onclick = async () => {
  const taskId = creaInp3.value;
  if (taskId) {
    await editTask(taskId, idshnik);
  } else {
    alert("Введите ID задачи.");
  }
};

async function editTask(id, userId) {
  const newTitle = prompt("Введите новый заголовок:");
  const newBody = prompt("Введите новое описание:");
  await updateTask(id, newTitle, newBody, userId);

  dashboard.innerHTML = "";

  await appendDash();
}

async function updateTask(id, title, body, userId) {
  const data = {
    title: title,
    body: body,
  };
  try {
    const response = await fetch(`https://656c49aee1e03bfd572e26bd.mockapi.io/aalam/todo/users_tasks/${userId}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    console.log('Обновление выполнено успешно:', responseData);
  } catch (error) {
    console.error('Ошибка при обновлении:', error);
  }
}

async function createOrUpdateTask(title, body, userId) {
  await createTask(title, body, userId);
  dashboard.innerHTML = "";
  await appendDash();
}

function displayErrorMessage(elementId, message) {
  const errorDiv = select(`.${elementId}`);
  if (errorDiv) {
    errorDiv.textContent = message;
  }
}

function clearErrorMessages() {
  displayErrorMessage("login-error-message", "");
  displayErrorMessage("signin-error-message", "");
}