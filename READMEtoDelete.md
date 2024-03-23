# Task manager project

### Project created by **_Einav Kohavi_**

#### Welcome to **Task manager**!<br>

In here I will describe the purpose and funcionalities of the project and demonstrate how to use the API it provides.

#### Goal:

> The project's goal was to build a Personal Task Manager API.<br>
> This API serves as the backend for a task management application, allowing users to create, read, update, and > delete tasks, as well as getting information about the objects available to view and manage.

#### Environments, libraries and technologies used:

> The application is built using:
>
> - `Visual Studio Code` for writing the code and files
>
> - `NodeJS` as the base runtime environment
>
> - `Express.js` as the server framework
>
> - `Mongoose` for MongoDB interactions
>
> - `Bcrypt` for hash functionalities
>
> - `JWT (JSON Web Tokens)` for authentication and authorization

#### Requirments:

> To use the API you will need:<br>
>
> - `Visual Studio Code` for running the app
>
> - `MongoDB Compass` and `mongod.exe` to run the server and database
>
> - `Postman` to send requests and connect to the API's routers.

<br><br>

---

## Important notes:

#### When first downloading the project's files, don't forget to:<br>

> - Create `node_modules` folder using:
>
> > ```sh
> > npm install
> > ```

<br>

> - Install required packages for the API to run (Express.js, Mongoose, Bcrypt, JWT, and Dotenv).<br>
>   To do this, use:
>
> > ```sh
> > npm i express mongoose bcrypt jsonwebtoken dotenv
> > ```

<br>

> - Run the built in `create_env` function located in the `package.json` file.<br>
>   This function copies the nessecary global variables for the API into an `.env` file by using `myENV.env` file.<br>
>   The function performs:
>
> > ```json
> > "create_env": "copy myENV.env .env"
> > ```
>
> **Important!** If you are using linux, change copy to cp like this:
>
> > ```json
> > "create_env": "cp myENV.env .env"
> > ```
>
> Do this by using:
>
> > ```sh
> > npm run create_env
> > ```

<br>

> - Run the built in `resetDB` function to start and when you want to reset the database to defaults.<br>
>   The function performs:
>
> > ```json
> > "resetDB": "node resetDB",
> > ```
>
> Do this by using:
>
> > ```sh
> > npm run resetDB
> > ```

### The app includes comments in every file explaining the logics behind every line.

<br>

---

## resetDB - Reset database to default file

> This file includes a function to reset the database to default users and tasks.<br>
> resetDB is not connected to the main app and connects to the database individually.
>
> > Step by explanation of the functionality of resetDB:
> >
> > - Individually uses the database global variables from the `.env` file to connect to the database.
> >
> > - Creates three default users and six default tasks (two for each user).
> >
> > - Deletes all users from User schema and inserts the newly created ones.
> >
> > - Deletes all tasks from Task schema and inserts the newly created ones.
> >
> > - Disconnects from the database.

<br>

---

## db.js - Database connection file

> This file is used to create the connection to the `MongoDB` database.<br>
> It performs all connction functions by using `Mongoose` appliances.
> db.js includes two functions inside it:
>
> > - `connect:` The function uses the database global variables from the `.env` file to connect the app to the API's `MongoDB` database.<br>
> >   Connects to the API's database and provides a success message or error message in the app's console.
> >
> > - `disconnect:` This function simply disconnects the app from the API's `MongoDB` database.<br>
> >   Provides a success message in the app's console.

<br>

---

## Index.js - Main app file

> This file serves as the main file to run the API app.<br>
> It connects to the database using `db.js` and uses all routes created in the app's code.<br>
> Index.js also imports `require("dotenv").config();` to allow all files in the app use the global variables from the `.env` file.

<br>

---

## authenticate.js - Authentication middleware file

