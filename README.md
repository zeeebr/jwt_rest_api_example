# jwt_rest_api_example

`jwt_rest_api_example` is an example of a simple secure CRUD rest-api on Node.JS + PostgreSQL with using Json Web Token technology.

# Installation
  - Clone the repository by using `git clone`.
  - Run `npm install` on the cloned directory.
  - Create `.env` file following the example from `/.env.example`
  - Create PostgreSQL database and user with data as in a `.env` file

# How to Run
```
node app.js
```
I would recommend using at the `pm2` for running on a production server.

## Endpoints
- **/user/registration** : 
    - Method: **POST**
      - Description: Create a new user.
      - Body: email, password.

   

License
----

MIT