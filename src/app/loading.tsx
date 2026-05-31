export default function Loading() {
  return (
    <main className="min-h-screen grid place-items-center bg-white text-slate-900">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-500">
          Loading
        </p>
      </div>
    </main>
  );
}
