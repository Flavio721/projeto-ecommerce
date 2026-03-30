import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import styles from "./Button.module.css";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonLinkProps extends LinkProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

/**
 * Use ButtonLink quando o botão precisar navegar para uma rota interna.
 * Use Button para ações (submit, onClick).
 *
 * Exemplo:
 *   <ButtonLink to="/checkout" size="lg">Finalizar compra</ButtonLink>
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Link>
  );
}