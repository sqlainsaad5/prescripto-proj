import React from 'react'

const HistorySectionTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-xs font-semibold tracking-wide text-gray-500 ${className}`}>
      {children}
    </h3>
  )
}

export default HistorySectionTitle
