// Função para alternar entre Sign In e Sign Up
function sign(mode) {
  const heroSignIn = document.querySelector('.hero .signin');
  const heroSignUp = document.querySelector('.hero .signup');
  const formSignIn = document.querySelector('.form .signin');
  const formSignUp = document.querySelector('.form .signup');

  if (mode === 'in') {
    heroSignIn.style.display = 'flex';
    heroSignUp.style.display = 'none';
    formSignIn.style.display = 'flex';
    formSignUp.style.display = 'none';
  } else if (mode === 'up') {
    heroSignIn.style.display = 'none';
    heroSignUp.style.display = 'flex';
    formSignIn.style.display = 'none';
    formSignUp.style.display = 'flex';
  }
}

const signinForm = document.querySelector('.form .signin');

if (signinForm) {
  signinForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = signinForm.querySelector('input[type="email"]').value.trim();
    const password = signinForm.querySelector('input[type="password"]').value.trim();
    const loader = document.getElementById('loading');

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      alert('E-mail ou senha incorretos!');
      return;
    }

    // Mostra o loader
    loader.style.display = 'block';

    setTimeout(() => {
      loader.style.display = 'none';
      window.location.href = '../../index.html';
    }, 2000);  
  });
}