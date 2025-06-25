// src/types/base/base-autosuggestions-config.tsx
import { defaultCopilotContextCategories } from "@copilotkit/react-core";
import { isMacOS } from "@copilotkit/shared";
var defaultShouldToggleHoveringEditorOnKeyPress = (event, shortcut) => {
  const isMetaKey = isMacOS() ? event.metaKey : event.ctrlKey;
  return event.key === shortcut && isMetaKey;
};
var defaultShouldAcceptAutosuggestionOnKeyPress = (event) => {
  if (event.key === "Tab") {
    return true;
  }
  return false;
};
var defaultShouldAcceptAutosuggestionOnTouch = () => false;
var defaultBaseAutosuggestionsConfig = {
  debounceTime: 250,
  contextCategories: defaultCopilotContextCategories,
  disableWhenEmpty: true,
  disabled: false,
  temporarilyDisableWhenMovingCursorWithoutChangingText: true,
  temporarilyDisableNotTrustedEvents: true,
  shouldToggleHoveringEditorOnKeyPress: defaultShouldToggleHoveringEditorOnKeyPress,
  shouldAcceptAutosuggestionOnKeyPress: defaultShouldAcceptAutosuggestionOnKeyPress,
  shouldAcceptAutosuggestionOnTouch: defaultShouldAcceptAutosuggestionOnTouch
};

export {
  defaultBaseAutosuggestionsConfig
};
//# sourceMappingURL=chunk-F6RLSVG3.mjs.map