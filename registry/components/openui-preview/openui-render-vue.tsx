/* @jsxImportSource vue */
import { Renderer as VueRenderer, type ActionEvent, type OpenUIError } from "@openuidev/vue-lang";
import { defineComponent, onMounted, ref } from "vue";
import { library as vueLibrary } from "./vue";

export interface OpenUIRenderVueProps extends Record<string, any> {
  source: string;
  showActions?: boolean;
}

export const OpenUIRenderVue = defineComponent<OpenUIRenderVueProps>(
  (props, { attrs }) => {
    const errors = ref<OpenUIError[]>([]);
    const actionEvent = ref("");
    const mounted = ref(false);

    onMounted(() => {
      mounted.value = true;
    });

    function recordAction(event: ActionEvent) {
      console.log("TODO:33333 ", event);
      actionEvent.value = JSON.stringify({
        type: event.type,
        message: event.humanFriendlyMessage,
        params: event.params,
      });
    }

    return () => {
      const DynamicRenderer = VueRenderer as any;
      const showActions = props.showActions ?? false;

      return (
        <figure {...attrs} class="openui-framework" data-framework="Vue">
          <figcaption>Vue</figcaption>
          <div
            {...(showActions ? ({ onClickCapture: () => (actionEvent.value = "") } as any) : {})}
          >
            <DynamicRenderer
              response={props.source}
              library={vueLibrary}
              onError={(nextErrors: OpenUIError[]) => (errors.value = nextErrors)}
              onAction={recordAction}
            />
          </div>
          {mounted.value && errors.value.length > 0 ? (
            <ul class="openui-errors" role="alert">
              {errors.value.map((error, index) => (
                <li key={index}>
                  <code>{error.code}</code> {error.message}
                </li>
              ))}
            </ul>
          ) : null}
          {showActions ? (
            <output class="openui-action-result">
              {actionEvent.value || "No action event received."}
            </output>
          ) : null}
        </figure>
      );
    };
  },
  {
    name: "OpenUIVuePreview",
    inheritAttrs: false,
    props: ["source", "showActions"],
  },
);
