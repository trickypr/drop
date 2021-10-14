import { useState } from 'react'
import { Actions, useAppDispatch } from '../store'

export const Drop = () => {
  const [hover, setHover] = useState(false)

  const dispatch = useAppDispatch()

  return (
    <>
      <div
        className={`h-96 rounded-md ${
          hover ? 'bg-gray-200' : 'bg-gray-100'
        } flex items-center justify-center p-4`}
        onDragEnter={(e) => {
          e.preventDefault()
          e.stopPropagation()

          setHover(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()

          setHover(false)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()

          setHover(false)
          const dragFiles = Array.from(e.dataTransfer.files)
          dragFiles.forEach((file) =>
            dispatch({ type: Actions.ADD_FILE, payload: file })
          )
        }}
      >
        <p>Drag a file here to send it</p>
      </div>
    </>
  )
}
