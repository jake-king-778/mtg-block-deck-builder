# mtg-block-deck-builder

## Getting the Datatbase Files

First, download the all files .sql file here, make sure to select the postgres option:
https://mtgjson.com/downloads/all-files/

Place this file in backend/scripts/db_init/

## Building

It is all built through docker so you can just run

```bash
docker-compose up
```

And view the page at ip:8000/static/index.html, note: database will take a long time to initialize
if its your first time.

## Running locally

Get the database running (this will take a long term if its your first time)

```
docker-compose up database
```

Run the backend in one terminal:

```bash
fastapi dev app/app.py
```

Run webpack in a different terminal

```bash
npm run vite
```

View the website at http://localhost:5173/static/
