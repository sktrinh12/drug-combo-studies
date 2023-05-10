import ReactLoading from 'react-loading'
import React, { Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import ScoreTable from './ScoreTable'
const Heatmap = React.lazy(() => import('./Heatmap'))
// const ComboPlots = React.lazy(() => import('./ComboPlots'))
// const SingleDRC = React.lazy(() => import('./SingleDRC'))

const height = 667
const width = 375
const colour = '#2E86C1'

const Item = styled.div`
  margin: 10px;
`

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

export default function Display(props) {
  const location = useLocation()
  const data = location.state.data
  const fileName = location.state.fileName
  // console.log(data)

  return (
    <>
      <Suspense
        fallback={
          <ReactLoading
            type='spin'
            color={colour}
            height={height}
            width={width}
            margin='auto'
            padding='1px'
          />
        }
      >
        <Container>
          <Item>
            <ScoreTable data={data} fileName={fileName} />
          </Item>
          {/*<Item>
            <ComboPlots data={data} />
          </Item>*/}
          <Item>
            <Heatmap data={data} />
          </Item>
          {/*<Item>
            <SingleDRC data={data} />
          </Item>*/}
        </Container>
      </Suspense>
    </>
  )
}
