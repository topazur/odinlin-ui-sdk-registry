import type React from "react"
import { Button } from "@ui-sdk/react/button"
import { buttonAttrs } from "../styles/button.stylex"

type Props = {
  children?: React.ReactNode
  variant?: "primary" | "secondary" | "outline"
  disabled?: boolean
} & React.ComponentProps<typeof Button>

export function ReactButton({
  children = "React Button",
  variant = "primary",
  disabled = false,
  className,
  ...props
}: Props) {
  const attrs = buttonAttrs(variant, disabled)
  return (
    <Button
      {...props}
      disabled={disabled}
      className={[attrs.class, className].filter(Boolean).join(" ")}
    >
      {children}
    </Button>
  )
}
