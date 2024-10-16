const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

const rows = 15;
const cols = 20;
const cellSize = 50;

const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let playerX = 0;
let playerY = 0;

const entrance = { row: 1, col: 1 }; // L'entrée du labyrinthe
const treasure = { row: 5, col: 12 }; // Position du trésor

// Déplacements possibles (haut, bas, gauche, droite)
const directions = [
    { row: -1, col: 0 }, // haut
    { row: 1, col: 0 },  // bas
    { row: 0, col: -1 }, // gauche
    { row: 0, col: 1 }   // droite
];

 // Charger l'image du chemin
const pathImage = new Image();
pathImage.src = 'chemin.jpg'; 

const wallImage = new Image();
wallImage.src = 'jungle.jpg'; 

const playerImage = new Image();
playerImage.src = 'arthur.png';

const visitedCells = [];


// Fonction pour détecter l'entrée
function detectEntrance() {
    playerX = entrance.col * cellSize + cellSize / 2;
    playerY = entrance.row * cellSize + cellSize / 2;
}

const treasureImage = new Image();
        treasureImage.src = 'treasure.png';
// Fonction pour dessiner une cellule du labyrinthe
function drawCell(row, col) {
    if (maze[row][col] === 1) {
        // Dessiner l'image du mur
        if (wallImage.complete) {
            ctx.drawImage(wallImage, col * cellSize, row * cellSize, cellSize, cellSize);
        } else {
            ctx.fillStyle = '#000';
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    } else {
        // Dessiner l'image du chemin
        let rotate = false;
        if (col > 0 && maze[row][col - 1] === 0) rotate = true;  // Chemin à gauche
        if (col < cols - 1 && maze[row][col + 1] === 0) rotate = true; // Chemin à droite

        ctx.save(); // Sauvegarder le contexte

        if (rotate) {
            ctx.translate(col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(pathImage, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
        } else {
            ctx.drawImage(pathImage, col * cellSize, row * cellSize, cellSize, cellSize);
        }

        ctx.restore(); // Restaurer le contexte
    }
    ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
}

// Fonction pour dessiner le labyrinthe complet
function drawMaze() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            drawCell(row, col);
        }
    }
}



// Fonction pour dessiner l'entrée et le trésor
function drawEntryAndTreasure() {
    // Marquer l'entrée (en haut à gauche)
    ctx.fillStyle = 'green';
    ctx.fillRect(entrance.col * cellSize + 5, entrance.row * cellSize + 5, cellSize - 10, cellSize - 10);
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = '#fff';
    ctx.fillText("Entrée", entrance.col * cellSize + 5, entrance.row * cellSize + 35);

    // Dessiner l'image du trésor lorsque l'image est chargée
    
        ctx.drawImage(treasureImage, treasure.col * cellSize, treasure.row * cellSize, cellSize, cellSize); // Dessiner l'image à la position du trésor

}

// Fonction pour dessiner le personnage
function drawPlayer() {
    const playerRow = Math.floor(playerY / cellSize);
    const playerCol = Math.floor(playerX / cellSize);

    // Ajouter la cellule actuelle aux cellules visitées
    visitedCells.push({ row: playerRow, col: playerCol });

    // Dessiner les cases visitées
    visitedCells.forEach(cell => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(cell.col * cellSize + cellSize / 2, cell.row * cellSize + cellSize / 2, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    if (playerImage.complete) {
        ctx.drawImage(playerImage, playerX - cellSize / 2, playerY - cellSize / 2, cellSize, cellSize);
    } else {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(playerX, playerY, 10, 0, Math.PI * 2);
        ctx.fill();
    }
}


// Algorithme BFS pour trouver le chemin le plus court vers le trésor
function bfs() {
    let queue = [{ row: entrance.row, col: entrance.col, path: [] }];
    let visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    visited[entrance.row][entrance.col] = true;

    while (queue.length > 0) {
        let { row, col, path } = queue.shift();

        // Si on trouve le trésor, on retourne le chemin
        if (row === treasure.row && col === treasure.col) {
            return path.concat({ row, col });
        }

        // Explorer les 4 directions possibles
        for (let dir of directions) {
            let newRow = row + dir.row;
            let newCol = col + dir.col;

            if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                !visited[newRow][newCol] &&
                maze[newRow][newCol] === 0
            ) {
                visited[newRow][newCol] = true;
                queue.push({
                    row: newRow,
                    col: newCol,
                    path: path.concat({ row, col })
                });
            }
        }
    }

    return null; // Aucun chemin trouvé (ne devrait pas arriver dans un labyrinthe valide)
}

// Fonction pour animer le déplacement du personnage le long du chemin trouvé
function animatePath(path) {
    let index = 0;

    function move() {
        if (index < path.length) {
            let { row, col } = path[index];
            playerX = col * cellSize + cellSize / 2;
            playerY = row * cellSize + cellSize / 2;

            // Redessiner le labyrinthe et le personnage
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawMaze();
            drawEntryAndTreasure();
            drawPlayer();

            index++;
            setTimeout(move, 300); // Attendre 300ms entre chaque mouvement
        }
    }

    move(); // Lancer l'animation
}

// Détection de l'entrée, puis dessin du labyrinthe, l'entrée, le trésor et le personnage au chargement
window.onload = function() {
    treasureImage.onload = function() {
        pathImage.onload = function(){
            wallImage.onload = function(){
        detectEntrance(); // Détection automatique de l'entrée
        drawMaze();
        drawEntryAndTreasure();
        drawPlayer();
            };
        };
    };

    let path = bfs(); // Calculer le chemin le plus court avec BFS
    if (path) {
        animatePath(path); // Animer le personnage le long du chemin
    }
    
};