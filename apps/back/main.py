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
    return "aaa"
    
@app.get("/getOptionList")
def getOptionList():
    base_path = "./RCA"
    try:
        optionList = [name for name in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, name))]
        return {"optionList": optionList}
    except Exception as e:
        return {"error": str(e)}

@app.get("/read_csv")
def read_csv(filename: str = Query(...)):
    filepath = f"./RCA/{filename}/{filename}.csv"
    
    if not os.path.exists(filepath):
        return {"error": "File not found"}
    
    df = pd.read_csv(filepath)
    return df.to_dict(orient="records")
