const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5050;

const ANSI_COLORS = { // Aesthetic only / Apenas estético
  RED: '\u001b[31m',
  GREEN: '\u001b[32m',
  RESET: '\u001b[0m'
}

const ERROR_TYPES = {
  NO_USERS_FOUND: {type: '/errors/no-users-found', detail: 'No users could be found.'},
  NULL_OR_UNDEFINED: {type: '/errors/null-or-undefined', detail: 'Value is Null or Undefined.'},
  USER_NOT_FOUND: {type: '/errors/user/user-not-found', detail: 'User could not be found.'},
  USER_NAME_TAKEN: {type: '/errors/user/name-taken', detail: 'Name was already taken by another user.'},
  USER_USERNAME_TAKEN: {type: '/errors/user/username-taken', detail: 'Username was already taken by another user.'}
}

let users = [
  { name: 'Henry Bastos da Silva', username: 'henry_bastos', age: 19 },
  { name: 'Jane Doe', username: 'janeDoe', age: 38 }
];

const checkExistingUser = (userToCheck) => {
  return {
    // name: users.map(user => user.name).indexOf(userToCheck.name) === -1 ? false : true,
    username: users.map(user => user.username).indexOf(userToCheck.username) === -1 ? false : true
  }
};

const registerError = (errorArray, errorBody) => {
  let error = errorBody;
  errorArray.push(error);
}

const returnError = (errorArray) => {
  // errorArray?.forEach(error => console.error(`🔴${ANSI_COLORS.RED} Error: ${error}${ANSI_COLORS.RESET}`))
  // throw new Error(errorArray?.reduce((prev, curr) => `${prev} ${curr}`));
  return {errors: errorArray};
}

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/errors',express.static(__dirname + '/public/routes/errors'));
app.use(cors());

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>');
})

app.get('/users', (req, res) => {
  let errorLog = [];
  try {
    if (users) {
      res.json(users);
    } else {
      registerError(errorLog, {
        type: ERROR_TYPES.NO_USERS_FOUND.type,
        title: 'No users could be found.',
        status: 404,
        detail: ERROR_TYPES.NO_USERS_FOUND.detail,
        instance: req.originalUrl
      })
      returnError(errorLog);
      console.error(errorLog);
      res.status(404).send(errorLog);
    }
  } catch (error) {
    res.status(404).send(error);
    console.error(error);
  }
})

app.get('/user/:username', (req, res) => {
  let errorLog = [];
  try {
    let user = users.filter(obj => obj?.username === req?.params?.username);
    if (user.length > 0) {
      res.json(user[0]);
    } else {
      registerError(errorLog, {
        type: ERROR_TYPES.USER_NOT_FOUND.type,
        title: 'User could not be found.',
        status: 404,
        detail: ERROR_TYPES.USER_NOT_FOUND.detail,
        instance: req.originalUrl
      });
      res.status(404).send({errors: errorLog});
    }
  } catch (error) {
    console.error(error);
    res.status(404).send(error);
  }
})

app.post('/add-user', (req, res) => {
  let errorLog = [];
  try {
    let newUser = {
      name: req?.body?.name || registerError(errorLog, {
        type: ERROR_TYPES.NULL_OR_UNDEFINED.type, 
        title: 'Name is null or undefined.',
        status: 400,
        detail: ERROR_TYPES.NULL_OR_UNDEFINED.detail,
        instance: req.originalUrl
      }),
      username: req?.body?.username || registerError(errorLog, {
        type: ERROR_TYPES.NULL_OR_UNDEFINED, 
        title: 'Username is null or undefined.',
        status: 400,
        detail: ERROR_TYPES.NULL_OR_UNDEFINED.detail,
        instance: req.originalUrl
      }),
      age: req?.body?.age || registerError(errorLog, {
        type: ERROR_TYPES.NULL_OR_UNDEFINED, 
        title: 'Age is null or undefined.',
        status: 400,
        detail: ERROR_TYPES.NULL_OR_UNDEFINED.detail,
        instance: req.originalUrl
      })
    };

    let checkResult = checkExistingUser(newUser); 
    let checkResultKeys = Object.keys(checkResult);

    if (checkResultKeys.every(key => checkResult[key] === false)) {
      users.push(newUser);
      console.log(newUser);
      console.log(`${ANSI_COLORS.GREEN}User created\n🟢 No errors. :)${ANSI_COLORS.RESET}`);
      res.status(201).json(users);
    } else {
      checkResult?.username && registerError(errorLog, {
        type: ERROR_TYPES.USER_USERNAME_TAKEN.type, 
        title: 'Username already used.', 
        status: 400,
        detail: ERROR_TYPES.USER_USERNAME_TAKEN.detail,
        instance: req.route.path,
        username: newUser.username
      });
      returnError(errorLog);
      console.error({errors: errorLog});
      res.status(400).send({errors: errorLog});
    }
  } 
  catch (error) {
    console.error(error);
    res.json(error);
  }
})

app.listen(PORT, () => {
  console.log(`Server opened at http://localhost:${PORT}`);
})