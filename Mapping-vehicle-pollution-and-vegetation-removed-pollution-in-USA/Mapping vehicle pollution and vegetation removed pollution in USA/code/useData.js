import React, { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl = 'https://gist.githubusercontent.com/georgeeeee/0342e8e427e75c369d5981550dd4b83c/raw/ea121927ead3ce1fb41dabcb7395fb1eaa6dda0d/pm2.5ByCounty.csv';

export const useData = () => {
	const [data, setData] = useState(null);
  
  useEffect(() => {
    let max = 0;
    let min = 20;
    
    const row = d => {
      for (const property in d) {
      	if (property === "id")
          continue;
        if (+d[property] > max) {
        	max = +d[property];
        }
        if (+d[property] < min) {
        	min = +d[property];
        }
      }
    	return d;
    }
  	csv(csvUrl, row).then((res) => {
      res.max = max;
      res.min = min;
      setData(res);
    });
  }, []);
  
  return data;
}