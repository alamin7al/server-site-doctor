const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const { query } = require('express');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = ` mongodb+srv://portpolio:tYOvSrNupLrc2D7j@cluster0.ow5x2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority  `;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('doctors_portal')
        const appointementCollection = database.collection('appointement')
        const usersCollection = database.collection('users')
        app.get('/appointements', async (req, res) => {
            const email = req.query.email
            const date = new Date(req.query.date).toLocaleDateString();
            const quray = { email: email, date: date }

            const cursor = appointementCollection.find(quray)
            const appointements = await cursor.toArray()
            res.send(appointements)
        })


        app.post('/appointements', async (req, res) => {
            const appointement = req.body
            const result = await appointementCollection.insertOne(appointement)
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            console.log(result);
            res.send(result)
        })
      
        app.put('/users', async (req, res) => {
            const user = req.body 
            console.log('pput',user); 
            const filter = { email: user.email }
            const options = { upsert: true }
            const updateDoc = { $set: user }
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.send(result)   
        })
        app.put('/users/admin', async (req, res) => {   
            const user = req.body
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.send(result)
        })
         
app.get('/users/:email',async(req,res)=>{
    const email=req.params.email
    const query={email:email}
    const user=await usersCollection.findOne(query)
    let isadmin=false
    if(user?.role==='admin'){
        isadmin=true
    }
    res.send({admin:isadmin})
})
        console.log('h');


    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running my CRUD Server');
});

app.listen(port, () => {
    console.log('Running Server on port', port);
})


