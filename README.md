# jwt_rest_api_example

`jwt_rest_api_example` is an example of a simple secure CRUD rest-api on Node.JS + PostgreSQL with using Json Web Token technology.

# Installation
  - Clone the repository by using `git clone`.
  - Run `npm install` in the cloned directory.
  - Adding variables to your environment:
      - `DB_NAME=your_db_mame`
      - `DB_USER=your_postgres_user`
      - `DB_PASSWORD=your_password`
      - `DB_HOST=your_host`
      - `PORT=your_port_number`
      - `SECRET_KEY=your_secret_key`

# How to Run
```
pm2 start app.js
```
or
```
node app.js
```

## Endpoints
- **/user/registration** : 
    - Method: **POST**
      - Description: Create a new user.
      - Body: email, password, repeatPassword.
- **/user/login** :
    - Method: **POST**
      -  Description: Getting access and reresh tokens.
      -  Body: email, password.
- **/user/login** :
    - Method: **PUT**
      -  Description: Update access and reresh tokens.
      -  Authorization: Bearer *refresh_token*.
- **/user/secret** :
    - Method: **GET**
      -  Description: Entrance to the secret page.
      -  Authorization: Bearer *access_token*.
- **/user/logout** :
    - Method: **GET**
      -  Description: Logout and removing tokens.
      -  Authorization: Bearer *access_token*.

License
----

MIT