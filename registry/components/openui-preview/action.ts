import { tagSchemaId } from "@openuidev/vue-lang";
import { z } from "zod/v4";

export const action = z.unknown();
tagSchemaId(action, "ActionExpression");
