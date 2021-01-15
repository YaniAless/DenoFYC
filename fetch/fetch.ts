export {} // Cette ligne est présente pour signifié que ce n'est pas un script, elle ne fait rien et ne nous sert à rien

const host = "https://pokeapi.co/api/v2/pokemon/"
const pokemonId = 100

// On créé ici un objet qui facilitera l'accès aux informations de notre pokemon une fois instancié
interface Pokemon{
    name: string,
    height: number
    weight: number
}

// Nous faisons ici notre requête pour récupérer les informations de notre pokémon
let response = await fetch(`${host}${pokemonId}`)
let json = await response.json()

let pokemon: Pokemon = {
    name: json["name"],
    height: json["height"],
    weight: json["weight"]
}

// Ici on affiche notre beau pokemon
console.log(pokemon)