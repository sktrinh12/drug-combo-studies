import ReactLoading from 'react-loading'
import { useSearchParams } from 'react-router-dom'
import React, { useEffect, useState, Suspense } from 'react'
const ComboPlots = React.lazy(() => import('./ComboPlots'))
const Heatmap = React.lazy(() => import('./Heatmap'))
const SingleDRC = React.lazy(() => import('./SingleDRC'))
const Sidebar = React.lazy(() => import('./Sidebar'))

export default function MainContent(props) {
  const [expanded, setExpanded] = useState(false)
  const [data, setData] = useState()
  const [drugs, setDrugs] = useState({ drug1: '', drug2: '' })
  const [loading, setLoading] = useState(true)
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
  const url = `${BACKEND_URL}/v1/data/${props.route}/`
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams()
  let drug1 = ''
  let drug2 = ''

  const fetchData = async () => {
    try {
      let endpointID = props.route === 'sql' ? 'block_id' : 'compound_id'
      console.log(endpointID)
      let newUrl = url + searchParams.get(endpointID)
      // let newUrl = url + endpointID;
      drug1 = searchParams.get('drug1')
      drug2 = searchParams.get('drug2')
      setDrugs({ drug1: drug1, drug2: drug2 })
      newUrl =
        newUrl +
        (props.route === 'sql' ? '?drug1=' + drug1 + '&drug2=' + drug2 : '')
      console.log(newUrl)
      const res = await fetch(newUrl)
      const json = await res.json()
      console.log(json)
      setData(json)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleSidebar() {
    setExpanded(!expanded)
  }

  return (
    <>
      {loading ? (
        <ReactLoading
          type='spin'
          color='#2E86C1'
          height={667}
          width={375}
          margin='auto'
          padding='10px'
        />
      ) : (
        <>
          <Suspense
            fallback={
              <ReactLoading
                type='spin'
                color='#2E86C1'
                height={667}
                width={375}
                margin='auto'
                padding='1px'
              />
            }
          >
            <Sidebar
              toggleSidebar={toggleSidebar}
              expanded={expanded}
              calcValues={data['summary']}
            />
            <section
              className={
                expanded
                  ? 'main-content main-content--expanded'
                  : 'main-content'
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
          </Suspense>
        </>
      )}
    </>
  )
}
