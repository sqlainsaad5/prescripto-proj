import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { slotDateFormat } from '../utils/helpers';
import { getFollowUpByToken, confirmFollowUp } from '../store/slices/userSlice';

const FollowUpBook = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token: authToken, userData } = useSelector((state) => state.user);
    const { currencySymbol } = useSelector((state) => state.app);
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(!!token);
    const [error, setError] = useState(null);
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid link');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        dispatch(getFollowUpByToken(token))
            .then((result) => {
                if (getFollowUpByToken.fulfilled.match(result)) {
                    setOffer(result.payload);
                } else {
                    setError(result.error?.message || 'Invalid or expired link');
                }
            })
            .finally(() => setLoading(false));
    }, [token, dispatch]);

    const handleConfirm = async () => {
        if (!token || !offer) return;
        setConfirming(true);
        const result = await dispatch(confirmFollowUp(token));
        setConfirming(false);
        if (confirmFollowUp.fulfilled.match(result)) {
            navigate('/my-appointments');
        }
    };

    if (loading) {
        return (
            <div className="max-w-lg mx-auto mt-12 p-6 text-center text-gray-600">
                Loading...
            </div>
        );
    }
    if (error || !offer) {
        return (
            <div className="max-w-lg mx-auto mt-12 p-6 border border-gray-200 rounded-lg bg-gray-50 text-center">
                <div className="text-gray-700">{error || 'Invalid or expired link'}</div>
                <Link to="/" className="text-primary hover:underline mt-2 inline-block">Back to home</Link>
            </div>
        );
    }

    const { docData, slotDate, slotTime, patientId } = offer;
    const isForCurrentUser = authToken && userData?._id && userData._id === patientId;

    return (
        <div className="max-w-lg mx-auto mt-12 p-6 border border-gray-200 rounded-lg bg-white">
            <h1 className="text-lg font-medium text-gray-800 mb-2">Suggested follow-up appointment</h1>
            <p className="text-sm text-gray-600 mb-4">Your doctor has suggested the following follow-up:</p>
            <div className="space-y-2 mb-6">
                <div><span className="font-medium">Doctor:</span> {docData?.name}</div>
                <div><span className="font-medium">Date:</span> {slotDateFormat(slotDate)}</div>
                <div><span className="font-medium">Time:</span> {slotTime}</div>
                <div><span className="font-medium">Fee:</span> {currencySymbol}{docData?.fee ?? '—'}</div>
            </div>
            {!authToken ? (
                <>
                    <p className="text-gray-600 mb-3">Log in to confirm this follow-up.</p>
                    <Link to={'/login?redirect=' + encodeURIComponent('/follow-up-book?token=' + token)} className="text-primary font-medium hover:underline">
                        Log in
                    </Link>
                </>
            ) : !isForCurrentUser ? (
                <div className="text-amber-700">This link is for another patient.</div>
            ) : (
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={confirming}
                    className="bg-primary text-white px-6 py-2 rounded hover:opacity-90 disabled:opacity-50"
                >
                    {confirming ? 'Confirming...' : 'Confirm follow-up'}
                </button>
            )}
        </div>
    );
};

export default FollowUpBook;
