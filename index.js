let wrapper = document.querySelector(".wrapper1")
let modal_login = document.querySelector(".modal_login")
let modal_signin = document.querySelector(".modal_signin")
let mBtn = document.querySelector(".modal_login_form-button")
let sBtn = document.querySelector(".modal_signin_form-button")
let toSignin = document.querySelector(".to_sign_in")
let toLogin = document.querySelector(".to_log_in")


// для получения информации о всех пользователях
async function getData(){
  let data1 = await fetch("https://656c49aee1e03bfd572e26bd.mockapi.io/aalam/todo/users_tasks")
  .then(response => response.json()).then(data => data)
  return data1
}


// для отображения задач конкретного пользователя 
const dashboard = document.querySelector(".main__inner")
async function toShowTasks(id){
  let data1 = await fetch(`https://656c49aee1e03bfd572e26bd.mockapi.io/aalam/todo/users_tasks/${id}/tasks`)
  .then(response => response.json()).then(data => data)
  return data1

}





// для создания нового таска
async function createTask(title , body , id){
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





// для входа в аккаунт
const wLogin = () =>{
    modal_login.style.display = "flex"
    modal_signin.style.display = "none"
    wrapper.style.display = "none"   
}

wLogin()



// для входа в регистрацию
const wSignin = () =>{
    modal_login.style.display = "none"
    modal_signin.style.display = "flex"
    wrapper.style.display = "none"
}



// для входа в главное меню
const wWrapper = () => {
    modal_login.style.display = "none"
    modal_signin.style.display =  "none"
    wrapper.style.display ="block"
}


let idshnik =  0

async function appendDash(){
  let newData = await toShowTasks(idshnik)
      
      await newData.map((item)=>{
        let newModel = document.createElement("div")
        newModel.setAttribute("class" , "todo ")
        newModel.innerHTML = `<h3>${item.title}</h3>
                              <p>${item.body}</p>
                              <button class = "todo_btn">${item.completed==false? "pass" : "done" }</button>`
        dashboard.append(newModel)
      })}



const mInpLogin = document.querySelector(".modal_login_form-input1")
const mInpPassword = document.querySelector(".modal_login_form-input2")
let WORK = async()=>{
    
    const data = await getData()
    let answer= 0 
    await data.map((item)=>{
      if(item.email == mInpLogin.value && item.password == mInpPassword.value){
          answer = item
          idshnik = item.id
      }
    }

    )

    if(answer!==0){
        wWrapper()
    }
    await appendDash()
    
}
mBtn.onclick=()=>{WORK()}

toSignin.onclick=()=>{
    wSignin()
}

toLogin.onclick=()=>{
    wLogin()
}

const sInpEmail=document.querySelector(".modal_signin_form-input1")
const sInpPassw=document.querySelector(".modal_signin_form-input2")

sBtn.onclick = async() => {
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
          // Add any other headers if needed
        },
        body: JSON.stringify(data)
      });
  
      const responseData = await response.json();
      console.log('Success:', responseData);
    } catch (error) {
      console.error('Error:', error);
    }
    wLogin()
  };



const creaInp1 = document.querySelector(".newTaskInp1")
const creaInp2 = document.querySelector(".newTaskInp2")
const creaBtn = document.querySelector(".newTaskBtn")
creaBtn.onclick=async()=>{
  await createTask(creaInp1, creaInp2 , idshnik)
  dashboard.innerHTML=""
  await appendDash()
}