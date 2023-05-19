const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ie2mpcl.mongodb.net/?retryWrites=true&w=majority`;

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
     const dataCollection = client.db('teddyToys').collection('toys')
     //get data all by limit
     app.get('/products', async(req, res)=>{
          
          const cursor = dataCollection.find().limit(20)    
          const result = await cursor.toArray();
          // console.log(result)
          res.send(result)
     })
     //.get data my email
     app.get('/products/mytoys', async(req, res)=>{
          let query ={}
          if(req.query?.email){
               query = {email: req.query?.email}
          }
          const filter = dataCollection.find(query).sort({price: 1})
          const result = await filter.toArray()

          res.send(result)
     })
     //get data by category
     app.get('/products/category', async(req, res)=>{

          // const data = req.params.sub;
          // console.log(req.query?.subcategory)

          const query = {subCategory:  req.query?.subcategory }
          // console.log(query)
          // const query = {sellerName: }

          // // const query = {subCategory: toString(data)}
          const cursor = dataCollection.find(query)
          const result = await cursor.toArray()
          res.send(result) 

     })
     
     app.get('/products/:id', async(req, res)=>{
          const id = req.params.id
          console.log(id)
          // if(req.query.subCategory){
          //      query= {subCategory: req.query.subCategory}
          // }
          const filter = {_id: new ObjectId(id)}
          const result = await dataCollection.findOne(filter)
          console.log(result)
          res.send(result)
     })
     // post and add data mongodb database
     app.post('/products', async(req, res)=>{
         const body = req.body;
     //     console.log(body)
         const result = await dataCollection.insertOne(body)
         res.send(result)
          
          
     
     })
     //delete one by mongodb
     app.delete('/products/:id', async (req, res)=>{
          const id = req.params.id;
          const query = {_id: new ObjectId(id)}
          const result = await dataCollection.deleteOne(query)
          res.send(result)
     })

//     Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
     res.send('Toys Server is running!')
})

app.listen(port, ()=>{
     console.log(`Tyos server port: ${port}`)
})