import pdfplumber, re
import pandas as pd
from datetime import datetime
from transformer_all import transform_all

def process_dataframes(df, last=False, ano_atual=datetime.now().year):
    if last:
        if len(df.columns) == 4:
            df.columns = ['a', 'b', 'c', 'd']
            df_ = df[['a', 'b', 'c']]
        else:
            df.columns = ['a', 'b']
            df_ = df['a'].str.split(expand=True)
    else:
        mid_point = len(df.columns) // 2
        df1 = df.iloc[:, :mid_point]
        df2 = df.iloc[:, mid_point:]
        df1.columns = ['a', 'b', 'c']
        df2.columns = ['a', 'b', 'c']
        df2 = pd.concat([df1, df2])
        df_ = df2
        
    df_.columns = ['data', 'estabelecimento', 'valor']
    
    if df_['data'].str.contains('Comprasparceladas-próximasfaturas').any():
        df_ = df_.loc[:df_[df_['data'] == 'Comprasparceladas-próximasfaturas'].index[0] - 1]
    elif df_['data'].str.contains('Compr').any():
        df_ = df_.loc[:df_[df_['data'] == 'Compr'].index[0] - 1]
        
    df_['data'] = pd.to_datetime(df_['data'], format='%d/%m', errors='coerce')
    df_.dropna(subset=['data'], inplace=True)
    df_['data'] = df_['data'].apply(lambda d: d.replace(year=ano_atual) if pd.notnull(d) and d.year == 1900 else d)
    df_.reset_index(drop=True, inplace=True)
    df_['estabelecimento'] = df_['estabelecimento'].apply(lambda x: re.sub(r'[^a-zA-Z]', '', x))
    
    # df_['valor'] = df_['valor'].str.replace(',', '.')
    # df_['valor'] = df_['valor'].str.replace(' E', '')
    # df_['valor'] = df_['valor'].astype(float)
    # print(df_, df_['valor'].sum(), "\n")
    return df_

table_settings = {
    "vertical_strategy": "text",
    "horizontal_strategy": "text",
}

arq = "azul_10_2024"
mFim = 2

with pdfplumber.open(f"../data/{arq}.pdf") as pdf:
    tables = []
    
    # Recuperar número de páginas - Latam deve ser antepenúltima página / Azul deve ser penúltima página
    ini = 1
    fim = len(pdf.pages) - mFim

    if "latam" in str(pdf.path):
        fim -= 1
        
    for i in range(ini, fim):
        page = pdf.pages[i]
        tables.append(page.extract_table(table_settings))
        
    #definir confgs da ultima pagina
    ultima_pagina = pdf.pages[fim]
    print(ultima_pagina)
    last_table = ultima_pagina.extract_table(table_settings)
    last_table = process_dataframes(pd.DataFrame(last_table), last=True, ano_atual=2024)
    
    process_tables = []
    for table in tables:
        if table:
            process_tables.append(process_dataframes(pd.DataFrame(table), ano_atual=2024))
    
    process_tables.append(last_table)
    
    final_data = pd.concat(process_tables)
    
    final_data['valor'] = final_data['valor'].str.replace(',', '.')
    final_data['valor'] = final_data['valor'].str.replace(' E', '')
    final_data['valor'] = final_data['valor'].astype(float)
    final_data = final_data.groupby(['data', 'estabelecimento']).agg({'valor': 'sum'}).reset_index()
    final_data = final_data.sort_values(by='valor', ascending=False)
    # final_data = final_data[final_data['valor'] > 0]
    
    # Adicionar colunas de cores
    cores = [
        {'bg': 'rgba(255, 99, 132, 0.2)', 'border': 'rgba(255, 99, 132, 1)'},
        {'bg': 'rgba(54, 162, 235, 0.2)', 'border': 'rgba(54, 162, 235, 1)'},
        {'bg': 'rgba(255, 206, 86, 0.2)', 'border': 'rgba(255, 206, 86, 1)'},
        {'bg': 'rgba(75, 192, 192, 0.2)', 'border': 'rgba(75, 192, 192, 1)'},
        {'bg': 'rgba(153, 102, 255, 0.2)', 'border': 'rgba(153, 102, 255, 1)'},
        {'bg': 'rgba(255, 159, 64, 0.2)', 'border': 'rgba(255, 159, 64, 1)'}
    ]

    final_data['bg'] = [cores[i % 6]['bg'] for i in range(len(final_data))]
    final_data['border'] = [cores[i % 6]['border'] for i in range(len(final_data))] 
    final_data['mes'] = final_data['data'].dt.month.max() + 1 if mFim == 2 else final_data['data'].dt.month.max()
    
    
    final_data.reset_index(drop=True, inplace=True)
    print(final_data)
    final_data.to_json(f"../../public/data/{arq}.json", orient='records')
    transform_all()