<script lang="ts" setup>
import { UnlistenFn } from '@tauri-apps/api/event';
import {
  LogicalPosition,
  LogicalSize,
  appWindow
} from '@tauri-apps/api/window';
import { onBeforeMount, onBeforeUnmount, watch } from 'vue';
import { Router, useRouter } from 'vue-router';

// Stores
import { useWindowStore } from '@/stores/window';

// Icons
import MdiHomeOutline from '~icons/mdi/home-outline';
import MdiRssFeed from '~icons/mdi/rss-feed';
import MdiSettingsOutline from '~icons/mdi/settings-outline';
import MdiWindowClose from '~icons/mdi/window-close';
import MdiWindowMaximize from '~icons/mdi/window-maximize';
import MdiWindowMinimize from '~icons/mdi/window-minimize';
import MdiWindowRestore from '~icons/mdi/window-restore';

// Injects
const router: Router = useRouter();
const { position, size, maximised, restore } = useWindowStore();

// Non-reactive
let unlistenOnMoved: UnlistenFn;
let unlistenOnResized: UnlistenFn;

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
  unlistenOnMoved = await appWindow.onMoved(
    async ({ payload }): Promise<void> => {
      if (!(await appWindow.isMaximized())) {
        const scale: number = await appWindow.scaleFactor();
        const logicalPosition: LogicalPosition = payload.toLogical(scale);
        position.value = {
          x: Math.trunc(logicalPosition.x),
          y: Math.trunc(logicalPosition.y)
        };
      }
    }
  );
  unlistenOnResized = await appWindow.onResized(
    async ({ payload }): Promise<void> => {
      maximised.value = await appWindow.isMaximized();

      if (!maximised.value) {
        const scale: number = await appWindow.scaleFactor();
        const logicalSize: LogicalSize = payload.toLogical(scale);
        size.value = {
          w: Math.trunc(logicalSize.width),
          h: Math.trunc(logicalSize.height)
        };
      }
    }
  );

  await restore();
});
onBeforeUnmount((): void => {
  unlistenOnMoved();
  unlistenOnResized();
});
</script>

<template>
  <div
    class="bg-blue-500 flex justify-between select-none text-white"
    data-tauri-drag-region>
    <h1 class="leading-none px-2 py-2">Feed Box</h1>
    <div class="flex">
      <button @click="router.push('/')" class="px-4 transition-colors hover:bg-blue-600">
        <MdiHomeOutline />
      </button>
      <button @click="router.push('/feeds')" class="px-4 transition-colors hover:bg-blue-600">
        <MdiRssFeed />
      </button>
      <button @click="router.push('/settings')" class="px-4 transition-colors hover:bg-blue-600">
        <MdiSettingsOutline />
      </button>
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
