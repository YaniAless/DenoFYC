import { Application, Router, RouterContext, send } from "https://deno.land/x/oak/mod.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

const PORT = 4000;
const router = new Router();

const app = new Application();

const client = new MongoClient();
client.connectWithUri(''); // Ne pas oublier d'ajouter ici la chaine de connexion pour Mongo Cloud

const db = client.database('testApp');
const users = db.collection<UserSchema>('users');

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (ctx) => {
    const result = ctx.request.body({ contentTypes: { json: ['form-data'] } });
    await send(ctx, ctx.request.url.pathname, {
        root: `${Deno.cwd()}/webserver/public`,
        index: "index.html",
    });
});

interface UserSchema{
    _id: { $oid: string }
    nickname: string,
    level: number,
}

router.get('/', (ctx) => {
    ctx.response.redirect('/index.html');
})

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