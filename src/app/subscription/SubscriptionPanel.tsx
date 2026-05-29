'use client';

import {useState} from 'react';

type Plan = {
    id: string;
    name: string;
    price: string;
    interval: string;
    note: string;
};

const plans: Plan[] = [
    {
        id: 'price_1TWtSCRtHNDHszzOCkL5QxOl',
        name: 'Monthly',
        price: '$5.90',
        interval: 'per month',
        note: 'Flexible access for regular play.',
    },
    {
        id: 'price_1TWtSCRtHNDHszzOioT5LZYn',
        name: 'Every 3 Months',
        price: '$15.90',
        interval: 'every 3 months',
        note: 'A little cheaper for steady builders.',
    },
    {
        id: 'price_1TWtSCRtHNDHszzOkocNJ9lD',
        name: 'Annual',
        price: '$56.60',
        interval: 'per year',
        note: 'Best value for long-term practice.',
    },
];

type SubscriptionPanelProps = {
    currentPriceId?: string | null;
    isPro: boolean;
};

export default function SubscriptionPanel({currentPriceId, isPro}: SubscriptionPanelProps) {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [error, setError] = useState('');

    const subscribe = async (priceId: string) => {
        setLoadingPlan(priceId);
        setError('');

        try {
            const response = await fetch('/api/stripe/subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({priceId}),
            });

            const data = await response.json();

            if (!response.ok || !data.url) {
                throw new Error(data.error ?? 'Could not start checkout.');
            }

            window.location.href = data.url;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not start checkout.');
            setLoadingPlan(null);
        }
    };

    return (
        <div className="w-full max-w-md bg-white border border-indigo-500 shadow-indigo-300 rounded-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h1 className="text-indigo-400 font-mono text-sm tracking-tighter uppercase">{'>'} SUBSCRIPTION</h1>
                <a href="/" className="text-indigo-500 hover:text-gray-400 transition-colors">x</a>
            </div>

            <div className="p-6 bg-white rounded-xl">
                <div className="mb-5">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Pro Plan</p>
                    <h2 className="mt-1 text-2xl font-black text-slate-900">Choose your access</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Unlock all solo levels and premium play while your subscription is active.
                    </p>
                </div>

                {error && (
                    <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600">
                        {error}
                    </p>
                )}

                <div className="flex flex-col gap-3">
                    {plans.map((plan) => {
                        const isCurrentPlan = isPro && currentPriceId === plan.id;

                        return (
                            <div
                                key={plan.id}
                                className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
                                    isCurrentPlan
                                        ? 'border-slate-900 bg-slate-950 text-white'
                                        : 'border-slate-200 bg-white text-slate-900 hover:border-indigo-300 hover:shadow-md'
                                }`}
                            >
                                {isCurrentPlan && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/65">
                                        <span className="rounded-full border border-white/40 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                                            Your Current Plan
                                        </span>
                                    </div>
                                )}

                                <div className={isCurrentPlan ? 'opacity-35' : ''}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-black">{plan.name}</h3>
                                            <p className={`mt-1 text-sm ${isCurrentPlan ? 'text-slate-300' : 'text-slate-500'}`}>
                                                {plan.note}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xl font-black">{plan.price}</p>
                                            <p className={`text-[11px] font-bold uppercase ${isCurrentPlan ? 'text-slate-300' : 'text-slate-400'}`}>
                                                {plan.interval}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => subscribe(plan.id)}
                                        disabled={Boolean(loadingPlan) || isCurrentPlan}
                                        className={`mt-4 h-11 w-full rounded-lg text-sm font-black transition-all disabled:cursor-not-allowed ${
                                            isCurrentPlan
                                                ? 'bg-white/20 text-white'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-300'
                                        }`}
                                    >
                                        {loadingPlan === plan.id ? 'OPENING CHECKOUT...' : isCurrentPlan ? 'CURRENT PLAN' : 'CHOOSE PLAN'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
