# Personal Budget Manager API
This API allows users to manage their personal budgets by creating envelopes for different expense categories and allocating budgets to each envelope. Users can perform various operations such as creating, updating, deleting envelopes, transferring funds between envelopes, and depleting budgets.

# Contents
 - [Endpoints](#API-Endpoints) 
   - [GET](#API-Endpoints) 

## Getting Started
To get started with the Personal Budget Manager API, follow the instructions below:


### Prerequisites
- Node.js and npm installed on your machine.

### Installation

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/your-username/personal-budget-manager-api.git
    ```

2. Navigate to the project directory:
    ```bash
    cd personal-budget-manager-api
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

### POST `/envelopes`

This endpoint is used to create envelopes for different expense categories.
(this should always be called first to instantiate the bugetManager class)

#### Request Body

- `totalBudget`: Total budget amount (float).
- `envelopes`: Array of envelopes containing category and amount.

Example request body:
```json
{
  "totalBudget": 4000,
  "envelopes": [
    { 
      "category": "health",
      "amount": 300 },
    { 
      "category": "food",
      "amount": 200 
    }
  ]
}
```

### GET `/envelopes`

This endpoint is used to recieve envelopes for different expense categories.

Example response:
```json

[
  { 
    "category": "health",
    "amount": 300,
    "id" : 124
  },
  { 
    "category": "food",
    "amount": 200,
    "id" : 147 
  }
]

```

### GET `/envelopes/:category`

This endpoint is used to recieve a single envelope for different expense categories.

#### Request Parameters

- `category`: The category of the envelope to be fetched.

Example response:
```json

{ 
  "category": "health",
  "amount": 300,
  "id" : 124
}

```

### PUT `/envelopes/add`

This endpoint is used to add a new envelope.

Example request body:
```json
{
  "category": "health",
  "amount": 300
}
```

### PUT `/envelopes/editCategory/:envelopeId`

This endpoint is used to edit the category of an existing envelope based on its ID.

#### Request Parameters

- `envelopeId`: The ID of the envelope whose category needs to be edited.

Example request body:
```json
{
  "category": "food"
}
```

### PUT `/envelopes/editAmount/:category`

This endpoint is used to edit the amount allocated to an existing envelope based on its category.

#### Request Parameters

- `category`: The category of the envelope whose amount needs to be edited.

Example request body:
```json
{
  "amount": 400
}
```

### PUT `/envelopes/deplete/:category`

This endpoint is used to deplete the budget of an envelope for a specific expense category by the requested amount.

#### Request Parameters

- `category`: The category of the envelope from which funds will be depleted.

#### Request Body

- `amount`: Amount to deplete from the envelope's budget (float).

Example request body:
```json
{
  "amount": 50
}
```

### PUT `/envelopes/transfer/:from/:to`

This endpoint transfers funds from one envelope to another.

#### Request Parameters

- `from`: The category of the envelope from which funds will be transferred.
- `to`: The category of the envelope to which funds will be transferred.

#### Request Body

- `amount`: The amount of funds to transfer (float).

Example Request:
```json
{
  "amount": 50
}
```

### DELETE `/envelopes/:category`

This endpoint deletes an envelope for the specified expense category.

#### Request Parameters

- `category`: The category of the envelope to delete.

#### Response

- `200 OK`: Returned if the deletion is successful.
- `404 Not Found`: Returned if the deletion is unsuccessful.






## `budgetManager` Class

The `budgetManager` class is responsible for managing the user's personal budget by creating envelopes for different expense categories and allocating budgets to each envelope.

### Constructor

The constructor initializes a new instance of the `budgetManager` class with the following parameters:

- `totalBudget`: The total budget amount (float).
- `envelopes`: An array of envelopes containing category, amount, and ID.

### Methods

#### `envelopes`

- **Description**: Retrieves all envelopes.
- **Return Value**: An array containing all envelopes.

#### `envelope(category)`

- **Parameters**: 
  - `category`: The category of the envelope to retrieve.
- **Description**: Retrieves a single envelope based on its category.
- **Return Value**: The envelope object corresponding to the specified category.

#### `addEnvelope(envelope)`

- **Parameters**: 
  - `envelope`: The envelope object to add.
- **Description**: Adds a new envelope to the collection.
- **Return Value**: `true` if the envelope was successfully added, `false` otherwise.

#### `deleteEnvelope(category)`

- **Parameters**: 
  - `category`: The category of the envelope to delete.
- **Description**: Deletes an envelope based on its category.
- **Return Value**: `true` if the envelope was successfully deleted, `false` otherwise.

#### `depleteBudget(category, Amount)`

- **Parameters**: 
  - `category`: The category of the envelope whose budget to deplete.
  - `Amount`: The amount to deplete from the envelope's budget.
- **Description**: Depletes the budget of an envelope for a specific category by the requested amount.
- **Return Value**: `true` if the budget depletion was successful, `false` otherwise.

#### `editAmountByCategory(category, amount)`

- **Parameters**: 
  - `category`: The category of the envelope whose amount to edit.
  - `amount`: The new amount for the envelope.
- **Description**: Edits the amount allocated to an existing envelope based on its category.
- **Return Value**: `true` if the amount of the envelope was successfully edited, `false` otherwise.

#### `editCategoryById(id, category)`

- **Parameters**: 
  - `id`: The ID of the envelope whose category to edit.
  - `category`: The new category for the envelope.
- **Description**: Edits the category of an existing envelope based on its ID.
- **Return Value**: `true` if the category of the envelope was successfully edited, `false` otherwise.



