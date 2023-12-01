const wrapper = document.querySelector(".wrapper1")
const modal_login = document.querySelector(".modal_login")
const mBtn = document.querySelector(".modal_login_form-button")
const sign_out = document.querySelector("#sign_out")

wrapper.style.display="none"
mBtn.onclick=()=>{
    wrapper.style.display="block"
    modal_login.style.display="none"
}

sign_out.onclick=()=>{
    wrapper.style.display="none"
    modal_login.style.display="block"
}