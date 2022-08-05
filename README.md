# Express Server 01

The main goals of this project are to exercise:

- ExpressJS' basic routing features.
- GET and POST HTTP methods.
- Error handling.
- General protocols and standards.
- Documentation and organization.

## 1. Features

There are 3 main features in this project:
- Get all the users from the database
- Get a specific user from the database
- Add a user to the database

## 2. Routes

### `GET '/'`

Shows the documentation of the project.

### `GET '/users'` 
Returns all the users from the database in JSON. Example:

```json
[
	{
		"name": "Henry Bastos da Silva",
		"username": "henry_bastos",
		"age": 19
	},
	{
		"name": "Jane Doe",
		"username": "janeDoe",
		"age": 38
	}
]
```

- If it fails to return the users, it will return the error type [`/errors/no-users-found`](#33-errorsno-users-found).

### `GET '/user/:username'` 
Returns a specific user from the database in JSON.

- If the username is null or undefined, it will return [`/errors/null-or-undefined`](#31-errorsnull-or-undefined).

- If the user can not be found, it will return [`/errors/user/user-not-found`](#34-errorsuseruser-not-found).

### `POST '/add-user'` 
Adds a user to the database. It requires the following structure:

```json
{
  "name": "Name and Surname", 
  "username": "username", 
  "age": 99
}
```

Successfull if all the requirements are pleased.

Requirements:
 - `name` : 
    - **Not Unique:** Do not need to be unique in the database. 
    - **Not null/undefined:** It can not be null nor undefined, otherwise it will return [`/errors/null-or-undefined`](#31-errorsnull-or-undefined). 
    - **String:** Required as a *String*.
 - `username` : 
    - **Unique:** Required to be unique in the database, otherwise it will return [`/errors/user/username-taken`](#32-errorsuserusername-taken).
    - **Not null/undefined:** It can not be null nor undefined, otherwise it will return [`/errors/null-or-undefined`](#31-errorsnull-or-undefined).
    - **String:** Required as a *String*.
 - `age` :
    - **Not Unique:** Do not need to be unique in the database. 
    - **Not null/undefined:** It can not be null nor undefined, otherwise it will return [`/errors/null-or-undefined`](#31-errorsnull-or-undefined). 
    - **Integer:** Required as an *Integer Number*;

___

## 3. Error handling

All the errors are returned following the standards of the document [RFC7807](https://datatracker.ietf.org/doc/html/rfc7807).

`/errors/error-types` 
Main page with all the Error types listed.

### 3.1. `/errors/null-or-undefined`
 The current value is null or undefined.

 Returned by:
 - [`GET '/user/:username'`](#get-userusername)
 - [`POST '/add-user'`](#post-add-user)

```json
{
  "type": "/errors/null-or-undefined",
  "title": "Value is Null or Undefined.",
  "status": 400,
  "detail": "Value is Null or Undefined.",
  "instance": "*"
}
```

### 3.2. `/errors/user/username-taken` 
Username was already taken by another user.

Returned by 
- [`POST '/add-user'`](#post-add-user)

```json
{
  "type": "/errors/user/username-taken",
  "title": "Username was already taken by another user.",
  "status": 400,
  "detail": "Username was already taken by another user.",
  "instance": "/add-user"
}
```

### 3.3. `/errors/no-users-found` 
No users could be found. 

Returned by 
- [`GET '/users'`](#get-users).

```json
{
  "type": "/errors/no-users-found",
  "title": "No users could be found.",
  "status": 404,
  "detail": "No users could be found.",
  "instance": "/users"
}
```

### 3.4. `/errors/user/user-not-found` 
User could not be found.

Returned by 
- [`GET '/user/:username'`](#get-userusername).

```json
{
  "type": "/errors/user/user-not-found",
  "title": "User could not be found.",
  "status": 404,
  "detail": "User could not be found.",
  "instance": "/users/:username"
}
```