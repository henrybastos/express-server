const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5050;

const ANSI_COLORS = { // Aesthetic of the console logs
  RED: '\u001b[31m',
  GREEN: '\u001b[32m',
  RESET: '\u001b[0m'
}

let errorLog = {errors: []};

const ERROR_TYPES = {
  NO_USERS_FOUND: {
    type: '/errors/no-users-found.html',
    title: 'No users could be found.',
    status: 404,
    detail: 'No users could be found.'
  },
  NULL_OR_UNDEFINED: {
    type: '/errors/null-or-undefined.html', 
    detail: 'Value is Null or Undefined.',
    title: 'Value is Null or Undefined.',
    status: 400,
  },
  USER_NOT_FOUND: {
    type: '/errors/user/user-not-found.html', 
    detail: 'User could not be found.',
    title: 'User could not be found.',
    status: 404
  },
  USER_NAME_TAKEN: {
    type: '/errors/user/name-taken.html', 
    detail: 'Name was already taken by another user.',
    title: 'Name was already taken by another user.',
    status: 400
  },
  USER_USERNAME_TAKEN: {
    type: '/errors/user/username-taken.html', 
    detail: 'Username was already taken by another user.',
    title: 'Username was already taken by another user.',
    status: 400
  }
}

let users = [
  { name: 'Henry Bastos da Silva', username: 'henry_bastos', age: 19 },
  { name: 'Jane Doe', username: 'janeDoe', age: 38 }
];

// ==================== CHECKS ====================

const checkExistingUser = (userToCheck, req) => {
  let checks = {
    // name: users.map(user => user.name).indexOf(userToCheck.name) === -1 ? false : true,
    username: users.map(user => user.username).indexOf(userToCheck.username) === -1 ? false : true
  };

  if (checks.username) {
    errorLog.errors.push({...ERROR_TYPES.USER_USERNAME_TAKEN, instance: req.originalUrl});
    return false;
  }
};

const checkNullOrUndefined = (value, key, req) => {
  if (value === undefined || value === null) {errorLog.errors.push({
    ...ERROR_TYPES.NULL_OR_UNDEFINED, 
    instance: req.originalUrl, 
    key: key,
  });
  return false;
  }
}

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/errors',express.static(__dirname + '/public/routes/errors'));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/routes/home.html');
})

app.get('/users', (req, res) => {
  errorLog.errors = [];
  try {
    if (users) {
      res.json(users);
    } else {
      errorLog.errors.push({...ERROR_TYPES.NO_USERS_FOUND, instance: req.originalUrl});
      console.error(errorLog);
      res.status(404).send(errorLog);
    }
  } catch (error) {
    res.status(404).send(error);
    console.error(error);
  }
})

app.get('/user/:username', (req, res) => {
  errorLog.errors = [];
  try {
    let user = users.filter(obj => obj?.username === req?.params?.username);
    if (user.length > 0) {
      res.json(user[0]);
    } else {
      errorLog.errors.push({...ERROR_TYPES.USER_NOT_FOUND, instance: req.originalUrl});
      res.status(404).send({errors: errorLog});
    }
  } catch (error) {
    console.error(error);
    res.status(404).send(error);
  }
})

app.post('/add-user', (req, res) => {
  errorLog.errors = [];

  try {
    let newUser = {
      name: req?.body?.name,
      username: req?.body?.username,
      age: req?.body?.age
    };

    let newUserChecks = [
      checkNullOrUndefined(newUser.name, 'name', req),
      checkNullOrUndefined(newUser.username, 'username', req),
      checkNullOrUndefined(newUser.age, 'age', req),
      checkExistingUser(newUser, req)
    ];

    if (newUserChecks.some(check => check === false)) {
      console.error(errorLog);
      res.status(400).send(errorLog);
    } else {
      users.push(newUser);
      res.status(201).json(users);
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