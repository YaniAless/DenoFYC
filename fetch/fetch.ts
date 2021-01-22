export {} // Cette ligne est présente pour signifier que ce n'est pas un script

const host = "https://pokeapi.co/api/v2/pokemon/"
const pokemonId = 100

// On créé ici un objet qui facilitera l'accès aux informations de notre pokemon une fois instancié
interface Pokemon{
    name: string,
    height: number,
    weight: number,
    front_sprite: string
}

// Nous faisons ici notre requête pour récupérer les informations de notre pokémon
let response = await fetch(`${host}${pokemonId}`)
let json = await response.json()

let pokemon: Pokemon = {
    name: json["name"],
    height: json["height"],
    weight: json["weight"],
    front_sprite: json["sprites"]["front_default"],
}

// Ici on affiche notre beau pokemon
console.log(pokemon)