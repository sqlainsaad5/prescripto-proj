import React from 'react'
import { assets } from '../../data/assets'

const DoctorImageUpload = ({ docImg, setDocImg }) => {
  return (
    <div className="flex items-center gap-4 mb-8 text-gray-500">
      <label htmlFor="doc-img">
        <img
          className="w-16 bg-gray-100 rounded-full cursor-pointer"
          src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
          alt=""
        />
      </label>
      <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
      <span>
        Upload doctor <br /> picture
      </span>
    </div>
  )
}

export default DoctorImageUpload
