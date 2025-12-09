import { obtenerVentas, obtenerDetalleVenta } from "../conexiones/ventasConexion.js";

class VentasUI {

    async cargarTabla() {
        const ventas = await obtenerVentas();
        const tbody = document.getElementById("tabla-ventas");
        tbody.innerHTML = "";

        ventas.forEach(v => {
            tbody.innerHTML += `
                <tr>
                    <td>${v.id_venta}</td>
                    <td>${v.cliente}</td>
                    <td>${v.fecha}</td>
                    <td>${v.metodo_pago}</td>
                    <td>${v.total}</td>
                    <td>
                        <button class="btn-detalle" data-id="${v.id_venta}">Ver detalle</button>
                    </td>
                </tr>
            `;
        });

        // Eventos botones detalle
        document.querySelectorAll(".btn-detalle").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                this.mostrarDetalle(id);
            });
        });

        // Gráfico
        this.generarGrafico(ventas);
    }

    // Mostrar detalle en modal
    async mostrarDetalle(id) {
        const rows = await obtenerDetalleVenta(id);

        let html = "";
        rows.forEach(r => {
            html += `
                <tr>
                    <td>${r.producto}</td>
                    <td>${r.cantidad}</td>
                    <td>${r.precio_unitario}</td>
                    <td>${r.subtotal}</td>
                </tr>
            `;
        });

        document.getElementById("detalle-body").innerHTML = html;
        document.getElementById("modal-detalle").style.display = "flex";
    }

    cerrarModal() {
        document.getElementById("modal-detalle").style.display = "none";
    }

generarGrafico(ventas) {
    const ctx = document.getElementById("graficoVentas").getContext("2d");

    const labels = ventas.map(v => v.fecha);
    const datos = ventas.map(v => v.total);

    // Degradado elegante
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(0, 123, 255, 0.3)");
    gradient.addColorStop(1, "rgba(0, 123, 255, 0)");

    new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Total de ventas",
                data: datos,
                borderColor: "#1a73e8",
                borderWidth: 3,
                pointBackgroundColor: "#1a73e8",
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.35,
                backgroundColor: gradient,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        font: { size: 14 },
                        color: "#000"
                    }
                },
                tooltip: {
                    backgroundColor: "#1a73e8",
                    titleColor: "#fff",
                    bodyColor: "#fff",
                    padding: 12,
                    cornerRadius: 10
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "#333",
                        maxRotation: 45,
                        font: { size: 12 }
                    },
                    grid: { display: false }
                },
                y: {
                    ticks: {
                        color: "#333",
                        font: { size: 12 }
                    },
                    grid: { color: "#e5e7eb" }
                }
            }
        }
    });
}

}

// 🔹 Crear instancia Y ponerla en window antes del DOMContentLoaded
const ui = new VentasUI();
window.VentasUI = ui;

// 🔹 Cargar tabla cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    ui.cargarTabla();
});

