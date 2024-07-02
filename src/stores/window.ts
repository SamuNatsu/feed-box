/// Window store
import {
  LogicalPosition,
  LogicalSize,
  appWindow
} from '@tauri-apps/api/window';
import { createGlobalState, useLocalStorage } from '@vueuse/core';
import { Ref } from 'vue';

// Types
type WindowPosition = {
  x: number;
  y: number;
};
type WindowSize = {
  w: number;
  h: number;
};

// Export store
export const useWindowStore = createGlobalState(() => {
  /// States
  const maximised: Ref<boolean> = useLocalStorage('window-maximized', false);
  const position: Ref<WindowPosition> = useLocalStorage('window-position', {
    x: 100,
    y: 100
  });
  const size: Ref<WindowSize> = useLocalStorage('window-size', {
    w: 800,
    h: 600
  });

  /// Actions
  const restore = async (): Promise<void> => {
    await appWindow.setPosition(
      new LogicalPosition(position.value.x, position.value.y)
    );
    await appWindow.setSize(new LogicalSize(size.value.w, size.value.h));
    if (maximised.value) {
      await appWindow.maximize();
    }
  };

  /// Return
  return { maximised, position, size, restore };
});
