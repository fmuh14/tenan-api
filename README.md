[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# tenan-api
How to run tenan-api locally :
1. move to tenan-api folder
```
$ cd tenan-api
```
2. run NPM install
```
$ npm install
```
3. Edit the environment variable in .env file
```
PORT: The port number on which the server will listen for incoming requests. In this case, it is set to 8080.

ACCESS_TOKEN_SECRET: The secret key used for generating and verifying access tokens. It is a long, randomly generated string that helps ensure the security of the tokens.

REFRESH_TOKEN_SECRET: The secret key used for generating and verifying refresh tokens. Similar to the access token secret, it is a long, randomly generated string used for token security.

DB_CLIENT: The database client or driver being used to connect to the database. In this case, it is set to mysql2, indicating the MySQL database client.

DB_USERNAME: The username used to authenticate and connect to the database. In this case, it is set to 'root', which is a commonly used default username for MySQL.

DB_PASSWORD: The password used to authenticate and connect to the database. It is currently empty, which might indicate that no password is required or that it will be entered separately during the setup process.

DB_DATABASE: The name of the database being accessed. In this case, it is set to 'tenan_database', suggesting that the application interacts with a database with this name.

DB_PORT: The port number on which the database is running. For MySQL, the default port is 3306.

DB_HOST: The hostname or IP address where the database server is located. In this case, it is set to '127.0.0.1', which is the loopback address commonly used to refer to the local machine.

URL_ML_HOTEL: The URL for the machine learning (ML) model's endpoint that predicts hotel-related information. It points to 'https://flask-model-ml-jryqok5x7a-et.a.run.app/api/predictHotel'. You can also use localhost too by running the model-deployment service.

URL_ML_TOURISM: The URL for the ML model's endpoint that predicts tourism-related information. It points to 'https://flask-model-ml-jryqok5x7a-et.a.run.app/api/predictTourism'. You can also use localhost too by running the model-deployment service.
```
4. Create database and tables from database/database.sql 
5. run NPM run start-dev
```
$ npm run start-dev
```

## Tenan API Documentation
__Swagger__ : [here](https://github.com/C23-PC620/tenan-api-swagger#how-to-open-swagger-ui) <br>
__Postman Collection__ : [here](https://www.postman.com/martian-meadow-395608/workspace/tenan-capstone-project-c23-pc620/collection/26683223-4e9cd0b8-56ac-46f4-8865-d411513cdabd?action=share&creator=26683223) <br>
\* For Postman Collection, you need to change the environment to Tenan. [See here](https://learning.postman.com/docs/sending-requests/managing-environments/#selecting-an-active-environment) for tutorial.

# model-deployment
How to run model-deployment locally :
1. move to model-deployment folder
```
$ cd model-deployment
```
2. install requirements.txt using pip
```
$ pip install -r requirements.txt
```
3. run the main.py
 ```
$ python main.py
```

## Model Deployment Testing
__Postman Documentation__ : [here](https://documenter.getpostman.com/view/26683223/2s93shz9T6) <br>
__Postman Collection__ : [here](https://www.postman.com/martian-meadow-395608/workspace/tenan-capstone-project-c23-pc620/collection/26683223-4e9cd0b8-56ac-46f4-8865-d411513cdabd?action=share&creator=26683223)

