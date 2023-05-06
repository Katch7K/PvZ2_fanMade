
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");

//Sezione pulsanti
const godmodebtn = document.querySelector("#godmode");
const resetbtn = document.querySelector("#reset");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "forestgreen";
const tileSize = 100; //grandezza del quadretto
let intervalID;


let zombieKilledCounter = 0;

const zombieSpawnRate = 60;
const sunSpawnRate = 90;

let zombieSpawnRate_counter = 0;
let sunSpawnRate_counter = 0;
let sun_counter = 200; // variabile che rappresenta la quantità di soli che il giocatore possiede in quel momento

let isGodModeOn = false;
let hasLost = false;

let zombies = [];

let plants = [];
let peashooter_cost = 100;

let suns = [];


//TEST DI PROVA
let zombie1 = new Entity(gameWidth,0 * tileSize,tileSize,tileSize);
zombies.push(zombie1);


let plantMap = [
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null]
];


//SEZIONE IMMAGINI
const peashooterAttackAnimation = [];
const peashooterIdleAnimation = [];
//aggiungiamo tutte le immagini
for(let i=0; i<60; i++){
    let img = new Image();
    if(i<8){
        img.src=`/gameplay/Sprite/Peashooter/AttackState/frame_0${i+2}_delay-0.02s.webp`;
    } else{
        img.src=`/gameplay/Sprite/Peashooter/AttackState/frame_${i+2}_delay-0.02s.webp`;
    }

    peashooterAttackAnimation.push(img);

    img = new Image();
    if(i<8){
        img.src=`/gameplay/Sprite/Peashooter/IdleState/frame_0${i+2}_delay-0.02s.png`;
    } else{
        img.src=`/gameplay/Sprite/Peashooter/IdleState/frame_${i+2}_delay-0.02s.png`;
    }
    peashooterIdleAnimation.push(img);
}

let projectiles = []; // array che memorizza i proiettili lanciati addosso agli zombi
let projectileImage = new Image();
projectileImage.src = "/gameplay/Sprite/Projectile/projectile.png";

const zombieImage = new Image();
zombieImage.src = "/gameplay/Sprite/Zombie/walking_zombie.png"

const sunImage = new Image();
sunImage.src = "/gameplay/Sprite/Items/Sun.png"



//per decidere che cosa far fare all'utente
let gameBar = document.querySelectorAll(".bar-item");
let selectedItem = "none";
for (const item of gameBar) {
    item.addEventListener("click",()=>{

        if(selectedItem ===item.id){
            selectedItem = "none";
        }
        else{
            selectedItem = item.id;
        }
        console.log(selectedItem);

        gameBar.forEach((item)=>{
            item.style["border"] = "2px solid black";
        });
        if(selectedItem!=="none"){
            item.style["border"] = "2px solid yellow";
        }
        
    })
}

//quando voglio piazzare la pianta o toglierla
gameBoard.addEventListener('click', (event) => chooseItem(event));

  function chooseItem(event){
    const rect = gameBoard.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    //controllo se non clicco un sole
    for(let i = 0; i< suns.length; i++){
        const sun = suns[i];
        //if Xs1 < x < Xs1 + tileSize e Ys1 < x < Ys1 il sole scompare
        if(sun.x < x  && x < sun.x + tileSize &&
            sun.y < y  && y < sun.y + tileSize ){
                sun_counter+=50;
                suns.splice(i,1);
                console.log("sole raccolto");
            }
    }

    let xPlant = Math.floor(x/tileSize);
    let yPlant = Math.floor(y/tileSize);


    //se non è presente una pianta in questa casella
    switch(selectedItem){
        case "peashooter" : 
            if(plantMap[yPlant][xPlant] === null){
                if(!isGodModeOn){
                    if(sun_counter >= peashooter_cost){
                        let newPlant = new Plant( xPlant, yPlant, tileSize);
                        plants.push(newPlant);
                        plantMap[yPlant][xPlant] = newPlant;
                        sun_counter-=100;
                    }
                }
                else{
                    let newPlant = new Plant( xPlant, yPlant, tileSize);
                    plants.push(newPlant);
                    plantMap[yPlant][xPlant] = newPlant;
                }
                
            }
            else{
                console.log("una pianta è già presente");
            }
            break;
        case "shovel" :
            for(let i =0; i< plants.length; i++){
                if(plants[i].x == xPlant && plants[i].y == yPlant){
                    plants.splice(i,1);
                    plantMap[yPlant][xPlant] = null;
                    break;
                }
            }
            break;
    }

  }


  //quando vado sopra una cella della mappa
  let cursorPosition = {
    "x" : "",
    "y" : ""
  }
  gameBoard.addEventListener('mousemove', function(event) {
    const rect = gameBoard.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left)/tileSize);
    const y = Math.floor((event.clientY - rect.top)/tileSize);
    // console.log(`Mouse coordinates: (${x}, ${y})`); 
    cursorPosition["x"] = x;
    cursorPosition["y"] = y;
  });

