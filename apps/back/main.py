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
    filepath = f"./data/world/World.csv"
    if not os.path.exists(filepath):
        return {"error": "File not found"}
    
    df = pd.read_csv(filepath)
    print("a")
    return df.to_dict(orient="records")
    #return {"message": "Welcome to the FastAPI application!"}
    
@app.get("/get_folders")
def list_folders():
    base_path = "./data"
    try:
        folders = [name for name in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, name))]
        print(folders)
        return {"folders": folders}
    except Exception as e:
        return {"error": str(e)}

@app.get("/read_csv")
def read_csv(filename: str = Query(...)):
    print("./data/"+filename+"/"+filename+".csv")
    filepath = f"./data/{filename}/{filename}.csv"
    
    if not os.path.exists(filepath):
        return {"error": "File not found"}
    
    df = pd.read_csv(filepath)
    return df.to_dict(orient="records")
