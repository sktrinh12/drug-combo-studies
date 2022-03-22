import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js"
import Heatmap from "./Heatmap";
import SingleDRC from "./SingleDRC";
import {useSearchParams} from "react-router-dom";
import ReactLoading from "react-loading";


export default function ComboPlots(props) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
	const url = "http://localhost:8000/v1/testdata/";
  let [searchParams, setSearchParams] = useSearchParams();

  const fetchData = async () => {
		try {
					let newUrl = url + searchParams.get("FT");
					console.log(newUrl);
					const res = await fetch(newUrl)
					const json = await res.json()
					// console.log(json);
					setData(json);
					setLoading(false);
				} catch (error) {
					console.log(error);
		}
  };
  useEffect(() => {
    fetchData();
  }, [])


  return ( 
				<div> 
			{ loading ? <ReactLoading type="spin" color="#2E86C1"
										height={667} width={375} margin="auto"
										padding="10px"
									/> :
				<>
				<Plot
        data={[
          {
            x: data["x"],
            y: data["y"],
            z: data["z"],
				    cmin: data["vmin"],
				    cmax: data["vmax"],
				    opacity: 0.75,
            type:'surface',
				    name: '',
				    contours: {
								z: {
								show: true,
								usecolormap: true,
								highlightcolor: "limegreen",
								project: {z: false}
								}
						},
				    colorscale: 'YlGnBu',
				    reversescale: true,
				    colorbar: {
												lenmode: 'fraction',
												len: 0.65,
												title: 'Effect'
				    }
          },
				  {
				    x: data["xs"],
            y: data["ys"],
            z: data["zs"],
				    type:'scatter3d',
				    mode: 'markers',
				    showlegend: false,
				    name: '',
				    marker: {
								     size: 3.0,
								     color: data['zs'],
								     colorscale: 'YlGnBu',
								     reversescale: true,
								     cmin: data['vmin'],
								     cmax: data['vmax'],
								     line: {
												    width: 0.5,
												    color: 'DarkSlateGrey'
								   	 }
						}
				  },
					{
						x: data["x1_xmin"],
				    y: data["y1_xmin"],
						z: data["z1_xmin"],
						type: 'scatter3d',
						mode: 'lines',
				    name: 'Drug1 HSA',
						line: {
										width: 8,
										color: 'blue'
									}
					},
					{
						x: data["x2_xmin"],
						// y: Array(data["x"].length).fill(0),
				    y: data["y2_xmin"],
						z: data["z2_xmin"],
						type: 'scatter3d',
						mode: 'lines',
				    name: 'Drug2 HSA',
						line: {
										width: 8,
										color: 'red'
									}
					},
					{
						// y: data["ys"].reduce((arr, e, i) => ((data["xs"][i] == -1 ) && arr.push(e), arr), []),
						y: data["y1_xmax"],
						x: data["x1_xmax"],
						z: data["z1_xmax"],
						type: 'scatter3d',
				    showlegend: false,
				    name: '',
						mode: 'lines',
						line: {
										width: 8,
								    color: [...Array(data["z1_xmax"].length).keys()],
								    colorscale: [ 
												['0.0', 'blue'],
												['0.111111111111', 'blue'],
												['0.222222222222', 'blue'],
												['0.333333333333', 'blue'],
												['0.444444444444', 'rgb(228,14,167)'],
												['0.555555555556', 'rgb(228,14,167)'],
												['0.666666666667', 'rgb(228,14,167)'],
												['0.777777777778', 'rgb(228,14,167)'],
												['0.888888888889', 'rgb(228,14,167)'],
												['1.0', 'rgb(228,14,167)']
										]
									}
					},
				  { // Drug 2 is varied
						y: data["x2_xmax"],
						x: data["y2_xmax"],
						z: data["z2_xmax"],
						type: 'scatter3d',
						mode: 'lines',
				    showlegend: false,
				    name: '',
						line: {
										width: 8,
								    color: [...Array(data["z2_xmax"].length).keys()], //count of datapoints
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
												['1.0', 'rgb(228,14,167)']
												// // [Math.min(...data["z2_xmax"]).toString(): 'rgb(23, 38, 173)'], //blue
												// // [(data["z2_xmax"].reduce((a, b) => a+b) / data["z2_xmax"].length).toString(): 'rgb(228,14,167)'], //magenta
												// // [Math.max(...data["z2_xmax"]).toString(): 'rgb(228,12,5)'] //red
										]
									}
					}
        ]}

				layout= {{
								   title: 'Test title for 3d contour plot - dose response surface',
								   autosize: false,
								   margin: {
														l: 100,
														r: 100,
														b: 90,
														t: 90 
									 },
								   width: 900,
								   height: 700,
								   scene: {
													camera: {
																  eye: {
																        x: 1.87,
																        y: 0.88,
																        z: 0.64
																	}
													},
													xaxis: {
																 title: 'Drug1'
													},
													yaxis: {
																 title: 'Drug2'
													},
													zaxis: {
																 title: 'Effect'
													},
												  aspectmode: 'cube'
									 }
				}}
      />
			<hr/>
			<Heatmap data={data}/>
			<hr/>
			<SingleDRC data={data}/>
		</>
   }
  </div>
  );
}
