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
fastapi dev main.py
```

And then view the application at http://127.0.0.1:8000/index.html


## Running locally

Ideally, you should run the appication through webpack while interacting with the python 
backend.

These docs are tbd as we will need to actually have the front end hitting the backend 
before we can configure this through npm.