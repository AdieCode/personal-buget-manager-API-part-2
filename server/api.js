const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require("express-session") //npm install express-session
const app = express()

app.use(cors('tiny'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// session store creation. sessions will be stored in locally in memmory, which is great for local devlopment.
// but you would ideally want them stored in a database.
const store = new session.MemoryStore();

// creating session and adding it to the store
app.use(
  session({
    secret: "D53gxl41G",
              //time in ms       //HTTPS       //cant remember, google it
    cookie: { maxAge: 300000000, secure: true, sameSite: "none" },
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// Do some kind of login in and if the user is authenticated the set an new key value pair in session, here is an example
//
//  req.session.authenticated = true;
//
// After this has been done you can create and add this middleware function to check if the user is authenticated in each request.

function Authenticated(req, res, next) {
  // Complete the if statement below:
  if (req.session.authenticated) {
    return next();
  } else {
    res.status(403).json({ msg: "You're not authorized to view this page" });
  }
}

// here is an example of how you would add it
// app.get('/stacks', Authenticated, (req, res, next) => {

//   data.getStacks((err, result) => {
//     if (err) {
//       console.error('Error getting stacks:', err);
//       res.status(500).json({ error: 'Internal server error' });
//       return;
//     }
//     res.status(200).json(result); // Send the result to the client as JSON
//   });
// });

app.get('/', (req, res) => {
  res.send('Welcome to the Budget Manager API');
});

// Routes related to Stacks
const stacksRouter = require('./routes/stacks');
app.use('/stacks', stacksRouter);

// Routes related to Envelopes
const envelopesRouter = require('./routes/envelopes');
app.use('/envelopes', envelopesRouter);

const port = process.env.PORT || 3000; // Use environment port or 3000 if not available

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});