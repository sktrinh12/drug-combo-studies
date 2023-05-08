import React from 'react'
import Plotly from 'plotly.js/lib/core'
import createPlotlyComponent from 'react-plotly.js/factory'
const Plot = createPlotlyComponent(Plotly)

export default function SingleDRC(props) {
  const d1 = props.data['d1_conc']
  const d2 = props.data['d2_conc']
  const E1 = props.data['d1_effect']
  const E2 = props.data['d2_effect']
  // console.log(d1)
  // console.log(d2)
  // console.log(E1)
  // console.log(E2)

  return (
    <div>
      <Plot
        data={[
          {
            x: d1,
            y: E1,
            mode: 'lines',
            // color: '#205B9D',
            name: props.data['drug1.name'],
            line: {
              shape: 'spline',
              color: 'blue',
              width: 6,
              smoothing: 1.2,
            },
          },
          {
            x: d2,
            y: E2,
            mode: 'lines',
            // color: '#CD3C1E',
            name: props.data['drug2.name'],
            line: {
              shape: 'spline',
              color: 'red',
              width: 6,
              smoothing: 1.2,
            },
          },
        ]}
        layout={{
          title: '1D Dose Effect Curve',
          xaxis: {
            title: 'log(Drug Conc.)',
          },
          yaxis: {
            title: 'Effect',
          },
        }}
        config={{ displaylogo: false }}
      />
    </div>
  )
}
