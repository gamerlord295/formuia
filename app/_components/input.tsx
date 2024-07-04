type Props = {
  placeholder: string;
  type: string;
  name: string;
  minLength?: number;
  className?: string;
  required?: boolean;
};

const Input = ({ placeholder, type, name, minLength = 6, className, required = true } : Props) => {
  return (
    <>
      <input
        required={required}
        className={`rounded-lg border border-violet-500 bg-transparent p-2 outline-none ${className}`}
        minLength={minLength}
        placeholder={placeholder}
        type={type}
        name={name}
      />
    </>
  );
};

export default Input;
