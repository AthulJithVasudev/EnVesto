export default function Footer() {
  return (
    <footer className="border-t border-envesto-gray-200 dark:border-neutral-800 bg-envesto-gray-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 py-14 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-envesto-teal uppercase mb-3">About</h3>
            <p className="text-envesto-gray-700 dark:text-neutral-300 leading-relaxed">
              EnVesto empowers gig workers and variable-income earners to plan, track, and invest with confidence.
              Our tools bring clarity to your financial journey.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-envesto-teal uppercase mb-3">Quick Links</h3>
            <ul className="space-y-2 text-envesto-gray-700 dark:text-neutral-300">
              <li><a href="/expense" className="hover:text-envesto-teal">Expense Calculator</a></li>
              <li><a href="/ai" className="hover:text-envesto-teal">EnVesto AI</a></li>
              <li><a href="/info" className="hover:text-envesto-teal">Learn More</a></li>
              <li><a href="/signup" className="hover:text-envesto-teal">Get Started</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-envesto-teal uppercase mb-3">Contact</h3>
            <ul className="space-y-2 text-envesto-gray-700 dark:text-neutral-300">
              <li>support@envesto.app</li>
              <li>Mon–Fri, 9:00–17:00</li>
              <li>Remote-first</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-envesto-gray-200 dark:border-neutral-800 text-sm flex flex-col md:flex-row items-center justify-between text-envesto-gray-600 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} EnVesto. All rights reserved.</p>
          <div className="mt-3 md:mt-0 space-x-4">
            <a href="/info" className="hover:text-envesto-teal">About</a>
            <a href="/signup" className="hover:text-envesto-teal">Get Started</a>
          </div>
        </div>
      </div>
    </footer>
  )
}


