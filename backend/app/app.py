import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware

from app.api.cards import router as cards_router
from app.api.sets import router as sets_router

app = FastAPI()

# TODO: make this configuration or at least put it in a folder called frontend on the docker image
if os.getenv("ENV") == "test":
    app.mount("/static", StaticFiles(directory="../dist/"), name="static")
else:
    app.mount("/static", StaticFiles(directory="../frontend/dist/"), name="static")
app.include_router(sets_router)
app.include_router(cards_router)

# TODO: need app config
if os.getenv("ENV") != "test":
    origins = [
        "http://localhost:8000",
        "http://localhost:5173",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
