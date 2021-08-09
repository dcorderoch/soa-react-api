let express = require("express");
let router = express.Router();

let spaces = [];
let counter = 0;

router.get("/spaces", (req, res, next) => {
  if (req.body.state !== undefined) {
    let result = spaces.filter((s) => {
      return s.state == req.body.state;
    });
    res.status(200).send(result);
  } else {
    res.status(200).send(spaces);
  }
});

router.get("/spaces/:id", (req, res, next) => {
  let result;
  for (let i = 0; i < spaces.length; ++i) {
    if (spaces[i].id == Number(req.params.id)) {
      result = spaces[i];
      res.status(200).send(result);
      return;
    }
  }
  res.send({ error: true, message: "No se existe espacio con el id indicado" });
});

router.post("/spaces", (req, res, next) => {
  if (typeof req.body.data === "undefined") {
    res
      .status(412)
      .send({
        error: true,
        message: "No se proporcionó data sobre el espacio",
      });
    return;
  }
  let space = {
    id: counter,
    state: "free",
    data: req.body.data,
    carID: "",
    date: "",
  };
  spaces.push(space);
  counter++;
  res.status(200).send({ error: false, message: "éxito al crear espacio" });
});

router.put("/spaces/:id", (req, res, next) => {
  let result;
  for (let i = 0; i < spaces.length; ++i) {
    if (spaces[i].id == req.params.id) {
      result = spaces[i];
      result.data = "modified";
      res.send({ error: false, message: "éxito al actulizar" });
      return;
    }
  }
  res.send({ error: true, message: "No existe el espacio" });
});

router.delete("/spaces/:id", (req, res, next) => {
  for (let i = 0; i < spaces.length; ++i) {
    if (spaces[i].id == req.params.id) {
      if (spaces[i].state == "free") {
        spaces.splice(i, 1);
        res.send({ error: false, message: "El espacio fué eliminado" });
      } else {
        res.send({ error: true, message: "El espacio está ocupado" });
      }
      return;
    }
  }
  res.send({ error: true, message: "No existe el espacio" });
});

router.get("/reservations", (req, res, next) => {
  result = [];
  for (let i = 0; i < spaces.length; ++i) {
    if (spaces[i].state == "in-use") {
      result.push(spaces[i]);
    }
  }
  res.status(200).send(result);
});

router.post("/reservations", (req, res, next) => {
  if (typeof req.body.carID === "undefined") {
    res
      .status(412)
      .send({ error: true, message: "No se proporcionó un carID" });
    return;
  }
  for (let i = 0; i < spaces.length; ++i) {
    if (spaces[i].state === "free") {
      spaces[i].state = "in-use";
      spaces[i].carID = req.body.carID;
      spaces[i].date = new Date();
      res.status(201).send({ error: false, message: "éxito al reservar" });
      return;
    }
  }
  res.status(412).send({ error: true, message: "No hay espacios disponibles" });
});

router.delete("/reservations/:id", (req, res, next) => {
  for (let i = 0; i < spaces.length; ++i) {
    if (spaces[i].id == req.params.id) {
      spaces[i].state = "free";
      spaces[i].carID == "";
      spaces[i].date == "";
      res.send({ error: false, message: "Reservación eliminada" });
      return;
    }
  }
  res.send({ error: true, message: "no existe la reservación" });
});

module.exports = router;
