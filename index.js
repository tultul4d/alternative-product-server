const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z5g3hgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
    await client.connect();
    

    const productCollection = client.db('productDB').collection('product');
    const commendCollection = client.db('productDB').collection('commend');



    app.get('/product', async(req, res) =>{
       const cursor = productCollection.find();
       const result = await cursor.toArray()
       res.send(result);
    })

// added delete
    app.get('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId (id)}
      const result = await productCollection.findOne(query)
      res.send(result);

    })

    app.get('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId (id)}


      const options = {
        projection: { title:1, name: 1, 
          photo: 1, 
          reason: 1, 
          createdAt: 1 },
      }
      const result = await productCollection.findOne(query, options)
      res.send(result);
    })




    app.post('/product', async(req, res) =>{
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

// update
    app.put('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const Products = req.body;
      console.log(id, Products);
      const filter = {_id: new ObjectId(id)}
      const option = {upsert: true}
      const updatedProducts = {
        $set: {
          name: Products.name,
          date: Products.title,
          brand: Products.brand,
          reason: Products.reason,
          date: Products.date,
        
        }
      }
      const result = await productCollection.updateOne(filter, updatedProducts, option )
      res.send(result);

    })


// API endpoint to fetch queries
app.get('http://localhost:5000/product', (req, res) => {
  res.json(queries);
});

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


// delete
    app.delete('/product/:id', async(req, res) =>{
      const id = req.params.id;
      console.log("plese delete ", id);
      const query = { _id: new ObjectId (id) }
      const result = await productCollection.deleteOne(query)
      res.send(result)
    })
    
    

  //  comment 
  app.get('/commend', async(req, res) =>{
    console.log(req.query.email);
    let query = {};
    if (req.query?.email){
      query = {email: req.query.email}
    }

    const result = await commendCollection.find(query).toArray();
    res.send(result);
  });

// all data comment
  app.get('/commend',  async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await commendCollection.find({ queryUserId: userId });
        res.send(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// added data
  app.post('/commend', async (req, res) => {
    const command = req.body;
    console.log(command);
    const result = await commendCollection.insertOne(command);
    res.send(result);
  });


// delete single data
  app.delete('/commend/:id' , async(req, res) =>{
    const id = req.params.id;
    const query = { _id: new ObjectId (id) }
    const result = await commendCollection.deleteOne(query);
    res.send(result);
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



app.get('/', (req, res) => {
    res.send ('alternative product server is running')
})

app.listen(port, () =>{
    console.log(`alternative product server port: ${port}`);
})