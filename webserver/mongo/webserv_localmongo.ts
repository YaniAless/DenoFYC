import { Application, Router, RouterContext, send } from "https://deno.land/x/oak/mod.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

const PORT = 4000;
const router = new Router();
const app = new Application();

// Déclaration de l'objet client Mongo qui nous permettra d'intéroger la BDD
const client = new MongoClient();
client.connectWithUri('mongodb://localhost:27017');

const db = client.database('testApp');
const users = db.collection<UserSchema>('users');

app.use(router.routes());
app.use(router.allowedMethods());

// Cette partie permet de mettre en place une règle générale sur le contexte de toutes
// Les requêtes du serveur web que l'on créé.
// Ici on va également déclarer notre dossier static /public dans lequel sera situé les fichiers HTML/CSS/JS
// Grâce à ça on pourra utiliser ces fichiers et donc les afficher.
app.use(async (ctx) => {
    const result = ctx.request.body({ contentTypes: { json: ['form-data'] } });
    await send(ctx, ctx.request.url.pathname, {
        root: `${Deno.cwd()}/webserver/mongo/public`,
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

router.get('/', async (ctx: RouterContext) => {
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

router.post('/users', async (ctx: RouterContext) => {
    const body = await ctx.request.body().value;

    const newUser = {
        nickname: body.get('nickname'),
        level: body.get('level'),
    }

    const insertUser = await users.insertOne(newUser);
    console.log(insertUser);
    ctx.response.headers.append('uid', insertUser['$oid']);
    ctx.response.redirect('/');
})

console.log(`Listening on port ${PORT}`)
await app.listen( { port: PORT });