// ./src/index.js
// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');


// defining the Express app
const app = express();
// app.use(express.json());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// defining an array to work as the database (temporary solution)
const ads = [
  { title: 'Hello, world (again)!' }
];

const mongoose = require('mongoose')

// const db = mongoose.connect('mongodb+srv://testuser:testuser@cluster0.xbcejhx.mongodb.net/testdb', {
//     dbName: 'NAGPDB',
//     user: 'testuser',
//     pass: 'testuser'
//   })

  const db = mongoose.connect(process.env.dburl, {
    dbName: process.env.dbname,
    user: process.env.dbuser,
    pass: process.env.dbpassword
  })

const studentSchema = new mongoose.Schema({
  name: String,
  email: String
})
const Student = mongoose.model('Student', studentSchema);

app.post('/student', (req, res) => {
  const obj = JSON.stringify(req.body);
  const data = JSON.parse(obj);
  let student = new Student({
    name: req.body?.name,
    email: req.body?.email
  });
  
  student.save()
    .then(doc => {
      console.log(doc)
      res.send(doc).status(200);
    })
    .catch(err => {
       console.log(err);
       res.send(err).status(500);
    })
})

app.get('/students', async (req, res) => {
  Student.find({}) .then((doc) => {
    res.send(doc);
  })
  .catch((err) => {
    res.send(err).status(500);
  });
});

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(ads);
});

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
  console.log(process.env.dburl);
  console.log(process.env.dbuser);
  console.log(process.env.dbpassword);
  console.log(process.env.dbname);
});