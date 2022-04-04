import {render} from 'react-dom';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import App from './App';
import './index.scss';
import MainContent from "./components/MainContent";

const rootElement = document.getElementById("root");
render(
				<BrowserRouter>
				<Routes>
								<Route path="/" element={<App />} />
								<Route path="test-plot" element={<MainContent route={"test"} />} />
								<Route path="file-plot" element={<MainContent route={"files"} />} />
								<Route path="cmbdb-plot" element={<MainContent route={"sql"} />} />
								<Route
											path="*"
											element={
												<main style={{ padding: "1rem" }}>
													<p>There's nothing here!</p>
												</main>
											}
								/>
				</Routes>
				</BrowserRouter>, 
				rootElement
);
