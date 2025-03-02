const diasDisponibles = ["martes", "miércoles", "jueves", "viernes", "sábado"];

const selectDia = document.getElementById('dia');
const selectHora = document.getElementById('hora');
const inputNombre = document.getElementById('nombre');
const botonRegistrar = document.getElementById('registrar-turno');
const alerta = document.getElementById('alerta');
const listaTurnos = document.getElementById('lista-turnos');

let turnos = JSON.parse(localStorage.getItem('turnos')) || {};

function inicializar() {
    generarHorasDisponibles();
    mostrarTurnos();
}

function generarHorasDisponibles() {
    const horasDisponibles = [];
    for (let i = 8; i <= 20; i++) {
        const horaFormato = i < 10 ? '0' + i : i;
        horasDisponibles.push(horaFormato);
    }


    selectHora.innerHTML = '<option value="">Seleccione una hora...</option>'; 
    horasDisponibles.forEach(hora => {
        const option = document.createElement('option');
        option.value = hora;
        option.textContent = `${hora}:00`;
        selectHora.appendChild(option);

        const optionMedia = document.createElement('option');
        optionMedia.value = `${hora}:30`;
        optionMedia.textContent = `${hora}:30`;
        selectHora.appendChild(optionMedia);
    });
}

function registrarTurno() {
    const diaSeleccionado = selectDia.value;
    const horaSeleccionada = selectHora.value;
    const nombreUsuario = inputNombre.value.trim();

    if (!validarEntradas(diaSeleccionado, horaSeleccionada, nombreUsuario)) return;

    const turnoId = `${diaSeleccionado}-${horaSeleccionada}`;

    if (turnos[turnoId]) {
        alerta.textContent = "Este turno ya está ocupado. Por favor, selecciona otro.";
        return;
    }

    turnos[turnoId] = { dia: diaSeleccionado, hora: horaSeleccionada, nombre: nombreUsuario };
    localStorage.setItem('turnos', JSON.stringify(turnos)); 

    alerta.textContent = "";
    selectDia.value = "";
    selectHora.value = "";
    inputNombre.value = "";

    mostrarTurnos();
}

function validarEntradas(dia, hora, nombre) {
    if (!dia || !hora || !nombre) {
        alerta.textContent = "Por favor, selecciona día, hora y proporciona tu nombre.";
        return false;
    }

    if (!diasDisponibles.includes(dia)) {
        alerta.textContent = "Solo se pueden seleccionar días entre martes y sábado.";
        return false;
    }

    return true;
}

function mostrarTurnos() {
    listaTurnos.innerHTML = '';
    for (const turnoId in turnos) {
        const turno = turnos[turnoId];
        const li = document.createElement('li');
        li.classList.add('turno-item');
        li.innerHTML = `Turno: ${turno.dia}, ${turno.hora} - Nombre: ${turno.nombre} <button onclick="eliminarTurno('${turnoId}')">Eliminar</button>`;
        listaTurnos.appendChild(li);
    }
}

function eliminarTurno(turnoId) {
    delete turnos[turnoId];
    localStorage.setItem('turnos', JSON.stringify(turnos)); 
    mostrarTurnos(); 
}

botonRegistrar.addEventListener('click', registrarTurno);

inicializar();
