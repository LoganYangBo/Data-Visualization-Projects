from flask import Flask, jsonify
import pandas as pd
import random


def pseudo_inference(test_data):
    '''
    note: the following codes are not real prediction!!!
    '''    
    pred_dates = [d.strftime('%Y/%m/%d') for d in pd.date_range('2021/05/27','2021/06/25')]
    #print(test_data['cases'])
    min_cases = min(test_data['cases'])
    max_cases = max(test_data['cases'])
    pred_cases = [random.randint(min_cases, max_cases) for i in range(30)]
    test_data['cases'] = test_data['cases'] + pred_cases
    test_data['dates'] = test_data['dates'] + pred_dates
    #convert the format
    res = []
    for d, c in zip(test_data['dates'], test_data['cases']):
        res.append({'date': d, 'cases': c})
    return jsonify(res)

def main():
    pass

if __name__ == '__main__':
    main()