> The authenticate middleware is used to verify JWT tokens for user authentication before accessing any protected route in the API.
>
> > Step by step explanation of the functionality of the middleware:
> >
> > - Collects the authentication data from the headers (Token).
> >
> > - If a token was not found in the header, returns `Invalid token` message to the user.
> >
> > - Checks validity of the token (has to be of type bearer and contain a token body). Returns `Invalid token` message if not.
> >
> > - Checks if the token matches the API's secret key global variable using `JWT's` verify function.
> >
> > - If all validations check out, provides the requesting user with authorization to perform the actions requested.

---

<br>

## assistFunctions.js - validation assist functions file

> The assist functions file includes the validation functions for emails, usernames and passwords.
>
> - `isValidEmail:` This function checks if the given email string does not include spaces, includes an at character ('@') and a domain ending (e.g: '.com').
>
> - `isValidUsername:` This function checks if the given username string is at least 5 characters long and does not include spaces or capital letters.
>
> - `isValidPassword:` This function checks if the given password string is at least 5 characters long, does not include spaces, includes at least one capital letter and one number.
>
> #### All these functions return a boolean and are used when registering a new user.

<br>

---

## API models

### `Users:`

> User properties:
>
> - `Email` : Mandatory and unique
> - `Username` : Manadatory and unique
> - `Password` : Mandatory
>
> All defined as type string and are mandatory when creating users.
> Unique means these properties can't be repeated again for other users in the schema.

### `Tasks:`

> Task properties:
>
> - `Title` : Mandatory
> - `Category` : Mandatory
> - `Description`
> - `Due date`
> - `Status` : Mandatory
> - `User ID`
>
> All defined as type string except for User ID which is an object.<br>
> Mandatory properties are required when creating a new task.
> Holds user ID to provide task owner information. Used for request authorization.

<br>

---

## Routers

#### All routers return json messages as responses.

#### Every possible scenario (either syntax error, authorization, validation, server errors etc) are caught using try catch blocks to provide the user with relevant messages and information.

<br>

### `usersRoutes.js:` Users router

####

> The users router provides routes performing different actions for the app's users:
>
> - `Show all users:` Get request to show all existing users in the database **(excludes password for security)**.
>
> - `Show user by username:` Get request to show specific user by requested username **(excludes password for security)**.<br>
>   Possible results:
>
>   - User is found - Provides `User is found` message and displays found user.
>   - User not found - Provides `User not found` message.
>
> - `Show user by email:` Get request to show specific user by requested email **(excludes password for security)**.<br>
>   Possible results:
>
>   - User is found - Provides `User is found` message and displays found user.
>   - User not found - Provides `User not found` message.
>
> - `User registration:` Post request to create a new user.<br>
>   This request requires the user to provide all user properties (Email, Username, Password).<br>
>   The functions inside the request perform:<br>
>
>   - Check requested user properties for existing users with the same username or email (searching User schema in the database).<br>
>     Returns relevant message if any of them are not available.
>   - Check username, email and password for valid formats (using `assistFunctions.js` file containing the validation functions).
>     Returns relevant message if any of them are not valid.
>   - Hash the given password using `bcrypt` for user privacy.
>   - Create the new user, add it to the User schema in the database
>   - Return `User created` message and the user details.
>
> - `User login:` Post request to log in existing user.<br>
>   This request requires the user to provide username OR email and password.<br>
>   The functions inside the request perform:<br>
>   - Check if no username or email are provided. If so, returns a message asking to provide any.
>   - Check if both username and email are provided. If so, returns a message asking to provide only one of them.
>   - Check if no password is provided. If so, returns a message asking to provide one.
>   - If email is provided, checks if email is of an existing user.
>   - If username is provided, checks if username is of an existing user.
>   - Check if provided password matches user with given property.
>   - If password checks out, provide the user with a token holding the username and user id (using `JWT`), used for request authorizations.
>   - Return `Login successful` message and the token.

<br>

### `tasksRoutes.js:` Tasks router

> The tasks router provides routes performing different actions for tasks:
>
> - `Show all user's tasks:` Get request to show all of the user's existing tasks from the Task schema.<br>
>   This request compares user ID and tasks' owner ID.<br>
>   Possible results:
>
>   - User's tasks displayed - If Task schema contains tasks that belong to the user, displays all found tasks.
>   - No tasks displayed - If no user's tasks are found, displays `You do not have any tasks` message.
>
> - `Create a new task:` Post request to create a new task for the current user.<br>
>   This request requires the user to provide all mandatory task properties (Title, Category, Status).<br>
>   The user can also provide description and due date, but it is not a must.<br>
>   The functions inside the request perform:<br>
>
>   - Collect all properties provided by the user.
>   - Tries to create the new task with provided properties and add it to the Task schema. If mandatory properties are not provided, returns an error message asking to provide them.
>
> - `Update an existing task:` Patch request to update an existing task.<br>
>   This request requires the user to provide the task ID and the property or properties he wishes to update.<br>
>   The user can provide one, few, or all properties and has to be the task owner.<br>
>   The functions inside the request perform:<br>
>
>   - Find task ID provided inside Task schema. If the ID was not found, return `Task not found` message to the user.
>   - If the task is found, check if the task owner is the user requesting to update it
>   - If the task belongs to a different user, return `You are not authorized to update this task` message to the user.
>   - Collect all properties from the request body (all properties are collected, even if not provided).
>   - Change task properties to provided properties (if a property was not provided, current property is kept).
>   - Save updated task with new properties into the schema.
>   - Return `Task updated` message to the user and the updated task details.
>
> - `Delete an existing task:` Delete request to delete an existing task from the Task schema.<br>
>   This request requires the user to provide a task ID.<br>
>   The user has to be the task owner.<br>
>   The functions inside the request perform:<br>
>
>   - Find task ID provided inside Task schema. If the ID was not found, return `Task not found` message to the user.
>   - If the task is found, check if the task owner is the user requesting to update it
>   - If the task belongs to a different user, return `You are not authorized to delete this task` message to the user.
>   - Delete the task from the Task schema, using the ID provided from the user.
>   - Return `Task deleted` message to the user and the deleted task details.

