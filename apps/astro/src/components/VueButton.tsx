import { Button } from "@ui-sdk/vue/button"
import { buttonAttrs } from "../styles/button.stylex"
import { defineComponent, type PropType } from "vue"

type Variant = "primary" | "secondary" | "outline"
type Demo = "pending" | "pending-content" | "focusable-disabled" | "link"

export const VueButton = defineComponent({
  name: "VueButton",
  inheritAttrs: false,
  props: {
    label: { type: String, default: "Vue Button" },
    variant: { type: String as PropType<Variant>, default: "primary" },
    disabled: { type: Boolean, default: false },
    demo: { type: String as PropType<Demo>, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const ButtonComponent = Button as any
    return () => {
      const styling = buttonAttrs(props.variant, props.disabled)
      const onClick = attrs.onClick ?? (props.demo === "pending" || props.demo === "pending-content"
        ? () => new Promise((resolve) => setTimeout(resolve, 1500))
        : undefined)
      const content = props.demo === "pending-content"
        ? <><span data-show="idle">Save</span><span data-show="pending">Saving…</span></>
        : slots.default ? slots.default() : props.label

      return (
        <ButtonComponent
          {...attrs}
          {...styling}
          disabled={props.disabled}
          onClick={onClick}
          v-slots={props.demo === "link" ? {
            render: ({ props: renderProps }: { props: Record<string, unknown> }) => (
              <a {...renderProps} href="#installation">{props.label}</a>
            ),
          } : undefined}
        >
          {content}
        </ButtonComponent>
      )
    }
  },
})
