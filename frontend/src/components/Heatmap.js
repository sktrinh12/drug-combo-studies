import Plotly from 'plotly.js/lib/core'
import Heatmap from 'plotly.js/lib/heatmap'
import createPlotlyComponent from 'react-plotly.js/factory'
import { transpose } from './transpose'

Plotly.register([Heatmap])
const Plot = createPlotlyComponent(Plotly)

const floorToExpon = (number, places) => {
  const l = 10 ** (Math.floor(Math.log10(Math.abs(number))) - places)
  return (Math.floor(number / l) * l).toExponential(places)
}

export default function HeatmapComp(props) {
  const transposedData = transpose(props.data['z'])
  return (
    <div>
      <Plot
        data={[
          {
            // z: props.data["z"].map((e) => (e.reverse())),
            z: transposedData,
            type: 'heatmap',
            colorscale: [
              ['0.0', '#fcfed6'],
              ['0.2', '#dcf2ca'],
              ['0.4', '#6ec6b2'],
              ['0.6', '#2194b7'],
              ['0.8', '#254493'],
              ['1.0', '#121c52'],
            ],
            reversescale: false,
          },
        ]}
        layout={{
          title: `${props.data['drug1.name']} vs ${props.data['drug2.name']} heatmap`,
          yaxis: {
            tickmode: 'array',
            tickvals: [...Array(props.data['d2_conc'].length + 1).keys()],
            // tickvals: props.data["xticks"],
            // ticktext: props.data["xticklabels"].map((e) => (e.replace(/[${}]/gi, ''))),
            ticktext: [
              0.0,
              ...props.data['d2_conc'].map((e) =>
                floorToExpon(Math.pow(10, e), 2)
              ),
            ],
            title: props.data['drug2.name'],
          },
          xaxis: {
            tickmode: 'array',
            // tickvals: props.data["yticks"],
            tickvals: [...Array(props.data['d1_conc'].length + 1).keys()],
            // ticktext: props.data["yticklabels"].map((e) => (e.replace(/[${}]/gi, ''))),
            ticktext: [
              0.0,
              ...props.data['d1_conc'].map((e) =>
                floorToExpon(Math.pow(10, e), 2)
              ),
            ],
            title: props.data['drug1.name'],
          },
          annotations: [
            {
              text: 'Max effect',
              x: 1.14,
              xref: 'paper',
              yref: 'paper',
              y: 1.05,
              showarrow: false,
            },
            {
              text: 'No effect',
              x: 1.13,
              xref: 'paper',
              yref: 'paper',
              y: -0.05,
              showarrow: false,
            },
          ],
        }}
        config={{ displaylogo: false }}
      />
    </div>
  )
}
