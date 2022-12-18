# House of Games API

## Background

The aim of this project is to build an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service which should provide this information to the front end architecture.

This database is setup using PostgreSQL, and interactions to the database are through [node-postgres](https://node-postgres.com/).

The hosted version can be found on [this](https://nervous-windbreaker-wasp.cyclic.app/api) webpage.

## Instructions

Minimum reccommended versions are `v18` for Node.js and `v10` for PostgreSQL

### Installation

The following command will clone the project to a local machine:

```
git clone https://github.com/Iris314/nc-games-api.git
```

The needed dependencies can be installed using:

```
npm install
```

### Database set-up

To run the project locally, create a `.env.test` and `.env.development` file in the main folder. The module [dotenv](https://github.com/motdotla/dotenv#readme) can be used to load these into the `process.env` global object by inserting the following text with the corresponding database names each file.

```
PGDATABASE=insert_database_name_here
```

Following this, the local database can be created and seeded using the commands:

```
npm run setup-dbs
npm run seed
```

### Testing

Run the test files using the command:

```
npm test
```
