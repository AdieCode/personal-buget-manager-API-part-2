const { Pool } = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;

// Connection pool configuration
const budgetManager = new Pool({
    connectionString: DATABASE_URL,
});

// for local
// const budgetManager = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'budgetManager',
//     password: 'postgres',
//     port: 5432, // Default PostgreSQL port is 5432
//   });
const createTablesQuery = `
CREATE TABLE IF NOT EXISTS stacks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  total_budget INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS envelopes (
  id SERIAL PRIMARY KEY,
  stack_id INT NOT NULL,
  category VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  current_budget INT DEFAULT 0,
  FOREIGN KEY (stack_id) REFERENCES stacks(id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  amount INT NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  envelope_id INT NOT NULL,
  FOREIGN KEY (envelope_id) REFERENCES envelopes(id)
);

CREATE OR REPLACE FUNCTION update_total_budget()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate the total budget for the affected stack_id
    UPDATE stacks
    SET total_budget = (
        SELECT SUM(current_budget)
        FROM envelopes
        WHERE envelopes.stack_id = NEW.stack_id
    )
    WHERE stacks.id = NEW.stack_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER envelopes_update_trigger
AFTER INSERT OR UPDATE OF current_budget ON envelopes
FOR EACH ROW
EXECUTE FUNCTION update_total_budget();

INSERT INTO stacks (title, total_budget)
VALUES ('My budget', 100);

INSERT INTO stacks (title, total_budget)
VALUES ('Another budget', 100);

INSERT INTO envelopes (stack_id, category, description, current_budget)
VALUES (1, 'gas', 'for my car', 100);

INSERT INTO envelopes (stack_id, category, description, current_budget)
VALUES (1, 'electricity', 'household', 100);

`;
  
budgetManager.query(createTablesQuery)
    .then(() => {
        console.log('Tables created successfully');
    })
    .catch((err) => {
        console.error('Error creating tables:', err);
    });

// Defineing an object to hold the functions for working with the databse.
const data = {

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

    addTransaction: function(newData, callback) {
        const { amount, recipient, id } = newData;
        budgetManager.query('INSERT INTO transactions (amount, recipient, envelope_id) VALUES ($1, $2, $3) RETURNING *', [amount, recipient, id], (err, res) => {
            if (err) {
                console.error('Error adding budget history:', err);
                callback(err, null);
                return;
            }
            callback(null, res.rows[0]); // Return the newly added budget history entry
        });
    },

    updateEnvelopeCategory: function(id, newData, callback) {
        const { category } = newData;
        budgetManager.query('UPDATE envelopes SET category = $1 WHERE id = $2', [category, id], (err, res) => {
        if (err) {
            console.error('Error updating envelopes:', err);
            callback(err, null);
            return;
        }
        callback(null, 'Envelope category was updated');
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
    },

    getTransactions: function(callback) {
        budgetManager.query('SELECT * FROM transactions;', (err, res) => {
          if (err) {
            console.error('Error executing query', err);
            callback(err, null);
            return;
          }
          callback(null, res.rows);
        });
    },

    subtractFromEnvelopeBudget: function(id, amount, callback) {
        budgetManager.query('UPDATE envelopes SET current_budget = current_budget - $1 WHERE id = $2', [amount, id], (err, res) => {
            if (err) {
                console.error('Error subtracting amount:', err);
                callback(err, null);
                return;
            }
            callback(null, 'Amount subtracted successfully');
        });
    },

    transferAmount: function(fromId, toId, amount, callback) {
        console.log("i was called")
        try {
            // Start a transaction
            budgetManager.query('BEGIN');
    
            // Subtract amount from the source envelope
            budgetManager.query('UPDATE envelopes SET current_budget = current_budget - $1 WHERE id = $2', [amount, fromId]);
    
            // Add amount to the destination envelope
            budgetManager.query('UPDATE envelopes SET current_budget = current_budget + $1 WHERE id = $2', [amount, toId]);
    
            // Commit the transaction
            budgetManager.query('COMMIT');
    
            // Callback with success message
            callback(null, 'Amount transferred successfully');
        } catch (error) {
            console.error('Error transferring amount:', error);
    
            try {
                // Rollback the transaction
                budgetManager.query('ROLLBACK');
            } catch (rollbackError) {
                console.error('Error rolling back transaction:', rollbackError);
            }
    
            callback(error, null);
        }
    },

    deleteEnvelopeById: function(id, callback) {
        budgetManager.query('DELETE FROM envelopes WHERE id = $1', [id], (err, res) => {
            if (err) {
                console.error('Error deleting envelope:', err);
                callback(err, null);
                return;
            }
            callback(null, 'Envelope deleted successfully');
        });
    }
};

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