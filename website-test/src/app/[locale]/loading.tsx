export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-sand">
      {/* Vous pouvez mettre un spinner ici */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocre"></div>
    </div>
  );
}