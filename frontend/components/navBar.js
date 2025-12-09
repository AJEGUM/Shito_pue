document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("header-componente");

    if (container) {
        try {
            const html = await fetch("../components/navBar.html").then(r => r.text());
            container.innerHTML = html;

            // activar logout después de insertar el navbar
            activarLogout();

        } catch (error) {
            console.error("Error cargando el navbar:", error);
        }
    }
});


function activarLogout() {
    const btnLogout = document.querySelector("#btnLogout");

    if (btnLogout) {
        btnLogout.addEventListener("click", logout);
    }
}

// ---- ESTA FUNCIÓN ERA LA QUE FALTABA ----
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/frontend/public/index.html";
}
