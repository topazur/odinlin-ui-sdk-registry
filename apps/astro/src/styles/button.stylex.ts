import * as stylex from "@stylexjs/stylex"

export const styles = stylex.create({
  button: {
    alignItems: "center",
    border: "1px solid transparent",
    borderRadius: "0.625rem",
    cursor: "pointer",
    display: "inline-flex",
    fontFamily: "system-ui, sans-serif",
    fontSize: "0.875rem",
    fontWeight: 600,
    gap: "0.5rem",
    justifyContent: "center",
    minHeight: "2.5rem",
    paddingBlock: "0.625rem",
    paddingInline: "1rem",
    transitionDuration: "150ms",
    transitionProperty: "background-color, border-color, color, box-shadow",
  },
  primary: {
    backgroundColor: "var(--button-primary-bg)",
    color: "var(--button-primary-fg)",
  },
  secondary: {
    backgroundColor: "var(--button-secondary-bg)",
    color: "var(--button-secondary-fg)",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "var(--button-outline-border)",
    color: "var(--button-outline-fg)",
  },
  disabled: {
    cursor: "not-allowed",
    opacity: 0.5,
  },
})

export const buttonAttrs = (variant: "primary" | "secondary" | "outline" = "primary", disabled = false) =>
  stylex.attrs(styles.button, styles[variant], disabled && styles.disabled)
