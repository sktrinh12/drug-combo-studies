from matplotlib import pyplot as plt
from .musyc.combinations.musyc import MuSyC
from .musyc.utils import plots, dose_tools
import pandas as pd
# from musyc.combinations.musyc import MuSyC
# from musyc.utils import plots, dose_tools


# def run_model(df,
#               e0_bounds,
#               e1_bounds,
#               e2_bounds,
#               e3_bounds):

#     print('model running...')

#     model = MuSyC(e0_bounds,
#                   e1_bounds,
#                   e2_bounds,
#                   e3_bounds)

#     model.fit(df['drug1.conc'],
#              df['drug2.conc'],
#              df['effect'],
#              bootstrap_iterations=100)

#     return model

# def visualise_model(df, model, type):
#     print(f'plotting {type}')
#     d1 = df['drug1.conc']
#     d2 = df['drug2.conc']
#     E = model.E(d1, d2)
#     if type == "heatmap":
#         return plots.plot_heatmap(d1, d2, xlabel='Drug1', ylabel='Drug2', E=E)
#     elif type == "3dsurface":
#         return plots.plot_surface_plotly(d1, d2, xlabel='Drug1', ylabel='Drug2', E=E, scatter_points=df)

# def generate_specific_model_data(df, model, type):
#     print(f'generating data for {type}')
#     d1 = df['drug1.conc']
#     d2 = df['drug2.conc']
#     E = model.E(d1, d2)
#     if type == "heatmap":
#         data = plots.generate_heatmap_data(d1, d2, E=E)
#     elif type == "3dsurface":
#         data = plots.generate_3dsur_data(d1, d2, E=E, scatter_points=df)
#     return data

def generate_model_data(df,
                        e0_bounds,
                        e1_bounds,
                        e2_bounds,
                        e3_bounds):
    print('model running...')

    d1 = df['drug1.conc']
    d2 = df['drug2.conc']
    eff = df['effect']

    model = MuSyC(E0_bounds=e0_bounds,
                  E1_bounds=e1_bounds,
                  E2_bounds=e2_bounds,
                  E3_bounds=e3_bounds)

    model.fit(d1, d2, eff, bootstrap_iterations=100)

    E = model.E(d1, d2)
    print('generate data from model...')
    data = plots.generate_3dsur_data(d1, d2, E=E, scatter_points=df)
    params = model.get_parameters(confidence_interval=95)
    # print(params)
    # print(''.join(['-']*10))
    summary = model.summary(confidence_interval=95)
    # print(summary)
    data = { **data, **params }
    data["summary"] = summary
    return data

def exec_sql(drug1, drug2, block_id, conn):
    cur = conn.cursor()
    query = f"""SELECT BLOCK_ID,
                       CONC_ROW,
                       CONC_COL,
                       RESPONSE
                FROM DRUG_COMBO_DATA
                WHERE DRUG_ROW = '{drug1}'
                AND DRUG_COL = '{drug2}'"""
    cur.execute(query)
    names = [x[0] for x in cur.description]
    data = cur.fetchall()
    cur.close()
    data = pd.DataFrame(data, columns=names)
    data.columns = ['block_id', 'drug1.conc', 'drug2.conc', 'effect']
    if block_id not in data['block_id']:
        return pd.DataFrame()
    data = data[data['block_id'] == block_id]
    data = data[['drug1.conc', 'drug2.conc', 'effect']]
    zero_conc = data[(data['drug1.conc'] == 0) & (data['drug2.conc'] == 0)]['effect'].item()
    data['effect'] = data['effect'].apply(lambda x: round(x/zero_conc, 5))
    data['effect'] = pd.to_numeric(data['effect'])
    data['drug1.conc'] = pd.to_numeric(data['drug1.conc'])
    data['drug2.conc'] = pd.to_numeric(data['drug2.conc'])
    return data

def drug_list(conn):
    cur = conn.cursor()
    query = """
            SELECT DISTINCT DRUG_{0}
            FROM DRUG_COMBO_DATA
            """
    cur.execute(query.format('ROW'))
    row_drugs = cur.fetchall()
    row_drugs = [d[0] for d in row_drugs]
    cur.execute(query.format('COL'))
    col_drugs = cur.fetchall()
    col_drugs = [d[0] for d in col_drugs]
    cur.close()
    return row_drugs, col_drugs
