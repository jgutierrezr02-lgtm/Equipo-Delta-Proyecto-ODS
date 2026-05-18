class Jugador {
    constructor(nombre) {
        this.nombre = nombre || 'Jugador';
        this.puntos = 0;
        this.aciertos = 0;
        this.fallos = 0;
    }

    sumarAcierto() {
        this.puntos += 10;
        this.aciertos++;
    }

    sumarFallo() {
        this.puntos -= 5;
        this.fallos++;
    }

    reiniciar() {
        this.puntos = 0;
        this.aciertos = 0;
        this.fallos = 0;
    }
}
