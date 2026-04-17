const STORAGE_KEY = "basura_items";
 
function cargarItems() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}
 
function guardarItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
 
// ─── Formulario (crear y editar) ─────────────────────────────────────────────
const formulario = document.getElementById("form-basura");
if (formulario) {
    const idEdicion = new URLSearchParams(window.location.search).get("id");
    if (idEdicion) {
        const itemAEditar = cargarItems().find(item => item.id === parseInt(idEdicion));
        if (itemAEditar) {
            const titulo = document.querySelector("h1");
            if (titulo) titulo.textContent = "Editar basura";
                formulario.nombre.value       = itemAEditar.nombre;
                formulario.colorBasura.value  = itemAEditar.colorBasura;
                formulario.pesoBasura.value   = itemAEditar.pesoBasura;
                formulario.material.value     = itemAEditar.material;
                formulario.descripcion.value  = itemAEditar.descripcion;
                formulario.fecha.value        = itemAEditar.fecha;
                formulario.reciclable.checked = itemAEditar.reciclable;
                formulario.querySelectorAll("[name='estado']").forEach(radio => radio.checked = radio.value === itemAEditar.estado);
        }
    }
 
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const items = cargarItems();
        const datos = {
            nombre:      formulario.nombre.value.trim(),
            colorBasura: formulario.colorBasura.value.trim(),
            pesoBasura:  parseFloat(formulario.pesoBasura.value),
            material:    formulario.material.value,
            descripcion: formulario.descripcion.value.trim(),
            estado:      formulario.querySelector("[name='estado']:checked")?.value ?? "",
            reciclable:  formulario.reciclable.checked,
            fecha:       formulario.fecha.value,
        };
        if (idEdicion) {
            const index = items.findIndex(item => item.id === parseInt(idEdicion));
            items[index] = { id: parseInt(idEdicion), ...datos };
        } else {
            const nuevoId = items.length ? Math.max(...items.map(item => item.id)) + 1 : 1;
            items.push({ id: nuevoId, ...datos });
        }
        guardarItems(items);
        window.location.href = "lista.html";
    });
}
 
// ─── Lista (leer, editar y eliminar) ─────────────────────────────────────────
const cuerpoTabla = document.getElementById("lista-body");
if (cuerpoTabla) {
    const items = cargarItems();
    if (items.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="10">No hay elementos registrados.</td></tr>`;
    } else {
        items.forEach(item => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${item.id}</td>
                <td>${item.nombre}</td>
                <td>${item.colorBasura}</td>
                <td>${item.pesoBasura}</td>
                <td>${item.descripcion}</td>
                <td>${item.material}</td>
                <td>${item.estado}</td>
                <td>${item.reciclable ? "Sí" : "No"}</td>
                <td>${item.fecha}</td>
                <td>
                    <button data-action="editar"   data-id="${item.id}">Editar</button>
                    <button data-action="eliminar" data-id="${item.id}">Eliminar</button>
                </td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    }
 
    cuerpoTabla.addEventListener("click", function (evento) {
        const boton = evento.target.closest("button[data-action]");
        if (!boton) return;
        const id = parseInt(boton.dataset.id);
        if (boton.dataset.action === "editar") {
            window.location.href = `formulario.html?id=${id}`;
        }
        if (boton.dataset.action === "eliminar") {
            const itemsFiltrados = cargarItems().filter(item => item.id !== id);
            guardarItems(itemsFiltrados);
            boton.closest("tr").remove();
        }
    });
}