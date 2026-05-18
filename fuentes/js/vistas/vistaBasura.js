class VistaBasura {
    constructor(controlador) {
        this.controlador = controlador;

        this.vistaListado = document.getElementById('vistaListado');
        this.vistaFormulario = document.getElementById('vistaFormulario');
        this.vistaJuego = document.getElementById('vistaJuego');
        this.vistaInstrucciones = document.getElementById('vistaInstrucciones');
        this.vistaEstadisticas = document.getElementById('vistaEstadisticas');
        this.vistaODS = document.getElementById('vistaODS');
        this.estadisticasCrud = document.getElementById('estadisticasCrud');
        this.tituloFormulario = document.getElementById('tituloFormulario');
        this.formulario = document.getElementById('form-basura');
        this.inputId = document.getElementById('basuraId');
        this.inputNombre = document.getElementById('nombre');
        this.inputColor = document.getElementById('colorBasura');
        this.selectMaterial = document.getElementById('material');
        this.textareaDesc = document.getElementById('descripcion');
        this.radioEstado = document.getElementsByName('estado');
        this.checkReciclable = document.getElementById('reciclable');
        this.inputFecha = document.getElementById('fecha');
        this.tbody = document.getElementById('lista-body');
        this.filtroNombre = document.getElementById('filtroNombre');
        this.filtroMaterial = document.getElementById('filtroMaterial');
        this.filtroEstado = document.getElementById('filtroEstado');
        this.filtroReciclable = document.getElementById('filtroReciclable');
        this.mensajeDiv = document.getElementById('mensaje');

        this.configurarEventos();
    }

    configurarEventos() {
        document.getElementById('btnMostrarLista').addEventListener('click', () => this.mostrarListado());
        document.getElementById('btnMostrarFormulario').addEventListener('click', () => this.mostrarFormulario());
        document.getElementById('btnMostrarJuego').addEventListener('click', () => this.mostrarVista(this.vistaJuego));
        document.getElementById('btnMostrarInstrucciones').addEventListener('click', () => this.mostrarVista(this.vistaInstrucciones));
        document.getElementById('btnMostrarEstadisticas').addEventListener('click', () => this.mostrarEstadisticas());
        document.getElementById('btnMostrarODS').addEventListener('click', () => this.mostrarVista(this.vistaODS));
        document.getElementById('btnCancelar').addEventListener('click', () => this.mostrarListado());
        this.formulario.addEventListener('submit', (e) => this.guardarResiduo(e));
        document.getElementById('btnFiltrar').addEventListener('click', () => this.filtrar());
        document.getElementById('btnLimpiarFiltro').addEventListener('click', () => this.limpiarFiltro());
    }

    ocultarVistas() {
        this.vistaListado.classList.add('vista-oculta');
        this.vistaFormulario.classList.add('vista-oculta');
        this.vistaJuego.classList.add('vista-oculta');
        this.vistaInstrucciones.classList.add('vista-oculta');
        this.vistaEstadisticas.classList.add('vista-oculta');
        this.vistaODS.classList.add('vista-oculta');
    }

    mostrarVista(vista) {
        this.ocultarVistas();
        vista.classList.remove('vista-oculta');
    }

    mostrarListado() {
        this.mostrarVista(this.vistaListado);
        this.renderizarTabla(this.controlador.obtenerTodas());
    }

    mostrarEstadisticas() {
        const basuras = this.controlador.obtenerTodas();
        const reciclables = basuras.filter(b => b.reciclable).length;
        const materiales = basuras.map(basura => basura.material).join(', ');

        this.estadisticasCrud.textContent =
            `Hay ${basuras.length} residuos registrados y ${reciclables} reciclables. Materiales registrados: ${materiales || 'ninguno'}.`;

        this.mostrarVista(this.vistaEstadisticas);
    }

    mostrarFormulario(modoEdicion = false, id = null) {
        this.mostrarVista(this.vistaFormulario);
        this.formulario.reset();

        if (modoEdicion) {
            this.tituloFormulario.textContent = 'Editar residuo';
            this.inputId.value = id;
            const basura = this.controlador.obtenerPorId(id);
            if (basura) {
                this.inputNombre.value = basura.nombre;
                this.inputColor.value = basura.color;
                this.selectMaterial.value = basura.material;
                this.textareaDesc.value = basura.descripcion;
                this.radioEstado.forEach(r => r.checked = r.value === basura.estado);
                this.checkReciclable.checked = basura.reciclable;
                this.inputFecha.value = basura.fecha;
            }
        } else {
            this.tituloFormulario.textContent = 'Nuevo residuo';
            this.inputId.value = '';
        }
    }

    guardarResiduo(evento) {
        evento.preventDefault();
        const formData = new FormData(this.formulario);
        const id = this.inputId.value;

        if (id) {
            this.controlador.actualizar(id, formData);
            this.mostrarMensaje('Residuo actualizado ✅');
        } else {
            this.controlador.crear(formData);
            this.mostrarMensaje('Residuo añadido ✅');
        }

        this.mostrarListado();
    }

    editarBasura(id) {
        this.mostrarFormulario(true, id);
    }

    eliminarBasura(id) {
        if (confirm('¿Seguro que quieres eliminar este residuo?')) {
            this.controlador.eliminar(id);
            this.renderizarTabla(this.controlador.obtenerTodas());
            this.mostrarMensaje('Residuo eliminado 🗑️');
        }
    }

    renderizarTabla(lista) {
        this.tbody.innerHTML = '';

        if (lista.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">No hay residuos registrados</td></tr>';
            return;
        }

        lista.forEach(basura => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${basura.id.slice(0, 8)}...</td>
                <td>${basura.nombre}</td>
                <td>${basura.color}</td>
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
            this.tbody.appendChild(fila);
        });

        this.tbody.querySelectorAll('.editar').forEach(btn => {
            btn.addEventListener('click', (e) => this.editarBasura(e.target.dataset.id));
        });
        this.tbody.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => this.eliminarBasura(e.target.dataset.id));
        });
    }

    filtrar() {
        const texto = this.filtroNombre.value;
        const material = this.filtroMaterial.value;
        const estado = this.filtroEstado.value;
        const soloReciclables = this.filtroReciclable.checked;
        const filtradas = this.controlador.filtrarAvanzado(texto, material, estado, soloReciclables);
        this.renderizarTabla(filtradas);
    }

    limpiarFiltro() {
        this.filtroNombre.value = '';
        this.filtroMaterial.value = '';
        this.filtroEstado.value = '';
        this.filtroReciclable.checked = false;
        this.renderizarTabla(this.controlador.obtenerTodas());
    }

    mostrarMensaje(texto) {
        this.mensajeDiv.textContent = texto;
        this.mensajeDiv.style.backgroundColor = '#d4edda';
        this.mensajeDiv.style.color = '#155724';
        this.mensajeDiv.style.padding = '10px';
        this.mensajeDiv.style.borderRadius = '4px';
        setTimeout(() => this.mensajeDiv.textContent = '', 3000);
    }
}
