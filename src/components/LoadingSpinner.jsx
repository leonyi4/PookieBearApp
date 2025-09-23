export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10 text-accent">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>

      {/* Message */}
      <p className="mt-4 text-sm animate-pulse">{message}</p>
    </div>
  );
}
