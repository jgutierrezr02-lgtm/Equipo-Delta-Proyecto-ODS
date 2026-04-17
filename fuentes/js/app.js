document.addEventListener('DOMContentLoaded', () => {
    const controlador = new ControladorBasura();
    const vista = new VistaBasura(controlador);
    vista.mostrarListado();
});
