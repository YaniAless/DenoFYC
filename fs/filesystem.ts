// Testing FS Standard Lib
// Forced to use an older version of the fs lib to use readJson and writeJson
import { readJson, writeJson, exists } from "https://deno.land/std@0.65.0/fs/mod.ts"; 

// Nous déclarons ici un objet contenant tous nos utilisateurs
const users = [
     { name: "Alessandro", level: 7 },
     { name: "Yani", level: 8 },
     { name: "Lukas", level: 11 },
     { name: "Ken", level: 15 },
]
// Ici on va créer un fichier JSON 'users' contenant les informations de notre objet créé précédemment
await writeJson('./fs/users.json', users, { spaces: 1 })

// Nous allons ici verifier que notre fichier à bien été créé
const fileExists = await exists('./fs/users.json')

if(fileExists) {
     console.log("file exists")
     // On va maintenant lire le fichier et stocker cela dans une variable
     // On va ensuite lire ces informations et les afficher dans la console
     const jsonObj = await readJson('./fs/users.json')
     console.log(jsonObj)
}

if(await exists('./fs/myFile.txt')) {
     console.log(true)
} else {
     console.log(false)
}