<br>

### `statusFilterRoute.js:` Filter tasks by status router

> The filter by status router provides a route to filter all user's tasks by the provided status:
>
> - `Filter tasks by status:` Get request to display all user's tasks with the status provided by the user.<br>
>   This request requires the user to provide a status to filter tasks by.<br>
>   The functions inside the request perform:<br>
>
>   - Collect the status to filter by, provided by the user.
>   - Find all user's tasks with the provided status in the Task schema.
>   - If no tasks with the provided status were found, return a `You do not have any ${status} tasks.` message to the user.
>   - Return a message including all user's tasks with the status provided.

<br>

### `categoryFilterRoute.js:` Filter tasks by category router

> The filter by category router provides a route to filter all user's tasks by the provided category:
>
> - `Filter category by status:` Get request to display all user's tasks with the category provided by the user.<br>
>   This request requires the user to provide a category to filter tasks by.<br>
>   The functions inside the request perform:<br>
>
>   - Collect the category to filter by, provided by the user.
>   - Find all user's tasks with the provided category in the Task schema.
>   - If no tasks with the provided category were found, return a `You do not have any ${category} tasks.` message to the user.
>   - Return a message including all user's tasks with the category provided.

<br>

---

## Examples of usage in Postman

### Body syntaxes:

> #### User login:
>
> ```json
> {
>   "email": "testemail@gmail.com", //Can be replaced with "username"
>   "password": "Password123"
> }
> ```

<br>

> #### User registration:
>
> ```json
> {
>   "email:": "newuser@gmail.com",
>   "username": "newuser",
>   "password": "passPASS123"
> }
> ```

<br>

