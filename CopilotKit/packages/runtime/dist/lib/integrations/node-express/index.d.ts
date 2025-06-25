import * as graphql_yoga from 'graphql-yoga';
import { b as CreateCopilotRuntimeServerOptions, G as GraphQLContext } from '../../../shared-bd953ebf.js';
import 'graphql';
import 'pino';
import '@copilotkit/shared';
import '../../../langserve-fc5cac89.js';
import '../../../index-d4614f9b.js';
import '../../../graphql/types/base/index.js';
import 'rxjs';
import '../../cloud/index.js';
import '@ag-ui/client';

declare function copilotRuntimeNodeExpressEndpoint(options: CreateCopilotRuntimeServerOptions): graphql_yoga.YogaServerInstance<{}, Partial<GraphQLContext>>;

export { copilotRuntimeNodeExpressEndpoint };
