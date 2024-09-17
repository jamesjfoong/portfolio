export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      <div className="text-center z-10">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-gray-300 mb-8">Oops! Page Not Found</p>
        <p className="text-xl text-gray-400 mt-8">
          Looks like you've ventured into uncharted space!
        </p>
        <a
          href="/"
          className="mt-8 inline-block bg-indigo-600 text-white py-3 px-6 rounded-full hover:bg-indigo-700 transition duration-300"
        >
          Return to Home
        </a>
      </div>
    </div>
  )
}
