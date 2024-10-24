import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { IoIosAttach } from 'react-icons/io'

interface IFileInputSendMessageProps {
  onChange: (file: File | null) => void
  resetPreview: boolean
}

export function FileInputSendMessage({
  onChange,
  resetPreview,
}: IFileInputSendMessageProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (resetPreview) {
      setImagePreviewUrl(null)
    }
  }, [resetPreview])

  const handleOnChange = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0] || null
    onChange(file)

    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImagePreviewUrl(imageUrl)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {imagePreviewUrl && (
        <div>
          <img
            src={imagePreviewUrl}
            alt="Preview"
            className="max-w-20 max-h-20"
          />
        </div>
      )}
      <div className="w-8 h-10 relative">
        <IoIosAttach className="w-full h-full text-ring" />
        <Input
          className="absolute inset-0 opacity-0 cursor-pointer"
          type="file"
          onChange={handleOnChange}
        />
      </div>
    </div>
  )
}
