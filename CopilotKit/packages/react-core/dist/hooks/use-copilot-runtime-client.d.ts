import { CopilotRuntimeClientOptions, CopilotRuntimeClient } from '@copilotkit/runtime-client-gql';
import { CopilotTraceHandler } from '@copilotkit/shared';

interface CopilotRuntimeClientHookOptions extends CopilotRuntimeClientOptions {
    showDevConsole?: boolean;
    onTrace?: CopilotTraceHandler;
}
declare const useCopilotRuntimeClient: (options: CopilotRuntimeClientHookOptions) => CopilotRuntimeClient;

export { CopilotRuntimeClientHookOptions, useCopilotRuntimeClient };
