import {
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v6.0.0/mod.ts";
import {
  viewEngine,
  engineFactory,
  adapterFactory,
} from "https://deno.land/x/view_engine@v1.3.0/mod.ts";

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

app.use(router.routes());
app.use(router.allowedMethods());

console.log("App is listening to port: 8080");

await app.listen({ port: 8080 });
