import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Chart = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleTime()
      .range([0, width]);

    const y = d3.scaleLinear()
      .range([height, 0]);

    const line = d3.line()
      .x(d => x(d.timestamp))
      .y(d => y(d.price));

    x.domain(d3.extent(data, d => d.timestamp));
    y.domain(d3.extent(data, d => d.price));

    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(y));

    svg.append('g')
      .attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(x));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('d', line);
  }, [data]);

  return (
    <svg ref={svgRef} width={400} height={300}>
      <g />
    </svg>
  );
};

export default Chart;