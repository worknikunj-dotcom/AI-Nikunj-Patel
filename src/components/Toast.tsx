export const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-4 right-4 rounded bg-emerald-600 px-4 py-2 text-sm text-white shadow-lg">{message}</div>
);
