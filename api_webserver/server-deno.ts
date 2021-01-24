import { serve } from "https://deno.land/std@0.76.0/http/server.ts"; 

const server = serve({port : 2525});
console.log("http://localhost:2525/"); 

//on parcourt les requêtes du serveur 
for await (const req of server){ 

    const url = req.url; 

    switch(url){
        case "/": 
            req.respond({ body : "Welcome to the main page \n"});
        break; 
        case "/page1": 
        req.respond({ body : "Welcome to the page 1 \n"});
        break; 
        default:
            req.respond({ body : "Error \n"});
        break;
    }
}