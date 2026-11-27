/* @jsxImportSource vue */
import { type RenderNodeResult } from "@openuidev/vue-lang";
import { defineComponent } from "vue";
import { Stack } from "../stack/stack-vue";

interface OpenUIStackNode extends Record<string, any> {
  props: {
    children: unknown;
  };
  renderNode: (value: unknown) => RenderNodeResult;
}

export const OpenUIStack = defineComponent<OpenUIStackNode>(
  (node) => () => (
    <Stack direction="horizontal" gap={2} wrap="wrap">
      {() => node.renderNode(node.props.children)}
    </Stack>
  ),
  {
    name: "OpenUIStack",
    props: ["props", "renderNode"],
  },
);

interface OpenUIInlineNode extends Record<string, any> {
  props: {
    children: unknown;
  };
  renderNode: (value: unknown) => RenderNodeResult;
}

export const OpenUIInline = defineComponent<OpenUIInlineNode>(
  (node) => () => <div class="openui-inline">{() => node.renderNode(node.props.children)}</div>,
  {
    name: "OpenUIInline",
    props: ["props", "renderNode"],
  },
);