> #### Task creation or update:
>
> ```json
> {
>   "title": "Task title", // Required string
>   "category": "category", // Required string
>   "description": "Description text", // String
>   "dueDate": "12.12.2024 8:00 PM", // String
>   "status": "completed" // Required string
> }
> ```

<br>

---

<br>

### Request screenshots:

<br>

#### Displaying all users

> ![All users](./resources/AllUsers.png "Displaying all users")

<br>

#### Finding user by username

> ![User by username](./resources/UserByUsername.png "Finding user by username")

<br>

#### Finding user by email

> ![User by email](./resources/UserByEmail.png "Finding user by email")

<br>

#### User login:

> ##### Using email
>
> ![Email login](./resources/LoginEmail.png "Login with email")

<br>

> ##### Using username
>
> ![Username login](./resources/LoginUsername.png "Login with username")

<br>

> ##### Username not found
>
> ![Login username not found](./resources/LoginUsernameNotFound.png "Login username not found")

<br>

> ##### Email not found
>
> ![Login email not found](./resources/LoginEmailNotFound.png "Login email not found")

<br>

> ##### Wrong password
>
> ![Login wrong password](./resources/LoginWrongPassword.png "Login wrong password")

<br>

> ##### Email or username not provided
>
> ![Login no email](./resources/LoginNoEmail.png "Login no email")

<br>

> ##### Password not provided
>
> ![Login no password](./resources/LoginNoPassword.png "Login no password")

---

<br><br>

#### User registration:

> ##### Success
>
> ![Register success](./resources/RegisterSuccess.png "Register success")

<br>

> ##### Email Already exists
>
> ![Register email taken](./resources/RegisterEmailTaken.png "Register email taken")

<br>

> ##### Username already exists
>
> ![Register username taken](./resources/RegisterUsernameTaken.png "Register username taken")

<br>

> ##### Invalid email
>
> ![Register invalid email](./resources/RegisterEmailInvalid.png "Register invalid email")

<br>

> ##### Invalid username
>
> ![Register invalid username](./resources/RegisterUsernameInvalid.png "Register invalid username")

<br>

> ##### Invalid password
>
> ![Register invalid password](./resources/RegisterPasswordInvalid.png "Register invalid password")

---

<br><br>

#### Inserting token

> ![Inserting token](./resources/InsertingToken.png "Inserting token")

---

<br><br>

#### Tasks:

> ##### Displaying all user tasks
>
> ![Displaying all tasks](./resources/AllTasks.png "All tasks")

<br>

> ##### No tasks to show
>
> ![No tasks to show](./resources/NoTasks.png "No tasks")

<br>

> ##### Find tasks by status
>
> ![Displaying tasks by status](./resources/CompletedTasks.png "Tasks by status")

<br>

> ##### Find tasks by category
>
> ![Displaying tasks by category](./resources/TodoTasks.png "Tasks by category")

<br>

> ##### Creating a new task
>
> ![Creating a new task](./resources/newTask.png "New task")

<br>

> ##### Creating a new task - required properties only
>
> ![Creating a new task minimally](./resources/newTaskMinimal.png "New task minimal")

<br>

> ##### Updating a task
>
> ![Updating a task](./resources/TaskUpdated.png "Task update")

<br>

> ##### Updating a task - One property only
>
> ![Updating a task](./resources/TaskUpdatedMinimal.png "Task update")

<br>

> ##### Deleting a task
>
> ![Deleting a task](./resources/TaskDeleted.png "Task delete")

---

<br><br>

#### Token and authorization errors:

> ##### Invalid token
>
> ![Invalid token](./resources/InvalidToken.png "Invalid token")

<br>

> ##### Unauthorized to update task
>
> ![Unauthorized to update task](./resources/TaskNoUpdate.png "Unauthorized update")

<br>

> ##### Unauthorized to delete task
>
> ![Unauthorized to delete task](./resources/TaskNoDelete.png "Unauthorized delete")

<br>

---

# Thank you for viewing my project and giving feedback! c:

---
