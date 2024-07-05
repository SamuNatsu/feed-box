<script setup lang="ts">
// Stores
import { useSubscriptionStore } from '@/stores/subscription';

// Components
import SubscriptionItem from '@/components/SubscriptionItem.vue';

// Injects
const { subscriptions, addNew } = useSubscriptionStore();
</script>

<template>
  <div class="bg-white flex-1 overflow-y-auto px-2 py-1">
    <h1 class="font-bold text-2xl">{{ $t('subscriptions.title') }}</h1>
    <div class="mt-2">
      <button
        @click="addNew()"
        class="bg-blue-200 px-2 py-1 rounded-md transition-colors hover:bg-blue-500 hover:text-white">
        {{ $t('subscriptions._buttons.add') }}
      </button>
    </div>
    <TransitionGroup class="flex flex-col gap-2 mt-4" tag="div">
      <SubscriptionItem
        v-for="(i, idx) in subscriptions"
        :index="idx"
        :key="i.uuid"
        :subscription="i"
        :total="subscriptions.length" />
      <h1
        v-if="subscriptions.length === 0"
        class="font-bold py-20 select-none text-3xl text-center text-neutral-300">
        {{ $t('subscriptions.no_subscription') }}
      </h1>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.v-move,
.v-enter-active,
.v-leave-active {
  @apply duration-200 transition-all;
}

.v-enter-from,
.v-leave-to {
  @apply opacity-0 -translate-y-6 w-[calc(100%-1rem-2px)];
}

.v-leave-active {
  @apply absolute;
}
</style>
