
const elementsDiv = document.querySelector("#container"); 

//variabili utili per informazioni della card
const cardDiv = document.querySelector(".card");
const divPlantPage = document.querySelector("#pagina_pianta");

const elementGroupName = document.querySelector("header").id;
let titolo = document.querySelector("#titolo-gruppo-piante");

let plantsTable;
let same_element_plants = [];
let objectPlantsInfo;



const defaultCardMessage = "questa pianta si chiama";
let plantSelected;


//VERSIONE CON JSON ONLINE
// let jsonURL = "https://gist.githubusercontent.com/Katch7K/3944a87601d9680d12bb805a34cf248a/raw/1b0c5a7576acdc432012d27df3f5659dbfda8deb/plantsInfo.json"; 

//JSON che contiene le statistiche delle piante
let jsonURL = "/jsons/plantsTable.json";
fetch(jsonURL).then(res=>res.json()).then(json=>{
    plantsTable = json;

    //JSON che contiene le informazioni delle piante
    jsonURL = "/jsons/plantsInfo.json";
    fetch(jsonURL)
        .then(res => res.json())
        .then(json =>{ //json è una variabile di tipo oggetto 
            loadPlantImage(json);
            objectPlantsInfo = json;

            // testPlantPage(); 
        }).catch(err =>console.error(err));
}).catch(err=>console.error(err));



    function testPlantPage(){
        plantSelected = objectPlantsInfo["sunflower"];
        console.log(plantSelected);
        cardDiv.querySelector("p").innerHTML = `${defaultCardMessage} <span>${plantSelected["name"]}</span> <br>
        costo del sole : <span style="color:rgb(243, 209, 15)">${plantSelected["Sun cost"]}</span> <br>
        danno : <span>${plantSelected["damage"]}</span>` ;
        cardDiv.className = "card-piantaCliccata";
        cardDiv.querySelector("img").src = plantSelected["image"];
        loadPlantSite();
    }

let plantsInfo;
function loadPlantImage(json){ //json : oggetto
    plantsInfo = Object.values(json);

    //carichiamo ogni pianta dentro il div #container
    for (const plant of plantsInfo) {
        if(plant.Family === elementGroupName ||plant["family"] === elementGroupName){
            

            let newPlantDiv = document.createElement("div");

            newPlantDiv.className = "img-testo";
            let iconPath =plant["image"];
            let img = document.createElement("img");
            img.src = iconPath;
            newPlantDiv.appendChild(img);
            newPlantDiv.append(document.createElement("p"));
            newPlantDiv.querySelector("p").innerText = plant["name"];
            
            elementsDiv.appendChild(newPlantDiv);
            same_element_plants.push(newPlantDiv);

            //il click su ogni immagine -> apertura della card
            newPlantDiv.querySelector("img").addEventListener("click" ,()=>{
                plantSelected = plant;
                cardDiv.querySelector("p").innerHTML = `${defaultCardMessage} <span>${plant["name"]}</span> <br>
                costo del sole : <span style="color:rgb(243, 209, 15)">${plant["Sun cost"]}</span> <br>
                danno : <span>${plant["damage"]}</span>` ;
                cardDiv.className = "card-piantaCliccata";
                cardDiv.querySelector("img").src = newPlantDiv.querySelector("img").src;
            })
        }
    } 
}







let bottone_tornaindietro = cardDiv.querySelector("#card-tornaIndietro");

bottone_tornaindietro.addEventListener("click", ()=>{
    let picture = cardDiv.querySelector("img");
    picture.src = "";
    cardDiv.classList.replace(cardDiv.className, "card");
    let p = cardDiv.querySelector("p");
    p.innerText = defaultCardMessage; 
    
});
//QUANDO CLICCO LE INFORMAZIONI SULLA CARD PER LA PIANTA
function bottoneCliccaQui(){
    //prima cosa da fare
    let divPagElementi = document.querySelector("#linkPianta"); // "clicca qui per avere altre informazioni"
    divPagElementi.addEventListener("click", ()=>{

    cardDiv.classList.replace(cardDiv.className, "card");
    console.log("cliccato");
    
    //faccio visualizzare la tabella
    loadPlantSite();
    });
}
bottoneCliccaQui();

//il bottone che fa tornare indietro dalla pagina della pianta alla pagina gruppo-piante
divPlantPage.querySelector("#torna-indietro").addEventListener("click",()=>{
    divPlantPage.style["display"]="none";
    document.querySelector("main").style["display"] = "block";

    titolo.innerHTML = elementGroupName;

});


function loadPlantSite(){
    divPlantPage.style["display"] = "block";
    divPlantPage.style["visibility"] = "visible";
    document.querySelector("main").style["display"] = "none";
    // accedo alla immagine della pagina, cambio il suo percorso in quella della pianta cliccata alla card
    let picture = cardDiv.querySelector("img"); //img della card
    let pagina_pianta_descrizione = divPlantPage.querySelector("#pagina_pianta_descrizione");
    let piantaImg = pagina_pianta_descrizione.querySelector("img");
        piantaImg.src =picture["src"];     // divPlantPage.querySelector("img")["src"] = ; 
        piantaImg.className = "plantImg";

        pagina_pianta_descrizione.querySelector("h3").innerHTML = `<h3 style="color:black">BIOGRAFIA</h3>`;
        pagina_pianta_descrizione.querySelector("p").innerHTML = `${defaultCardMessage} <span>${plantSelected["name"]}</span>
         <br>
        costo del sole : <span style="color:rgb(243, 209, 15)">${plantSelected["Sun cost"]}</span>
         <br>
        danno : <span>${plantSelected["damage"]}</span> <br>
        specialità: ${plantSelected.hasOwnProperty("Special") ? plantSelected["Special"] : "Questa pianta non ha nulla di particolare"}`;
        console.log(plantSelected["Special"]);


        titolo.innerText = plantSelected["name"];



    let table = divPlantPage.querySelector("#table");
        table.style["margin-top"] = "5px";
        table.innerHTML=`
        <div id="descrizione" ">
            <h3>DESCRIZIONE</h3>
            <div>${plantSelected["description"]}</div>
        </div>
        <div id="pagina-pianta-container">
            <p>Tabella degli upgrade della pianta</p>
            ${plantsTable[plantSelected["name"]]}
        </div>
        `;
}


//Search with the name
function searchChange() {
    let plantNameSearched = document.querySelector("#search").value.toLowerCase();
    
    for (const plantDiv of same_element_plants) {
        //se il nome della pianta non inizia con la frase inserita allora nascondilo
        let plantDivName = plantDiv.querySelector("p").innerText.toLowerCase();
        if(!(plantDivName.includes(plantNameSearched))){
            plantDiv.style["display"] = "none";
        }
        else{
            plantDiv.style["display"] = "inline-block";
        }
    }
}
