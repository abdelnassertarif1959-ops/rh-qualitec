<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- Portal/Teleport Container - Sempre no topo da hierarquia -->
    <div id="teleports" class="relative z-[9999]"></div>
  </div>
</template>
