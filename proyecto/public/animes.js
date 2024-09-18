//Variables
let animeCorrecto; 
let animes = []; 
let animesIngresados = [];
let animesFiltrados = [];
let intentos = 0;
let winner;
let verdadero;

//Eventos:
//Lo primero que se hace al cargar la pagina:
window.onload = () => { 
    fetch('/api/random-anime')
        .then(response => response.json()) 
        .then(data => {animeCorrecto = data; console.log("Anime correcto:", animeCorrecto.nombre);})
        .catch(error => console.error('Error fetching the anime:', error));

    fetch('/api/all-animes')
        .then(response => response.json())
        .then(data => {animes = data.animes; cargarListaAnimes(animes);})
        .catch(error => console.error('Error fetching the anime list:', error));
};



//Funciones:
//Al presionar o clickear algo:
//Presionar enter y verificar anime
function handleKeyPress(event) {
    if (event.key === 'Enter') { 
        if (animesFiltrados.length > 0) {
            
            // Seleccionar el valor del primer ítem de la lista filtrada
            document.getElementById('animeInput').value = animesFiltrados[0].nombre;
            console.log('Valor seleccionado:', document.getElementById('animeInput').value);
            verificarAnime();
        } else {
            // Si no hay ítems en la lista filtrada, solo verificar el input
            verificarAnime();
        }
    }
}
document.getElementById('animeInput').addEventListener('keypress', handleKeyPress);

//Presionar click fuera del anime input y del anime select y ocultar la lista de animes
function handleDocumentClick(event) {
    if (!document.getElementById('animeInput').contains(event.target) && !document.getElementById('animeSelect').contains(event.target)) {
        ocultarListaAnimes();
    }
}
document.addEventListener('click', handleDocumentClick);

//Lista Anime:
function ajustarAlturaAnimeSelect() {
    const animeSelect = document.getElementById('animeSelect');
    const optionCount = animeSelect.getElementsByTagName('option').length;
    const optionHeight = 30; // Altura estimada de cada opción
    const maxHeight = 150; // Altura máxima permitida para el contenedor

    // Calcula la altura deseada basada en el número de opciones
    const desiredHeight = Math.min(optionCount * optionHeight, maxHeight);

    // Establece la altura del contenedor
    animeSelect.style.height = `${desiredHeight}px`;
}
//Mostrar la lista de los animes
function mostrarListaAnimes() {
    document.getElementById('animeSelectContainer').classList.remove('hidden');
    filtrarAnimes(); // Filtrar animes cada vez que se muestra la lista
    
}

//Filtrar los animes segun lo que ingreses en el anime input
function filtrarAnimes() {
    const filtro = document.getElementById('animeInput').value.toLowerCase();
    animesFiltrados = animes.filter(anime => anime.nombre.toLowerCase().includes(filtro));
    cargarListaAnimes(animesFiltrados);
    ajustarAlturaAnimeSelect();
}
document.getElementById('animeInput').addEventListener('input', filtrarAnimes);

//Ocultar la lista de los animes
function ocultarListaAnimes() {
    document.getElementById('animeSelectContainer').classList.add('hidden');
}

//Cargar la lista de los animes para que sea visible
function cargarListaAnimes(animes) {
    const animeSelect = document.getElementById('animeSelect');
    animeSelect.innerHTML = '';
    animes.forEach(anime => {
        const option = document.createElement('option');
        option.value = anime.nombre;
        option.textContent = anime.nombre;
        animeSelect.appendChild(option);
    });
}



function mostrarPistaAnimes(id,x, pistaA, pistaB) {
    if (intentos >= x && document.getElementById(id).classList.contains('hidden')){
        document.getElementById(id).classList.remove('hidden');
        document.getElementById(pistaA).classList.add('hidden');
        document.getElementById(pistaB).classList.add('hidden');
    }
    else if(intentos >= x && !document.getElementById(id).classList.contains('hidden')){
        document.getElementById(id).classList.add('hidden');
    }
}


    

function ocultarPistaAnimes(id, pistaA) {
    if (intentos >= x){
        document.getElementById(id).classList.remove('hidden');
        document.getElementById(pistaA).classList.add('hidden');
        document.getElementById(pistaB).classList.add('hidden');
    }
    
}

//Seleccionar un anime(option) del select y verificarlo, ademas ocultar la lista despues de esto
function seleccionarAnime() {
    const animeSelect = document.getElementById('animeSelect');
    const selectedAnime = animeSelect.value;
    document.getElementById('animeInput').value = selectedAnime;
    verificarAnime();
    document.getElementById('animeInput').value = ''; // Limpiar el campo de entrada
    ocultarListaAnimes(); // Ocultar la lista después de seleccionar un anime
}

