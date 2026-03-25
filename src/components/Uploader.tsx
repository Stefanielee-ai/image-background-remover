'use client'

import { useCallback, useRef, useState } from 'react'

type State = 'idle' | 'loading' | 'done' | 'error'

export default function Uploader() {
  const [state, setState] = useState<State>('idle')
  const [originalUrl, setOriginalUrl] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validate = (file: File): string | null => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) return 'Please upload a JPG, PNG, or WebP image.'
    if (file.size > 10 * 1024 * 1024) return 'File size must be under 10MB.'
    return null
  }

  const processFile = useCallback(async (file: File) => {
    const err = validate(file)
    if (err) { setErrorMsg(err); setState('error'); return }

    setOriginalUrl(URL.createObjectURL(file))
    setState('loading')

    const form = new FormData()
    form.append('image_file', file)

    try {
      const res = await fetch('/api/remove-bg', { method: 'POST', body: form })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || `Error ${res.status}`)
      }
      const blob = await res.blob()
      setResultBlob(blob)
      setResultUrl(URL.createObjectURL(blob))
      setState('done')
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong.')
      setState('error')
    }
  }, [])

  const reset = () => {
    setState('idle')
    setOriginalUrl('')
    setResultUrl('')
    setResultBlob(null)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const download = () => {
    if (!resultBlob) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(resultBlob)
    a.download = 'background-removed.png'
    a.click()
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  return (
    <div className="w-full">
      {/* Upload zone */}
      {state === 'idle' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50'}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f) }}
          />
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-lg font-semibold text-slate-700 mb-1">Drag & drop your image here</p>
          <p className="text-slate-400 text-sm mb-5">or</p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Choose Image
          </button>
          <p className="text-xs text-slate-400 mt-4">Supports JPG, PNG, WebP · Max 10MB</p>
        </div>
      )}

      {/* Loading */}
      {state === 'loading' && (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Removing background...</p>
        </div>
      )}

      {/* Result */}
      {state === 'done' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Original</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={originalUrl} alt="Original" className="w-full rounded-lg object-contain max-h-72" />
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Background Removed</p>
              <div className="checker-bg rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Result" className="w-full object-contain max-h-72" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={download}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-lg transition-colors"
            >
              ⬇️ Download PNG
            </button>
            <button
              onClick={reset}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-7 py-3 rounded-lg transition-colors"
            >
              Try Another Image
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {state === 'error' && (
        <div className="text-center py-16">
          <p className="text-red-500 mb-4">{errorMsg}</p>
          <button
            onClick={reset}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
