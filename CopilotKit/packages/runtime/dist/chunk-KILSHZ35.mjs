import {
  copilotRuntimeNodeHttpEndpoint,
  getRuntimeInstanceTelemetryInfo,
  telemetry_client_default
} from "./chunk-45L3PJR3.mjs";
import {
  __name
} from "./chunk-FHD4JECV.mjs";

// src/lib/integrations/nest/index.ts
function copilotRuntimeNestEndpoint(options) {
  telemetry_client_default.setGlobalProperties({
    runtime: {
      framework: "nest"
    }
  });
  telemetry_client_default.capture("oss.runtime.instance_created", getRuntimeInstanceTelemetryInfo(options));
  return copilotRuntimeNodeHttpEndpoint(options);
}
__name(copilotRuntimeNestEndpoint, "copilotRuntimeNestEndpoint");

export {
  copilotRuntimeNestEndpoint
};
//# sourceMappingURL=chunk-KILSHZ35.mjs.map