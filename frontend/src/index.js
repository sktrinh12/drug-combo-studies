import { render } from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import './index.scss'
import MainContent from './components/MainContent'
import CsvUploader from './components/CsvUploader'
import Display from './components/Display'
import ScoreTable from './components/ScoreTable'

const rootElement = document.getElementById('root')
render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='test-plot' element={<MainContent route={'test'} />} />
      <Route path='file-plot' element={<MainContent route={'files'} />} />
      <Route path='cmbdb-plot' element={<MainContent route={'sql'} />} />
      <Route path='visualise' element={<Display />} />
      <Route path='upload-data' element={<CsvUploader />} />
      <Route path='upload' element={<CsvUploader />} />
      <Route path='score' element={<ScoreTable />} />
      <Route
        path='*'
        element={
          <main style={{ padding: '1rem' }}>
            <p>There's nothing here!</p>
          </main>
        }
      />
    </Routes>
  </BrowserRouter>,
  rootElement
)
