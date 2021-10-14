import Peer, { DataConnection } from 'peerjs'
import { useEffect, useState } from 'react'
import { Drop } from './Drop'
import { FileCard } from './File'
import { Header } from './Header/Header'
import { Share } from './Share'
import { store, useAppSelector } from './store'

function downloadFile(name: string, fileContent: ArrayBuffer) {
  const link = document.createElement('a')
  link.download = name
  link.href = URL.createObjectURL(new Blob([fileContent]))
  link.click()
}

function App() {
  const [peerId, setPeerId] = useState<string | null>(null)

  const [parentPeer, setParentPeer] = useState<DataConnection | null>(null)
  const [childPeer, setChildPeer] = useState<DataConnection[]>([])
  const [parentFiles, setParentFiles] = useState<
    { name: string; size: number }[]
  >([])

  const storeFiles = useAppSelector((store) => store.files)

  useEffect(() => {
    const peer = new Peer()

    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const peerId = urlParams.get('peer')
    const hasParent = !!peerId

    peer.on('open', (id) => {
      setPeerId(id)

      // We want to broadcast files to the children peer if we are a parent
      if (!hasParent) {
        peer.on('connection', (conn) => {
          setTimeout(() => setChildPeer((prev) => [...prev, conn]), 10)

          conn.on('data', async (data) => {
            if (data.type === 'requestFile') {
              const file = store.getState().files[data.index]

              conn.send(file)
            }
          })
        })
      } else {
        // Otherwise, we want to listen to file broadcasts from the parent
        const conn = peer.connect(peerId)
        setParentPeer(conn)
        conn.on('data', (data) => {
          console.log(data)

          if (data instanceof ArrayBuffer) {
            downloadFile(store.getState().fileName, data)
            return
          }

          if (data.type === 'files') {
            setParentFiles(data.files)
          }

          if (data.type === 'file') {
            downloadFile(data.name, data.file)
          }
        })
      }
    })
  }, [])

  useEffect(() => {
    const files = storeFiles.map((file) => ({
      name: file.name,
      size: file.size,
    }))

    for (const conn of childPeer) {
      conn.send({
        type: 'files',
        files,
      })
    }
  }, [storeFiles, childPeer])

  let files

  if (parentFiles.length > 0) {
    files = parentFiles
  } else {
    files = storeFiles.map((file) => ({
      name: file.name,
      size: file.size,
    }))
  }

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <Header />

      {peerId && storeFiles.length > 0 && <Share peerId={peerId} />}

      {files.map((file, index) => (
        <FileCard
          parent={parentPeer}
          fileName={file.name}
          index={index}
          key={index}
          askForSend={parentPeer !== null}
        />
      ))}

      <Drop />
    </div>
  )
}

export default App
