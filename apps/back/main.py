from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {"message": "Welcome to the FastAPI application!"}

@app.get("/read_csv")
def read_csv(filename: str = Query(...)):
    filepath = f"./csv/{filename}"
    
    if not os.path.exists(filepath):
        return {"error": "File not found"}
    
    df = pd.read_csv(filepath)
    return df.to_dict(orient="records")
