// 📍 Example: src/components/ui/button.tsx

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'destructive';
  isLoading?: boolean;
}

export function Button({ variant, isLoading, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        // 1. Base Institutional Styles
        "rounded-[2rem] px-8 py-4 font-black uppercase transition-all",
        
        // 2. Dynamic Variant Logic
        variant === 'primary' && "bg-primary text-white shadow-apex",
        variant === 'destructive' && "bg-destructive/10 text-destructive border border-destructive/20",
        
        // 3. State Management
        isLoading && "opacity-50 cursor-not-allowed animate-pulse",
        
        // 4. Manual Override Ingress (The most important part!)
        className 
      )}
      {...props}
    />
  );
}