//aggiungiamo la funzione di freccia_basso in 
window.addEventListener("keydown", changeDirection);
godmodebtn.addEventListener("click", cheatGame);
resetbtn.addEventListener("click",resetGame);

gameStart();

function gameStart(){
    nextTick();
};

function nextTick(){
    intervalID = setTimeout(() => {
        clearBoard();

        if(hasLost){
            drawLostDisplay();
        }
        else{
            drawGrid();
            drawMousePosition();
            updateSunCounter();
            
            triggerZombieSpawnEvent();
            triggerSunSpawnEvent();

            drawPlants(); //aggiorna e disegna le pianta
            drawZombies(); // aggiorna e disegna gli zombi all'interno della mappa

            updateProjectiles();
            drawProjectiles();
            

            drawSuns();

            updateScore();
        }
        
        nextTick();
    }, 15)
};
function clearBoard(){
    ctx.fillStyle = boardBackground; 
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function drawLostDisplay(){
    ctx.fillStyle = "red";
    ctx.font = "32px 'Nunito'";
    ctx.fillText("Hai perso",gameWidth/2 - 40, gameHeight/2);
    console.log("hai perso")
}

function drawGrid(){
        //disegna griglia
        //linee verticali
        ctx.strokeStyle = "black";
        for(let i = 0; i<10; i++){
            ctx.beginPath();
            ctx.moveTo(i*tileSize,0);
            ctx.lineTo(i*tileSize,gameHeight);
            ctx.stroke();
            ctx.closePath();
        }
        for(let i = 0; i<5; i++){
            ctx.beginPath();
            ctx.moveTo(0,i*tileSize);
            ctx.lineTo(gameWidth,i*tileSize);
            ctx.stroke();
            ctx.closePath();
        }
}
//funzione che aggiorna i soli
function updateSunCounter(){
    // console.log(sun_counter);
    const displayText = document.querySelector("#sun-counter");
    displayText.innerHTML= `SOLI : ${sun_counter}`;

}

function triggerZombieSpawnEvent(){
    zombieSpawnRate_counter++;
    if(zombieSpawnRate_counter == zombieSpawnRate){
        let possibility = Math.floor(Math.random() *2);
        if(possibility == 1){
            spawnZombie();
        }
        zombieSpawnRate_counter = 0;
    }
}

function triggerSunSpawnEvent(){
    sunSpawnRate_counter++;
    if(sunSpawnRate_counter === sunSpawnRate){
        sunSpawnRate_counter = 0;
        //1 possibilità su 3 di spawn
        if(Math.floor(Math.random()*3) === 0){
            spawnSun();
        }
    }

}

function drawMousePosition(){
    if(cursorPosition["x"]!=-1 && cursorPosition["y"]!=-1){
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.strokeRect(cursorPosition["x"]*tileSize,cursorPosition["y"] * tileSize,tileSize,tileSize);
    }
    
    ctx.lineWidth = 1;
}
function drawPlants(){
    for(let i=0; i<plants.length; i++){

        //AGGIORNA
        const plant = plants[i];
        plant.updateFrame();

        if(plant.getHp() < 0){
            plantMap[plant.y][plant.x] = null;
            plants.splice(i,1);
            continue;
        }

        if(plant.frameAnimation == 30 && plant.attackState){ // frame nella quale si spara un seme
            const newProjectile = new Projectile(plant.x * tileSize + tileSize/2,plant.y * tileSize + tileSize/4);
            projectiles.push(newProjectile);
        }

        if(plant.frameAnimation == 0){
            //aggiorna lo stato della pianta
            //se è presente uno zombi davanti alla pianta va in attackState
            let isZombiePresent = false;
            for (const zombie of zombies) {
                if(zombie.y  === plant.y * tileSize){
                    isZombiePresent = true;
                    break;
                }
            }
            plant.attackState = isZombiePresent;
            
        }


        //DISEGNA LA PIANTA
        if(plant.attackState){
            ctx.drawImage(peashooterAttackAnimation[plant.frameAnimation],plant.x * tileSize,plant.y * tileSize,tileSize,tileSize);
        } else{
            ctx.drawImage(peashooterIdleAnimation[plant.frameAnimation],plant.x * tileSize -5,plant.y * tileSize,tileSize + 5,tileSize);
        }
            
        //ctx.drawImage(img, xImg, yImg, width, height,  x, y)
    }
}

function drawZombies(){
    for(let i = 0; i< zombies.length; i++){
        const zombie = zombies[i];
        zombie.update(plantMap);
        //se lo zombie raggiunge la linea di difesa
        if(zombie.x < -tileSize){
            zombies.splice(i,1);
            resetGame();
            hasLost = true;
        }
        else if(zombie.getHp()<0){
            zombies.splice(i,1);
            zombieKilledCounter++;
            continue;
        }
        else{
            
            const spriteWidth = Math.floor(zombieImage.naturalWidth/6) - 10;

            ctx.drawImage(zombieImage,zombie.frameSpriteIndex * spriteWidth +22,48,spriteWidth,zombieImage.naturalHeight,zombie.x,zombie.y,tileSize*1.5,tileSize*1.5);

        }
    }
}

function updateProjectiles(){
    for(let i = 0; i< projectiles.length; i++){
        projectiles[i].update(zombies);
        if(projectiles[i].x > gameWidth){
            
            //rimuovi il proiettile dall'array
            projectiles.splice(i,1);
            continue;
        }
        if(projectiles[i].hasHitted){
            //rimuovi il proiettile dall'array
            projectiles.splice(i,1);
        }
    }
}
function drawProjectiles(){
    for(let i =0; i < projectiles.length; i++){
        const projectile = projectiles[i];
        ctx.drawImage(projectileImage,projectile.x,projectile.y,projectile.width,projectile.height);


        //disegno hitbox del proiettile
        //ctx.strokeRect( projectile.x,projectile.y,projectile.width,projectile.height); 
    }
}   

function drawSuns(){
    for (const sun of suns) {
        sun.update();
        ctx.drawImage(sunImage,sun.x,sun.y,tileSize, tileSize);
    }
}


function changeDirection(event){

    //spawn casuale dello zombi a comando
    if(!isGodModeOn){
        return;
    }
   if(event.key === 'w'){
    spawnZombie();
   }
   if(event.key === 's'){
    spawnSun();
   }
};
function spawnZombie(){
    const row = Math.floor(Math.random()*5);
    const zombie = new Entity(gameWidth,row*tileSize,tileSize,tileSize);
    // console.log(zombie);
    zombies.push(zombie);
}
function spawnSun(){
    //decidiamo la casella su cui atterrerà il sole
    const xSun = Math.floor(Math.random()*10) * tileSize;
    const ySun = Math.floor(Math.random()*5) * tileSize;
    const sun = new Sun(xSun, ySun);
    suns.push(sun);

    
}


function updateScore(){
    // scoreText.textContent = `${zombieKilledCounter} : ${player2Score}`; 
    scoreText.innerHTML = `zombi uccisi : ${zombieKilledCounter}`;
};
function cheatGame(){

    //peashooter_cost = 0;
    isGodModeOn = !isGodModeOn;
    godmodebtn.innerHTML = `God Mode <span>${isGodModeOn ? "On" : "Off"}</span>`
        godmodebtn.querySelector("span").style["color"] = isGodModeOn ? "green" : "red";

    
};

function resetGame(){
    if(hasLost){
        hasLost = false;
        return;
    }
    plantMap = [
        [null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null]
    ];
    plants = [];
    zombies = [];
    suns = [];
    projectiles = [];
    sun_counter = 200;
    zombieKilledCounter = 0;

}
