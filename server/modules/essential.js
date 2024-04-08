const bcrypt = require("bcrypt");

/*
Hashes a password using bcrypt.

@param {string} password - The password to be hashed.

@param {number} saltRounds - The number of salt rounds to be used in the hashing process.

@returns {Promise<string|null>} - A promise that resolves to the hashed password or null if an error occurs.
*/
const passwordHasher = async (password, saltRounds) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash
  } catch (err) {
    console.log(err);
  }
  return null;
};

// password comparison function below:
const comparePasswords = async (password, hash) => {
    try {
      const matchFound = await bcrypt.compare(password, hash);
      return matchFound;
    } catch (err) {
      console.log(err);
    }
    return false;
};
  