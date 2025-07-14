function AccountPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Account</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Username:</p>
          <p className="text-gray-900">@your_username</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Email:</p>
          <p className="text-gray-900">your@email.com</p>
        </div>
        <div className="mt-6">
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
