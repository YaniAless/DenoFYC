import {
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v6.2.0/mod.ts";
import {
  viewEngine,
  engineFactory,
  adapterFactory,
} from "https://deno.land/x/view_engine@v1.4.5/mod.ts";

const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

//app.use(async (ctx, next) => {
//  await send(ctx, ctx.request.url.pathname, {
//    root: `${Deno.cwd()}\/static`,
//  });
//  next();
//});

app.use(viewEngine(oakAdapter, ejsEngine));

// Affiche les requetes en console
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

router.get("/", (ctx) => {
  ctx.response.body = "This is the homepage";
});

router.get("/sub-page", (ctx) => {
  ctx.response.body =
    "This is the subpage of localhost<br/>You can add a value after the URL and it will be printed";
});

router.get("/sub-page/:value", (ctx) => {
  if (ctx.params && ctx.params.value) {
    ctx.response.body = `You parameter is "${ctx.params.value}", how original.`;
  }
});

router.post("/", (ctx) => {
  ctx.response.body = "Hi Postman !";
});

router.get("/beautiful-page", (ctx) => {
  console.log("test");
  ctx.render("web/index.ejs", { data: { msg: "An amazing website" } });
});

const path = "https://pokeapi.co/api/v2/pokemon?limit=10";
const pokeId_1 = Math.floor(Math.random() * 10) + 1;
const pokeId_2 = Math.floor(Math.random() * 10) + 1;

//On affiche une liste des 10 premiers pokémons avec la méthode fetch
// on affiche le json dans la console
router.get('/pokemons', async (ctx) => {
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
    ctx.render("web/index.ejs",
    {
      pokemon_1: {name: pokemonName_1, ability: ability_1},
      pokemon_2: {name: pokemonName_2, ability: ability_2}
    });
})

app.use(router.routes());
app.use(router.allowedMethods());

console.log("App is listening to port: 8080");

await app.listen({ port: 8080 });
