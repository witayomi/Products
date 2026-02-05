"use client";

import { useEffect, useRef, useState } from "react";

export default function AutoSaveForm({
  action,
  children
}: {
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = () => {
    setSaved(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      formRef.current?.requestSubmit();
      setSaved(true);
    }, 800);
  };

  return (
    <div>
      <form ref={formRef} action={action} onChange={handleChange} className="space-y-3">
        {children}
      </form>
      <p className="mt-2 text-xs text-slate-500">{saved ? "All changes saved." : "Saving..."}</p>
    </div>
  );
}
