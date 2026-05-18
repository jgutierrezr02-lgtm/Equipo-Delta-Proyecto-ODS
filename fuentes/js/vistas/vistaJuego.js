class VistaJuego {
    constructor(controladorJuego) {
        this.controladorJuego = controladorJuego;

        this.vistaJuego = document.getElementById('vistaJuego');
        this.inputJugador = document.getElementById('nombreJugador');
        this.btnIniciarJuego = document.getElementById('btnIniciarJuego');
        this.btnReiniciarJuego = document.getElementById('btnReiniciarJuego');
        this.tableroJuego = document.getElementById('tableroJuego');
        this.objetosJuego = document.getElementById('objetosJuego');
        this.infoResiduo = document.getElementById('infoResiduoJuego');
        this.zonas = document.querySelectorAll('.zona-contenedor');
        this.resultadoJuego = document.getElementById('resultadoJuego');
        this.puntuacionJuego = document.getElementById('puntuacionJuego');

        this.objetosEnPantalla = [];
        this.objetoSeleccionado = null;
        this.idArrastrado = null;
        this.movimiento = null;
        this.maxObjetosPantalla = 1;

        this.configurarEventos();
    }

    configurarEventos() {
        this.btnIniciarJuego.addEventListener('click', () => this.iniciarJuego());
        this.btnReiniciarJuego.addEventListener('click', () => this.iniciarJuego());

        document.addEventListener('keydown', (evento) => this.controlarTeclado(evento));

        this.zonas.forEach(zona => {
            zona.addEventListener('dragover', (evento) => {
                evento.preventDefault();
                zona.classList.add('contenedor-activo');
            });

            zona.addEventListener('dragleave', () => {
                zona.classList.remove('contenedor-activo');
            });

            zona.addEventListener('drop', (evento) => {
                evento.preventDefault();
                zona.classList.remove('contenedor-activo');
                this.responder(zona.dataset.material, this.idArrastrado);
            });

            zona.addEventListener('click', () => {
                this.responder(zona.dataset.material);
            });
        });
    }

    iniciarJuego() {
        this.detenerMovimiento();
        this.limpiarObjetos();
        this.controladorJuego.iniciarJuego(this.inputJugador.value);
        this.resultadoJuego.textContent = '';
        this.resultadoJuego.className = '';
        this.infoResiduo.textContent = 'Selecciona el residuo y llévalo a su contenedor. Solo aparece un residuo cada vez.';
        this.actualizarPuntuacion();

        if (!this.controladorJuego.quedanResiduosPendientes()) {
            this.infoResiduo.textContent = 'No hay residuos para jugar. Crea alguno en el CRUD primero.';
            return;
        }

        this.rellenarTablero();
        this.iniciarMovimiento();
    }

    rellenarTablero() {
        while (this.objetosEnPantalla.length < this.maxObjetosPantalla && this.controladorJuego.quedanResiduosPendientes()) {
            const residuo = this.controladorJuego.obtenerSiguienteResiduo();
            this.crearObjetoGrafico(residuo);
        }
    }

    crearObjetoGrafico(residuo) {
        const elemento = document.createElement('div');
        elemento.className = 'residuo-grafico';
        elemento.draggable = true;
        elemento.textContent = this.obtenerIconoMaterial(residuo.material);
        elemento.title = residuo.nombre;

        const anchoTablero = this.tableroJuego.clientWidth || 620;
        const posicionX = Math.floor(Math.random() * Math.max(100, anchoTablero - 90)) + 10;
        const velocidadHorizontal = this.numeroAleatorio(0.8, 2.8) * (Math.random() > 0.5 ? 1 : -1);
        const velocidadVertical = this.numeroAleatorio(0.8, 2.2);

        const objeto = {
            id: residuo.id,
            residuo: residuo,
            elemento: elemento,
            x: posicionX,
            y: 35,
            velocidadX: velocidadHorizontal,
            velocidadY: velocidadVertical
        };

        elemento.addEventListener('click', () => this.seleccionarObjeto(objeto.id));
        elemento.addEventListener('mouseover', () => elemento.classList.add('residuo-activo'));
        elemento.addEventListener('mouseout', () => elemento.classList.remove('residuo-activo'));
        elemento.addEventListener('dragstart', (evento) => {
            this.idArrastrado = objeto.id;
            this.seleccionarObjeto(objeto.id);
            evento.dataTransfer.setData('text/plain', objeto.id);
        });

        this.objetosJuego.appendChild(elemento);
        this.objetosEnPantalla.push(objeto);
        this.pintarObjeto(objeto);

        if (!this.objetoSeleccionado) {
            this.seleccionarObjeto(objeto.id);
        }
    }

    seleccionarObjeto(idObjeto) {
        this.objetoSeleccionado = this.objetosEnPantalla.find(objeto => objeto.id === idObjeto) || null;

        this.objetosEnPantalla.forEach(objeto => {
            objeto.elemento.classList.toggle('residuo-seleccionado', objeto.id === idObjeto);
        });

        if (this.objetoSeleccionado) {
            const residuo = this.objetoSeleccionado.residuo;
            this.infoResiduo.textContent = `${residuo.nombre} · ${residuo.color} · ${residuo.estado} · Material oculto: clasifícalo`;
        }
    }

    iniciarMovimiento() {
        this.movimiento = setInterval(() => {
            const anchoTablero = this.tableroJuego.clientWidth;
            const altoTablero = this.tableroJuego.clientHeight;

            this.objetosEnPantalla.forEach(objeto => {
                objeto.x += objeto.velocidadX;
                objeto.y += objeto.velocidadY;

                if (objeto.x <= 0 || objeto.x >= anchoTablero - 70) {
                    objeto.velocidadX = objeto.velocidadX * -1;
                }

                if (objeto.y >= altoTablero - 78) {
                    this.perderObjeto(objeto.id);
                } else {
                    this.pintarObjeto(objeto);
                }
            });
        }, 30);
    }

    pintarObjeto(objeto) {
        objeto.elemento.style.left = `${objeto.x}px`;
        objeto.elemento.style.top = `${objeto.y}px`;
    }

    perderObjeto(idObjeto) {
        const objeto = this.objetosEnPantalla.find(item => item.id === idObjeto);
        if (!objeto) return;

        this.quitarObjeto(idObjeto);
        this.controladorJuego.registrarResiduoPerdido();
        this.resultadoJuego.textContent = `⚠️ ${objeto.residuo.nombre} cayó al suelo. Pierdes una vida.`;
        this.resultadoJuego.className = 'mensaje-error';
        this.actualizarPuntuacion();
        this.continuarOFinalizar();
    }

    responder(materialElegido, idObjeto = null) {
        const objeto = idObjeto
            ? this.objetosEnPantalla.find(item => item.id === idObjeto)
            : this.objetoSeleccionado;

        if (!objeto) {
            this.resultadoJuego.textContent = 'Primero selecciona o arrastra un residuo.';
            this.resultadoJuego.className = 'mensaje-error';
            return;
        }

        const correcto = this.controladorJuego.comprobarRespuesta(objeto.residuo, materialElegido);

        if (correcto) {
            this.resultadoJuego.textContent = `✅ Correcto. ${objeto.residuo.nombre} estaba bien clasificado.`;
            this.resultadoJuego.className = 'mensaje-correcto';
        } else {
            this.resultadoJuego.textContent = `❌ Incorrecto. ${objeto.residuo.nombre} iba en ${objeto.residuo.material}.`;
            this.resultadoJuego.className = 'mensaje-error';
        }

        this.quitarObjeto(objeto.id);
        this.actualizarPuntuacion();
        this.continuarOFinalizar();
    }

    continuarOFinalizar() {
        this.rellenarTablero();

        if (this.controladorJuego.juegoTerminado(this.objetosEnPantalla.length)) {
            this.terminarJuego();
            return;
        }

        if (!this.objetoSeleccionado && this.objetosEnPantalla.length > 0) {
            this.seleccionarObjeto(this.objetosEnPantalla[0].id);
        }
    }

    quitarObjeto(idObjeto) {
        const objeto = this.objetosEnPantalla.find(item => item.id === idObjeto);
        if (!objeto) return;

        objeto.elemento.remove();
        this.objetosEnPantalla = this.objetosEnPantalla.filter(item => item.id !== idObjeto);

        if (this.objetoSeleccionado && this.objetoSeleccionado.id === idObjeto) {
            this.objetoSeleccionado = null;
        }
    }

    controlarTeclado(evento) {
        if (this.vistaJuego.classList.contains('vista-oculta')) {
            return;
        }

        if (evento.key === '1') this.responder('plastico');
        if (evento.key === '2') this.responder('vidrio');
        if (evento.key === '3') this.responder('papel');
        if (evento.key === '4') this.responder('aluminio');
        if (evento.key === '5') this.responder('hierro');
        if (evento.key === '6') this.responder('cobre');
        if (evento.key === '7') this.responder('oro');
        if (evento.key === '8') this.responder('plata');
    }

    obtenerIconoMaterial(material) {
        const iconos = {
            plastico: '🥤',
            vidrio: '🍾',
            papel: '📰',
            aluminio: '🥫',
            hierro: '🔩',
            cobre: '🔌',
            oro: '💍',
            plata: '🪙'
        };

        return iconos[material] || '♻️';
    }

    numeroAleatorio(minimo, maximo) {
        return Math.random() * (maximo - minimo) + minimo;
    }

    actualizarPuntuacion() {
        const estadisticas = this.controladorJuego.obtenerEstadisticas();
        this.puntuacionJuego.textContent =
            `Jugador: ${estadisticas.nombre} · Puntos: ${estadisticas.puntos} · Aciertos: ${estadisticas.aciertos} · Fallos: ${estadisticas.fallos} · Vidas: ${estadisticas.vidas} · Pendientes: ${estadisticas.pendientes}`;
    }

    detenerMovimiento() {
        if (this.movimiento) {
            clearInterval(this.movimiento);
            this.movimiento = null;
        }
    }

    limpiarObjetos() {
        this.objetosJuego.innerHTML = '';
        this.objetosEnPantalla = [];
        this.objetoSeleccionado = null;
        this.idArrastrado = null;
    }

    terminarJuego() {
        const estadisticas = this.controladorJuego.obtenerEstadisticas();
        this.detenerMovimiento();
        this.limpiarObjetos();
        this.infoResiduo.textContent = 'Partida terminada.';
        this.resultadoJuego.className = 'mensaje-correcto';
        this.resultadoJuego.textContent =
            `Juego terminado. Has conseguido ${estadisticas.puntos} puntos con ${estadisticas.aciertos} aciertos y ${estadisticas.fallos} fallos.`;
    }
}
