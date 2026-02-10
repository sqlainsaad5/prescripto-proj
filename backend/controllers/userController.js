import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js';
import Stripe from 'stripe'


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.json({ success: false, message: 'Missing Details' })
        }
        //validating email format

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'enter a valid email' })
        }
        // validating strong password

        if (password.length < 8) {
            return res.json({ success: false, message: 'enter a strong password' })
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })



    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User does not Exist' })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid Credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
//api to get user profile data

const getProfile = async (req, res) => {
    try {
        const userId = req.userId
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
//api to update user profile
const updateProfile = async (req, res) => {
    try {

        const userId = req.userId
        const { name, phone, address, dob, gender } = req.body
        const imageFile = req.file
        console.log("Image file path:", imageFile?.path)

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
        if (imageFile) {
            //upload image cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const image = imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId, { image }, { new: true })
        }
        res.json({ success: true, message: "Profile Updated" })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//api to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { docId, slotDate, slotTime } = req.body
        const userId = req.userId

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor not available' })
        }
        let slots_booked = docData.slots_booked || {}


        //checking for slot avaibility
        const alreadyBooked = await appointmentModel.findOne({
            userId,
            slotDate,
            slotTime
        })

        if (alreadyBooked) {
            return res.json({ success: false, message: 'slot not available' })
        }

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'slot not available' })

            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')
        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fee,
            slotTime,
            slotDate,
            date: Date.now()
        }
        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//API to get user appointments for frontend my-appointments page

const listAppointment = async (req, res) => {
    try {
        const userId = req.userId
        const appointments = await appointmentModel.find({ userId })
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
//Api to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const userId = req.userId  // Assuming userId is set from auth middleware

        if (!userId) {
            return res.json({ success: false, message: 'User not authenticated' })
        }

        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized Action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: 'Appointment Cancelled' })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

// API to make payment of appointment using stripe
const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment cancelled or not found' })
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price_data: {
                    currency: process.env.CURRENCY,
                    product_data: {
                        name: "Appointment Fee"
                    },
                    unit_amount: appointmentData.amount * 100
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${origin}/my-appointments?success=true&appointmentId=${appointmentData._id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/my-appointments?success=false&appointmentId=${appointmentData._id}`,
        })

        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {
        const { appointmentId, success, session_id } = req.body

        if (success === "true") {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
            const session = await stripe.checkout.sessions.retrieve(session_id)

            if (session.payment_status === 'paid') {
                await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
                return res.json({ success: true, message: "Payment Successful" })
            }
        }

        res.json({ success: false, message: "Payment Failed" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
//API to verify payment from stripe

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentStripe, verifyStripe }
