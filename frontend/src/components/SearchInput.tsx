import { useEffect, useState } from "react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Поиск...",
}: {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(value);
  useEffect(() => {
    setLocal(value);
  }, [value]);
  useEffect(() => {
    const id = setTimeout(() => onChange(local), 350);
    return () => clearTimeout(id);
  }, [local]);
  return (
    <input
      className="input"
      placeholder={placeholder}
      value={local}
      onChange={e => setLocal(e.target.value)}
    />
  );
}
