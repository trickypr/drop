import { FC } from 'react'
import QRCode from 'react-qr-code'

export const Share: FC<{ peerId: string }> = ({ peerId }) => {
  return (
    <div className={`flex flex-row gap-8 mb-8 p-4 items-center`}>
      <QRCode
        className=""
        size={128}
        value={`${window.location.href}?peer=${peerId}`}
      />

      <div>
        Scan this qrcode to receive the file <br /> or use{' '}
        <a
          href={`${window.location.href}?peer=${peerId}`}
          className="text-blue-800 underline"
        >
          this link
        </a>
      </div>
    </div>
  )
}
