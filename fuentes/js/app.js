// ----- CONSTANTES Y VARIABLES GLOBALES -----
const STORAGE_KEY = 'basuras_ods13';  // Clave para localStorage
let basuras = [];                     // Array con los objetos Basura

// ----- FUNCIONES DE ALMACENAMIENTO -----
function cargarBasuras() {
    const datosGuardados = localStorage.getItem(STORAGE_KEY);
    if (datosGuardados) {
        const objetosPlanos = JSON.parse(datosGuardados);
        // Convertir cada objeto plano a instancia de Basura
        basuras = objetosPlanos.map(obj => new Basura(
            obj.id, obj.nombre, obj.color, obj.peso, obj.material,
            obj.descripcion, obj.estado, obj.reciclable, obj.fecha
        ));
    } else {
        basuras = [];
    }
}

function guardarBasuras() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(basuras));
}

// ----- RENDERIZAR TABLA -----
function renderizarTabla(listaAMostrar) {
    const tbody = document.getElementById('lista-body');
    tbody.innerHTML = '';  // Limpiar tabla

    if (listaAMostrar.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;">No hay residuos registrados</td></tr>';
        return;
    }

    listaAMostrar.forEach(basura => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${basura.id.slice(0, 8)}...</td>
            <td>${basura.nombre}</td>
            <td>${basura.color}</td>
            <td>${basura.peso.toFixed(2)} kg</td>
            <td>${basura.descripcion}</td>
            <td>${basura.material}</td>
            <td>${basura.estado}</td>
            <td>${basura.reciclable ? '♻️ Sí' : '❌ No'}</td>
            <td>${basura.fecha}</td>
            <td>
                <button class="editar" data-id="${basura.id}">✏️ Editar</button>
                <button class="eliminar" data-id="${basura.id}">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });

    // Asignar eventos a botones de editar y eliminar
    document.querySelectorAll('.editar').forEach(btn => {
        btn.addEventListener('click', function() {
            editarBasura(this.dataset.id);
        });
    });
    document.querySelectorAll('.eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            eliminarBasura(this.dataset.id);
        });
    });
}

// ----- CONTROL DE VISTAS (LISTADO / FORMULARIO) -----
const vistaListado = document.getElementById('vistaListado');
const vistaFormulario = document.getElementById('vistaFormulario');

function mostrarListado() {
    vistaListado.classList.remove('vista-oculta');
    vistaFormulario.classList.add('vista-oculta');
    renderizarTabla(basuras);
}

function mostrarFormulario(modoEdicion = false, id = null) {
    vistaListado.classList.add('vista-oculta');
    vistaFormulario.classList.remove('vista-oculta');

    const titulo = document.getElementById('tituloFormulario');
    const formulario = document.getElementById('form-basura');
    formulario.reset();

    if (modoEdicion) {
        titulo.textContent = 'Editar residuo';
        document.getElementById('basuraId').value = id;
        const basura = basuras.find(b => b.id === id);
        if (basura) {
            document.getElementById('nombre').value = basura.nombre;
            document.getElementById('colorBasura').value = basura.color;
            document.getElementById('pesoBasura').value = basura.peso;
            document.getElementById('material').value = basura.material;
            document.getElementById('descripcion').value = basura.descripcion;
            document.querySelector(`input[name="estado"][value="${basura.estado}"]`).checked = true;
            document.getElementById('reciclable').checked = basura.reciclable;
            document.getElementById('fecha').value = basura.fecha;
        }
    } else {
        titulo.textContent = 'Nuevo residuo';
        document.getElementById('basuraId').value = '';
    }
}

// ----- OPERACIONES CRUD -----
function guardarResiduo(evento) {
    evento.preventDefault();  // Evitar recarga de página

    const id = document.getElementById('basuraId').value;
    const nombre = document.getElementById('nombre').value;
    const color = document.getElementById('colorBasura').value;
    const peso = document.getElementById('pesoBasura').value;
    const material = document.getElementById('material').value;
    const descripcion = document.getElementById('descripcion').value;
    const estado = document.querySelector('input[name="estado"]:checked').value;
    const reciclable = document.getElementById('reciclable').checked;
    const fecha = document.getElementById('fecha').value;

    if (id) {
        // Editar existente
        const indice = basuras.findIndex(b => b.id === id);
        if (indice !== -1) {
            basuras[indice] = new Basura(id, nombre, color, peso, material, descripcion, estado, reciclable, fecha);
        }
        mostrarMensaje('Residuo actualizado ✅', 'ok');
    } else {
        // Crear nuevo
        const nuevaBasura = new Basura(null, nombre, color, peso, material, descripcion, estado, reciclable, fecha);
        basuras.push(nuevaBasura);
        mostrarMensaje('Residuo añadido ✅', 'ok');
    }

    guardarBasuras();
    mostrarListado();
}

function editarBasura(id) {
    mostrarFormulario(true, id);
}

function eliminarBasura(id) {
    if (confirm('¿Seguro que quieres eliminar este residuo?')) {
        basuras = basuras.filter(b => b.id !== id);
        guardarBasuras();
        renderizarTabla(basuras);
        mostrarMensaje('Residuo eliminado 🗑️', 'ok');
    }
}

// ----- FILTRO DE BÚSQUEDA -----
function filtrarTabla() {
    const texto = document.getElementById('filtroNombre').value.toLowerCase();
    const filtradas = basuras.filter(b => b.nombre.toLowerCase().includes(texto));
    renderizarTabla(filtradas);
}

function limpiarFiltro() {
    document.getElementById('filtroNombre').value = '';
    renderizarTabla(basuras);
}

// ----- MENSAJES TEMPORALES -----
function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = texto;
    mensajeDiv.style.backgroundColor = '#d4edda';
    mensajeDiv.style.color = '#155724';
    mensajeDiv.style.padding = '10px';
    mensajeDiv.style.borderRadius = '4px';
    setTimeout(() => mensajeDiv.textContent = '', 3000);
}

// ----- INICIALIZACIÓN AL CARGAR LA PÁGINA -----
document.addEventListener('DOMContentLoaded', function() {
    cargarBasuras();
    mostrarListado();

    // Eventos de menú
    document.getElementById('btnMostrarLista').addEventListener('click', mostrarListado);
    document.getElementById('btnMostrarFormulario').addEventListener('click', () => mostrarFormulario(false));
    document.getElementById('btnCancelar').addEventListener('click', mostrarListado);

    // Evento submit del formulario
    document.getElementById('form-basura').addEventListener('submit', guardarResiduo);

    // Eventos de filtro
    document.getElementById('btnFiltrar').addEventListener('click', filtrarTabla);
    document.getElementById('btnLimpiarFiltro').addEventListener('click', limpiarFiltro);
});