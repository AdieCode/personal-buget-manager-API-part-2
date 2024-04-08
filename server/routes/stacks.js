const express = require('express')
const router = express.Router();
const { data } = require('../data/data.js')

router.get('/', (req, res, next) => {
    data.getStacks((err, result) => {
      if (err) {
        console.error('Error getting stacks:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(200).json(result); // Send the result to the client as JSON
    });
});

module.exports = router;