import Plotly from 'plotly.js/lib/core'
import Scatter from 'plotly.js/lib/scatter'
import createPlotlyComponent from 'react-plotly.js/factory'

Plotly.register([Scatter])
const Plot = createPlotlyComponent(Plotly)

const floorToExpon = (number, places) => {
  const l = 10 ** (Math.floor(Math.log10(Math.abs(number))) - places)
  return (Math.floor(number / l) * l).toExponential(places)
}

export default function Heatmap(props) {
  return (
    <div>
      <Plot
        data={[
          {
            // z: props.data["z"].map((e) => (e.reverse())),
            z: props.data.data['z'],
            type: 'heatmap',
            // colorscale: 'YlGnBu',
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
          title: `${props.data.data['drug1.name']} vs ${props.data.data['drug2.name']} heatmap`,
          xaxis: {
            tickmode: 'array',
            tickvals: [...Array(props.data.data['d2_conc'].length + 1).keys()],
            // tickvals: props.data["xticks"],
            // ticktext: props.data["xticklabels"].map((e) => (e.replace(/[${}]/gi, ''))),
            ticktext: [
              0.0,
              ...props.data.data['d2_conc'].map((e) =>
                floorToExpon(Math.pow(10, e), 2)
              ),
            ],
            // title: 'Drug1'
            title: props.data.data['drug2.name'],
          },
          yaxis: {
            tickmode: 'array',
            // tickvals: props.data["yticks"],
            tickvals: [...Array(props.data.data['d1_conc'].length + 1).keys()],
            // ticktext: props.data["yticklabels"].map((e) => (e.replace(/[${}]/gi, ''))),
            ticktext: [
              0.0,
              ...props.data.data['d1_conc'].map((e) =>
                floorToExpon(Math.pow(10, e), 2)
              ),
            ],
            // title: 'Drug2'
            title: props.data.data['drug1.name'],
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
      />
    </div>
  )
}
