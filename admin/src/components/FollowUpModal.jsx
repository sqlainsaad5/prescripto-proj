import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { suggestFollowUp } from '../store/slices/doctorSlice';

const daysofWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function buildDocSlots(slotsBooked) {
    const today = new Date();
    const result = [];
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        const endTime = new Date(today);
        endTime.setDate(today.getDate() + i);
        endTime.setHours(21, 0, 0, 0);
        if (today.getDate() === currentDate.getDate()) {
            currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
            currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        } else {
            currentDate.setHours(10);
            currentDate.setMinutes(0);
        }
        const timeSlots = [];
        while (currentDate < endTime) {
            const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            const slotDate = day + '_' + month + '_' + year;
            const isSlotBooked = slotsBooked && slotsBooked[slotDate] && slotsBooked[slotDate].includes(formattedTime);
            timeSlots.push({
                datetime: new Date(currentDate),
                time: formattedTime,
                booked: !!isSlotBooked
            });
            currentDate.setMinutes(currentDate.getMinutes() + 30);
        }
        result.push(timeSlots);
    }
    return result;
}

const FollowUpModal = ({ appointment, slotsBooked, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [followUpLink, setFollowUpLink] = useState(null);

    const docSlots = useMemo(() => buildDocSlots(slotsBooked || {}), [slotsBooked]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!slotTime) return;
        const daySlots = docSlots[slotIndex];
        if (!daySlots || !daySlots.length) return;
        const date = daySlots[0].datetime;
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const slotDate = day + '_' + month + '_' + year;
        setSubmitting(true);
        const resultAction = await dispatch(suggestFollowUp({
            appointmentId: appointment._id,
            slotDate,
            slotTime
        }));
        setSubmitting(false);
        if (suggestFollowUp.fulfilled.match(resultAction)) {
            setFollowUpLink(resultAction.payload);
        }
    };

    const handleCopyLink = () => {
        if (followUpLink) {
            navigator.clipboard.writeText(followUpLink);
            toast.success('Link copied to clipboard');
        }
    };

    const handleDone = () => {
        onSuccess?.();
        onClose?.();
    };

    if (!appointment) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white px-8 py-8 border rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto border-gray-300">
                <p className="mb-4 text-lg font-medium text-gray-700">
                    Suggest follow-up for {appointment.userData?.name || 'Patient'}
                </p>
                {followUpLink ? (
                    <div className="flex flex-col gap-3">
                        <p className="text-sm text-gray-600">Priority booking link created. Share this link with the patient:</p>
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                readOnly
                                value={followUpLink}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="border border-primary text-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors"
                            >
                                Copy link
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handleDone}
                            className="bg-primary text-white px-4 py-2 rounded mt-2"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <p className="text-sm text-gray-600">Select date and time for the suggested follow-up.</p>
                        <div className="flex gap-3 items-center w-full overflow-x-auto">
                            {docSlots.map((daySlots, index) => (
                                <div
                                    key={index}
                                    onClick={() => { setSlotIndex(index); setSlotTime(''); }}
                                    className={`text-center py-4 min-w-14 rounded-full cursor-pointer flex-shrink-0 ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
                                >
                                    <p className="text-xs">{daySlots[0] && daysofWeek[daySlots[0].datetime.getDay()]}</p>
                                    <p>{daySlots[0] && daySlots[0].datetime.getDate()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {docSlots[slotIndex]?.map((item, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    disabled={item.booked}
                                    onClick={() => !item.booked && setSlotTime(item.time)}
                                    className={`text-sm px-4 py-2 rounded-full ${
                                        item.booked
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : item.time === slotTime
                                            ? 'bg-primary text-white'
                                            : 'border border-gray-300 hover:bg-primary/10'
                                    }`}
                                >
                                    {item.time.toLowerCase()}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="border border-gray-400 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!slotTime || submitting}
                                className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                {submitting ? 'Creating...' : 'Create follow-up link'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FollowUpModal;
