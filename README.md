# Demo-Project for the key technology

## Running the application

### npm dev

Runs the app in the development mode.\
The page will reload when you make changes.

### npm run build

Builds the app for production to the `dist` folder.\

### npm run test

Run the playwright tests. Make sure to set the necessary environment variables before running the tests.

### npm run preview

Run the app in production mode (run `npm run build` first)

## Environment Variables

### .env

-   `VITE_GRAPHQL_URL`: The GraphQL-API-Endpoint
-   `TEST_SERVER_PORT`: The port on which the test server will run.

### .env.local

To successfully run the tests, create a `.env.local` file at the root of the project and add the following variables:

-   `TEST_PASSWORD`: The password the playwright tests will use.
-   `TEST_EMAIL`: The email address the playwright tests will use.

## Demo

There is currently a demo running at: https://thekey.coflnet.com
