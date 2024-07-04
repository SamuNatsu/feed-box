<script setup lang="ts">
import { Subscription, useSubscriptionStore } from '@/stores/subscription';

// Icons
import MdiArrowDownThin from '~icons/mdi/arrow-down-thin';
import MdiArrowUpThin from '~icons/mdi/arrow-up-thin';
import MdiEdit from '~icons/mdi/edit';
import MdiDelete from '~icons/mdi/delete';
import MdiRssFeed from '~icons/mdi/rss-feed';

// Props
defineProps<{
  index: number;
  subscription: Subscription;
  total: number;
}>();

// Injects
const { moveUp, moveDown, remove } = useSubscriptionStore();

// Functions
const getTimeSpan = (datetime: Date): string => {
  let span: number = Math.trunc((Date.now() - datetime.getTime()) / 1000);

  const hours: number = Math.trunc(span / 3600);
  span %= 3600;
  if (hours > 99) {
    return '99h+';
  }

  const minutes: number = Math.trunc(span / 60);
  const secounds: number = minutes % 60;

  return (
    (hours > 0 ? `${hours}h` : '') +
    (minutes > 0 ? `${minutes}m` : '') +
    (secounds > 0 ? `${secounds}s` : '')
  );
};
</script>

<template>
  <div
    class="border-2 border-blue-300 flex group items-center justify-between p-2 rounded-lg transition-colors hover:bg-blue-50">
    <div class="flex gap-2 items-center">
      <MdiRssFeed
        v-if="subscription.icon === null"
        class="leading-none text-3xl" />
      <img v-else class="h-[30px] w-[30px]" :src="subscription.icon" />
      <div class="flex flex-col gap-1">
        <div class="flex gap-2 items-baseline">
          <h2 class="font-semibold leading-none text-lg">
            {{ subscription.name }}
          </h2>
          <p v-if="subscription.updated_at !== null" class="leading-none">
            {{ getTimeSpan(subscription.updated_at) }}
          </p>
        </div>
        <p class="leading-none text-sm">{{ subscription.url }}</p>
      </div>
    </div>
    <div class="gap-1 hidden items-center group-hover:flex">
      <button
        v-if="index > 0"
        @click="moveUp(subscription.uuid)"
        class="flex h-8 items-center justify-center overflow-hidden transition-colors rounded-full w-8 hover:bg-blue-200"
        :title="$t('subscriptions._buttons.move_up')">
        <MdiArrowUpThin class="text-2xl" />
      </button>
      <button
        v-if="index < total - 1"
        @click="moveDown(subscription.uuid)"
        class="flex h-8 items-center justify-center overflow-hidden transition-colors rounded-full w-8 hover:bg-blue-200"
        :title="$t('subscriptions._buttons.move_down')">
        <MdiArrowDownThin class="text-2xl" />
      </button>
      <button
        class="flex h-8 items-center justify-center overflow-hidden transition-colors rounded-full w-8 hover:bg-blue-200"
        :title="$t('subscriptions._buttons.edit')">
        <MdiEdit />
      </button>
      <button
        @click="remove(subscription.uuid)"
        class="flex h-8 items-center justify-center overflow-hidden transition-colors rounded-full w-8 hover:bg-blue-200"
        :title="$t('subscriptions._buttons.delete')">
        <MdiDelete />
      </button>
    </div>
  </div>
</template>
