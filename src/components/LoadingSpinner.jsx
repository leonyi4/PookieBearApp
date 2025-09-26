export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 sm:h-64 lg:h-80 text-accent py-6">
      <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sm sm:text-base animate-pulse">{message}</p>
    </div>
  );
}
