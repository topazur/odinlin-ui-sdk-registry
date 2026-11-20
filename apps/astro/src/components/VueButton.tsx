import { Button } from "@ui-sdk/vue/button"
import { buttonAttrs } from "../styles/button.stylex"
import { defineComponent, h, type PropType } from "vue"

type Variant = "primary" | "secondary" | "outline"

export const VueButton = defineComponent({
  name: "VueButton",
  inheritAttrs: false,
  props: {
    label: { type: String, default: "Vue Button" },
    variant: { type: String as PropType<Variant>, default: "primary" },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const styling = buttonAttrs(props.variant, props.disabled)
      return h(
        Button,
        {
          ...attrs,
          ...styling,
          disabled: props.disabled,
        },
        slots.default ? slots.default() : props.label,
      )
    }
  },
})
