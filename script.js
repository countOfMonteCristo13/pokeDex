const baseUrl = 'https://pokeapi.co/api/v2/';
const pokemonUrl = 'pokemon?limit=100000&offset=0'
let pocetniBrojPokemonaRegiona = 0;
let page = 0;
let pocetnaTacka = page * 50;
let raspon = 50;
let loadMore = true;
let pokemonaIzbaceno;
let gornjaGranicaPokemona = 10000;
const card = document.querySelector('.kartica');
const cards = document.querySelector('.kartice');
const opis = document.querySelector('.flex-row')
const totalPokemon = document.getElementById("total-pokemon");

const regioni = document.querySelectorAll('.region');
let pokemons = [];
let shinyPokemons = [];

const deleteList = () =>{
    while(cards.firstChild){
            cards.removeChild(cards.lastChild);
    }

    cards.appendChild(card);
    card.classList.remove("hidden");
}

regioni[1].addEventListener('click', () =>{

    deleteList()

    regionFechovanje(0,151);
})

regioni[2].addEventListener('click', () =>{
    deleteList();
    regionFechovanje(151,251);

})

regioni[3].addEventListener('click',()=>{
    deleteList();
    regionFechovanje(251,386);
})

regioni[4].addEventListener('click',() =>{
    deleteList();
    regionFechovanje(386,493);
})

regioni[5].addEventListener('click',() =>{
    deleteList();
    regionFechovanje(493,649)
})

regioni[6].addEventListener('click',() =>{
    deleteList();
    regionFechovanje(649,721)
})

regioni[7].addEventListener('click',() =>{
    deleteList();
    regionFechovanje(721,809)
})
regioni[8].addEventListener('click',() =>{
    deleteList();
    regionFechovanje(809,905)
})
regioni[9].addEventListener('click',() =>{
    deleteList();
    regionFechovanje(905,1015)
})




const regionFechovanje = (start, total) =>{
    loadMore = true;
    page = 0;
    raspon= 50;
    totalPokemon.innerText = (page + 1) * 50;


    pocetniBrojPokemonaRegiona = start;
    gornjaGranicaPokemona = total;
    pocetnaTacka = start + (page * 50); 
    console.log('odavde krece lista naredna (fecovanjeRegiona) ' + pocetnaTacka);


    fetch(`${baseUrl}pokemon?limit=50&offset=${pocetnaTacka}`) 
    .then(response => response.json())
    .then(data =>{
        let fetchedPokemons = data.results;
        

        const pokemonMetaData = fetchedPokemons.map(pokemon =>{
            return fetch(pokemon.url)
                .then(response => response.json())
                .then(data => {
                    pokemons.push(data);
                    addCard(data);
                })
        })

        return Promise.all(pokemonMetaData);



    })
    .finally(() =>{
        card.classList.add('hidden');
        console.log('kraj regionFecovanja!')
    });
}

const fetchovanje = () =>{

        console.log(pocetnaTacka);
        pokemonaIzbaceno = (page + 1) * 50 + pocetniBrojPokemonaRegiona;
        console.log('trenutan broj prikazanih pokemona: ' + pokemonaIzbaceno);
        console.log('granica ' + gornjaGranicaPokemona);
        if(pokemonaIzbaceno >= gornjaGranicaPokemona){
            loadMore = false;
            console.log('radi');
            totalPokemon.innerText = gornjaGranicaPokemona;
            raspon = gornjaGranicaPokemona + raspon - pokemonaIzbaceno;
            pocetnaTacka = gornjaGranicaPokemona-raspon;
        }

        

        console.log(raspon);
        console.log('odavde je krenula lista (fecovanje)' + pocetnaTacka)

        fetch(`${baseUrl}pokemon?limit=${raspon}&offset=${pocetnaTacka}`)
        .then(response => response.json())
        .then(data =>{
            let fetchedPokemons = data.results;
            console.log(fetchedPokemons);

            const pokemonMetaData = fetchedPokemons.map(pokemon =>{
                return fetch(pokemon.url)
                    .then(response => response.json())
                    .then(data => {
                        pokemons.push(data);
                        addCard(data);
                    })
            })

            return Promise.all(pokemonMetaData);



        })
        .finally(() =>{
            card.classList.add('hidden');
        });
    
};




const addCard = (pokemonData) =>{

    const newCard = card.cloneNode(true);

    const title = newCard.querySelector('.title');
    title.innerHTML = `#${pokemonData.id} ${pokemonData.name}`;

    const image = newCard.querySelector('img');
    image.src = pokemonData.sprites.front_default;

    const typesDiv = newCard.querySelector(".types");
    const types = pokemonData.types.map((type) => type.type.name);
    typesDiv.innerText = types.join(" / ");

    const weightDiv = newCard.querySelector(".weight");
    weightDiv.innerText = `${pokemonData.weight} kg`;
  
    cards.appendChild(newCard);
}

const nextPage = () => {
    if(loadMore){
        showAndMovePlaceholder();
        card.classList.remove("hidden");
        page++;
        pocetnaTacka+=50;
        totalPokemon.innerText = (page + 1) * 50;
        console.log('nextPage: ' + pocetnaTacka)
        fetchovanje();
        
        
    }    

  };

  const showAndMovePlaceholder = () => {
    card.classList.remove("hidden");
    card.remove();
    cards.appendChild(card);
  };

  fetchovanje();
