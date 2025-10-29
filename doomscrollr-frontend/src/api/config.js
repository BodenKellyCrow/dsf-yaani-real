export const MEDIA_URL = 'https://doomscrollr.onrender.com'; // Your Render backend URL

// ✅ ADD THIS HELPER FUNCTION
// This function fixes the image loading issue by ensuring the URL is correctly formed.
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/default-image.png';
  
  // If path already has full URL (e.g., from an external source or correctly saved full path), return as-is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If path starts with /, just prepend domain
  if (imagePath.startsWith('/')) {
    return `${MEDIA_URL}${imagePath}`;
  }
  
  // If path is a filename (e.g., 'images/profile.jpg'), we prepend the domain and the media root.
  // Assuming Django's MEDIA_ROOT is serving from /media/
  return `${MEDIA_URL}/media/${imagePath}`;
};