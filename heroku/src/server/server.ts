import { json } from 'body-parser';
import { Request, Response } from 'express';
import express from 'express';
import * as fs from 'fs';
import path from 'path';

const app = express();
app.use(json());

const pokemonList = JSON.parse(
  fs.readFileSync(__dirname + "/data.json", "utf-8")
);

console.log(__dirname);

app.use(express.static(__dirname + "/../client"));

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + "/../client/index.html"));
});
//  /../../dist/tsc/client"
app.get("/pokemons", (_req: Request, res: Response) => {
  res.send(pokemonList);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
});