import React from "react";

export default function NotificationToast({ open, message, type = "info", onClose }) {
  if (!open) return null;
  let color = "bg-primary text-white";
  if (type === "success") color = "bg-green-600 text-white";
  if (type === "error") color = "bg-red-600 text-white";
  if (type === "warning") color = "bg-yellow-500 text-black";

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-xl font-bold ${color}`}>
      <span>{message}</span>
      <button className="ml-4 text-xs underline" onClick={onClose}>Dismiss</button>
    </div>
  );
}
