import ReactLoading from 'react-loading'
import React, { useState, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
const ComboPlots = React.lazy(() => import('./ComboPlots'))
const Heatmap = React.lazy(() => import('./Heatmap'))
const SingleDRC = React.lazy(() => import('./SingleDRC'))
const Sidebar = React.lazy(() => import('./Sidebar'))

const height = 667
const width = 375
const colour = '#2E86C1'

export default function Display(props) {
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)
  const data = location.state.data
  // console.log(data)

  function toggleSidebar() {
    setExpanded(!expanded)
  }

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
        <Sidebar
          toggleSidebar={toggleSidebar}
          expanded={expanded}
          calcValues={data.data['summary']}
        />
        <section
          className={
            expanded ? 'main-content main-content--expanded' : 'main-content'
          }
        >
          <ComboPlots data={data} expanded={expanded} />
          <Heatmap data={data} />
          <SingleDRC data={data} />
        </section>
      </Suspense>
    </>
  )
}
