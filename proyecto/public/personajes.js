// Variables
let personajeCorrecto;
let personajes = [];
let personajesIngresados = [];
let personajesFiltrados = [];
let intentos = 0;
let winner;

// Eventos:
// Lo primero que se hace al cargar la página:
window.onload = () => {
    fetch('/api/all-personajes')
        .then(response => response.json())
        .then(data => {
            personajes = data.personajes;
           

        // Luego de cargar la lista de personajes, obtener un personaje aleatorio
    fetch('/api/random-personaje')
        .then(response => response.json())
        .then(data => {
            personajeCorrecto = data;
            console.log("Personaje correcto:", personajeCorrecto.nombre);
            // Aquí puedes realizar cualquier acción adicional que necesites con el personaje correcto
        })
        .catch(error => console.error('Error fetching the random personaje:', error));
    })
    .catch(error => console.error('Error fetching the personaje list:', error));
};

function handleKeyPress(event) {
    if (event.key === 'Enter' && document.getElementById('personajeInput').value.length > 0) { 
            document.getElementById('personajeInput').value = personajesFiltrados[0].nombre; 
            verificarPersonaje();
    }
}
document.getElementById('personajeInput').addEventListener('keypress', handleKeyPress);

//Presionar click fuera del personaje input y del personaje select y ocultar la lista de personajes
function handleDocumentClick(event) {
    if (!document.getElementById('personajeInput').contains(event.target) && !document.getElementById('personajeSelect').contains(event.target)) {
        ocultarListaPersonajes();
    }
}
document.addEventListener('click', handleDocumentClick);

//Lista personaje:
function ajustarAlturaPersonajeSelect() {
    const personajeSelect = document.getElementById('personajeSelect');
    const optionCount = personajeSelect.getElementsByTagName('option').length;
    const optionHeight = 30; // Altura estimada de cada opción
    const maxHeight = 150; // Altura máxima permitida para el contenedor

    // Calcula la altura deseada basada en el número de opciones
    const desiredHeight = Math.min(optionCount * optionHeight, maxHeight);

    // Establece la altura del contenedor
    personajeSelect.style.height = `${desiredHeight}px`;
}
//Mostrar la lista de los personajes
function mostrarListaPersonajes() {
    document.getElementById('personajeSelectContainer').classList.remove('hidden');
    filtrarPersonajes(); // Filtrar personajes cada vez que se muestra la lista
    
}

//Filtrar los personajes segun lo que ingreses en el personaje input
function filtrarPersonajes() {
    const filtro = document.getElementById('personajeInput').value.toLowerCase();
    personajesFiltrados = personajes.filter(personaje => personaje.nombre.toLowerCase().includes(filtro));
    cargarListaPersonajes(personajesFiltrados);
    ajustarAlturaPersonajeSelect();
}
document.getElementById('personajeInput').addEventListener('input', filtrarPersonajes);

//Ocultar la lista de los personajes
function ocultarListaPersonajes() {
    document.getElementById('personajeSelectContainer').classList.add('hidden');
}

//Cargar la lista de los personajes para que sea visible
function cargarListaPersonajes(personajes) {
    const personajeSelect = document.getElementById('personajeSelect');
    personajeSelect.innerHTML = '';
    personajes.forEach(personaje => {
        const option = document.createElement('option');
        option.value = personaje.nombre;
        option.textContent = personaje.nombre;
        personajeSelect.appendChild(option);
    });
}



function mostrarPistaPersonajes(id,x, pistaA, pistaB) {
    if (intentos >= x){
        document.getElementById(id).classList.remove('hidden');
        document.getElementById(pistaA).classList.add('hidden');
        document.getElementById(pistaB).classList.add('hidden');
    }
    
}

//Seleccionar un personaje(option) del select y verificarlo, ademas ocultar la lista despues de esto
function seleccionarPersonaje() {
    const personajeSelect = document.getElementById('personajeSelect');
    const selectedpersonaje = personajeSelect.value;
    document.getElementById('personajeInput').value = selectedpersonaje;
    verificarPersonaje();
    document.getElementById('personajeInput').value = ''; // Limpiar el campo de entrada
    ocultarListaPersonajes(); // Ocultar la lista después de seleccionar un personaje
}

