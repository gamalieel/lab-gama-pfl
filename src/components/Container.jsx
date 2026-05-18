export default function Container({
  children,
  className = ""
}) {
  return (
    <div className={`container mx-auto py-8 px-4 ${className}`}>
      {children}
    </div>
  );
}