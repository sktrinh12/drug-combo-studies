import ComboPlots from "./ComboPlots";
import Sidebar from "./Sidebar";
import { useState } from "react";



export default function MainContent(props) {
const [expanded, setExpanded] = useState(false);

function toggleSidebar() {
				setExpanded( !expanded );
}

return (
   <>
		 <Sidebar toggleSidebar={toggleSidebar} expanded={expanded} />
		 <section className={
		 								  expanded 
		 									? "main-content main-content--expanded" 
		 									: "main-content"}
		 >
			<ComboPlots />
     </section>
	</>
);
}
