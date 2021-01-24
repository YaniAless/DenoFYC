import { Application, Router, RouterContext, send } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
const app = new Application();

router.get('/', (ctx) => {
    ctx.response.body = "Welcome home";
})

router.get('/users', (ctx: RouterContext) => {
    ctx.response.body = "Hello Mr. Unknown" ;
})

app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 2525 });