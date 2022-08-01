# Northcoders House of Games API

## Background

The aim of this project is to build an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

This database will be PSQL, and interaction happens using [node-postgres](https://node-postgres.com/).

## Instructions

To run the prject locally, please create `.env.test` and `.env.development` files in the main folder. The module [dotenv](https://github.com/motdotla/dotenv#readme) can be used to load these into the `process.env` global object by using the following text with the corresponding database names inserted in each file.

```
PGDATABASE=insert_database_name_here
```
