<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
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
    const isAuthenticated = ref(null)

    onMounted(async () => {
      isAuthenticated.value = await user.isAuthenticated(import.meta.env.API_URL)
    })

    return {
      isAuthenticated
    }
  }
}
</script>

<style scoped>

</style>
