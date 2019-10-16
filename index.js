const fs = require('fs')
const { BrowserWindow, dialog } = require('electron').remote

const key = 'ssssssssssssssss'
const isSecret = true
const LEFT_FRAME_MIN_WIDTH = 45
const FRAME_ADJUSTED_SETTING = 10

// html内の要素取得とリスナーの設定
const preview = document.getElementById('preview')

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    aaa: '',
    width: null,
    isDragged: false,
    leftWidth: 200,
    centWidth: 10
  },
  mounted() {
  },
  methods: {
    reload: function (event) {
      location.reload()
    },

    // 指定したファイルを読み込む
    readFile: function (path) {
      // alert(path)

      fs.readFile(path, (error, content) => {
        if (error != null) {
          alert('file open error.')
          return
        }

        // let data = content
        let data = content.toString()
        // console.log(data)
        console.log(data)

        if (isSecret) {
          const decrypted = CryptoJS.AES.decrypt(data, key)
          data = decrypted.toString(CryptoJS.enc.Utf8)
          console.log(decrypted.toString(CryptoJS.enc.Utf8))
        }
        this.aaa = data
        // preview.value = decrypted.toString(CryptoJS.enc.Utf8)
      })
    },

    openFile: function (event) {
      const win = BrowserWindow.getFocusedWindow()
      dialog.showOpenDialog(
        win,
        {
          properties: ['openFile'],
          filters: [
            {
              name: 'Document',
              extensions: ['csv', 'txt']
              // extensions: ['txt']
            }
          ]
        },
        (fileNames) => {
          if (fileNames.length) {
            // alert(fileNames[0])
            this.readFile(fileNames[0]) // 複数選択の可能性もあるので配列となる。
          }
        }
      )
    },

    // saveFileボタンが押されたとき
    saveFile: function (event) {
      const win = BrowserWindow.getFocusedWindow()
      dialog.showSaveDialog(
        win,
        {
          properties: ['openFile'],
          filters: [
            {
              name: 'Documents',
              extensions: ['txt']
              // extensions: ['csv', 'txt']
            }
          ]
        },
        (fileName) => {
          if (fileName) {
            // let data = preview.textContent
            let data = this.aaa
            console.log(data)

            if (isSecret) {
              const encrypted = CryptoJS.AES.encrypt(data, key)
              data = encrypted.toString()
            }

            this.writeFile(fileName, data)
          }
        }
      )
    },

    // fileを保存（Pathと内容を指定）
    writeFile: function (path, data) {
      console.log(data)
      fs.writeFile(path, data, (error) => {
        if (error != null) {
          alert('save error.')
        }
      })
    },

    startResize() {
      this.isDragged = !this.isDragged
    },

    changeWitdh() {
      return this.isDragged ? 'pink ' : 'grey'
    },

    resizeFrame(event) {
      if (this.isDragged) {
        if (event.clientX + FRAME_ADJUSTED_SETTING < LEFT_FRAME_MIN_WIDTH) {
          this.leftWidth = LEFT_FRAME_MIN_WIDTH
          return
        }
        // console.log(event.clientX)
        this.leftWidth = event.clientX
      }
    }
  }
})
