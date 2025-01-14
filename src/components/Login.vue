<script>
import user from "./../scripts/user.js"
import {onMounted, ref} from "vue";

//const apiURL = process.env.API_URL || import.meta.env.API_URL;
const apiURL = "https://live-api.tigers.gay/api/v1/";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      signupToken: "",
      isRegister: false,
      errorMessage: "",
      requireToken: undefined,
      stateObj: {
        register :{
          name: 'Register',
          message: 'Already have an account? login.',
          toggle: 'Already have an account?'
        },
        login : {
          name: 'Login',
          message: 'Register',
          toggle: 'Need to create an account?'
        }
      }
    };
  },
  methods: {
    login() {
      const { username, password } = this;
      user.login(apiURL, username, password).then(r => {
        if(!r){
          this.errorMessage = "Failed to login!"
        }
        else{
          window.location.reload()
        }
      })
    },
    register() {
      if(this.password === this.confirmPassword){
        this.errorMessage = ""
        user.createUser(apiURL, this.username, this.password, this.signupToken).then(r => {
          this.$refs.form.reset()
          if(!r){
            this.errorMessage = "Could not create account!"
          }
          else{
            window.location.reload()
          }
        })
      }
      else {
        this.errorMessage = "Passwords do not match!"
      }
    },
    swap() {
      if(this.requireToken === undefined){
        user.needsSignupToken("https://live-api.tigers.gay/api/v1/").then(r => this.requireToken = r)
      }
      this.isRegister = !this.isRegister
    }
  }
};
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height fill-width>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>{{isRegister ? stateObj.register.name : stateObj.login.name}} form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <form ref="form" @submit.prevent="isRegister ? register() : login()">
                  <v-text-field
                      v-model="username"
                      name="username"
                      label="Username"
                      type="text"
                      placeholder="Username"
                      required
                  ></v-text-field>

                  <v-text-field
                      v-model="password"
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="Password"
                      required
                  ></v-text-field>

                  <v-text-field v-if="isRegister"
                                v-model="confirmPassword"
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm Password"
                                required
                  ></v-text-field>

                  <v-text-field v-if="isRegister && requireToken"
                                v-model="signupToken"
                                name="signupToken"
                                label="Signup Token"
                                type="text"
                                placeholder="Signup Token"
                                required
                  ></v-text-field>
                  <div class="red--text"> {{errorMessage}}</div>
                  <v-btn type="submit" class="mt-4" color="primary" value="log in">{{isRegister ? stateObj.register.name : stateObj.login.name}}</v-btn>
                  <div class="grey--text mt-4" v-on:click="swap()">
                    {{isRegister ? stateObj.register.toggle : stateObj.login.toggle}}
                  </div>
                </form>
              </v-card-text>
            </v-card>

          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>

</style>