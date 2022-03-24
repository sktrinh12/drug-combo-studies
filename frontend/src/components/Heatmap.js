import React from 'react';
import Plot from "react-plotly.js"

export default function Heatmap(props) {
  return (
    <div>
      <Plot
        data={[
          {
            z: props.data["z"],
            type:'heatmap',
				    colorscale: 'YlGnBu',
				    reversescale: true
          }
        ]}

				layout={{
								title: 'Drug 1 vs Drug2 heatmap',
								xaxis: { 
												 tickmode: 'array',
												 tickvals: props.data["xticks"],
												 ticktext: props.data["xticklabels"].map((e) => (e.replace(/[${}]/gi, ''))),
												 title: 'log(Drug1)'
												},
								yaxis: { 
												 tickmode: 'array',
												 tickvals: props.data["yticks"], 
												 ticktext: props.data["yticklabels"].map((e) => (e.replace(/[${}]/gi, ''))),
												 title: 'log(Drug2)'
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
