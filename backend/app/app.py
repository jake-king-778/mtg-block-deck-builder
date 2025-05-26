from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api.sets import router as sets_router

app = FastAPI()

app.mount("/static", StaticFiles(directory="../frontend/dist/"), name="static")
app.include_router(sets_router)
