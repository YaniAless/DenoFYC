import { Application, Router, RouterContext, send } from "https://deno.land/x/oak/mod.ts";
//importation du package MongoClient
import { MongoClient } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

const PORT = 4000;
const router = new Router();
const app = new Application();

// Déclaration de l'objet client Mongo qui nous permettra d'intéroger la BDD
const client = new MongoClient();
client.connectWithUri('mongodb://localhost:27017');

const db = client.database('pokemon');
const users = db.collection<UserSchema>('users');
const pokemons = db.collection<Pokemon>('pokemons');

app.use(router.routes());
app.use(router.allowedMethods());

// Cette partie permet de mettre en place une règle générale sur le contexte de toutes
// Les requêtes du serveur web que l'on créé.
// Ici on va également déclarer notre dossier static /public dans lequel sera situé les fichiers HTML/CSS/JS
// Grâce à ça on pourra utiliser ces fichiers et donc les afficher.
app.use(async (ctx) => {
    const result = ctx.request.body({ contentTypes: { json: ['form-data'] } });
    await send(ctx, ctx.request.url.pathname, {
        root: `${Deno.cwd()}/tp/public`,
        index: "index.html",
    });
});

// UserShema est un DAO (Data Access Object) et corresponds à la 'table' USERS dans la BDD
// Cela nous permet d'ajouter facilement des informations en base
interface UserSchema {
    _id: { $oid: string }
    username: string,
    pokedex: [Pokemon],
}

interface Pokemon {
    _id: number,
    name: string,
    height: number,
    weight: number,
    types: [string],
    front_sprite: string,
}

router.get('/', (ctx: RouterContext) => {
    ctx.response.redirect('/index.html');
})

// RouterContext ici est un type qui nous permet d'accèder au contexte de la requête
// CAD que l'on pourra gérer les requêtes d'entrée (récupérer les params / headers)
// Et également préparer notre requête de réponse en ajoutant nos différentes infos dans celle-ci
router.get('/users', async (ctx: RouterContext) => {
    const user = await users.find({});
    ctx.response.type = "application/json";
    ctx.response.headers.append('OKKK', "OKKKKK");
    ctx.response.body = user;
})

const path = "https://pokeapi.co/api/v2/pokemon?limit=10"; 
const pokeId_1 = Math.floor(Math.random() * 10) + 1; // !!!!!! à deplacer
const pokeId_2 = Math.floor(Math.random() * 10) + 1;

//On affiche une liste des 10 premiers pokémons avec la méthode fetch
// on affiche le json dans la console
router.get('/pokemons', async (ctx: RouterContext) => {
    let response = await fetch(`${path}`);
    let json = await response.json();
    console.log(json);
    //on va maintenant chercher 1 attaque parmi 2 pokémons au hasard de la liste, on les récupère grâce à l'url du premier call
    //on affiche donc le nom du pokemon et l'attaque qu'il utilise
    //Pokemon 1 :
    const pokemonName_1 = json.results[pokeId_1].name;
    const pokemonUrl_1 = json.results[pokeId_1].url;
    const pokemon_1 = await fetch(`${pokemonUrl_1}`);
    let pokemonJson_1 = await pokemon_1.json();
    const ability_1 = pokemonJson_1.abilities[1].ability.name;
    console.log("Le pokemon " + pokemonName_1 + " utilise " + ability_1);

    //Pokemon 2 :
    const pokemonName_2 = json.results[pokeId_2].name;
    const pokemonUrl_2 = json.results[pokeId_2].url;
    const pokemon_2 = await fetch(`${pokemonUrl_2}`);
    let pokemonJson_2 = await pokemon_2.json();
    const ability_2 = pokemonJson_2.abilities[1].ability.name;
    console.log("Le pokemon " + pokemonName_2 + " utilise " + ability_2);
})


// On récupère un pokemon au hasard
router.get('/pokemon', async (ctx: RouterContext) => {

    const randomPokemonId = Math.floor(Math.random() * 100) + 1;
    const urlPokemon = "https://pokeapi.co/api/v2/pokemon/";
    let response = await fetch(`${urlPokemon}${randomPokemonId}`);
    
    let json = await response.json();
    //console.log(json);

    let pokemon: Pokemon = {
        _id: json["id"],
        name: json["name"],
        height: json["height"],
        weight: json["weight"],
        types: json["types"],
        front_sprite: json["sprites"]["front_default"],
    }

    ctx.response.type = "application/json";
    ctx.response.body = pokemon;

})

router.post('/addPokemon', async (ctx: RouterContext) => {
    const body = await ctx.request.body().value;

    let response = await fetch(`http://localhost:${PORT}/pokemon`);
    let json = await response.json();

    let receivedPokemon: Pokemon = {
        _id: json["_id"],
        name: json["name"],
        height: json["height"],
        weight: json["weight"],
        types: json["types"],
        front_sprite: json["front_sprite"],
    }

    const receivedUser = {
        username: body.get('username'),
        pokemon: receivedPokemon
    }

    const user = await users.findOne({ username : receivedUser["username"] })
    if(user != null) {
        user.pokedex.push(receivedUser.pokemon)
        const { matchedCount, modifiedCount, upsertedId } = await users.updateOne(
            { username : user.username },
            { pokedex: user.pokedex }
          )
        ctx.response.type = "application/json";

        ctx.response.body = user
    } else {
        const user = await users.insertOne({ 
                username: receivedUser.username, 
                pokedex: [receivedUser.pokemon]
            })
        ctx.response.type = "application/json";
        
        ctx.response.body = user
    }

})

console.log(`Listening on port ${PORT}`)
await app.listen( { port: PORT });





