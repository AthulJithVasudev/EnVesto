export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-envesto-gray-200 border-t-envesto-teal rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-envesto-navy mb-2">EnVesto</h2>
        <p className="text-envesto-gray-500 text-sm">Earn and Invest</p>
        <p className="text-envesto-gray-400 text-xs mt-2">Loading your financial dashboard...</p>
      </div>
    </div>
  )
}
