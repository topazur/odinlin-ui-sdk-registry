import type React from "react"
import { Button } from "@ui-sdk/react/button"
import { buttonAttrs } from "../styles/button.stylex"

type Props = {
  children?: React.ReactNode
  variant?: "primary" | "secondary" | "outline"
  disabled?: boolean
  demo?: "pending" | "pending-content" | "focusable-disabled" | "link"
} & React.ComponentProps<typeof Button>

export function ReactButton({
  children = "React Button",
  variant = "primary",
  disabled = false,
  demo,
  className,
  ...props
}: Props) {
  const attrs = buttonAttrs(variant, disabled)
  const onClick = props.onClick ?? (demo === "pending" || demo === "pending-content"
    ? () => new Promise((resolve) => setTimeout(resolve, 1500))
    : undefined)
  const content = demo === "pending-content" ? (
    <>
      <span data-show="idle">Save</span>
      <span data-show="pending">Saving…</span>
    </>
  ) : children
  return (
    <Button
      {...props}
      disabled={disabled}
      onClick={onClick}
      render={demo === "link" ? <a href="#installation" /> : props.render}
      className={[attrs.class, className].filter(Boolean).join(" ")}
    >
      {content}
    </Button>
  )
}
