const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const category = require('./category.json')
const allProducts = require('./allProducts.json')
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {

  res.send("App is running on port " + port)
})




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.9qpxu0o.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const database = client.db("StyleSpot");
    const products = database.collection("products");
    const carts = database.collection('carts');




    app.get('/products', async (req, res) => {



      const result = await products.find().toArray()





      res.send(result)
    })

    app.get('/products/:id', async (req, res) => {

      const id = req.params.id


      const result = await products.findOne({
        _id: new ObjectId(id)
      })

      res.send(result)
    })


    app.post('/carts', async (req, res) => {

      const body = req.body
      const query = {

        body, email: body.email
      }



      const result = await carts.insertOne(query)
      res.send(result)



    })

    app.get('/carts/:email', async (req, res) => {


      const email = req.params.email


      const result = await carts.find({

        email: email


      }).toArray()

      res.send(result)




    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);











// app.get ('/products', (req, res) => {  


//     res.send (allProducts)
// })
app.listen(port, () => {

  console.log("Dress server listening on port " + port)
})


