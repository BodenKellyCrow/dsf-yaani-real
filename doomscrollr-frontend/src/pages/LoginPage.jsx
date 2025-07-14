function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Doomscrollr</h1>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mb-2 w-full max-w-sm">
        Continue with Google
      </button>
      <button className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded w-full max-w-sm">
        Continue with Facebook
      </button>
    </div>
  );
}

export default LoginPage;
