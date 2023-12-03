let wrapper = document.querySelector(".wrapper1")
let modal_login = document.querySelector(".modal_login")
let modal_signin = document.querySelector(".modal_signin")
let mBtn = document.querySelector(".modal_login_form-button")
let sBtn = document.querySelector(".modal_signin_form-button")
let toSignin = document.querySelector(".to_sign_in")
let toLogin = document.querySelector(".to_log_in")



async function getData(){
    let data1 = await fetch("https://656c49aee1e03bfd572e26bd.mockapi.io/aalam/todo/users_tasks")
    .then(response => response.json()).then(data => data)
    return data1
}

async function postData(){

}



const wLogin = () =>{
    modal_login.style.display = "flex"
    modal_signin.style.display = "none"
    wrapper.style.display = "none"
    
}

wLogin()

const wSignin = () =>{
    modal_login.style.display = "none"
    modal_signin.style.display = "flex"
    wrapper.style.display = "none"
}
const wWrapper = () => {
    modal_login.style.display = "none"
    modal_signin.style.display =  "none"
    wrapper.style.display ="block"
}


const mInpLogin = document.querySelector(".modal_login_form-input1")
const mInpPassword = document.querySelector(".modal_login_form-input2")
mBtn.onclick = async()=>{
    const data = await getData()
    let answer= 0 
    data.map((item)=>{
        if(item.email == mInpLogin.value && item.password == mInpPassword.value){
            answer = item
        }
    })
    if(answer!==0){
        wWrapper()
    }
}

toSignin.onclick=()=>{
    wSignin()
}

toLogin.onclick=()=>{
    wLogin()
}

sBtn.onclick = async() => {
    const url = 'https://656c49aee1e03bfd572e26bd.mockapi.io/aalam/todo/users_tasks';
    const data = {
      email: 'value1',
      password: 'value2'
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
  };
