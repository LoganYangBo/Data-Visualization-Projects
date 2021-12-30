# Author: Rui Li <li.8950@osu.edu>
# License: MIT
# Copyright: Rui Li
# Date: 10/03/2021

from flask import Flask, render_template, request

import json
import os

from models import CasePrediction

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_pred_data', methods = ['POST'])
def get_pred_data():
    data_str = request.form.get('data')
    data_dic = json.loads(data_str)
    predition = CasePrediction.pseudo_inference(data_dic)
    print(predition)
    return predition
    

if __name__ == '__main__':
    app.run(debug = True)