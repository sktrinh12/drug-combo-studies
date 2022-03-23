import ComboPlots from "./ComboPlots";
import Heatmap from "./Heatmap";
import SingleDRC from "./SingleDRC";
import Sidebar from "./Sidebar";
import ReactLoading from "react-loading";
import {useSearchParams} from "react-router-dom";
import { useEffect, useState } from "react";


export default function MainContent() {
	const [expanded, setExpanded] = useState(false);
	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);
	const url = "http://localhost:8000/v1/testdata/";
	const [searchParams, setSearchParams] = useSearchParams();

  const fetchData = async () => {
		try {
					let newUrl = url + searchParams.get("compound_id");
					console.log(newUrl);
					const res = await fetch(newUrl)
					const json = await res.json()
					console.log(json);
					setData(json);
					setLoading(false);
				} catch (error) {
					console.log(error);
		}
  };
  useEffect(() => {
    fetchData();
  }, [])

  function toggleSidebar() {
				setExpanded( !expanded );
  }

  return (
	  <>	
		{ loading 
			? <ReactLoading type="spin" color="#2E86C1"
														height={667} width={375} margin="auto"
														padding="10px" /> 
			:
    <>
		 <Sidebar 
				toggleSidebar={toggleSidebar} 
				expanded={expanded} 
				calcValues={data["summary"]} 
     />
		 <section 
				className={
							expanded 
							? "main-content main-content--expanded" 
							: "main-content"
				}
		 >

		    <ComboPlots 
								data={data} 
								expanded={expanded}
								loading={loading}
        />
			  <Heatmap data={data}/>
				<SingleDRC data={data}/>
     </section>
	</>
 }
</>	
 );
}
