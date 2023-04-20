import { render } from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainContent from './components/MainContent'
import CsvUploader from './components/CsvUploader'
import Display from './components/Display'
import ScoreTable from './components/ScoreTable'
import Test from './components/Test'

const rootElement = document.getElementById('root')
render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<CsvUploader />} />
      <Route path='test' element={<MainContent route={'files'} />} />
      <Route path='test2' element={<Test />} />
      <Route path='db' element={<MainContent route={'sql'} />} />
      <Route path='visualise' element={<Display />} />
      <Route path='score' element={<ScoreTable />} />
      <Route
        path='*'
        element={
          <main style={{ padding: '1rem' }}>
            <p>That endpoint does not exist!</p>
          </main>
        }
      />
    </Routes>
  </BrowserRouter>,
  rootElement
)
