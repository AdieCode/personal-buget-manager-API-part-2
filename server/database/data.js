const { Pool } = require('pg');

// Connection pool configuration
const budgetManager = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'budgetManager',
  password: 'postgres',
  port: 5432, // Default PostgreSQL port is 5432
});


// Defineing an object to hold the functions for working with the databse.
const data = {

      // Function to update a stack in the database
      
      // Function to add a new stack to the database
    addStack: function(newData, callback) {
        const { title } = newData;
        budgetManager.query('INSERT INTO stacks (title, total_budget) VALUES ($1, $2) RETURNING *', [title, 0], (err, res) => {
            if (err) {
                console.error('Error adding stack:', err);
                callback(err, null);
                return;
            }
            callback(null, res.rows[0]); // Return the newly added stack
        });
    },

    addEnvelope: function(newData, callback) {
        const { stack_id, category, description, budget } = newData;
        budgetManager.query('INSERT INTO envelopes (stack_id, category, description, current_budget) VALUES ($1, $2, $3, $4) RETURNING *', [stack_id, category, description, budget], (err, res) => {
            if (err) {
                console.error('Error adding envelopes:', err);
                callback(err, null);
                return;
            }
            callback(null, res.rows[0]); // Return the newly added stack
        });
    },

    updateEnvelopeCategory: function(id, newData, callback) {
        const { title } = newData;
        budgetManager.query('UPDATE envelopes SET title = $1 WHERE id = $2', [title, id], (err, res) => {
        if (err) {
            console.error('Error updating envelopes:', err);
            callback(err, null);
            return;
        }
        callback(null, res.rows);
        });
    },

    updateEnvelopeBudget: function(id, newData, callback) {
        const { budget } = newData;
        budgetManager.query('UPDATE envelopes SET current_budget = $1 WHERE id = $2', [budget, id], (err, res) => {
        if (err) {
            console.error('Error updating envelopes:', err);
            callback(err, null);
            return;
        }
        callback(null, 'Envelope budget was updated');
        });
    },
        
    updateStackTitle: function(id, newData, callback) {
        const { title } = newData;
        budgetManager.query('UPDATE stacks SET title = $1 WHERE id = $2', [title, id], (err, res) => {
        if (err) {
            console.error('Error updating stack:', err);
            callback(err, null);
            return;
        }
        callback(null, res.rows);
        });
    },
        
    getStacks: function(callback) {
      budgetManager.query('SELECT * FROM stacks;', (err, res) => {
        if (err) {
          console.error('Error executing query', err);
          callback(err, null);
          return;
        }
        callback(null, res.rows);
      });
    },
    
    getStackTotal: function(id, callback) {
      budgetManager.query('SELECT total_budget FROM stacks WHERE id = $1;', [id], (err, res) => {
        if (err) {
          console.error('Error executing query', err);
          callback(err, null);
          return;
        }
        callback(null, res.rows);
      });
    },
    
    getEnvelopes: function(id, callback) {
      budgetManager.query('SELECT * FROM envelopes WHERE stack_id = $1;', [id], (err, res) => {
        if (err) {
          console.error('Error executing query', err);
          callback(err, null);
          return;
        }
        callback(null, res.rows);
      });
    },
    
    getEnvelope: function(id, callback) {
      budgetManager.query('SELECT * FROM envelopes WHERE id = $1;', [id], (err, res) => {
        if (err) {
          console.error('Error executing query', err);
          callback(err, null);
          return;
        }
        callback(null, res.rows);
      });
    },
    
    getEnvelopeTotal: function(id, callback) {
      budgetManager.query('SELECT current_budget FROM envelopes WHERE id = $1;', [id], (err, res) => {
        if (err) {
          console.error('Error executing query', err);
          callback(err, null);
          return;
        }
        callback(null, res.rows);
      });
    }
};

// Example usage
data.getEnvelopeTotal(3, (err, envelopes) => {
  if (err) {
    console.error('Error getting envelopes:', err);
    return;
  }
  console.log("result",envelopes)
});

// Listen for the exit event to close the connection pool when the application exits
process.on('exit', () => {
    console.log('Closing the connection pool...');
    budgetManager.end(); // Close the connection pool
  });
  
  // Optionally, handle other signals that may cause your application to exit
  process.on('SIGINT', () => {
    console.log('Received SIGINT. Exiting...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Exiting...');
    process.exit(0);
  });

module.exports = { data };