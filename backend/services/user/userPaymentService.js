import Stripe from 'stripe'
import appointmentModel from '../../models/appointmentModel.js'

const createCheckoutSession = async (appointmentId, originHeader) => {
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData || appointmentData.cancelled) {
        return { success: false, message: 'Appointment cancelled or not found' }
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: process.env.CURRENCY,
                    product_data: {
                        name: 'Appointment Fee',
                    },
                    unit_amount: appointmentData.amount * 100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${originHeader}/my-appointments?success=true&appointmentId=${appointmentData._id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${originHeader}/my-appointments?success=false&appointmentId=${appointmentData._id}`,
    })

    return { success: true, session_url: session.url }
}

const verifyStripePayment = async ({ appointmentId, success, session_id }) => {
    if (success === 'true') {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        const session = await stripe.checkout.sessions.retrieve(session_id)

        if (session.payment_status === 'paid') {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return { success: true, message: 'Payment Successful' }
        }
    }

    return { success: false, message: 'Payment Failed' }
}

export { createCheckoutSession, verifyStripePayment }
