import {
  geoIdentity,
  geoPath,
} from 'd3';
import { dataFilter } from './dataFilter';

const projection = geoIdentity().reflectY(false);
const path = geoPath(projection);

export const Marks = ({ UsaGeo, data, year, colorScale }) => {
  let dataMap = dataFilter(data, year);
  const states = new Map(UsaGeo[1].features.map(d => [d.id, d.properties.name]));
  
  projection.fitExtent(
    [
      [0, 0],
      [975, 500],
    ],
    UsaGeo[0]
  );
  return (
    <g className="marks">
      {UsaGeo[0].features.map((feature) => {
        return ( 
        	<path 
            className="border"
          	d={path(feature)} 
          	fill={colorScale(dataMap.get(feature.id)) ? 
                 colorScale(dataMap.get(feature.id)) :
                 "grey"}>
            <title>
              {feature.properties.name}, {states.get(feature.id.slice(0, 2))} 
              &#xA;{dataMap.get(feature.id)}
            </title>
          </path>
        )
      })}
      <path className="interiors" d={path(UsaGeo[2])} />
    </g>
  );
};
