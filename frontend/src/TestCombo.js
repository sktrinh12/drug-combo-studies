import Plotly from 'plotly.js/lib/core'
import Scatter3d from 'plotly.js/lib/scatter3d'
import Surface from 'plotly.js/lib/surface'
import createPlotlyComponent from 'react-plotly.js/factory'

Plotly.register([Surface, Scatter3d])
const Plot = createPlotlyComponent(Plotly)

export default function TestPlots(props) {
  // console.log(props.data['xs'])
  // console.log(props.data['ys'])
  // console.log(props.data['zs'])
  // console.log('------')
  // console.log(props.data['x'])
  // console.log(props.data['y'])
  // console.log(props.data['z'])
  return (
    <Plot
      data={[
        {
          x: props.data['x'],
          y: props.data['y'],
          z: props.data['z'],
          // cmin: props.data["vmin"],
          // cmax: props.data["vmax"],
          opacity: 0.75,
          type: 'surface',
          name: '',
          contours: {
            z: {
              show: true,
              usecolormap: true,
              highlightcolor: 'limegreen',
              project: { z: false },
            },
          },
          // colorscale: 'YlGnBu',
          colorscale: [
            ['0.0', '#fcfed6'],
            ['0.2', '#dcf2ca'],
            ['0.4', '#6ec6b2'],
            ['0.6', '#2194b7'],
            ['0.8', '#254493'],
            ['1.0', '#121c52'],
          ],
          // reversescale: true,
          colorbar: {
            lenmode: 'fraction',
            len: 0.65,
            title: 'Effect',
          },
        },
        {
          x: props.data['xs'],
          y: props.data['ys'],
          z: props.data['zs'],
          type: 'scatter3d',
          mode: 'markers',
          showlegend: false,
          name: '',
          marker: {
            size: 3.0,
            // color: props.data['zs'],
            // colorscale: 'YlGnBu',
            colorscale: [
              ['0.0', '#fcfed6'],
              ['0.2', '#dcf2ca'],
              ['0.4', '#6ec6b2'],
              ['0.6', '#2194b7'],
              ['0.8', '#254493'],
              ['1.0', '#121c52'],
            ],
            line: {
              width: 0.5,
              color: 'DarkSlateGrey',
            },
          },
        },
      ]}
      layout={{
        title: 'Surface Plot',
        autosize: false,
        margin: {
          l: 100,
          r: 100,
          b: 90,
          t: 90,
        },
        width: 900,
        height: 700,
        scene: {
          camera: {
            eye: {
              x: 1.87,
              y: 0.88,
              z: 0.64,
            },
          },
          xaxis: {
            title: props.data['drug1.name'],
          },
          yaxis: {
            title: props.data['drug2.name'],
          },
          zaxis: {
            title: 'Effect',
          },
          aspectmode: 'cube',
        },
      }}
      config={{ displaylogo: false }}
    />
  )
}
