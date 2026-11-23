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
  },
})

export const buttonAttrs = () => stylex.attrs(styles.button)
