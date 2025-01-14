<template>
  <header>

  </header>

  <main>
    <Home v-if="isAuthenticated" />
    <Login v-else />
  </main>
</template>

<script>
import Home from "@/components/Home.vue"
import Login from "@/components/Login.vue"

import user from "./scripts/user.js"
import {onMounted, ref} from "vue";

export default {
  components: {
    Home,
    Login
  },
  setup() {
    const isAuthenticated = ref(false)

    onMounted(async () => {
      //isAuthenticated.value = await user.isAuthenticated(import.meta.env.API_URL)
      isAuthenticated.value = await user.isAuthenticated("https://live-api.tigers.gay/api/v1/")
    })

    return {
      isAuthenticated
    }
  }
}
</script>

<style scoped>

</style>
