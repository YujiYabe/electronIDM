<template>
  <v-app>
    <!-- <v-app-bar app>
      <v-toolbar-title class='headline text-uppercase'>
        <span>Vuetify</span>
        <span class='font-weight-light'>MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text href='https://github.com/vuetifyjs/vuetify/releases/latest' target='_blank'>
        <span class='mr-2'>Latest Release</span>
      </v-btn>
    </v-app-bar>-->

    <v-content>
      <!-- <HelloWorld /> -->
      <div id="flexbox_rght_pane" v-if="testvalue == null">
        <RightFrame />
      </div>
    </v-content>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld'
import RightFrame from './components/RightFrame'

export default {
  name: 'App',
  components: {
    // HelloWorld
    RightFrame
  },
  computed: {
    testvalue () {
      console.log(this.$store.getters['testvalue'])
      return this.$store.getters['testvalue']
    }
  },

  data: () => ({
    //
  })
}
</script>
