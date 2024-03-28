const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { data } = require('./database/data.js')
const app = express()

let userBudgetManager;

app.use(cors('tiny'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/envelopes', (req, res, next) => {

    const stack_id = req.body.stack_id;
    const category = req.body.category;
    const description = req.body.description;
    const budget = req.body.budget;

    if (stack_id && category && description && budget){
      data.addEnvelope(req.body, (err, result) => {
        if (err) {
          console.error('Error getting envelopes:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.status(200).json(result); // Send the result to the client as JSON
      });

    } else {
      res.status(404).send('Invalid data received');
    }


})

app.get('/envelopes', (req, res, next) => {
  data.getEnvelopes(1, (err, result) => {
    if (err) {
      console.error('Error getting envelopes:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(result); // Send the result to the client as JSON
  });

});

app.get('/envelopes/:stack_id', (req, res, next) => {
  
  const stack_id = req.params.stack_id;

  if ( stack_id ){
    data.getEnvelope(stack_id, (err, result) => {
      if (err) {
        console.error('Error getting envelopes:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(200).json(result); // Send the result to the client as JSON
    });

  } else {
    res.status(404).send('Invalid id received');
  }
})

app.put('/envelopes/add', (req, res, next) => {
  const id = req.params.id;
  const budget = req.body.budget;

  if ( stack_id ){
    data.getEnvelope(stack_id, (err, result) => {
      if (err) {
        console.error('Error getting envelopes:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(200).json(result); // Send the result to the client as JSON
    });

  } else {
    res.status(404).send('Invalid id received');
  }
})

app.put('/envelopes/editAmount/:id', (req, res, next) => {

  const id = req.params.id;
  const budget = req.body.budget;

  if (id && budget){
    data.updateEnvelopeBudget(id,req.body, (err, result) => {
      if (err) {
        console.error('Error getting envelopes:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(200).json(result); // Send the result to the client as JSON
    });

  } else {
    res.status(404).send('Invalid data received');
  }
});

app.put('/envelopes/editCategory/:id', (req, res, next) => {
  const id = req.params.id;
  const category = req.body.category;

})

app.put('/envelopes/deplete/:category', (req, res, next) => {
  const category = req.params.category;
  const amount = req.body.amount;

})

app.put('/envelopes/transfer/:from_id/:to_id', (req, res, next) => {
  const from = req.params.from_id;
  const to = req.params.to_id;
  const amount = req.body.amount;

})

app.delete('/envelopes/:id', (req, res, next) => {
  const category = req.params.category;

})

const port = process.env.PORT || 3000; // Use environment port or 3000 if not available

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


/* stuff needed
  add more envelopes
  ==================
  - adding function --- done
  - verrify data total amount of the envelopes don't exceed the totalBudget --- busy


  update an envelopes amount
  ==========================
*/