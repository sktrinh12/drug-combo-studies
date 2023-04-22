import React from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'

const tooltipText = `Multidimensional Synergy of Combinations (MuSyC) is a drug synergy framework based on the law of mass action. In MuSyC, synergy is parametrically defined as shifts in potency, efficacy, or cooperativity.\n
Alpha 2_1 : Synergistic potency (0,1) = antagonism, (1,inf) = synergism. At large concentrations of drug 2, the "effective dose" of drug 1 = alpha21*d1.\n
Alpha 1_2 : Synergistic potency (0,1) = antagonism, (1,inf) = synergism. At large concentrations of drug 1, the "effective dose" of drug 2 = alpha12*d2.\n
Beta : Synergistic efficacy ((-inf,0) = antagonism, (0,inf) = synergism. At large concentrations of both drugs, the combination achieves an effect beta% stronger (or weaker) than the stronger single-drug.\n
Gamma 2_1 : Synergistic cooperativity (0,1) = antagonism, (1,inf) = synergism. At large concentrations of drug 2, the Hill slope of drug 1 = gamma21*h1\n
Gamma 1_2 : Synergistic cooperativity (0,1) = antagonism, (1,inf) = synergism. At large concentrations of drug 1, the Hill slope of drug 2 = gamma12*h2`

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;

  th,
  td {
    text-align: left;
    padding: 8px;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  td {
    border: 1px solid #ddd;
  }
`

const StyledPaper = styled.div`
			background-color: #f5f5f5;
			padding: 4px;
			border-radius: 5px;
			box-shadow: 0px 0px 4px #888888;
			margin: 10px;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
		}
`

const columns = [
  { id: 'drug1.name', label: 'Drug 1' },
  { id: 'drug2.name', label: 'Drug 2' },
  { id: 'beta', label: 'Beta' },
  { id: 'alpha12', label: 'Alpha 1_2' },
  { id: 'alpha21', label: 'Alpha 2_1' },
  { id: 'gamma12', label: 'Gamma 1_2' },
  { id: 'gamma21', label: 'Gamma 2_1' },
]

const scoreColumns = columns.map((column) => column.id)

const ScoreTable = () => {
  // const ScoreTable = ({ data, fileName }) => {
  let subsetData
  const location = useLocation()
  const data = location.state.data
  const fileName = location.state.fileName
  if (data) {
    subsetData = Object.keys(data).reduce((obj, key) => {
      if (scoreColumns.includes(key)) {
        // conditionally grab the first element of array for model params
        obj[key] = key.includes('drug') ? data[key] : data[key][0]
      }
      return obj
    }, {})
  }
  console.log(subsetData)
  subsetData = [
    Object.fromEntries(
      Object.entries(subsetData).map(([key, value]) =>
        key.includes('drug') ? [key, value] : [key, value.toFixed(4)]
      )
    ),
  ]
  return (
    <Container>
      {data && (
        <StyledTable title={tooltipText}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subsetData.map((row, i) => (
              <tr key={`row_${i}`}>
                {columns.map((column) => (
                  <td key={column.id}>{row[column.id]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      )}
      <StyledPaper>
        <strong>File name:&nbsp; </strong> {fileName}
      </StyledPaper>
    </Container>
  )
}
export default ScoreTable
