const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.static("build"));

app.use(cors());
//JSON PARSER AGREGA BODY A LA REQUEST
app.use(express.json());

let waifus = [
  {
    id: 1,
    name: "yoshiko",
    lastname: "tsushima",
    day: 13,
    month: 7,
    anime: "love live Sunshine!!",
    seiyuuname: "aika",
    seiyuulastname: "kobayashi",
  },
  {
    id: 2,
    name: "riko",
    lastname: "sakurauchi",
    day: "19",
    month: "9",
    anime: "love live sunshine",
    seiyuuname: "aida",
    seiyuulastname: "rikyako",
  },
];

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/", (request, response) => {
  response.send("<h1>Hello node</h1>");
});

app.get("/api/waifus", (request, response) => {
  response.json(waifus);
});

app.get("/api/waifus/:id", (request, response) => {
  const id = Number(request.params.id);
  const waifu = waifus.find((el) => el.id === id);

  if (waifu) {
    response.json(waifu);
  } else {
    response.status(404).end("404 Not Found");
  }
});

app.delete("/api/waifus/:id", (request, response) => {
  const id = Number(request.params.id);
  const waifu = waifus.find((el) => el.id === id);
  if (waifu) {
    waifus = waifus.filter((el) => el.id !== id);
    response.status(204).end();
  } else {
    response.status(404).end("404 Not Found");
  }
});

app.post("/api/waifus", (request, response) => {
  const generateId = () => {
    const maxId = waifus.length > 0 ? Math.max(...waifus.map((p) => p.id)) : 0;
    return maxId + 1;
  };

  const body = request.body;

  if (
    !body.name ||
    !body.lastname ||
    !body.day ||
    !body.month ||
    !body.anime ||
    !body.seiyuuname ||
    !body.seiyuulastname
  ) {
    return response.status(400).json({
      error: "missing field, all are required",
    });
  } else {
    if (
      waifus.find((el) => el.name.toLowerCase() === body.name.toLowerCase()) &&
      waifus.find(
        (el) => el.lastname.toLowerCase() === body.lastname.toLowerCase()
      )
    ) {
      return response.status(400).json({
        error: "waifus names must be unique",
      });
    }
  }

  const waifu = {
    id: generateId(),
    name: body.name,
    lastname: body.lastname,
    day: body.day,
    month: body.month,
    anime: body.anime,
    seiyuuname: body.seiyuuname,
    seiyuulastname: body.seiyuulastname,
  };

  waifus = waifus.concat(waifu);
  response.status(200).json(waifu);
});

//falta put

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Escuchando el puerto ${PORT}`);
});