//Verificar si el anime es el correcto y dar las pistas
function verificarAnime() {
    const animeIngresado = document.getElementById('animeInput').value.trim();
    const resultado = document.getElementById('resultado');
    const intento = document.getElementById('intentos');
    const pista1 = document.getElementById('pista1');
    const pista2 = document.getElementById('pista2');
    const pista3 = document.getElementById('pista3');
    const animeEncontrado = animes.find(anime => anime.nombre.toLowerCase() === animeIngresado.toLowerCase());

    if (animeEncontrado) {
        if (!animesIngresados.includes(animeIngresado)) {
            animes = animes.filter(anime => anime.nombre.toLowerCase() !== animeIngresado.toLowerCase());
            cargarListaAnimes(animes);
            mostrarDetallesAnime(animeEncontrado);
            animesIngresados.push(animeIngresado);
            if (animeIngresado.toLowerCase() === animeCorrecto.nombre.toLowerCase()) {
                resultado.textContent = "¡Correcto! Has adivinado el anime.";
                resultado.style.color = "green";
                document.getElementById('animeInputContainer').classList.add('hidden');
            } else {
                intentos += 1;
                if (intentos == 1) {
                    intento.textContent = "Usted lleva " + intentos + " intento";
                } else {
                    intento.textContent = "Usted lleva " + intentos + " intentos";
                }
                if (intentos >= 5){
                    document.getElementById('imagenArte').src = 'img/pistaArteAnime2.png';
                }
                if (intentos >= 10){
                    document.getElementById('imagenInicial').src = 'img/pistaInicialAnime2.png';
                }
                if (intentos >= 15){
                    document.getElementById('imagenDescripcion').src = 'img/pistaDescripcionAnime2.png';
                }
                pista1.textContent = animeCorrecto.estudio;
                pista2.textContent = animeCorrecto.nombre.charAt(0);
                pista3.textContent = animeCorrecto.descripcion;
                
            }
        }
    } else {
        resultado.textContent = "Anime no encontrado";
        resultado.style.color = "red";
    }

    document.getElementById('animeInput').value = ''; // Limpiar el campo de entrada
}

function mostrarDetallesAnime(anime) {
    const table = document.getElementById('animeTable');
    const newRow = table.insertRow(1);
    const detalles = ['nombre', 'franquicia', 'anio', 'temas', 'episodios', 'generos', 'estudio'];
    const delay = 500;

    detalles.forEach((detalle, index) => {
        setTimeout(() => {
            const cell = newRow.insertCell();
            cell.classList.add('cell-flip');
            // Ajustar el tamaño de la fuente si el contenido es muy largo
            const animeDetalle = anime[detalle].split(',').map(g => g.trim().toLowerCase());
            // Procesar cada parte del detalle para agregar un espacio después del noveno carácter
            const animeCorrectoDetalle = animeCorrecto[detalle].split(',').map(g => g.trim().toLowerCase());

            let isMatch = animeDetalle.some(g => animeCorrectoDetalle.includes(g));
            let isExactMatch = anime[detalle] === animeCorrecto[detalle];

            if (detalle === 'temas' || detalle === 'generos' || detalle === 'estudio') {
                cell.textContent = anime[detalle]; // Mostrar el detalle original
                if (isMatch) {
                    cell.style.backgroundColor = isExactMatch ? "green" : "orange";
                } else {
                    cell.style.backgroundColor = "red";
                }
            } else if (detalle === 'franquicia') {
                cell.textContent = isExactMatch ? "✓" : "X";
                cell.style.backgroundColor = isExactMatch ? "green" : "red";
            } else if (anime[detalle] == animeCorrecto[detalle]) {
                cell.style.backgroundColor = "green";
                cell.textContent = anime[detalle]; // Mostrar el detalle original
            } else {
                cell.style.backgroundColor = "red";
                cell.textContent = anime[detalle]; // Mostrar el detalle original

                if (detalle === 'anio' || detalle === 'episodios') {
                    if (parseInt(anime[detalle]) > parseInt(animeCorrecto[detalle])) {
                        cell.textContent = `${anime[detalle]} ⇩`;
                    } else {
                        cell.textContent = `${anime[detalle]} ⇧`;
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

//Apartado para adivinar anime:
//Mostrar el apartado para adivinar el anime
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

function darkmode(id, img1, img2) { 
   
    document.getElementById('circle').style.animation = null;
    document.getElementById('circle').offsetHeight;
    
    var imgElement = document.getElementById(id);
    var currentSrc = imgElement.src.split('/').pop(); // Obtener solo el nombre del archivo
    if (currentSrc === img1.split('/').pop()) {
        imgElement.src = img2;
        document.getElementById('fondo').style.backgroundColor = 'white';
        document.getElementById('tituloPag').style.color = '#bdbdbd';
        document.getElementById('settings').src = 'img/settings2.png';
        document.getElementById('animeTexto').style.filter = 'invert(100%)';
        document.getElementById('personajeTexto').style.filter = 'invert(100%)';
        document.getElementById('circle').style.backgroundColor= 'black';
        
        
    } else {
        imgElement.src = img1;
        document.getElementById('fondo').style.backgroundColor = 'black';
        document.getElementById('settings').src = 'img/settings.png';
        document.getElementById('tituloPag').style.color = '#333';
        document.getElementById('animeTexto').style.filter = 'none';
        document.getElementById('personajeTexto').style.filter = 'none';
        document.getElementById('circle').style.backgroundColor = 'white';

    }
    document.getElementById('circle').style.animation = 'openCircle 5s forwards';

}
function performanceMode() {
        document.getElementById('animaciones').href = '';
}
