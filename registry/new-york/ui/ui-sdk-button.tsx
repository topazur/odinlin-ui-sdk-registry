import type React from "react"
import { Button } from "@ui-sdk/react/button"
import { buttonAttrs } from "./ui-sdk-button.stylex"

type UiSdkButtonProps = React.ComponentProps<typeof Button>

function UiSdkButton({ className, ...props }: UiSdkButtonProps) {
  const attrs = buttonAttrs()
  return <Button {...props} className={[attrs.class, className].filter(Boolean).join(" ")} />
}

export { UiSdkButton }
