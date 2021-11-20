const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxelq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log('connection err', err);
  const postCollection = client.db('javascriptProject').collection('posts');

  app.get('/posts', (req, res) => {
    postCollection.find().toArray((err, posts) => {
      res.send(posts);
    });
  });

  app.get('/posts/:id', (req, res) => {
    postCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.post('/addPost', (req, res) => {
    const newPost = req.body;
    postCollection.insertOne(newPost).then((result) => {
      result.send(result.insertedCount > 0);
    });
  });

  app.delete('/postDelete/:id', (req, res) => {
    postCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });

  //   client.close();
});

app.get('/', (req, res) => {
  res.send('Javascript Project Server!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
