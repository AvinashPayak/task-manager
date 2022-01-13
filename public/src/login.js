
const loginBtn = document.querySelector('.login button');

const loginUser = async () => {
    const email = document.querySelector('.login input[name="email"]');
    const password = document.querySelector('.login input[name="password"]');
    const response = await axios.post('http://localhost:8080/auth/login', {
        email: email.value,
        password: password.value
    },
    {
        Headers : {
            'Content-Type': 'application/json'
        }
    });
    if(response.status != 200){
        window.location.href = 'http://127.0.0.1:5500/public/login.html';
    }
    else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        window.location.href = 'http://127.0.0.1:5500/public/dashboard.html';
    }
}
loginBtn.addEventListener('click', loginUser);