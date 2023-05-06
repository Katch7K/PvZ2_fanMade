

let picture_div = document.querySelectorAll('.img-testo'); // accedo a tutti i div con la classe img-testo
let card = document.querySelector(".card");
let container = document.querySelector("#container");
let bottone_tornaindietro = document.querySelector("#card-tornaIndietro");


let titoloPagina = "Pagina Principale";
let defaultCardMessage = "Questo gruppo di piante appartiene alla classe *nome_classe*";

let allPlantsWithFire = [];
let classe_pianta = "";

let url_pag_elementi ="";
//ad ogni immagine viene applicato

function bottoneCliccaQui(){
    //prima cosa da fare : creare un div su cui aggiungere l'immagine
    let divPagElementi = document.querySelector("#linkElementi");
    divPagElementi.addEventListener("click", ()=>{
        let picture = card.querySelector("img");
        picture.src = "";
        card.classList.replace(card.className, "card");
        let p = card.querySelector("p");
        p.innerText = defaultCardMessage; 

        // console.log(`/elementi/${sitoGruppoPiante}.html`); 
        
          window.open(`/elementi/${url_pag_elementi}.html`,"_self");  
    });
}
bottoneCliccaQui();
for (const single_picture_div of picture_div) {

    let img_icon_card = single_picture_div.querySelector("img");
    
    //quandp clicco l'immagine
    img_icon_card.addEventListener("click", ()=>{
        let icon_path = img_icon_card.src;
        
        card.classList.replace(card.className, "card-piantaCliccata");
        card.querySelector("img").src = icon_path;

        //cambio di testo
        let p = card.querySelector("p");
        let testo  = defaultCardMessage;  
        classe_pianta = single_picture_div.textContent.trim();
        testo = testo.replace("*nome_classe*", single_picture_div.textContent.trim()); // qua *nome_classe viene sostituito solo una volta, le altre volte il codice non riesce ad individuare perché il nome persiste per sempre 
        
        url_pag_elementi = img_icon_card.id;
        p.innerText = testo;
        //sfondo sfuocato
    });
}

bottone_tornaindietro.addEventListener("click", ()=>{
    let picture = card.querySelector("img");
    picture.src = "";
    card.classList.replace(card.className, "card");
    let p = card.querySelector("p");
    p.innerText = defaultCardMessage; 
});



//questa funzione non è attualmente richiamata
function loadPlantImage(json){ //json : oggetto
    plantsInfo = Object.values(json);

    //Aggiungiamo al div ogni pianta di una famiglia
    for (const plant of plantsInfo) {
        if(plant.Family === element ){
            same_element_plants.push(plant);

            let newPlantDiv = document.createElement("div");

            newPlantDiv.className = "img-testo";
            let iconPath =`https://raw.githubusercontent.com/code-cracked/plants-vs-zombies-api/main/public${plant.image}`;
            let img = document.createElement("img");
            img.src = iconPath;
            newPlantDiv.appendChild(img);
            console.log(iconPath);
            //<img src="https://raw.githubusercontent.com/code-cracked/plants-vs-zombies-api/main/public/assets/plants/Peashooter.png" id="seme" alt="">
            elementsDiv.appendChild(newPlantDiv);

            //ogni immagine - card
            newPlantDiv.addEventListener("click" ,()=>{
                console.log(plant.name);
            })
        }
    } 
    console.log(elementsDiv);
}

//per mostare un immagine della pianta : 
//https://raw.githubusercontent.com/code-cracked/plants-vs-zombies-api/main/public/assets/plants/A.K.E.E..png
//https://raw.githubusercontent.com/code-cracked/plants-vs-zombies-api/main/public/assets/plants/Peashooter.png