class ControladorJuego {
    constructor(controladorBasura) {
        this.controladorBasura = controladorBasura;
        this.jugador = new Jugador('Jugador');
        this.residuosPendientes = [];
        this.vidas = 3;
        this.jugando = false;
    }

    iniciarJuego(nombreJugador) {
        this.jugador = new Jugador(nombreJugador);
        this.residuosPendientes = this.mezclarResiduos(this.controladorBasura.obtenerTodas());
        this.vidas = 3;
        this.jugando = true;
    }

    mezclarResiduos(residuos) {
        const copia = [...residuos];
        for (let i = copia.length - 1; i > 0; i--) {
            const posicionAleatoria = Math.floor(Math.random() * (i + 1));
            const temporal = copia[i];
            copia[i] = copia[posicionAleatoria];
            copia[posicionAleatoria] = temporal;
        }
        return copia;
    }

    obtenerSiguienteResiduo() {
        if (this.vidas <= 0 || this.residuosPendientes.length === 0) {
            return null;
        }
        return this.residuosPendientes.shift();
    }

    comprobarRespuesta(residuo, materialElegido) {
        if (!residuo || this.vidas <= 0) {
            return false;
        }

        const correcto = residuo.material === materialElegido;

        if (correcto) {
            this.jugador.sumarAcierto();
        } else {
            this.jugador.sumarFallo();
            this.vidas--;
        }

        return correcto;
    }

    registrarResiduoPerdido() {
        if (this.vidas <= 0) {
            return;
        }

        this.jugador.sumarFallo();
        this.vidas--;
    }

    quedanResiduosPendientes() {
        return this.residuosPendientes.length > 0;
    }

    juegoTerminado(objetosEnPantalla) {
        return this.vidas <= 0 || (!this.quedanResiduosPendientes() && objetosEnPantalla === 0);
    }

    obtenerEstadisticas() {
        return {
            nombre: this.jugador.nombre,
            puntos: this.jugador.puntos,
            aciertos: this.jugador.aciertos,
            fallos: this.jugador.fallos,
            vidas: this.vidas,
            pendientes: this.residuosPendientes.length
        };
    }
}