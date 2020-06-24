const fs = require("fs");
const http = require("http");
const url = require("url");

const json = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const query = url.parse(req.url, true).query;

  // Product overview
  if (pathName === "/products" || pathName === "/") {
    fs.readFile(`${__dirname}/templates/template_overview.html`, "utf-8", (err, data) => {
      let output = data;

      fs.readFile(`${__dirname}/templates/template_card.html`, "utf-8", (err, data) => {
        const cardsOutput = laptopData.map( el => replaceTemplate(data, el) );
        output = output.replace("{%CARDS%}", cardsOutput.join(""));

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(output);
      });
    });

  // Laptop details
  } else if (pathName === "/laptop" && query.id < laptopData.length) {
    fs.readFile(`${__dirname}/templates/template_laptop.html`, "utf-8", (err, data) => {
      const renderedPage = replaceTemplate(
        data,
        laptopData[query.id]
      );

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(renderedPage);
    });

  // Requesting an image
  } else if (/\.(jpg|jpeg|png|gif)$/.test(pathName)) {
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      res.writeHead(200, { "Content-Type": "image/jpg" });
      res.end(data);
    });

  // 404 not found
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("404 not found!");
  }

});

server.listen(1337, "localhost", () => {
  console.log("Server is now listening!");
});

function replaceTemplate(originalHtml, laptop) {
  let output = originalHtml.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%PRODUCTNAME%}/g, laptop.productName);
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  output = output.replace(/{%ID%}/g, laptop.id);
  return output;
}