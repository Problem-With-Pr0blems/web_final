let wrapper = document.querySelector(".wrapper1");
let modal_login = document.querySelector(".modal_login");
let modal_signin = document.querySelector(".modal_signin");
let mBtn = document.querySelector(".modal_login_form-button");
let sBtn = document.querySelector(".modal_signin_form-button");
let toSignin = document.querySelector(".to_sign_in");
let toLogin = document.querySelector(".to_log_in");
const dashboard = document.querySelector(".main__inner");




const filterSelect = document.createElement('select');
filterSelect.innerHTML = `
  <option value="all">All Tasks</option>
  <option value="current">Current Tasks</option>
  <option value="completed">Completed Tasks</option>
`;

// Добавляем select на страницу
wrapper.appendChild(filterSelect);

// Добавляем обработчик событий для фильтрации
filterSelect.addEventListener('change', async () => {
  const selectedValue = filterSelect.value;
  await filterTasks(selectedValue);
});

// Функция фильтрации тасков
async function filterTasks(filterType) {
  dashboard.innerHTML = ""; // Очищаем текущий список

  let newData = await toShowTasks(idshnik);

  if (filterType === 'current') {
    newData = newData.filter(item => !item.completed);
  } else if (filterType === 'completed') {
    newData = newData.filter(item => item.completed);
  }

  newData.map((item) => {
    let newModel = document.createElement("div");
    newModel.setAttribute("class", "todo ");
    newModel.innerHTML = `<h3>${item.title}</h3>
                              <p>${item.body}</p>
                              <button class="todo_btn" data-task-id="${item.id}">edit</button>
                              <button class="delete_btn" data-task-id="${item.id}">delete</button>`;
    dashboard.append(newModel);
  });
}  


async function getData() {
  let data1 = await fetch("https://656c49aee1e03bfd572e26bd.mockapi.io/aalam/todo/users_tasks")
    .then(response => response.json()).then(data => data);
  return data1;
}

async function toShowTasks(id) {
  let data1 = await fetch(`https://656c49aee1e03bfd572e26bd.mockapi.io/aalam/todo/users_tasks/${id}/tasks`)
    .then(response => response.json()).then(data => data);
  return data1;
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
  modal_login.style.display = "flex";
  modal_signin.style.display = "none";
  wrapper.style.display = "none";
}

wLogin();

const wSignin = () => {
  modal_login.style.display = "none";
  modal_signin.style.display = "flex";
  wrapper.style.display = "none";
}

const wWrapper = () => {
  modal_login.style.display = "none";
  modal_signin.style.display = "none";
  wrapper.style.display = "block";
}

let idshnik = 0;

async function appendDash() {
  let newData = await toShowTasks(idshnik);

  await newData.map((item) => {
    let newModel = document.createElement("div");
    newModel.setAttribute("class", "todo ");
    newModel.innerHTML = `<h3>${item.title}</h3>
                              <p>${item.body}</p>
                              <button class="todo_btn" data-task-id="${item.id}">edit</button>
                              <button class="delete_btn" data-task-id="${item.id}">delete</button>
                              <button class="mark_btn" data-task-id="${item.id}" data-completed="${item.completed}">${item.completed ? 'Mark as Undone' : 'Mark as Done'}</button>`;
    dashboard.append(newModel);
  });

  // Добавляем обработчик событий для кнопки "Mark as Done/Undone"
  dashboard.addEventListener('click', async (event) => {
    if (event.target.classList.contains('mark_btn')) {
      const taskId = event.target.dataset.taskId;
      const completed = event.target.dataset.completed === 'true';

      // Меняем значение completed в таске
      await markTaskAsCompleted(taskId, idshnik, !completed);

      // Обновляем список
      dashboard.innerHTML = "";
      await appendDash();
    }
  });
}

// Функция пометки таска как сделанный/не сделанный
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
  } catch (error) {
    console.error('Mark as Completed Error:', error);
  }
}

// Добавляем обработчик событий на родительский элемент
dashboard.addEventListener('click', async (event) => {
  if (event.target.classList.contains('todo_btn')) {
    const taskId = event.target.dataset.taskId;
    await editTask(taskId, idshnik);
  } else if (event.target.classList.contains('delete_btn')) {
    const taskId = event.target.dataset.taskId;
    await deleteTask(taskId, idshnik);
  }
});

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


// Добавляем обработчик событий на родительский элемент
dashboard.addEventListener('click', async (event) => {
  // Проверяем, была ли нажата кнопка "edit"
  if (event.target.classList.contains('todo_btn')) {
    // Получаем ID таска из атрибута данных (data-task-id) кнопки
    const taskId = event.target.dataset.taskId;

    // Вызываем функцию editTask с передачей ID таска
    await editTask(taskId, idshnik);
  }
});

const mInpLogin = document.querySelector(".modal_login_form-input1");
const mInpPassword = document.querySelector(".modal_login_form-input2");

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
  }
  await appendDash();
}

mBtn.onclick = () => { WORK(); }

toSignin.onclick = () => {
  wSignin();
}

toLogin.onclick = () => {
  wLogin();
}

const sInpEmail = document.querySelector(".modal_signin_form-input1");
const sInpPassw = document.querySelector(".modal_signin_form-input2");

sBtn.onclick = async () => {
  const url = 'https://656c49aee1e03bfd572e26bd.mockapi.io/aalam/todo/users_tasks';
  const data = {
    email: sInpEmail.value,
    password: sInpPassw.value
  };

  try {
    const response = await fetch(url, {
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
  wLogin();
};

const creaInp1 = document.querySelector(".newTaskInp1");
const creaInp2 = document.querySelector(".newTaskInp2");
const creaBtn = document.querySelector(".newTaskBtn");

creaBtn.onclick = async () => {
  await createOrUpdateTask(creaInp1, creaInp2, idshnik);
}

const creaInp3 = document.querySelector(".newTaskInp3");
const creaEditBtn = document.querySelector(".newTaskEditBtn");

creaEditBtn.onclick = async () => {
  const taskId = creaInp3.value;
  if (taskId) {
    await editTask(taskId, idshnik);
  } else {
    alert("Please enter a task ID.");
  }
};


const editBtn = document.querySelector(".todo_btn")


async function editTask(id, userId) {
  const newTitle = prompt("Enter new title:");
  const newBody = prompt("Enter new body:");
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
    console.log('Update Success:', responseData);
  } catch (error) {
    console.error('Update Error:', error);
  }
}

async function createOrUpdateTask(title, body, userId) {
  
  await createTask(title, body, userId);
  dashboard.innerHTML = "";
  await appendDash();
}
  
