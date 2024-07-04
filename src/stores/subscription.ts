/// Subscription store
import { i18n } from '@/i18n';
import { confirm } from '@tauri-apps/api/dialog';
import { createGlobalState, useLocalStorage } from '@vueuse/core';
import { v4 as uuid4 } from 'uuid';
import { ComputedRef, Ref, computed } from 'vue';
import { Composer } from 'vue-i18n';

// Types
export type Subscription = {
  uuid: string;
  name: string;
  url: string;
  icon: string | null;
  updated_at: Date | null;
};

// Export store
export const useSubscriptionStore = createGlobalState(() => {
  /// States
  const subscriptions: Ref<Subscription[]> = useLocalStorage(
    'subscriptions',
    []
  );

  /// Getters
  const uuidToSubscriptionMap: ComputedRef<
    Record<string, Subscription & { index: number }>
  > = computed(
    (): Record<string, Subscription & { index: number }> =>
      subscriptions.value.reduce(
        (
          prev: Record<string, Subscription & { index: number }>,
          cur: Subscription,
          curIdx: number
        ): Record<string, Subscription & { index: number }> => {
          prev[cur.uuid] = { ...cur, index: curIdx };
          return prev;
        },
        {}
      )
  );

  /// Actions
  const addNew = (): void => {
    const { t } = i18n.global as Composer;

    subscriptions.value.unshift({
      uuid: uuid4(),
      name: t('subscriptions.default_name'),
      url: 'http://example.com/feed.xml',
      icon: null,
      updated_at: null
    });
  };
  const moveUp = (uuid: string): void => {
    const idx: number = uuidToSubscriptionMap.value[uuid].index;
    if (idx === 0) {
      return;
    }

    const el: Subscription = subscriptions.value[idx];
    subscriptions.value.splice(idx, 1);
    subscriptions.value.splice(idx - 1, 0, el);
  };
  const moveDown = (uuid: string): void => {
    const idx: number = uuidToSubscriptionMap.value[uuid].index;
    if (idx === subscriptions.value.length - 1) {
      return;
    }

    const el: Subscription = subscriptions.value[idx];
    subscriptions.value.splice(idx, 1);
    subscriptions.value.splice(idx + 1, 0, el);
  };
  const remove = async (uuid: string): Promise<void> => {
    const { t } = i18n.global as Composer;

    const ret: boolean = await confirm(
      t('subscriptions._dialogs.confirm_delete.msg', {
        name: uuidToSubscriptionMap.value[uuid].name,
        url: uuidToSubscriptionMap.value[uuid].url
      }),
      {
        title: t('subscriptions._dialogs.confirm_delete.title'),
        type: 'warning',
        okLabel: t('subscriptions._dialogs.confirm_delete.ok'),
        cancelLabel: t('subscriptions._dialogs.confirm_delete.cancel'),
      }
    );
    if (ret) {
      subscriptions.value = subscriptions.value.filter(
        (v: Subscription): boolean => v.uuid !== uuid
      );
    }
  };

  /// Return
  return { subscriptions, addNew, moveUp, moveDown, remove };
});
