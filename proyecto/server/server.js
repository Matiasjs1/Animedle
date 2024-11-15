const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const port = 3000;

let animes = [];

let personajes = [];

let emojis = [];

// Leer el archivo CSV y almacenar los datos en el arreglo 'animes'
fs.createReadStream(path.join(__dirname, 'animes.csv'))
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
        animes.push({
            nombre: row.nombreAnime,
            franquicia: row.franquicia,
            anio: row.anioLanzamiento,
            temas: row.temas,
            episodios: row.episodios,
            generos: row.generos,
            estudio: row.estudioAnimacion,
            descripcion: row.descripcion
        });
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
fs.createReadStream(path.join(__dirname, 'personajes.csv'))
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
        personajes.push({
            nombre: row.nombrePersonaje,
            franquicia: row.franquicia,
            genero: row.genero,
            especie: row.especie,
            poder: row.poder,
            edad: row.edad,
            altura: row.altura,
            colorOjos: row.colorOjos,
            lugarOrigen: row.lugarOrigen,
            frase: row.frase
        });
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
    fs.createReadStream(path.join(__dirname, 'emojis.csv'))
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
        emojis.push({
            franquicia: row.franquicia,
            emojis: row.emojis
        });
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
// Endpoint para obtener un anime aleatorio
app.get('/api/random-anime', (req, res) => {
    const randomAnime = animes[Math.floor(Math.random() * animes.length)];
    res.json(randomAnime);
});

// Endpoint para obtener la lista completa de animes
app.get('/api/all-animes', (req, res) => {
    res.json({ animes: animes });
});

app.get('/api/random-personaje', (req, res) => {
    const randomPersonaje = personajes[Math.floor(Math.random() * personajes.length)];
    res.json(randomPersonaje);
});

// Endpoint para obtener la lista completa de animes
app.get('/api/all-personajes', (req, res) => {
    res.json({ personajes: personajes });
});

app.get('/api/random-emoji', (req, res) => {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    res.json(randomEmoji);
});

// Endpoint para obtener la lista completa de animes
app.get('/api/all-emojis', (req, res) => {
    res.json({ emojis: emojis });
});


// Servir archivos estáticos desde el directorio "public"
app.use(express.static(path.join(__dirname, '..', 'public')));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
