import json
import pandas as pd
from helper import *

df = pd.read_csv ("https://raw.githubusercontent.com/djwooten/synergy/master/datasets/sample_data_1.csv")

model = run_model(df, (0, 1), (0, 1), (0, 1), (0, 1))
print('generate data')
data = generate_model_data(df, model)
data = json.dumps(data, indent=4)

print(data)

print(''.join(['-']*10))
