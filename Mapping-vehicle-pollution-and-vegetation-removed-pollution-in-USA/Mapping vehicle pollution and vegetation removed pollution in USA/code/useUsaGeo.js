import React, { useState, useEffect } from 'react';
import { json } from 'd3';
import { feature, mesh } from 'topojson';

const jsonUrl =
  'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json';

export const useUsaGeo = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    json(jsonUrl).then(topology => {
      const { counties } = topology.objects;
      const { states } = topology.objects;
      setData([
        feature(topology, counties),
        feature(topology, states),
        mesh(topology, states, (a, b) => a !== b)
      ]);
    });
  }, []);

  return data;
};
