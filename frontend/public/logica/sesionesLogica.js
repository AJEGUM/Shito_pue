import { logout } from "../conexiones/authConexion.js";

document.addEventListener("DOMContentLoaded", () => {
  // Referencias
  const navActions = document.querySelector(".nav-actions");
  const originalUserDiv = document.querySelector(".nav-user");
  const user = JSON.parse(localStorage.getItem("user"));

  // 1) Reemplazamos el nodo para limpiar listeners previos (solo el wrapper, NO hijos)
  const cleanUserDiv = originalUserDiv.cloneNode(false); // false: no children, no listeners
  originalUserDiv.parentNode.replaceChild(cleanUserDiv, originalUserDiv);

  // 2) Usamos la referencia nueva
  const userBox = document.querySelector(".nav-user");

  if (!user) {
    userBox.classList.remove("user-logged");
    userBox.innerHTML = `<img src="/frontend/imgs/Perfil.png" class="icon-user" />`;

    // Abrir modal cuando NO haya sesión
    userBox.addEventListener("click", () => abrirModal("modalLogin"));
  } else {
    // Usuario logueado -> mostrar nombre + botón logout
    userBox.classList.add("user-logged");
    userBox.innerHTML = `
      <span class="user-name">${user.nombre}</span>
      <button id="btnLogout" class="logout-btn">Cerrar sesión</button>
    `;
  }

  // 3) Event delegation para el logout (funciona incluso si el botón se crea dinámicamente)
  navActions.addEventListener("click", async (e) => {
    const target = e.target;
    if (!target) return;

    // Si el click viene del botón logout (o de un icono dentro)
    if (target.id === "btnLogout" || target.classList.contains("logout-btn")) {
      try {
        // Si tu logout es async/promise, await; si no, lo llamamos igual.
        if (typeof logout === "function") {
          const maybePromise = logout();
          if (maybePromise instanceof Promise) await maybePromise;
        } else {
          // Fallback seguro: limpiar sesión local y recargar
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          location.reload();
        }
      } catch (err) {
        console.error("Error durante logout():", err);
        // Fallback en caso de error: limpiar y recargar para evitar usuario fantasma
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        location.reload();
      }
    }
  });
});
