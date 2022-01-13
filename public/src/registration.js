
const registerBtn = document.querySelector('.registration button');
const errpr = document.querySelector('.error');

const registerUser = async () => {
    const name = document.querySelector('.registration input[name = "name"]');
    const email = document.querySelector('.registration input[name="email"]');
    const password = document.querySelector('.registration input[name="password"]');
    
    const response = await axios.put('http://localhost:8080/auth/signup', {
        name: name.value,
        email: email.value,
        password: password.value
    },
    {
        Headers : {
            'Content-Type': 'application/json'
        }
    });
    if(response.status != 200){
        window.location.href = 'http://localhost:5500/public/registration.html';
    }
    else {
        window.location.href = 'http://localhost:5500/public/login.html';
    }
}
registerBtn.addEventListener('click', registerUser);