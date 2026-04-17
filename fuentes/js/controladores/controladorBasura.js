class ControladorBasura {
    constructor() {
        this.basuras = [];
        this.cargarDatosEjemplo();
    }

    cargarDatosEjemplo() {
        this.basuras = [
            new Basura(null, 'Botella plástico', 'transparente', 0.03, 'plastico', 'Botella de agua', 'usado', true, '2026-04-15'),
            new Basura(null, 'Lata aluminio', 'plateado', 0.015, 'aluminio', 'Lata de refresco', 'usado', true, '2026-04-14'),
            new Basura(null, 'Bolsa papel', 'marrón', 0.005, 'papel', 'Bolsa de supermercado', 'usado', true, '2026-04-13')
        ];
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
            datosFormulario.get('pesoBasura'),
            datosFormulario.get('material'),
            datosFormulario.get('descripcion'),
            datosFormulario.get('estado'),
            datosFormulario.get('reciclable') === 'on',
            datosFormulario.get('fecha')
        );
        this.basuras.push(nueva);
        return nueva;
    }

    actualizar(id, datosFormulario) {
        const indice = this.basuras.findIndex(b => b.id === id);
        if (indice === -1) return null;
        const actualizada = new Basura(
            id,
            datosFormulario.get('nombre'),
            datosFormulario.get('colorBasura'),
            datosFormulario.get('pesoBasura'),
            datosFormulario.get('material'),
            datosFormulario.get('descripcion'),
            datosFormulario.get('estado'),
            datosFormulario.get('reciclable') === 'on',
            datosFormulario.get('fecha')
        );
        this.basuras[indice] = actualizada;
        return actualizada;
    }

    eliminar(id) {
        this.basuras = this.basuras.filter(b => b.id !== id);
    }

    filtrarPorNombre(texto) {
        if (!texto) return this.basuras;
        return this.basuras.filter(b => b.nombre.toLowerCase().includes(texto.toLowerCase()));
    }
}
