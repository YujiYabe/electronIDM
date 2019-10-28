import Vue from 'vue'
import Vuex from 'vuex'
import fs from 'fs'
import path from 'path'
const remote = require('electron').remote
const app = remote.app

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  // mounted () {
  //   // this.methodOpenConfig()
  //   this.$store.actions.methodReadHistoryFileList()
  // },

  mutations: {},
  actions: {
    actionReaConfigFile: function () {
      let contentConfigFile

      let configFile = path.join(
        app.getPath('userData'), 'config.json'
      )

      // 保存ファイル読み込み
      try {
        contentConfigFile = fs.readFileSync(configFile, 'utf8')
        console.log(contentConfigFile)
      } catch (e) {
        fs.writeFileSync(
          configFile, JSON.stringify('')
        )
      }
    }

  },

  modules: {},
  getters: {
    testvalue: state => state.testvalue
  }
})
