const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.port || 5000;

const products = require('./data/products.json')

app.use(cors())

app.get('/', (req, res)=>{
     res.send('Toys Server is running!')
})
app.get('/toys', (req, res)=>{
     res.send(products)
})
app.listen(port, ()=>{
     console.log(`Tyos server port: ${port}`)
})