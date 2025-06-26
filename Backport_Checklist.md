```markdown
# CopilotKit Packages Backport: Product Requirements and Checklist

## 1. Overview & Goals

The primary goal of this project is to backport the suite of `@copilotkit/*` packages to ensure compatibility with an older, specific technology stack. This will enable integration of CopilotKit functionalities into existing React projects that are constrained by these older versions and cannot easily upgrade.

The project involves modifying all packages within the `CopilotKit/packages` directory of this monorepo. Success is defined by the ability to install these backported packages into a host React application running the target stack, import their components/functions, and utilize their core features without build-time or runtime errors related to version incompatibilities.

## 2. Target Technology Stack for Compatibility

The backported `@copilotkit/*` packages must be compatible with and usable in a React project built with the following specific versions:

*   **React:** `16.13.1`
*   **React Scripts:** `3.4.0` (This implies Create React App v3.x, which includes Webpack 4, Babel 7)
*   **Babel Preset React App:** `7.8.3` (This is the Babel configuration used by `react-scripts 3.4.0`)
*   **Node.js:** `12.13.1` (This is the runtime environment for both the build process of the host application and the runtime for any server-side aspects of CopilotKit if used in a Node context directly)
*   **PNPM:** (While the specific version isn't a "target" for compatibility, it's the package manager for this monorepo, current version `9.5.0`. The backported packages should still be buildable and manageable with pnpm in a Node 12.13.1 environment).

## 3. Scope of Work

*   **All Packages:** All packages under `CopilotKit/packages/` are in scope. This includes:
    *   `@copilotkit/shared`
    *   `@copilotkit/runtime`
    *   `@copilotkit/runtime-client-gql`
    *   `@copilotkit/react-core`
    *   `@copilotkit/react-textarea`
    *   `@copilotkit/react-ui`
    *   `@copilotkit/sdk-js`
*   **Dependency Management:**
    *   Downgrade all direct and peer dependencies (including React, ReactDOM, TypeScript, Jest, Zod, UI libraries, etc.) to versions compatible with the target stack.
    *   Replace `workspace:*` protocol with relative `file:` paths during development and then with fixed version numbers for publishing (e.g., `x.y.z-react16-backport.0`).
*   **Code Refactoring:**
    *   Modify JavaScript/TypeScript code to remove or polyfill features not supported by Node 12 or browsers targeted by React 16 + Babel 7.
    *   Adjust code to accommodate API changes in downgraded dependencies (e.g., `react-markdown` v10/v8 to v6).
    *   Ensure React code uses patterns compatible with React 16 (e.g., avoiding React 17/18+ specific hooks or behaviors).
*   **Build System Adjustments:**
    *   Downgrade `tsup` to a version compatible with Node 12.
    *   Modify `tsup.config.ts` files to align with the older `tsup` version and to output ES5-compatible code.
    *   Adjust global and per-package `tsconfig.json` files (e.g., `target: "es5"`, `jsx: "react"`).
*   **Testing:** Ensure existing tests (or modified versions) pass in the backported environment. This primarily means tests should run correctly with downgraded Jest and related tooling in a Node 12 environment.
*   **Monorepo Integrity:** The pnpm workspace and turbo build setup should remain functional for building the backported packages.

## 4. Key Challenges & Known Issues

*   **Node Version Control:** The development environment *must* strictly use Node 12.13.1.
*   **`tsup` Compatibility:** The current `tsup` version (`^6.7.0`) requires Node 14+. This will need to be downgraded, and configurations adapted.
*   **`react-markdown` Downgrade:** `react-markdown` needs to be downgraded from v8/v10 to v6, which will involve significant API changes and refactoring of its usage in `@copilotkit/react-core` and `@copilotkit/react-ui`.
*   **`workspace:*` Protocol:** This needs to be systematically replaced.
*   **Transitive Dependencies:** Many deep dependencies might have their own Node/React version requirements that need careful investigation.
*   **Polyfills:** Code relying on newer JS built-ins not present in Node 12 or target browsers will need polyfills.
*   **TypeScript Version:** Finding a TypeScript version that works with Node 12, an older `tsup`, and the codebase will be key. Initial thought: `~3.8.3`.

## 5. Deliverables

*   A new branch in the repository (e.g., `feat/backport-react16`) containing all changes.
*   All `@copilotkit/*` packages modified to meet the compatibility requirements.
*   Updated `package.json` files with correctly versioned dependencies.
*   Successful build of all packages using `pnpm turbo run build` in a Node 12.13.1 environment.
*   (Ideally) A simple example project demonstrating that the backported packages can be installed and used in an application running the target stack.
*   This document (`Backport_Checklist.md`) updated with progress and any new findings.

# Backport Checklist for CopilotKit to React 16 / Node 12

This checklist outlines the major steps and considerations for backporting the CopilotKit packages to be compatible with React 16.13.1, react-scripts 3.4.0, babel-preset-react-app 7.8.3, and Node 12.13.1.

## Phase 0: Environment and Global Setup

-   [ ] **Set Sandbox Node Version:** Ensure the development/testing environment is strictly using Node.js v12.13.1.
    -   Current Node version in sandbox: (Needs verification, was v22.16.0)
    -   Target Node version: v12.13.1
-   [ ] **Git Branch:** Create and work on a dedicated branch (e.g., `feat/backport-react16`).
-   [ ] **Global `typescript` Version:** Downgrade the root `CopilotKit/package.json` to use a TypeScript version compatible with Node 12 and chosen tooling (e.g., `~3.8.3` initially, may need adjustment based on `tsup` compatibility).
-   [ ] **Global `@types/node` Version:** Downgrade in root `CopilotKit/package.json` to match Node 12 (e.g., `^12.13.0`).
-   [ ] **Base `tsconfig.json` (`CopilotKit/utilities/tsconfig/base.json`):**
    -   [ ] Set `compilerOptions.target` to `"es5"`.
    -   [ ] Set `compilerOptions.jsx` to `"react"`.
    -   [ ] Set `compilerOptions.lib` to include `["es2015", "dom"]`.
-   [ ] **`tsup` Version and Configuration:**
    -   [ ] Identify and downgrade `tsup` in all package.json files to a version compatible with Node 12 (e.g., tsup v4 or v5).
    -   [ ] Update all `tsup.config.ts` files to use the configuration syntax of the downgraded `tsup` version.
    -   [ ] Ensure `tsup` configurations are set to output ES5-compatible JavaScript (e.g., through esbuild options like `target: 'es5'`).

## Phase 1: Core Non-React Package Backporting

For each package (`@copilotkit/shared`, `@copilotkit/runtime`, `@copilotkit/sdk-js`):

-   [ ] **Update `package.json`:**
    -   [ ] Replace `workspace:*` dependencies with `file:../<relative_path>` for local linking during backporting.
    -   [ ] Downgrade `typescript` to the globally decided version.
    -   [ ] Downgrade other devDependencies (Jest, @types/jest, ts-jest, etc.) to Node 12/TS 3.8 compatible versions.
        -   Example: Jest `^24.9.0`, `@types/jest^24.9.0`, `ts-jest^24.3.0`.
    -   [ ] Downgrade direct dependencies to versions compatible with Node 12 and the chosen TypeScript version.
        -   `@copilotkit/shared`:
            -   [ ] `zod` (e.g., `"1.11.15"`)
            -   [ ] `zod-to-json-schema` (e.g., `"3.6.1"`)
            -   [ ] `chalk` (e.g., `^3.0.0`)
            -   [ ] `uuid` (e.g., `^8.3.2`)
        -   `@copilotkit/runtime` & `@copilotkit/sdk-js`:
            -   [ ] `langchain` and `@langchain/*`
            -   [ ] `openai`
            -   [ ] `@anthropic-ai/sdk`
            -   [ ] `groq-sdk`
            -   [ ] GraphQL dependencies
            -   [ ] Other core libraries.
-   [ ] **Refactor Code:** Address any breaking changes from downgraded dependencies or Node 12 JavaScript feature limitations.
-   [ ] **Build:** Run `pnpm --filter <package-name> build`. Troubleshoot and fix errors.
-   [ ] **Test:** Run `pnpm --filter <package-name> test`. Troubleshoot and fix errors.

## Phase 2: React Packages Backporting

For each React package (`@copilotkit/runtime-client-gql`, `@copilotkit/react-core`, `@copilotkit/react-textarea`, `@copilotkit/react-ui`):

-   [ ] **Update `package.json`:**
    -   [ ] Set `peerDependencies` for `react` and `react-dom` to `^16.13.1`.
    -   [ ] Set `devDependencies` for `react` and `react-dom` to `16.13.1`.
    -   [ ] Downgrade `@types/react` and `@types/react-dom` to versions compatible with React 16 (e.g., `^16.9.x`).
    -   [ ] Replace `workspace:*` dependencies.
    -   [ ] Downgrade `typescript` and other devDependencies as in Phase 1.
    -   [ ] Downgrade direct dependencies, paying close attention to:
        -   `@copilotkit/react-core`: `react-markdown` (e.g., `^6.0.3`).
        -   `@copilotkit/react-ui`: `react-markdown` (e.g., `^6.0.3`), `react-syntax-highlighter`, `rehype-raw`, `remark-gfm`, `@headlessui/react`.
        -   `@copilotkit/react-textarea`: `@emotion/*`, `@mui/material`, `@radix-ui/*`, `slate`, `lucide-react`, `tailwindcss`, `postcss`.
        -   `@copilotkit/runtime-client-gql`: GraphQL codegen dependencies, `urql`.
-   [ ] **Refactor Code:**
    -   [ ] Address breaking changes from downgraded dependencies.
    -   [ ] Remove/polyfill React 17/18+ specific APIs (e.g., `useId`, new hooks, automatic batching assumptions).
    -   [ ] Refactor `react-markdown` usage for v6 API.
-   [ ] **Build:** Run `pnpm --filter <package-name> build`. Troubleshoot.
-   [ ] **Test:** Run `pnpm --filter <package-name> test`. Troubleshoot.

## Phase 3: Monorepo Finalization and Verification

-   [ ] **Resolve `workspace:*`:** Update all inter-package dependencies from `file:` paths to specific version numbers (e.g., `1.9.2-react16-backport.0`) that will be used for publishing.
-   [ ] **Root Install & Build:**
    -   [ ] Run `pnpm install` from the monorepo root (`CopilotKit/`).
    -   [ ] Run `pnpm turbo run build` (or equivalent) to build all packages. Troubleshoot.
-   [ ] **Testing in Target Environment (Crucial):**
    -   [ ] Create a minimal test application using `create-react-app` with `react-scripts 3.4.0` and `react@16.13.1`.
    -   [ ] Install the backported packages into this test application.
    -   [ ] Verify that the packages can be imported and basic functionality works at runtime.
-   [ ] **Final Review:** Check all changes, ensure consistency.
-   [ ] **Commit and Submit.**

## Ongoing Considerations

*   **Node 12 Polyfills:** Be vigilant for JavaScript features used in code or dependencies that are not native to Node 12 (e.g., modern `fetch` behavior, certain `Promise` methods, `Array` methods) and add polyfills if `react-scripts` doesn't cover them.
*   **`babel-preset-react-app@7.8.3`:** Understand its capabilities and limitations. `tsup` output must be compatible.
*   **Iterative Process:** Expect to iterate on dependency versions and code refactoring as issues are discovered.
```
