import React from "react";

export default function ShareButton({
  url,
  title = "Check this out!",
  className = "",
}) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        // Use the native Web Share API if available
        await navigator.share({
          title,
          url,
        });
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`bg-accent text-white font-medium py-1 px-2 rounded-md hover:bg-gray-400 transition ${className}`}
    >
      Share
    </button>
  );
}
