import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { getMyPrescriptions } from '../store/slices/userSlice'

const backendUrl = import.meta.env.VITE_BACKEND_URL

const MyPrescriptions = () => {
  const { token, prescriptions } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [downloadingId, setDownloadingId] = useState(null)

  useEffect(() => {
    if (token) {
      dispatch(getMyPrescriptions())
    }
  }, [token, dispatch])

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const downloadFilename = (item) => {
    const dateStr = item.prescriptionDate
      ? new Date(item.prescriptionDate).toISOString().slice(0, 10)
      : (item._id || '').toString()
    return `Prescription-${dateStr}.pdf`
  }

  const handleDownloadPdf = async (item) => {
    if (!token || !item._id) return
    setDownloadingId(item._id)
    try {
      const res = await fetch(backendUrl + '/api/prescription/download/' + item._id, {
        headers: { token }
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.message || 'Failed to download PDF')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = downloadFilename(item)
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      toast.error(err.message || 'Failed to download PDF')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <>
      <h1 className='pb-3 mt-12 font-medium text-zinc-700 border-b border-gray-200'>My Prescriptions</h1>
      <div>
        {prescriptions && prescriptions.length === 0 && (
          <p className='py-6 text-zinc-500 text-sm'>No prescriptions yet.</p>
        )}
        {prescriptions && prescriptions.length > 0 && prescriptions.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b border-gray-200' key={item._id || index}>
            <div className='flex-1 text-sm text-zinc-600'>
              <h2 className='text-neutral-800 font-semibold'>Prescription</h2>
              <p className='text-xs mt-1'><span className='text-neutral-700 font-medium'>Date:</span> {formatDate(item.prescriptionDate)}</p>
              <p className='text-xs'><span className='text-neutral-700 font-medium'>Medicines:</span> {item.medicines?.length || 0} item(s)</p>
            </div>
            <div className='flex flex-col gap-2 justify-end'>
              {item.prescriptionPDF ? (
                <button
                  type='button'
                  onClick={() => handleDownloadPdf(item)}
                  disabled={downloadingId === item._id}
                  className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50'
                >
                  {downloadingId === item._id ? 'Downloading…' : 'Download PDF'}
                </button>
              ) : (
                <span className='text-sm text-zinc-400 sm:min-w-48 py-2'>PDF not available</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default MyPrescriptions
