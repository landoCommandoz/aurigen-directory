/**
 * Settings feature: the export contract the shell mounts.
 *   /settings            SettingsHome
 *   /settings/setup      SetupFlow
 *   /settings/device     DeviceRoleScreen
 *   /settings/backup     BackupScreen
 *   /settings/developer  DeveloperPanel (page); <DeveloperPanel open onClose> is the slide-over
 *   above the app frame  DevicePreviewBar (renders nothing unless developer tools are enabled)
 * Hooks for the shell: useSetupState (setup and "Backup due" banners), useHandedness (thumb side),
 * usePreviewWidth (the preview wrapper's width), useDeveloperToolsEnabled (show the dev tools).
 */
export { SettingsHome } from './SettingsHome';
export { SetupFlow } from './SetupFlow';
export { DeviceRoleScreen } from './DeviceRoleScreen';
export { BackupScreen } from './BackupScreen';
export { DeveloperPanel } from './DeveloperPanel';
export type { DeveloperPanelProps } from './DeveloperPanel';
export { DevicePreviewBar } from './DevicePreviewBar';
export type { DevicePreviewBarProps } from './DevicePreviewBar';
export { useSetupState, useHandedness, setHandedness } from './hooks';
export type { SetupState, Handedness } from './hooks';
export { usePreviewWidth, setPreviewWidth, getPreviewWidth, PREVIEW_WIDTHS } from './previewWidth';
export type { PreviewWidth } from './previewWidth';
export { useDeveloperToolsEnabled, isDevBuild } from './devTools';
