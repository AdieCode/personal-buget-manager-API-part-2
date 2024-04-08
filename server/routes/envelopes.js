const express = require('express')
const router = express.Router();
const { data } = require('../data/data.js')


router.post('/add', (req, res, next) => {
    const stack_id = req.body.stack_id;
    const category = req.body.category;
    const description = req.body.description;
    const budget = parseInt(req.body.budget);

    console.log(stack_id, category, description, budget)

    if (stack_id && category && description && !isNaN(budget)){
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
});

router.post('/transaction', (req, res, next) => {

  const amount = req.body.amount;
  const recipient = req.body.recipient;
  const id = req.body.id; 

  if (amount && recipient && id ){
    data.addTransaction(req.body, (err, result) => {
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

router.get('/:stack_id', (req, res, next) => {
  
  const stack_id = req.params.stack_id;

  if ( stack_id ){
    data.getEnvelopes(stack_id, (err, result) => {
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
});

router.get('/:envelope_id', (req, res, next) => {
  
  const envelope_id = req.params.envelope_id;

  if ( envelope_id ){
    data.getEnvelope(envelope_id, (err, result) => {
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
});

router.put('/editAmount/:id', (req, res, next) => {
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

router.put('/editCategory/:id', (req, res, next) => {
  const id = req.params.id;
  const category = req.body.category;

  if (id && category){
    data.updateEnvelopeCategory(id,req.body, (err, result) => {
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

router.put('/deplete/:id', (req, res, next) => {
  const id = req.params.id;
  const amount = req.body.amount;

  if ( id && amount ){
    data.subtractFromEnvelopeBudget(id, amount, (err, result) => {
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

});

router.put('/transfer/:from_id/:to_id', (req, res, next) => {

  const from_id = req.params.from_id;
  const to_id = req.params.to_id;
  const amount = req.body.amount;

  if ( from_id && to_id && amount ){
    data.transferAmount(from_id, to_id, amount, (err, result) => {
      if (err) {
        console.error('Error getting envelopes:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(200).json(result); // Send the result to the client as JSON
    });

  } else {
    res.status(404).send('Invalid (parameter or data) received');
  };

});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  if ( id ){
    data.deleteEnvelopeById(id, (err, result) => {
      if (err) {
        console.error('Error getting envelopes:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(200).json(result); // Send the result to the client as JSON
    });

  } else {
    res.status(404).send('Invalid id received');
  };
});

module.exports = router;