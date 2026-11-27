import { Renderer, type OpenUIError } from "@openuidev/react-lang";
import { createElement, useState } from "react";
import { library as reactLibrary } from "./react";

export interface OpenUIRenderReactProps {
  source: string;
  showActions?: boolean;
}

export function OpenUIRenderReact({ source, showActions = false }: OpenUIRenderReactProps) {
  const [errors, setErrors] = useState<OpenUIError[]>([]);
  const [actionEvent, setActionEvent] = useState("");

  const renderer = createElement(
    Renderer,
    {
      library: reactLibrary,
      publishObservability: false,
      response: source,
      onError: setErrors,
      onAction: (event) => {
        console.log("TODO:3 ", event);

        setActionEvent(
          JSON.stringify({
            type: event.type,
            message: event.humanFriendlyMessage,
            params: event.params,
          }),
        );
      },
    },
    createElement(Renderer.Content),
  );

  return (
    <figure className="openui-framework" data-framework="React">
      <figcaption>React</figcaption>
      <div onClickCapture={showActions ? () => setActionEvent("") : undefined}>{renderer}</div>
      {errors.length > 0 && (
        <ul className="openui-errors" role="alert">
          {errors.map((error, index) => (
            <li key={index}>
              <code>{error.code}</code> {error.message}
            </li>
          ))}
        </ul>
      )}
      {showActions && (
        <output className="openui-action-result">
          {actionEvent || "No action event received."}
        </output>
      )}
    </figure>
  );
}
