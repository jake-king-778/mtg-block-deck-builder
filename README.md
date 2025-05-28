# mtg-block-deck-builder


## Building

To run, first build the front end

```bash
cd frontend
npm run build
```

Then init the python virtualenv

```bash
cd backend
uv sync
```

Then either run through uv or activate the virtual environment
```bash
source .venv/bin/activate
```

Then run fast API to serve the build application!
```bash
fastapi run app/app.py
```

And then view the application at http://127.0.0.1:8000/index.html


## Running locally

Ideally, you should run the appication through webpack while interacting with the python 
backend.

These docs are tbd as we will need to actually have the front end hitting the backend 
before we can configure this through npm.

## Initializing the Database

First, download the all files .sql file here, make sure to select the postgres option:
https://mtgjson.com/downloads/all-files/


Then load up the dependent containers

```bash
docker-compose up
```

And load it into SQL (with psql or you may mount the file and load it up in the container)

```bash
psql -h localhost -p 5432 -U postgres -d postgres -f ~/Downloads/AllPrintings.psql
```

Last step, we need to load the standard dates which are probably(?) right.

```bash
cd backend/scripts/add_out_of_standard_dates
python add_out_of_standard_dates.py
```


## Run With docker-compose

First, move your AllPrintings.psql file to backend/scripts/db_init, then

```bash
docker-compose up --build --
```

Note: it will take forever for the database to set up the tables and fill with data.
