from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from fastapi.encoders import jsonable_encoder
import pandas as pd
import pandas.io.sql as sqlio
import psycopg2
from starlette.responses import StreamingResponse
from .helper import *
from .testdata import (
    generate_test_data,
    generate_test2_data,
    generate_test3_data,
    generate_test4_data,
    generate_test5_data,
)
from .ft_nbrs import ft_numbers
from .db import conn
from .schema import ModelInput

app = FastAPI()

origins = ["http://localhost:3000", "localhost:3000", "http://musyc.frontend.kinnate"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ddict = {}
dfdict = {}

df = pd.read_csv(
    "https://raw.githubusercontent.com/djwooten/synergy/master/datasets/sample_data_1.csv"
)
dfdict["dosedata"] = df
ddict["dosedata"] = json.loads(df.to_json())
df = pd.read_json("combo-data.json")
dfdict["combodata"] = df
df = pd.read_json("combo-data2.json")
dfdict["combodata2"] = df
df = pd.read_json("combo-data3.json")
dfdict["combodata3"] = df
with open("combo-data.json") as f:
    # ddict['combodata'] = json.load(f)
    dfdict["combodata"] = pd.read_json(f)
with open("combo-data3.json") as f:
    # ddict['combodata3'] = json.load(f)
    dfdict["combodata3"] = pd.read_json(f)

row_drugs, col_drugs = drug_list(conn)


@app.get("/", tags=["roots"])
async def read_root() -> dict:
    return {"message": "Welcome to your drug combo home endpoint"}


@app.get("/dosedata", tags=["fixed-data"])
async def get_dosedata() -> Response:
    return ddict["dosedata"]


@app.get("/combodata", tags=["fixed-data"])
async def get_combodata() -> Response:
    return ddict["combodata"]


@app.get("/v1/data/sql/{block_id}", tags=["dynamic-data"])
async def vis_model(drug1: str, drug2: str, block_id: int) -> Response:
    print(f"drug1: {drug1}\ndrgu2: {drug2}")
    if drug1 not in row_drugs:
        raise HTTPException(
            status_code=404, detail=f"That drug, {drug1} does not exist"
        )
    if drug2 not in col_drugs:
        raise HTTPException(
            status_code=404, detail=f"That drug, {drug2} does not exist"
        )
    dsql = exec_sql(drug1, drug2, block_id, conn)
    if dsql.shape[0] == 0:
        raise HTTPException(
            status_code=404, detail=f"That block id, {block_id} does not exist"
        )
    data = generate_model_data(dsql, (0, 1), (0, 1), (0, 1), (0, 1), False)
    return data


@app.get("/v1/data/files/{ft_nbr}", tags=["dynamic-data"])
async def tmp_model(ft_nbr: str) -> Response:
    if ft_nbr not in ft_numbers:
        raise HTTPException(
            status_code=404, detail=f"That FT number,{ft_nbr} does not exist"
        )
    print(ft_nbr)
    data = generate_model_data(
        dfdict["combodata3"], (0, 1), (0, 1), (0, 1), (0, 1), True
    )
    return data


@app.get("/v1/data/test/{ft_nbr}", tags=["fixed-data"])
async def test_model(ft_nbr: str) -> Response:
    if ft_nbr not in ft_numbers:
        raise HTTPException(
            status_code=404, detail=f"That FT number, {ft_nbr} does not exist"
        )
    print(ft_nbr)
    data = generate_test5_data()
    return data


@app.post("/v1/data/upload", tags=["dynamic-data"])
async def gen_model_from_file(model_input: ModelInput) -> Response:
    # print(model_input)
    model_input_dict = jsonable_encoder(model_input)
    df = pd.DataFrame(model_input_dict)
    df = df.rename(
        columns={
            "drug1_conc": "drug1.conc",
            "drug2_conc": "drug2.conc",
            "drug1_name": "drug1.name",
            "drug2_name": "drug2.name",
        }
    )
    print(df.head())
    data = generate_model_data(df, (0, 1), (0, 1), (0, 1), (0, 1), True)
    return data
