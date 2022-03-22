export default function Sidebar(props) {
    return (
      <div className={
												props.expanded 
												? "sidebar sidebar--expanded" 
												: "sidebar"} onClick={props.toggleSidebar} 
      >
					<ul>
								<li>beta=0.43 (0.13,0.68) (>0) <span style={{color: "blue"}}>synergistic</span></li>
								<li>alpha=212.29 (1.68,3.18) (>1)<span style={{color: "blue"}}> synergistic</span></li>
								<li>gamma=122.53 (1.56,7.75) (>1) <span style={{color: "blue"}}> synergistic</span></li>
					</ul>
      </div>
    )
}