//Verificar si el personaje es el correcto y dar las pistas
function verificarPersonaje() {
    const personajeIngresado = document.getElementById('personajeInput').value.trim();
    const resultado = document.getElementById('resultado');
    const intento = document.getElementById('intentos');
    const pista1 = document.getElementById('pista1');
    const pista2 = document.getElementById('pista2');
    const pista3 = document.getElementById('pista3');
    const personajeEncontrado = personajes.find(personaje => personaje.nombre.toLowerCase() === personajeIngresado.toLowerCase());

    if (personajeEncontrado) {
        if (!personajesIngresados.includes(personajeIngresado)) {
            personajes = personajes.filter(personaje => personaje.nombre.toLowerCase() !== personajeIngresado.toLowerCase());
            cargarListaPersonajes(personajes);
            mostrarDetallesPersonaje(personajeEncontrado);
            personajesIngresados.push(personajeIngresado);
            if (personajeIngresado.toLowerCase() === personajeCorrecto.nombre.toLowerCase()) {
                resultado.textContent = "¡Correcto! Has adivinado el personaje.";
                resultado.style.color = "green";
                document.getElementById('personajeInputContainer').classList.add('hidden');
            } else {
                resultado.textContent = "Incorrecto. Intenta de nuevo.";
                resultado.style.color = "red";
                intentos += 1;
                if (intentos == 1) {
                    intento.textContent = "Usted lleva " + intentos + " intento";
                } else {
                    intento.textContent = "Usted lleva " + intentos + " intentos";
                }
                if (intentos == 3) {
                    pista1.textContent = personajeCorrecto.lugarOrigen;
                }
                else if (intentos == 6) {
                    pista2.textContent = personajeCorrecto.nombre.charAt(0);
                }
                else if (intentos == 9) {
                    pista3.textContent = personajeCorrecto.frase;
                }
            }
        }
    } else {
        resultado.textContent = "personaje no encontrado";
        resultado.style.color = "red";
    }

    document.getElementById('personajeInput').value = ''; // Limpiar el campo de entrada
}

function mostrarDetallesPersonaje(personaje) {
    const table = document.getElementById('personajeTable');
    const newRow = table.insertRow(1);
    const detalles = ['nombre', 'franquicia', 'genero', 'especie', 'poder', 'edad', 'altura', 'colorOjos'];
    const delay = 500;


    detalles.forEach((detalle, index) => {
        setTimeout(() => {
            const cell = newRow.insertCell();
            cell.classList.add('cell-flip');

            // Ajustar el tamaño de la fuente si el contenido es muy largo


            const personajeDetalle = personaje[detalle].split(',').map(g => g.trim().toLowerCase());

            
            // Procesar cada parte del detalle para agregar un espacio después del noveno carácter
            
            

            const personajeCorrectoDetalle = personajeCorrecto[detalle].split(',').map(g => g.trim().toLowerCase());

            let isMatch = personajeDetalle.some(g => personajeCorrectoDetalle.includes(g));
            let isExactMatch = personaje[detalle] === personajeCorrecto[detalle];

            
            if (personaje[detalle] == personajeCorrecto[detalle]) {
                cell.style.backgroundColor = "green";
                cell.textContent = personaje[detalle]; // Mostrar el detalle original
            } else {
                cell.style.backgroundColor = "red";
                cell.textContent = personaje[detalle]; // Mostrar el detalle original

                if (detalle === 'edad') {
                    if (parseInt(personaje[detalle]) > parseInt(personajeCorrecto[detalle])) {
                        cell.textContent = `${personaje[detalle]} ⇩`;
                    } else {
                        cell.textContent = `${personaje[detalle]} ⇧`;
                    }
                }else if (detalle === 'altura') {
                    if (parseFloat(personaje[detalle]) > parseFloat(personajeCorrecto[detalle])) {
                        cell.textContent = `${personaje[detalle]} ⇩`;
                    } else {
                        cell.textContent = `${personaje[detalle]} ⇧`;
                    }
                }
            }
            let maxLength = 30; // Longitud a partir de la cual se empieza a reducir el tamaño de la fuente
        
            // Calcula el nuevo tamaño de la fuente
            let fontSize = 16;
            if (cell.textContent.length > maxLength) {
                fontSize -= (cell.textContent.length - maxLength) / 2.5; // Ajusta este valor para obtener la reducción deseada
                if (fontSize < 11) {
                    fontSize = 12; // Establece un tamaño mínimo de la fuente
                }
            }
            
        
            // Aplica el nuevo tamaño de la fuente a la celda
            cell.style.fontSize = `${fontSize}px`;
            
            cell.textContent = cell.textContent;
           
        }, delay * index);
    });
}

//Apartado para adivinar personaje:
//Mostrar el apartado para adivinar el personaje
function agregarQuitarClase(agregar,quitar,clase) {
    document.getElementById(agregar).classList.remove(clase);
    document.getElementById(quitar).classList.add(clase);
}

function toggleIndicadorColores() {
    const indicador = document.getElementById('indicadorColores');
    if (indicador.style.display === 'none') {
        indicador.style.display = 'block';
    } else {
        indicador.style.display = 'none';
    }
}
