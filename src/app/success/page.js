export default function SuccessPage() {
    return (
      <div className="w-full h-screen bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
        <div className="w-full max-w-screen-md text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-white">
            Successful!
          </h1>
          <p className="mt-4 text-lg">
            Your response has been recorded successfully.
          </p>
          <a
            href="/"
            className="mt-6 inline-block px-6 py-3 text-lg bg-white text-purple-500 rounded-lg shadow-lg hover:bg-purple-100 transition"
          >
            Go back to homepage
          </a>
        </div>
      </div>
    );
  }