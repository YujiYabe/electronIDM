import Vue from 'vue'
import Vuex from 'vuex'
import fs from 'fs'
import path from 'path'
// const fs = require('fs')
// const path = require('path')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    testvalue: 'gffdgdgdfss',
    dataPosition: null,

    dataSaveFile: {
      boolVisibleIcon: false,
      encryptKeyword: '',
      dataDirectory: 'data',
      historyList: null,
      openFileType: 'normal',
      saveFileType: 'normal',
      optionSaveFileName: '',
      selectHistoryFile: '',
      selectHistoryIndex: null
    },

    dataDialog: {
      save: false,
      open: true
    },

    isDragged: false,

    dataPrependIcon: {
      id: false,
      password: false,
      other1: false,
      other2: false
    },

    dataAppendIcon: {
      all: false,
      id: false,
      password: false,
      other1: false,
      other2: false
    },

    dataFreeWord: '',

    rules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters'
    },
    dataDictionary: {
      placeholderBody: 'Please input',
      placeholderOther: 'optional',
      placeholderTag: 'changeable'
    },

    dataColorList: {
      // itemList: "amber lighten-3",
      // itemSelect: "pink lighten-3",
      // name: "cyan lighten-4",

      // id: "blue lighten-4",
      // password: "green lighten-4",
      // other1: "teal lighten-4",
      // other2: "indigo lighten-4",
      // text: "deep-purple lighten-4",

      // tagId: "blue",
      // tagPassword: "green",
      // tagOther1: "teal",
      // tagOther2: "indigo",
      itemList: '',
      itemSelect: '',
      name: '',

      id: '',
      password: '',
      other1: '',
      other2: '',
      text: '',

      tagId: '',
      tagPassword: '',
      tagOther1: '',
      tagOther2: ''
    },

    dataItemList: [],
    dataSelectItem: {
      index: null,
      name: '',
      id: '',
      password: '',
      other1: '',
      other2: '',
      text: ''
    },

    dataItemTemplate: {
      name: '',
      id: '',
      password: '',
      other1: '',
      other2: '',
      text: '',

      tagId: 'ID',
      tagPassword: 'password',
      tagOther1: 'other1',
      tagOther2: 'other2'
    }
  },
  // mounted () {
  //   // this.methodOpenConfig()
  //   this.$store.actions.methodReadHistoryFileList()
  // },

  mutations: {},
  actions: {
    methodReadHistoryFileList: function (state) {
      let self = state
      console.log(path.join(__dirname, state.state.dataSaveFile.dataDirectory))

      fs.readdir(path.join(__dirname, state.state.dataSaveFile.dataDirectory), function (err, files) {
        if (err) {
          console.log('error : ' + err)
        }
        console.log(files)
        // ふぉるださくせい
        if (files.length === 0) {
          // バックアップファイルが一つもない場合、ダイアログを開かない
          console.log('not found files')
          self.dataDialog.open = false
        }
        self.dataSaveFile.historyList = files.slice().reverse()
        console.log(files)
      })
    }
  },

  modules: {},
  getters: {
    testvalue: state => state.testvalue
  }
})
