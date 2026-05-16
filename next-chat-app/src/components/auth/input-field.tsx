type InputFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-200">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-700"
      />
    </div>
  );
}
