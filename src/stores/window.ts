/// Window store
import { LogicalSize, appWindow } from '@tauri-apps/api/window';
import { createGlobalState, useLocalStorage } from '@vueuse/core';
import { Ref } from 'vue';

// Export store
export const useWindowStore = createGlobalState(() => {
  /// States
  const height: Ref<number> = useLocalStorage('window-height', 600);
  const width: Ref<number> = useLocalStorage('window-width', 800);
  const maximised: Ref<boolean> = useLocalStorage('window-maximized', false);

  /// Actions
  const restore = async (): Promise<void> => {
    await appWindow.setSize(new LogicalSize(width.value, height.value));
    if (maximised.value) {
      await appWindow.maximize();
    }
  };

  /// Return
  return { height, width, maximised, restore };
});
