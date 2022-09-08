// import the packages we need
// mongoose, express
const mongoose = require("mongoose");
const express = require("express");
const products = require("./products");
const cors = require("cors");

const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/Final";
const PORT = process.env.PORT || 7000;

mongoose
	.connect("mongodb://localhost:27017/Final", { useNewUrlParser: true })
	.then(() => {
		// create a backend server that will listen to our requests
		// listen for the products path (req.url: /products)
		// send data to front-end

		const app = express();
		app.use(cors());

		app.listen(PORT, () => {
			console.log(`server has started - port: ${PORT}`);
		});

		// will retrieve the products page and display all products
		app.get("/products", async (req, res) => {
			// what takes time? what should we wait for: data from database
			// send my data; what format? : JSON
			// send the response

			const data = await products.find(); // mongodb function

			res.json(data);
		});

		//app.use(express.json());-----------------ERROR !!!!!
		app.get("/products/:id", async (req, res) => {
			try {
				const products = await products.findOne({ _id: req.params.id });
				res.json(products);
			} catch {
				console.log("Error: get request incomplete");
				res.json({ error: "product does not exist" });
				res.status(404);
			}
		});

		// POST Request - Postman
		// path, body, insert into MongoDB
		app.use(express.json());
		app.post("/products", async (req, res) => {
			console.log(req.body);

			const product = new products({
				name: req.body.name,
				image: req.body.image,
				price: req.body.price,
			});

			await product.save();
			res.json();
		});

		app.delete("/products/:id", async (req, res) => {
			try {
				await products.deleteOne({ _id: req.params.id });
				res.status(204).send();
			} catch {
				res.json({ error: "product does not exist" });
				res.status(404);
			}
		});

		app.put("/products/:id", async (req, res) => {
			try {
				const product = await products.findOne({ _id: req.params.id });
				console.log(product);
				console.log(req.body);

				if (req.body.name) {
					product.name = req.body.name;
				}

				if (req.body.image) {
					product.image = req.body.image;
				}

				if (req.body.price) {
					product.price = req.body.price;
				}

				await product.save();
				res.json(product);
			} catch {
				res.json({ error: "product does not exist" });
				res.status(404);
			}
		});

		if (process.env.NODE_ENV === "production") {
			app.use(express.static("client/build"));

			app.get("*", (req, res) => {
				res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
			});
		}
	});
