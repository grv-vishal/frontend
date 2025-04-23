import React from 'react';
import Plot from 'react-plotly.js';


export const LoadGraph = ({load}) => {

    const times = load.map((dataPoint) => dataPoint.timestamp)
    const values = load.map((dataPoint) => parseFloat(dataPoint.values));  // Convert string to float
    const maxValue = Math.max(...load.map((entry) => entry.values));
    const yRange = [0, Math.max(10, maxValue + 50)]; 
    
    return (
        <Plot
          data={[
            {
                x: times,  
                y: values,  
                type: 'scattergl',
                mode: 'lines+markers',
                name: 'Actual',  
                marker: { color: 'blue' },
                line: { shape: 'linear' },
            },
  
          ]}
          layout={{
            autosize: true,
            title: 'Load Consumption',
            xaxis: {
              title: 'Time',
              type: 'category',  
            },
            yaxis: {
              title: 'energy (KWh)',
              range: yRange,  
              fixedrange: true
            },
            dragmode: 'pan',  
            legend: {
              x: 1,         
              y: 1.1,        
              xanchor: 'right',
              yanchor: 'top',
            },  
          }}
          useResizeHandler
          config={{
            scrollZoom: true,  
            responsive: true,  
          }}
    
          style={{ width: '100%', height: '100%' }}
        />
      );
  
  
   };