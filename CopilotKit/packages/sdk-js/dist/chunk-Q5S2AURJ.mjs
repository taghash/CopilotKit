var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/langgraph.ts
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch";
import { convertJsonSchemaToZodSchema, randomId, CopilotKitMisuseError } from "@copilotkit/shared";
import { Annotation, MessagesAnnotation, interrupt } from "@langchain/langgraph";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { AIMessage } from "@langchain/core/messages";
var CopilotKitPropertiesAnnotation = Annotation.Root({
  actions: Annotation
});
var CopilotKitStateAnnotation = Annotation.Root({
  copilotkit: Annotation,
  ...MessagesAnnotation.spec
});
function copilotkitCustomizeConfig(baseConfig, options) {
  if (baseConfig && typeof baseConfig !== "object") {
    throw new CopilotKitMisuseError({
      message: "baseConfig must be an object or null/undefined"
    });
  }
  if (options && typeof options !== "object") {
    throw new CopilotKitMisuseError({
      message: "options must be an object when provided"
    });
  }
  if (options == null ? void 0 : options.emitIntermediateState) {
    if (!Array.isArray(options.emitIntermediateState)) {
      throw new CopilotKitMisuseError({
        message: "emitIntermediateState must be an array when provided"
      });
    }
    options.emitIntermediateState.forEach((state, index) => {
      if (!state || typeof state !== "object") {
        throw new CopilotKitMisuseError({
          message: `emitIntermediateState[${index}] must be an object`
        });
      }
      if (!state.stateKey || typeof state.stateKey !== "string") {
        throw new CopilotKitMisuseError({
          message: `emitIntermediateState[${index}] must have a valid 'stateKey' string property`
        });
      }
      if (!state.tool || typeof state.tool !== "string") {
        throw new CopilotKitMisuseError({
          message: `emitIntermediateState[${index}] must have a valid 'tool' string property`
        });
      }
      if (state.toolArgument && typeof state.toolArgument !== "string") {
        throw new CopilotKitMisuseError({
          message: `emitIntermediateState[${index}].toolArgument must be a string when provided`
        });
      }
    });
  }
  try {
    const metadata = (baseConfig == null ? void 0 : baseConfig.metadata) || {};
    if (options == null ? void 0 : options.emitAll) {
      metadata["copilotkit:emit-tool-calls"] = true;
      metadata["copilotkit:emit-messages"] = true;
    } else {
      if ((options == null ? void 0 : options.emitToolCalls) !== void 0) {
        metadata["copilotkit:emit-tool-calls"] = options.emitToolCalls;
      }
      if ((options == null ? void 0 : options.emitMessages) !== void 0) {
        metadata["copilotkit:emit-messages"] = options.emitMessages;
      }
    }
    if (options == null ? void 0 : options.emitIntermediateState) {
      const snakeCaseIntermediateState = options.emitIntermediateState.map((state) => ({
        tool: state.tool,
        tool_argument: state.toolArgument,
        state_key: state.stateKey
      }));
      metadata["copilotkit:emit-intermediate-state"] = snakeCaseIntermediateState;
    }
    baseConfig = baseConfig || {};
    return {
      ...baseConfig,
      metadata
    };
  } catch (error) {
    throw new CopilotKitMisuseError({
      message: `Failed to customize config: ${error instanceof Error ? error.message : String(error)}`
    });
  }
}
__name(copilotkitCustomizeConfig, "copilotkitCustomizeConfig");
async function copilotkitExit(config) {
  if (!config) {
    throw new CopilotKitMisuseError({
      message: "LangGraph configuration is required for copilotkitExit"
    });
  }
  try {
    await dispatchCustomEvent("copilotkit_exit", {}, config);
  } catch (error) {
    throw new CopilotKitMisuseError({
      message: `Failed to dispatch exit event: ${error instanceof Error ? error.message : String(error)}`
    });
  }
}
__name(copilotkitExit, "copilotkitExit");
async function copilotkitEmitState(config, state) {
  if (!config) {
    throw new CopilotKitMisuseError({
      message: "LangGraph configuration is required for copilotkitEmitState"
    });
  }
  if (state === void 0) {
    throw new CopilotKitMisuseError({
      message: "State is required for copilotkitEmitState"
    });
  }
  try {
    await dispatchCustomEvent("copilotkit_manually_emit_intermediate_state", state, config);
  } catch (error) {
    throw new CopilotKitMisuseError({
      message: `Failed to emit state: ${error instanceof Error ? error.message : String(error)}`
    });
  }
}
__name(copilotkitEmitState, "copilotkitEmitState");
async function copilotkitEmitMessage(config, message) {
  if (!config) {
    throw new CopilotKitMisuseError({
      message: "LangGraph configuration is required for copilotkitEmitMessage"
    });
  }
  if (!message || typeof message !== "string") {
    throw new CopilotKitMisuseError({
      message: "Message must be a non-empty string for copilotkitEmitMessage"
    });
  }
  try {
    await dispatchCustomEvent("copilotkit_manually_emit_message", {
      message,
      message_id: randomId(),
      role: "assistant"
    }, config);
  } catch (error) {
    throw new CopilotKitMisuseError({
      message: `Failed to emit message: ${error instanceof Error ? error.message : String(error)}`
    });
  }
}
__name(copilotkitEmitMessage, "copilotkitEmitMessage");
async function copilotkitEmitToolCall(config, name, args) {
  if (!config) {
    throw new CopilotKitMisuseError({
      message: "LangGraph configuration is required for copilotkitEmitToolCall"
    });
  }
  if (!name || typeof name !== "string") {
    throw new CopilotKitMisuseError({
      message: "Tool name must be a non-empty string for copilotkitEmitToolCall"
    });
  }
  if (args === void 0) {
    throw new CopilotKitMisuseError({
      message: "Tool arguments are required for copilotkitEmitToolCall"
    });
  }
  try {
    await dispatchCustomEvent("copilotkit_manually_emit_tool_call", {
      name,
      args,
      id: randomId()
    }, config);
  } catch (error) {
    throw new CopilotKitMisuseError({
      message: `Failed to emit tool call '${name}': ${error instanceof Error ? error.message : String(error)}`
    });
  }
}
__name(copilotkitEmitToolCall, "copilotkitEmitToolCall");
function convertActionToDynamicStructuredTool(actionInput) {
  if (!actionInput) {
    throw new CopilotKitMisuseError({
      message: "Action input is required but was not provided"
    });
  }
  if (!actionInput.name || typeof actionInput.name !== "string") {
    throw new CopilotKitMisuseError({
      message: "Action must have a valid 'name' property of type string"
    });
  }
  if (!actionInput.description || typeof actionInput.description !== "string") {
    throw new CopilotKitMisuseError({
      message: `Action '${actionInput.name}' must have a valid 'description' property of type string`
    });
  }
  if (!actionInput.parameters) {
    throw new CopilotKitMisuseError({
      message: `Action '${actionInput.name}' must have a 'parameters' property`
    });
  }
  try {
    return new DynamicStructuredTool({
      name: actionInput.name,
      description: actionInput.description,
      schema: convertJsonSchemaToZodSchema(actionInput.parameters, true),
      func: async () => {
        return "";
      }
    });
  } catch (error) {
    throw new CopilotKitMisuseError({
      message: `Failed to convert action '${actionInput.name}' to DynamicStructuredTool: ${error instanceof Error ? error.message : String(error)}`
    });
  }
}
__name(convertActionToDynamicStructuredTool, "convertActionToDynamicStructuredTool");
function convertActionsToDynamicStructuredTools(actions) {
  if (!Array.isArray(actions)) {
    throw new CopilotKitMisuseError({
      message: "Actions must be an array"
    });
  }
  return actions.map((action, index) => {
    try {
      return convertActionToDynamicStructuredTool(action);
    } catch (error) {
      throw new CopilotKitMisuseError({
        message: `Failed to convert action at index ${index}: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  });
}
__name(convertActionsToDynamicStructuredTools, "convertActionsToDynamicStructuredTools");
function copilotKitInterrupt({ message, action, args }) {
  if (!message && !action) {
    throw new CopilotKitMisuseError({
      message: "Either message or action (and optional arguments) must be provided for copilotKitInterrupt"
    });
  }
  if (action && typeof action !== "string") {
    throw new CopilotKitMisuseError({
      message: "Action must be a string when provided to copilotKitInterrupt"
    });
  }
  if (message && typeof message !== "string") {
    throw new CopilotKitMisuseError({
      message: "Message must be a string when provided to copilotKitInterrupt"
    });
  }
  if (args && typeof args !== "object") {
    throw new CopilotKitMisuseError({
      message: "Args must be an object when provided to copilotKitInterrupt"
    });
  }
  let interruptValues = null;
  let interruptMessage = null;
  let answer = null;
  try {
    if (message) {
      interruptValues = message;
      interruptMessage = new AIMessage({
        content: message,
        id: randomId()
      });
    } else {
      const toolId = randomId();
      interruptMessage = new AIMessage({
        content: "",
        tool_calls: [
          {
            id: toolId,
            name: action,
            args: args ?? {}
          }
        ]
      });
      interruptValues = {
        action,
        args: args ?? {}
      };
    }
    const response = interrupt({
      __copilotkit_interrupt_value__: interruptValues,
      __copilotkit_messages__: [
        interruptMessage
      ]
    });
    answer = response[response.length - 1].content;
    return {
      answer,
      messages: response
    };
  } catch (error) {
    throw new CopilotKitMisuseError({
      message: `Failed to create interrupt: ${error instanceof Error ? error.message : String(error)}`
    });
  }
}
__name(copilotKitInterrupt, "copilotKitInterrupt");

export {
  CopilotKitPropertiesAnnotation,
  CopilotKitStateAnnotation,
  copilotkitCustomizeConfig,
  copilotkitExit,
  copilotkitEmitState,
  copilotkitEmitMessage,
  copilotkitEmitToolCall,
  convertActionToDynamicStructuredTool,
  convertActionsToDynamicStructuredTools,
  copilotKitInterrupt
};
//# sourceMappingURL=chunk-Q5S2AURJ.mjs.map