document.addEventListener('DOMContentLoaded', () => {
    const controladorBasura = new ControladorBasura();
    const controladorJuego = new ControladorJuego(controladorBasura);

    const vistaBasura = new VistaBasura(controladorBasura);
    const vistaJuego = new VistaJuego(controladorJuego);

    vistaBasura.mostrarListado();
});

