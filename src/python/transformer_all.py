import pandas
import glob

def transform_all():
    path = '../../public/data/*.json'
    all_dfs = []
    cartao = 'azul'
    
    for file in glob.glob(path):
        if cartao in str(file) and 'all' not in str(file):
            df = pandas.read_json(file)
            all_dfs.append(df)
        else:
            print(f'File {file} not included')
        
        
    all_dfs = pandas.concat(all_dfs)
    all_dfs.reset_index(drop=True, inplace=True)
    
    all_dfs.to_json(f'../../public/data/all_{cartao}.json', orient='records')
    
if __name__ == "__main__":
    print('Transforming all data')