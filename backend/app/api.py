from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import pandas as pd
from starlette.responses import StreamingResponse
from .helper import *
from .testdata import generate_test_data, generate_test2_data, generate_test3_data, generate_test4_data
from .ft_nbrs import ft_numbers

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

ddict = {}
dfdict = {}

df = pd.read_csv ("https://raw.githubusercontent.com/djwooten/synergy/master/datasets/sample_data_1.csv")
dfdict["dosedata"] = df
ddict['dosedata'] = json.loads(df.to_json())
df = pd.read_json("combo-data.json")
dfdict["combodata"] = df
with open("combo-data.json") as f:
    ddict['combodata'] = json.load(f)

@app.get("/", tags=["roots"])
async def read_root() -> dict:
    return {"message": "Welcome to your home endpoint"}


@app.get("/dosedata", tags=["fixed-data"])
async def get_dosedata() -> Response:
    return ddict["dosedata"]

@app.get("/combodata", tags=["fixed-data"])
async def get_combodata() -> Response:
    return ddict["combodata"]

@app.get("/v1/data/{ft_nbr}", tags=["dynamic-data"])
async def vis_model(ft_nbr: str) -> Response:
    if ft_nbr not in ft_numbers:
        raise HTTPException(status_code=404, detail=f"That FT number,{ft_nbr} does not exist")
    print(ft_nbr)
    data = generate_model_data(dfdict['combodata'], (0,1), (0,1), (0,1), (0,1))
    return data

@app.get("/v1/testdata/{ft_nbr}", tags=["fixed-data"])
async def test_model(ft_nbr: str) -> Response:
    if ft_nbr not in ft_numbers:
        raise HTTPException(status_code=404, detail=f"That FT number, {ft_nbr} does not exist")
    print(ft_nbr)
    data = generate_test4_data()
    return data
