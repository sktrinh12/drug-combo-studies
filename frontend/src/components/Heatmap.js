import React from 'react';
import Plot from "react-plotly.js"

export default function Heatmap(props) {
  const data = props.data["z"];
  return (
    <div>
      <Plot
        data={[
          {
            z: data,
            type:'heatmap',
				    colorscale: 'YlGnBu',
				    reversescale: true
          }
        ]}

				layout={{
								title: 'Drug 1 vs Drug2 heatmap',
								xaxis: { ticks: '',
												 showticklabels: false,
												 title: 'Drug1'
												},
								yaxis: { ticks: '', 
												 showticklabels: false,
												 title: 'Drug2'
												},
								annotations: [
												{
																text: 'Max effect',
																x: 1.14,
																xref: 'paper',
																yref: 'paper',
																y: 1.05,
																showarrow: false
												},
												{
																text: 'No effect',
																x: 1.13,
																xref: 'paper',
																yref: 'paper',
																y: -0.05,
																showarrow: false
												}
																				]
								}}
      />
    </div>
  );
}
