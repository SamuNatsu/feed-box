<script lang="ts" setup>
import { LogicalSize, appWindow } from '@tauri-apps/api/window';
import { onBeforeMount, watch } from 'vue';

// Stores
import { useWindowStore } from '@/stores/window';

// Icons
import MdiWindowClose from '~icons/mdi/window-close';
import MdiWindowMaximize from '~icons/mdi/window-maximize';
import MdiWindowMinimize from '~icons/mdi/window-minimize';
import MdiWindowRestore from '~icons/mdi/window-restore';

// Injects
const { height, width, maximised, restore } = useWindowStore();

// Watches
watch(maximised, (): void => {
  if (maximised.value) {
    document
      .querySelector<HTMLDivElement>('#app')!
      .setAttribute('full-screen', '');
  } else {
    document
      .querySelector<HTMLDivElement>('#app')!
      .removeAttribute('full-screen');
  }
});

// Hooks
onBeforeMount(async (): Promise<void> => {
  await appWindow.onResized(async ({ payload }): Promise<void> => {
    const curState: boolean = await appWindow.isMaximized();
    if (curState !== maximised.value) {
      maximised.value = await appWindow.isMaximized();
    } else {
      const scale: number = await appWindow.scaleFactor();
      const logicalSize: LogicalSize = payload.toLogical(scale);
      height.value = Math.trunc(logicalSize.height);
      width.value = Math.trunc(logicalSize.width);
    }
  });

  await restore();
});
</script>

<template>
  <div
    class="bg-blue-500 flex justify-between select-none text-white"
    data-tauri-drag-region>
    <h1 class="leading-none px-2 py-2">Feed Box</h1>
    <div class="flex">
      <button
        @click="appWindow.minimize()"
        class="px-4 transition-colors hover:bg-blue-600">
        <MdiWindowMinimize />
      </button>
      <button
        @click="appWindow.toggleMaximize()"
        class="px-4 transition-colors hover:bg-blue-600">
        <MdiWindowRestore v-if="maximised" />
        <MdiWindowMaximize v-else />
      </button>
      <button
        @click="appWindow.close()"
        class="px-4 transition-colors hover:bg-red-500">
        <MdiWindowClose />
      </button>
    </div>
  </div>
</template>
