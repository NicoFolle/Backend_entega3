const express = require("express");
const app = express();

const PORT = 8080;

const fs = require("fs");

class Contenedor {
  constructor(nombre) {
    this.nombre = nombre;
  }

  // MÉTODOS.

  async save(object) {
    try {
      const contenido = await fs.promises.readFile(this.nombre);
      const contenido_parsed = JSON.parse(contenido);

      object["id"] = contenido_parsed[contenido_parsed.length - 1].id + 1;
      await fs.promises.writeFile(
        "./productos.txt",
        JSON.stringify([...contenido_parsed, object])
      );
    } catch (error) {
      await fs.promises.writeFile(
        "./productos.txt",
        JSON.stringify([{ ...object, id: 0 }])
      );
    }
    return JSON.stringify([{ ...object }]);
  }

  async getById(id) {
    try {
      const productos = await this.getAll();
      return productos.find((producto) => id === producto.id);
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    try {
      const contenido = await fs.promises.readFile(this.nombre, "utf-8");
      return JSON.parse(contenido);
    } catch (error) {
      console.log("No se pudo leer el archivo.");
    }
  }
}

const contenedor1 = new Contenedor("./productos.txt");

const prueba = async () => {
  console.log("Guardo tres productos: ");

  const refProd1 = await contenedor1.save({
    title: "Escuadra",
    price: 123.45,
    thumbnail:
      "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
  });

  console.log("Guardo: " + refProd1);

  const refProd2 = await contenedor1.save({
    title: "Globo Terráqueo",
    price: 345.67,
    thumbnail:
      "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
  });

  console.log("Guardo: " + refProd2);

  const refProd3 = await contenedor1.save({
    title: "Calculadora",
    price: 234.56,
    thumbnail:
      "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
  });

  console.log("Guardo: " + refProd3);

  const listadoProductos = await contenedor1.getAll();
  console.log(
    "Productos listados: " + JSON.stringify(listadoProductos, null, 2)
  );
};

//prueba();

const server = app.listen(PORT, () => {
  console.log(`servidor iniciado en el puerto ${server.address().port}`);
});

app.get("/", (req, res) => {
  res.send(`<h1> Bienvenido al servidor en express </>`);
});

app.get("/productos", async (req, res) => {
  const total = await contenedor1.getAll();
  res.send(
    `<h1> Listado de Productos.</h1>
    </br>
    <h2>${JSON.stringify(total, null, '</br>')}</h2>`
  );
});

app.get("/productoRandom", async (req, res) => {
  const total = await contenedor1.getAll();
  const producto = await contenedor1.getById(
    Math.floor(Math.random() * total.length)
  );
  res.send(
    `<h1> Producto Elegido.</h1>
      </br>
      <h2>${JSON.stringify(producto, null, '</br>')}</h2>`
  );
});
