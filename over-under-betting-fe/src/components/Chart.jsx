import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const Chart = ({ data }) => {
    const svgRef = useRef(null);
    const [mousePosition, setMousePosition] = useState(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const line = d3
            .line()
            .x(d => x(d.timestamp))
            .y(d => y(d.price));

        x.domain(d3.extent(data, d => d.timestamp));
        y.domain(d3.extent(data, d => d.price));

        svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .call(d3.axisLeft(y));

        svg
            .append('g')
            .attr('transform', `translate(${margin.left},${height + margin.top})`)
            .call(d3.axisBottom(x).tickFormat('').tickSize(0));

        svg
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('d', line);

        const rect = svg
            .append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .on('mousemove', handleMouseMove)
            .on('mouseout', () => {
                setMousePosition(null);
            });

        svg.select('rect').lower();

        function handleMouseMove(event) {
            const [xCoord] = d3.pointer(event);
            const invertedX = x.invert(xCoord);
            const foundIndex = d3.bisector(d => d.timestamp).left(data, invertedX, 1);
            const d0 = data[foundIndex - 1];
            const d1 = data[foundIndex];
            const d = invertedX - d0.timestamp > d1.timestamp - invertedX ? d1 : d0;

            setMousePosition({ x: x(d.timestamp), y: y(d.price), price: d.price });
        }
    }, [data]);

    return (
        <svg ref={svgRef} width={400} height={350}>
            <g />
            {mousePosition && (
                <text x={mousePosition.x} y={mousePosition.y - 10} textAnchor="middle">
                    {mousePosition.price}
                </text>
            )}
        </svg>
    );
};

export default Chart;