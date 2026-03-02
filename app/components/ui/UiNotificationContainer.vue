<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <TransitionGroup name="notification" tag="div">
        <UiNotification
          v-for="notification in notifications"
          :key="notification.id"
          :show="notification.show"
          :title="notification.title"
          :message="notification.message"
          :variant="notification.variant"
          :duration="0"
          @close="removeNotification(notification.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { notifications, removeNotification } = useNotifications()
</script>

<style scoped>
.notification-move,
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-active {
  position: absolute;
  right: 0;
}
</style>