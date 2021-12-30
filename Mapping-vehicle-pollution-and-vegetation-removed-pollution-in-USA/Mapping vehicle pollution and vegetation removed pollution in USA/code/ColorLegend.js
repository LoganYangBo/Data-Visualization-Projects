import React from 'react';
import { interpolateRdYlBu } from 'd3';

const legendScale = d3.scaleLinear()
    .domain([0, 19])
    .range([0, 200]);

export const ColorLegend = () => (
  <g transform={`translate(630, 15)`}>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop
          offset="0%"
          style={{ stopColor: interpolateRdYlBu(1), stopOpacity: 1 }}
        />
        <stop
          offset="25%"
          style={{ stopColor: interpolateRdYlBu(0.75), stopOpacity: 1 }}
        />
        <stop
          offset="50%"
          style={{ stopColor: interpolateRdYlBu(0.5), stopOpacity: 1 }}
        />
        <stop
          offset="75%"
          style={{ stopColor: interpolateRdYlBu(0.25), stopOpacity: 1 }}
        />
        <stop
          offset="100%"
          style={{ stopColor: interpolateRdYlBu(0), stopOpacity: 1 }}
        />
      </linearGradient>
    </defs>
    <text font-size="10">PM2.5 Concentration</text>
    <rect width="200" height="15" y="2" fill="url(#grad1)" />
    <g fill="none" font-size="10" font-family="sans-serif" text-anchor="middle">
      <g class="tick" opacity="1" transform={`translate(${legendScale(0)},1)`}>
        <line stroke="black" y2="24"></line>
        <text fill="currentColor" y="26" dy="0.71em">
          0
        </text>
      </g>
      <g class="tick" opacity="1" transform={`translate(${legendScale(5)},1)`}>
        <line stroke="black" y2="24"></line>
        <text fill="currentColor" y="26" dy="0.71em">
          5
        </text>
      </g>
      <g class="tick" opacity="1" transform={`translate(${legendScale(10)},1)`}>
       	<line stroke="black" y2="24"></line>
        <text fill="currentColor" y="26" dy="0.71em">
          10
        </text>
      </g>
      <g class="tick" opacity="1" transform={`translate(${legendScale(15)},1)`}>
        <line stroke="black" y2="24"></line>
        <text fill="currentColor" y="26" dy="0.71em">
          15
        </text>
      </g>
    </g>
  </g>
);
