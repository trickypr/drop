import { DataConnection } from 'peerjs'
import { FC } from 'react'
import { Download } from 'react-feather'
import { Actions, useAppDispatch } from '../store'

export const FileCard: FC<{
  fileName: string
  index: number
  askForSend: boolean
  parent: DataConnection | null
}> = ({ fileName, askForSend, parent, index }) => {
  const dispatch = useAppDispatch()

  return (
    <div className="mb-2 bg-gray-100 rounded-md flex flex-row p-4 justify-between items-center">
      <div>{fileName}</div>

      {askForSend && parent && (
        <button
          className="text-white stroke-current bg-gradient-to-br p-2 rounded from-green-400 to-blue-500"
          onClick={() => {
            dispatch({ type: Actions.SET_FILE_NAME, payload: fileName })
            parent.send({ type: 'requestFile', index })
          }}
        >
          <Download />
        </button>
      )}
    </div>
  )
}
