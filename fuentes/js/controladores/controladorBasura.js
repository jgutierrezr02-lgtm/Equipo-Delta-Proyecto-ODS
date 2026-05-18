class ControladorBasura {
    constructor() {
        this.basuras = [];
        this.cargarDatos();
    }

    cargarDatos() {
        const datosGuardados = localStorage.getItem('basurasODS');

        if (datosGuardados) {
            const objetos = JSON.parse(datosGuardados);
            this.basuras = objetos.map(objeto => new Basura(
                objeto.id,
                objeto.nombre,
                objeto.color,
                objeto.material,
                objeto.descripcion,
                objeto.estado,
                objeto.reciclable,
                objeto.fecha
            ));
            return;
        }

        this.cargarDatosEjemplo();
    }

    cargarDatosEjemplo() {
        this.basuras = [
            new Basura(null, 'Botella de agua', 'transparente', 'plastico', 'Botella de plástico usada', 'usado', true, '2026-04-15'),
            new Basura(null, 'Lata de refresco', 'plateado', 'aluminio', 'Lata vacía de refresco', 'usado', true, '2026-04-14'),
            new Basura(null, 'Periódico viejo', 'gris', 'papel', 'Papel de periódico para reciclar', 'usado', true, '2026-04-13'),
            new Basura(null, 'Botella de vidrio', 'verde', 'vidrio', 'Botella de vidrio de bebida', 'usado', true, '2026-04-12'),
            new Basura(null, 'Cable de cobre', 'naranja', 'cobre', 'Cable viejo de electricidad', 'rotura', true, '2026-04-11'),
            new Basura(null, 'Tornillo oxidado', 'marrón', 'hierro', 'Pieza metálica oxidada', 'rotura', true, '2026-04-10'),
            new Basura(null, 'Anillo falso', 'dorado', 'oro', 'Objeto decorativo dorado', 'usado', true, '2026-04-09'),
            new Basura(null, 'Moneda antigua', 'plateado', 'plata', 'Objeto metálico plateado', 'usado', true, '2026-04-08')
        ];
        this.guardarDatos();
    }

    guardarDatos() {
        localStorage.setItem('basurasODS', JSON.stringify(this.basuras));
    }

    obtenerTodas() {
        return this.basuras;
    }

    obtenerPorId(id) {
        return this.basuras.find(b => b.id === id);
    }

    crear(datosFormulario) {
        const nueva = new Basura(
            null,
            datosFormulario.get('nombre'),
            datosFormulario.get('colorBasura'),
            datosFormulario.get('material'),
            datosFormulario.get('descripcion'),
            datosFormulario.get('estado'),
            datosFormulario.get('reciclable') === 'on',
            datosFormulario.get('fecha')
        );
        this.basuras.push(nueva);
        this.guardarDatos();
        return nueva;
    }

    actualizar(id, datosFormulario) {
        const indice = this.basuras.findIndex(b => b.id === id);
        if (indice === -1) return null;

        const actualizada = new Basura(
            id,
            datosFormulario.get('nombre'),
            datosFormulario.get('colorBasura'),
            datosFormulario.get('material'),
            datosFormulario.get('descripcion'),
            datosFormulario.get('estado'),
            datosFormulario.get('reciclable') === 'on',
            datosFormulario.get('fecha')
        );
        this.basuras[indice] = actualizada;
        this.guardarDatos();
        return actualizada;
    }

    eliminar(id) {
        this.basuras = this.basuras.filter(b => b.id !== id);
        this.guardarDatos();
    }

    filtrarPorNombre(texto) {
        if (!texto) return this.basuras;
        return this.basuras.filter(b => b.nombre.toLowerCase().includes(texto.toLowerCase()));
    }

    filtrarAvanzado(texto, material, estado, soloReciclables) {
        return this.basuras.filter(basura => {
            const coincideNombre = !texto || basura.nombre.toLowerCase().includes(texto.toLowerCase());
            const coincideMaterial = !material || basura.material === material;
            const coincideEstado = !estado || basura.estado === estado;
            const coincideReciclable = !soloReciclables || basura.reciclable;
            return coincideNombre && coincideMaterial && coincideEstado && coincideReciclable;
        });
    }
}
