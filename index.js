const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://jawadhossaintanjim:kp12Ypr0pL613iLr@cluster0.in9lm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        // Send a ping to confirm a successful connection
        // create database
        const studentsCollection = client.db('studentsDB').collection('student')
        // get data

        app.get('/students', async (req, res) => {
            const cursor = studentsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // get data id wise
        app.get('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await studentsCollection.findOne(query)
            res.send(result)
        })
        // create data
        app.post('/students', async (req, res) => {
            const newStudent = req.body;
            console.log(newStudent);
            const result = await studentsCollection.insertOne(newStudent)
            res.send(result)
        })

        // deleted data
        app.delete('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await studentsCollection.deleteOne(query)
            res.send(result)
        })

        // updated data

        // Updated route to handle student updates
        app.put('/students/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStudent = req.body;
            const query = { _id: new ObjectId(id) };
            const options = { returnDocument: 'after' }; // To return the updated document
            const result = await studentsCollection.findOneAndUpdate(query, { $set: updatedStudent }, options);

            if (result.value) {
                res.send({ updatedId: result.value._id });
            } else {
                res.status(404).send({ message: 'Student not found' });
            }
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);











app.get('/', (req, res) => {
    res.send('devcluster runing')
})

app.listen(port, () => {
    console.log(`Devcluster in runing on ${port}`);
})