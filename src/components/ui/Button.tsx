import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-orange text-white hover:bg-orange/90 shadow-sm",
  secondary: "bg-navy-light text-white hover:bg-navy",
  ghost: "text-navy hover:bg-cream/80",
  outline: "border-2 border-navy text-navy hover:bg-cream",
} as const;

export type ButtonVariant = keyof typeof variants;

export function buttonClassName(variant: ButtonVariant = "primary", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:opacity-50",
    variants[variant],
    className,
  );
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  className,
  children,
  type = "button",
  ...rest
}: Props & { type?: "button" | "submit" | "reset" }) {
  return (
    <button type={type} className={buttonClassName(variant, className)} {...rest}>
      {children}
    </button>
  );
}
