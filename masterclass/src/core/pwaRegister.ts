// Types for the virtual module (vanilla registerSW API). tsconfig.json loads no ambient types, so the reference is explicit.
/// <reference types="vite-plugin-pwa/vanillajs" />
/**
 * The only import of vite-plugin-pwa's virtual module. pwa.ts loads this file on demand, so unit
 * tests (which inject a fake register function) never need the plugin. The plugin block in
 * vite.config.ts provides the module; without it a build that reaches this file fails to resolve
 * "virtual:pwa-register".
 */
export { registerSW } from 'virtual:pwa-register';
