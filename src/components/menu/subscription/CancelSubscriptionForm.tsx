'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type CancelSubscriptionFormProps = {
    onCancel: () => void;
};

export default function CancelSubscriptionForm({onCancel}: CancelSubscriptionFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [periodEnd, setPeriodEnd] = useState<string | null>(null);

    const cancelSubscription = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/stripe/cancel-subscription', {
                method: 'POST',
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ?? 'Could not cancel subscription.');
            }

            setPeriodEnd(data.currentPeriodEnd);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not cancel subscription.');
        } finally {
            setIsLoading(false);
        }
    };

    if (periodEnd) {
        return (
            <div className="flex flex-col gap-5 p-2">
                <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                    <p className="mb-1 font-black">Subscription canceled</p>
                    <p>
                        You can keep playing as Pro until {new Date(periodEnd).toLocaleDateString()}.
                    </p>
                </div>
                <button
                    onClick={onCancel}
                    className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white transition-all hover:bg-indigo-700"
                >
                    Done
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-2">
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <p className="mb-1 font-black text-slate-900">Cancel Pro Plan</p>
                <p>
                    Your subscription will stop renewing, but your Pro access stays active until the paid period ends.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {error && <p className="text-sm font-bold text-rose-600">{error}</p>}
                <button
                    onClick={cancelSubscription}
                    disabled={isLoading}
                    className="w-full rounded-xl bg-rose-500 py-4 font-bold text-white transition-all hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {isLoading ? 'Canceling...' : 'CANCEL SUBSCRIPTION'}
                </button>
                <button
                    onClick={onCancel}
                    className="w-full py-3 font-semibold text-slate-500 hover:underline"
                >
                    Keep Pro Plan
                </button>
            </div>
        </div>
    );
}
