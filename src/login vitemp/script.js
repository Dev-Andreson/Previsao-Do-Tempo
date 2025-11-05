function login() {
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();
      const erro = document.getElementById("erro");

      if (email.toUpperCase() === "VITEMP.PEDRO" && senha === "12345") {
        localStorage.setItem("logado", "sim");
        window.location.href = "home.html";
      } else {
        erro.textContent = "Email ou senha incorretos!";
      }
    }

    if (localStorage.getItem("logado") === "sim") {
      window.location.href = "home.html";
    }