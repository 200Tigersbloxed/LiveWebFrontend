<script setup>
import {ref} from "vue";
import user from "@/scripts/user.js";

//const apiURL = process.env.API_URL || import.meta.env.API_URL;
const apiURL = "https://live-api.tigers.gay/api/v1/";

const username = ref(user.getSavedUsername())
const streamKey = ref("")

const locations = ref([])
const items = ref([])
const location = ref(undefined)

user.getServers(apiURL).then(servers => {
  items.value = []
  for (let i = 0; i < servers.length; i++) {
    items.value.push({ title: servers[i] })
  }
  locations.value = servers
  location.value = servers[0]
})

user.getStreamKey(apiURL).then(key => streamKey.value = key)

function getWebRTCUrl(){
  return "https://" + location.value + "/live/" + username.value
}

function logout(){
  user.logout(apiURL).then(r => {
    if(!r){
      alert("Could not log out!")
      return
    }
    window.location.reload()
  })
}

function logoutAll(){
  user.revokeTokens(apiURL).then(r => {
    if(!r){
      alert("Could not log out!")
      return
    }
    window.location.reload()
  })
}

function resetStreamKey(){
  user.resetStreamKey(apiURL).then(r => {
    if(r === undefined){
      alert("Could not reset stream key!")
      return
    }
    streamKey.value = r
  })
}

function getStreamURL(){
  return "https://" + location.value + "/live/" + username.value + "/publish?key=" + streamKey.value + "&video-codec=h264%2F90000&video-bitrate=5000"
}
</script>

<template>
  <div>
    <label>Hello {{username}}!</label>
    <v-select
        v-model="location"
        :items="locations"
        label="Location"
    ></v-select>
    <div v-if="location !== undefined">
      <h2>Start your stream!</h2>
      <label>Set the server to the following text: rtmp://{{location}}/live</label>
      <h3>Stream directly from your Browser</h3>
      <a v-bind:href="getStreamURL()">Click here to start a stream!</a>
      <br/>
      <label>Set the Stream key to the following text: {{username}}?key={{streamKey}}</label>
      <h2>Play your stream back!</h2>
      <label>There's plenty of ways to watch the stream, here's some common ones</label>
      <br/>
      <br/>
      <label>RTMP: rtmp://{{location}}/live/{{username}}</label>
      <br/>
      <label>RTSP: rtsp://{{location}}/live/{{username}}</label>
      <br/>
      <label>RTSP (TCP): rtspt://{{location}}/live/{{username}}</label>
      <br/>
      <label>HLS: https://{{location}}/live/{{username}}/index.m3u8</label>
      <br/>
      <br/>
      <a v-bind:href="getWebRTCUrl()">Or watch in the browser!</a>
      <h2>Manage your account</h2>
      <v-btn
          color="primary"
          dark
          @click="resetStreamKey()"
      >
        Reset Stream Key
      </v-btn>
      <v-btn
          color="primary"
          dark
          @click="logout()"
      >
        Logout
      </v-btn>
      <v-btn
          color="primary"
          dark
          @click="logoutAll()"
      >
        Logout of all Devices
      </v-btn>
    </div>
  </div>
</template>

<style scoped>

</style>