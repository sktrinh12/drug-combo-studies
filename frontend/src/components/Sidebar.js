import MathJax from 'react-mathjax';

export default function Sidebar(props) {
		const splitValues = (arr) => {
			return arr.split("\n").map((e) => (e.split('\t')));
		}
    const convertTex = (str) => {
			let prefixStr = str.match("[a-zA-Z]{1,}");
			let suffixStr = str.match("[1-9]{1,}");
      // console.log(prefixStr);
      // console.log(suffixStr);
			switch(prefixStr[0]) {
				case "beta":
								return `\\beta`
				case "alpha":
								return `\\alpha_{${suffixStr}}`
				case "gamma":
								return `\\gamma_{${suffixStr}}`
				default:
								return str
			}
		}

    const setTextColour = (str) => {
      try {
					let findStr = str.match("syn.*");
					// console.log(findStr);
					return findStr.length > 0 ? "blue" : "red"
			} catch { return "red" }
		}

    const calcValues = splitValues(props.calcValues);
    
    // console.log(calcValues);
    return (
      <div className={
												props.expanded 
												? "sidebar sidebar--expanded" 
												: "sidebar"} onClick={props.toggleSidebar} 
      >
				{ calcValues.length < 2 
				  ? <p>{calcValues[0]}</p>
				  : calcValues.map((str, i) => (
							<tr key={i}> 
								<MathJax.Provider>
									<th> 
											<MathJax.Node inline formula =
												{ convertTex(str[0]) }
											/>
									</th>
									<td> <p>={str[1]} {str[2]} </p> </td>
									<td> <span style={{color: setTextColour(str[3]) }}>
											 {" " + str[3]} 
											 </span> 
							    </td>
							  </MathJax.Provider>
							</tr>
							) )
				} 
      </div>
    );
}
