export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-5 bg-[rgba(58,211,249,1)]">
      {/* Logo */}
      <div className="w-[25vw] max-w-[120px] h-[25vw] max-h-[120px] mb-[5vh]">
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <path
            d="M32 2 C20 20, 8 32, 32 62 C56 32, 44 20, 32 2 Z"
            fill="#00C896"
            stroke="#006D75"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-5 w-full max-w-[250px]">
        <a
          href="/login"
          className="w-full py-3 bg-[#004B5E] text-white text-lg rounded-md text-center hover:opacity-90 transition"
        >
          Log In
        </a>

        <a
          href="/register"
          className="w-full py-3 bg-[#00C896] text-white text-lg rounded-md text-center hover:opacity-90 transition"
        >
          Register
        </a>
      </div>
    </main>
  );
}
