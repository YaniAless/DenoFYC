import { Application, Router, RouterContext, send } from "https://deno.land/x/oak/mod.ts";

const PORT = 4000;
const router = new Router();
const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

// Cette partie permet de mettre en place une règle générale sur le contexte de toutes
// Les requêtes du serveur web que l'on créé.
// Ici on va également déclarer notre dossier static /public dans lequel sera situé les fichiers HTML/CSS/JS
// Grâce à ça on pourra utiliser ces fichiers et donc les afficher.
app.use(async (ctx) => {
    const result = ctx.request.body({ contentTypes: { json: ['form-data'] } });
    await send(ctx, ctx.request.url.pathname, {
        root: `${Deno.cwd()}/webserver/public`,
        index: "index.html",
    });
});

// Objet UserShema qui corresponds à la TABLE "users" dans la BDD
// Cela nous permet d'ajouter facilement des informations en base
interface UserSchema{
    _id: { $oid: string }
    nickname: string,
    level: number,
}

router.get('/', (ctx: RouterContext) => {
    ctx.response.redirect('/index.html');
})

// RouterContext ici est un type qui nous permet d'accèder au contexte de la requête
// CAD que l'on pourra gérer les requêtes d'entrée (récupérer les params / headers)
// Et également préparer notre requête de réponse en ajoutant nos différentes infos dans celle-ci
router.post('/users', async (ctx: RouterContext) => {
    const body = await ctx.request.body().value;
    let nickname = body.get('nickname')
    let level = body.get('level')
    
    ctx.response.headers.append('nickname', "good");
    ctx.response.body = `${nickname} is level ${level}`
})

console.log(`Listening on port ${PORT}`)
await app.listen( { port: PORT });