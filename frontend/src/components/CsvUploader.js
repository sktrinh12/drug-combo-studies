import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import styled from 'styled-components'
import ReactLoading from 'react-loading'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const DropzoneContainer = styled.div`
  border: 2px dashed #bbb;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  font-size: 1.2rem;
  color: #aaa;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`

const Code = styled.code`
  &.code {
    color: red;
  }
`

function CsvUploader() {
  const [fileError, setFileError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const reader = new FileReader()
      reader.onload = () => {
        const csv = reader.result
        // console.log('CSV:', csv)
        const { data, errors } = Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
        })
        // console.log('Data:', data)
        // console.log('Errors:', errors)
        if (errors.length) {
          setFileError('Error parsing CSV file')
        } else {
          // console.log(data)
          const floatData = Object.keys(data[0]).reduce((acc, key) => {
            // must convert . to _ for python schema class
            const newKey = key.replace('.', '_')
            acc[newKey] = Object.values(data).map((item) =>
              isNaN(item[key]) ? item[key] : parseFloat(item[key])
            )
            return acc
          }, {})

          setLoading(true)
          console.log('Data:', floatData)
          console.log('----------------')
          console.log(BACKEND_URL)
          fetch(`${BACKEND_URL}/v1/data/upload`, {
            mode: 'cors',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(floatData),
          })
            .then((response) => response.json())
            .then((respData) => {
              console.log(respData)
              setFileError(null)
              navigate(
                '/score',
                { state: { data: respData, fileName: acceptedFiles[0].name } },
                { target: '_blank' }
              )
            })
            .catch((error) => {
              console.error(error)
              alert(`!X! Error: ${error}`)
            })
            .finally(() => {
              setLoading(false)
            })
        }
      }
      reader.readAsText(acceptedFiles[0])
    },
    [navigate]
  )

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    onDrop: handleDrop,
  })

  return loading ? (
    <div
      style={{
        margin: 'auto',
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <ReactLoading type='spin' color={'#343990ff'} height={667} width={375} />
    </div>
  ) : (
    <DropzoneContainer {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop a CSV file here, or click to select file</p>
      <p>Ensure the following column names exist:</p>
      <Code className='code'>
        <p>drug1.conc</p>
        <p>drug2.conc</p>
        <p>effect</p>
        <p>drug1.name</p>
        <p>drug2.name</p>
      </Code>
      {fileError && <p>{fileError}</p>}
    </DropzoneContainer>
  )
}

export default CsvUploader
