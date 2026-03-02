import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

const hospitalName = process.env.HOSPITAL_NAME || 'PRESCRIPTO';
const hospitalAddress1 = process.env.HOSPITAL_ADDRESS_LINE1 || '';
const hospitalAddress2 = process.env.HOSPITAL_ADDRESS_LINE2 || '';

function formatAppointmentDate(slotDate, slotTime) {
    if (!slotDate) return slotTime || '—';
    const parts = String(slotDate).split('_');
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dateStr = parts.length === 3 ? `${parts[0]} ${months[Number(parts[1])]} ${parts[2]}` : slotDate;
    return slotTime ? `${dateStr}, ${slotTime}` : dateStr;
}

function calculateAge(dob) {
    if (!dob) return '—';
    const today = new Date();
    const birth = new Date(dob);
    const age = today.getFullYear() - birth.getFullYear();
    return isNaN(age) ? '—' : age;
}

function buildPdfBuffer({ prescription, appointment, doctor, patient }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const patientName = patient?.name || appointment?.userData?.name || '—';
        const patientAge = calculateAge(patient?.dob || appointment?.userData?.dob);
        const patientGender = patient?.gender || appointment?.userData?.gender || '—';
        const appointmentDateTime = formatAppointmentDate(appointment?.slotDate, appointment?.slotTime);
        const prescriptionDateStr = prescription.prescriptionDate
            ? new Date(prescription.prescriptionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : '—';

        doc.fontSize(18).text(hospitalName, { align: 'center' });
        if (hospitalAddress1 || hospitalAddress2) {
            doc.fontSize(10).text([hospitalAddress1, hospitalAddress2].filter(Boolean).join(' | '), { align: 'center' });
        }
        doc.moveDown(2);

        doc.fontSize(12).text('Prescription', { underline: true });
        doc.moveDown(1);
        doc.fontSize(10).text(`Date: ${prescriptionDateStr}`);
        doc.text(`Appointment: ${appointmentDateTime}`);
        doc.moveDown(1);

        doc.text('Doctor:', { continued: false });
        doc.text(`  ${doctor?.name || '—'}, ${doctor?.degree || ''} (${doctor?.speciality || '—'})`);
        if (doctor?.address?.line1 || doctor?.address?.line2) {
            doc.text(`  ${[doctor.address.line1, doctor.address.line2].filter(Boolean).join(', ')}`);
        }
        doc.moveDown(1);

        doc.text('Patient:', { continued: false });
        doc.text(`  ${patientName}, Age: ${patientAge}, Gender: ${patientGender}`);
        doc.moveDown(2);

        doc.fontSize(11).text('Medicines', { underline: true });
        doc.moveDown(0.5);
        const tableTop = doc.y;
        doc.fontSize(9);
        doc.text('Medicine', 50, tableTop, { width: 120 });
        doc.text('Dosage', 170, tableTop, { width: 80 });
        doc.text('Duration', 250, tableTop, { width: 80 });
        doc.text('Instructions', 330, tableTop, { width: 200 });
        doc.moveDown(0.5);
        let y = doc.y;
        (prescription.medicines || []).forEach((med) => {
            const medName = (med.medicineName || '—').substring(0, 25);
            const dosage = (med.dosage || '—').substring(0, 12);
            const duration = (med.duration || '—').substring(0, 12);
            const instructions = (med.instructions || '—').substring(0, 35);
            doc.text(medName, 50, y, { width: 120 });
            doc.text(dosage, 170, y, { width: 80 });
            doc.text(duration, 250, y, { width: 80 });
            doc.text(instructions, 330, y, { width: 200 });
            y += 22;
        });
        doc.y = y + 15;

        doc.moveDown(2);
        doc.fontSize(10).text('Doctor\'s signature: _________________________', 50, doc.y);
        doc.end();
    });
}

function uploadPrescriptionPdf(buffer) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'prescriptions', resource_type: 'raw' },
            (err, result) => {
                if (err) return reject(err);
                if (!result?.secure_url) return reject(new Error('No URL returned from Cloudinary'));
                resolve(result.secure_url);
            }
        );
        const readable = Readable.from(buffer);
        readable.pipe(uploadStream);
    });
}

export async function generatePrescriptionPdf({ prescription, appointment, doctor, patient }) {
    try {
        const buffer = await buildPdfBuffer({ prescription, appointment, doctor, patient });
        const secureUrl = await uploadPrescriptionPdf(buffer);
        return secureUrl;
    } catch (err) {
        console.error('Prescription PDF generation or upload failed:', err);
        return null;
    }
}
