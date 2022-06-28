import ComboPlots from "./ComboPlots";
import Heatmap from "./Heatmap";
import SingleDRC from "./SingleDRC";
import Sidebar from "./Sidebar";
import ReactLoading from "react-loading";
import {useSearchParams} from "react-router-dom";
import { useEffect, useState } from "react";


export default function MainContent(props) {
	const [expanded, setExpanded] = useState(false);
	const [data, setData] = useState();
	const [drugs, setDrugs] = useState({"drug1": '', "drug2": ''});
	const [loading, setLoading] = useState(true);
	const url = `http://localhost:8000/v1/data/${props.route}/`;
	const [searchParams, setSearchParams] = useSearchParams();
	let drug1 = '';
	let drug2 = '';

  const fetchData = async () => {
		try {
					let endpointID = props.route === "sql" ? "block_id" : "compound_id";
					// console.log(endpointID);
					let newUrl = url + searchParams.get(endpointID);
					drug1 = searchParams.get("drug1");
					drug2 = searchParams.get("drug2");
					setDrugs({"drug1": drug1, "drug2": drug2});
					newUrl = newUrl + (props.route === "sql" 
									 ? "?drug1=" + drug1 + 
										 "&drug2=" + drug2 
									 : "");
					console.log(newUrl);
					const res = await fetch(newUrl)
					const json = await res.json()
				  // let statusCode = res.status;
				  // if (statusCode !== 200) {

				  // };
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
								drugs={drugs}
								loading={loading}
        />
			  <Heatmap data={data} drugs={drugs} />
				<SingleDRC data={data} drugs={drugs} />
     </section>
	</>
 }
</>	
 );
}
