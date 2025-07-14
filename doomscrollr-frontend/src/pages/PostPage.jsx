import { useParams } from 'react-router-dom';

function PostPage() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Post Details</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-2">Project Title #{id}</h3>
        <p className="text-gray-700 mb-4">
          This is the full description of the project post with ID: <strong>{id}</strong>.
        </p>
        <p className="text-sm text-gray-500">Posted by @username</p>
      </div>
    </div>
  );
}

export default PostPage;
