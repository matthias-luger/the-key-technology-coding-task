# Demo-Project for the key technology

## Running the application

### npm dev

Runs the app in the development mode.\
The page will reload when you make changes.

### npm run build

Builds the app for production to the `dist` folder.\

### npm run test

Run the playwright tests.

### npm run preview

Run the app in production mode.

## Environment Variables

### .env

-   `VITE_GRAPHQL_URL`: The GraphQL-API-Endpoint

### .env.local

To successfully run the tests, create a `.env.local` file at the root of the project and add the following variables:

-   `TEST_PASSWORD`: The password the playwright tests will use.
-   `TEST_EMAIL`: The email address the playwright tests will use.
-   `TEST_SERVER_PORT`: The port on which the test server will run. The default value is 3000.
