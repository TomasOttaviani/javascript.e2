const diasDisponibles = ["martes", "miércoles", "jueves", "viernes", "sábado"];

const selectDia = document.getElementById('dia');
const selectHora = document.getElementById('hora');
const inputNombre = document.getElementById('nombre');
const botonRegistrar = document.getElementById('registrar-turno');
const listaTurnos = document.getElementById('lista-turnos');

let turnos = {};

function inicializar() {
    cargarTurnos();
    generarHorasDisponibles();
}

function cargarTurnos() {
    const turnosGuardados = localStorage.getItem('turnos');

    try {
        if (turnosGuardados) {
            const data = JSON.parse(turnosGuardados);
            if (data && typeof data === "object" && !Array.isArray(data)) {
                turnos = data;
                mostrarTurnos();
                return;
            }
        }
    } catch (e) {
        console.warn("Error al parsear localStorage. Se carga desde JSON.");
    }

    fetch('turnos.json')
        .then(response => response.json())
        .then(data => {
            turnos = data;
            localStorage.setItem('turnos', JSON.stringify(turnos));
            mostrarTurnos();
        })
        .catch(error => {
            console.error('Error al cargar los turnos desde JSON:', error);
        });
}

function generarHorasDisponibles() {
    const horasDisponibles = [];
    for (let i = 8; i <= 20; i++) {
        const horaFormato = i.toString().padStart(2, '0');
        horasDisponibles.push(horaFormato);
    }

    selectHora.innerHTML = '<option value="">Seleccione una hora...</option>';
    horasDisponibles.forEach(hora => {
        const option = document.createElement('option');
        option.value = `${hora}:00`;
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
        Swal.fire({
            icon: 'error',
            title: '¡Turno no disponible!',
            text: 'Este turno ya está ocupado. Por favor, selecciona otro.'
        });
        return;
    }

    turnos[turnoId] = { dia: diaSeleccionado, hora: horaSeleccionada, nombre: nombreUsuario };
    localStorage.setItem('turnos', JSON.stringify(turnos));

    Swal.fire({
        icon: 'success',
        title: '¡Turno registrado!',
        text: `Tu turno para el ${diaSeleccionado} a las ${horaSeleccionada} ha sido registrado.`
    });

    selectDia.value = "";
    selectHora.value = "";
    inputNombre.value = "";

    mostrarTurnos();
}

function validarEntradas(dia, hora, nombre) {
    if (!dia || !hora || !nombre) {
        Swal.fire({
            icon: 'warning',
            title: '¡Datos incompletos!',
            text: 'Por favor, selecciona el día, la hora y proporciona tu nombre.'
        });
        return false;
    }

    if (!diasDisponibles.includes(dia)) {
        Swal.fire({
            icon: 'warning',
            title: 'Día no válido',
            text: 'Solo se pueden seleccionar días entre martes y sábado.'
        });
        return false;
    }

    return true;
}

function mostrarTurnos() {
    const listaTurnos = document.getElementById('lista-turnos');
    listaTurnos.innerHTML = '';

    if (Object.keys(turnos).length === 0) {
        listaTurnos.innerHTML = '<p class="text-center text-muted">No hay turnos registrados.</p>';
        return;
    }

    for (const turnoId in turnos) {
        const turno = turnos[turnoId];

        const tarjeta = document.createElement('div');
        tarjeta.className = 'card text-white bg-dark mb-3 shadow-sm animate__animated animate__slideInUp';
        tarjeta.innerHTML = `
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title mb-1">${turno.nombre}</h5>
                    <p class="card-text mb-0"><strong>Día:</strong> ${turno.dia}</p>
                    <p class="card-text"><strong>Hora:</strong> ${turno.hora}</p>
                </div>
                <button class="btn btn-danger btn-sm" onclick="eliminarTurno('${turnoId}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        listaTurnos.appendChild(tarjeta);
    }
}

function eliminarTurno(turnoId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este turno será eliminado.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            delete turnos[turnoId];
            localStorage.setItem('turnos', JSON.stringify(turnos));
            Swal.fire({
                icon: 'success',
                title: '¡Turno eliminado!',
                text: 'El turno ha sido eliminado correctamente.'
            });
            mostrarTurnos();
        }
    });
}

botonRegistrar.addEventListener('click', registrarTurno);

inicializar();

