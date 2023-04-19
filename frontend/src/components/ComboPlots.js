import Plotly from 'plotly.js/lib/core'
import Scatter3d from 'plotly.js/lib/scatter3d'
import Surface from 'plotly.js/lib/surface'
import createPlotlyComponent from 'react-plotly.js/factory'

Plotly.register([Surface, Scatter3d])
const Plot = createPlotlyComponent(Plotly)

export default function ComboPlots(props) {
  // console.log(props.data)
  return (
    <Plot
      data={[
        {
          x: props.data['x'],
          y: props.data['y'],
          z: props.data['z'],
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
          colorscale: [
            ['0.0', '#fcfed6'],
            ['0.2', '#dcf2ca'],
            ['0.4', '#6ec6b2'],
            ['0.6', '#2194b7'],
            ['0.8', '#254493'],
            ['1.0', '#121c52'],
          ],
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
            color: props.data['zs'],
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
            // cmin: props.data['vmin'],
            // cmax: props.data['vmax'],
            line: {
              width: 0.5,
              color: 'DarkSlateGrey',
            },
          },
        },
        {
          x: props.data['x1_xmin'],
          y: props.data['y1_xmin'],
          z: props.data['z1_xmin'],
          type: 'scatter3d',
          mode: 'lines',
          name: props.data['drug1.name'] + ' HSA',
          line: {
            width: 8,
            color: 'blue',
          },
        },
        {
          x: props.data['x2_xmin'],
          // y: Array(props.data["x"].length).fill(0),
          y: props.data['y2_xmin'],
          z: props.data['z2_xmin'],
          type: 'scatter3d',
          mode: 'lines',
          name: props.data['drug2.name'] + ' HSA',
          line: {
            width: 8,
            color: 'red',
          },
        },
        {
          // y: props.data["ys"].reduce((arr, e, i) => ((props.data["xs"][i] == -1 ) && arr.push(e), arr), []),
          y: props.data['y1_xmax'],
          x: props.data['x1_xmax'],
          z: props.data['z1_xmax'],
          type: 'scatter3d',
          showlegend: false,
          name: '',
          mode: 'lines',
          line: {
            width: 8,
            color: [...Array(props.data['z1_xmax'].length).keys()],
            colorscale: [
              ['0.0', 'rgb(228,14,167)'],
              ['0.111111111111', 'rgb(228,14,167)'],
              ['0.222222222222', 'rgb(228,14,167)'],
              ['0.333333333333', 'rgb(228,14,167)'],
              ['0.444444444444', 'rgb(228,14,167)'],
              ['0.555555555556', 'blue'],
              ['0.666666666667', 'blue'],
              ['0.777777777778', 'blue'],
              ['0.888888888889', 'blue'],
              ['1.0', 'blue'],
            ],
          },
        },
        {
          // Drug 2 is varied
          x: props.data['x2_xmax'],
          y: props.data['y2_xmax'],
          z: props.data['z2_xmax'],
          type: 'scatter3d',
          mode: 'lines',
          showlegend: false,
          name: '',
          line: {
            width: 8,
            color: [...Array(props.data['z2_xmax'].length).keys()], //count of datapoints
            colorscale: [
              ['0.0', 'red'],
              ['0.111111111111', 'red'],
              ['0.222222222222', 'red'],
              ['0.333333333333', 'red'],
              ['0.444444444444', 'red'],
              ['0.555555555556', 'rgb(228,14,167)'],
              ['0.666666666667', 'rgb(228,14,167)'],
              ['0.777777777778', 'rgb(228,14,167)'],
              ['0.888888888889', 'rgb(228,14,167)'],
              ['1.0', 'rgb(228,14,167)'],
              // // [Math.min(...props.data["z2_xmax"]).toString(): 'rgb(23, 38, 173)'], //blue
              // // [(props.data["z2_xmax"].reduce((a, b) => a+b) / props.data["z2_xmax"].length).toString(): 'rgb(228,14,167)'], //magenta
              // // [Math.max(...props.data["z2_xmax"]).toString(): 'rgb(228,12,5)'] //red
            ],
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
