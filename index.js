const fs = require('fs')
const { BrowserWindow, dialog } = require('electron').remote

const key = 'ssssssssssssssss'
const isSecret = true

// html内の要素取得とリスナーの設定
document.querySelector('#openFile').addEventListener('click', () => {
  openFile()
})

document.querySelector('#saveFile').addEventListener('click', () => {
  saveFile()
})

document.querySelector('#encrypt').addEventListener('change', () => { encrypt() })
document.querySelector('#decrypt').addEventListener('click', () => { decrypt() })

function encrypt () {
  var str = $('#encrypt').val()
  var encrypted = CryptoJS.AES.encrypt(str, key)
  $('#decrypt').val(encrypted.toString())
  console.log(encrypted.toString())
}

function decrypt () {
  var str = $('#decrypt').val()
  var decrypted = CryptoJS.AES.decrypt(str, key)
  console.log(decrypted)

  console.log(decrypted.toString(CryptoJS.enc.Utf8))
}

const preview = document.getElementById('preview')

// openFileボタンが押されたとき（ファイル名取得まで）
function openFile () {
  const win = BrowserWindow.getFocusedWindow()
  dialog.showOpenDialog(
    win,
    {
      properties: ['openFile'],
      filters: [
        {
          name: 'Document',
          // extensions: ['csv', 'txt']
          extensions: ['txt']
        }
      ]
    },
    (fileNames) => {
      if (fileNames.length) {
        // alert(fileNames[0])
        readFile(fileNames[0]) // 複数選択の可能性もあるので配列となる。
      }
    }
  )
}

// 指定したファイルを読み込む
function readFile (path) {
  fs.readFile(path, (error, content) => {
    if (error != null) {
      alert('file open error.')
      return
    }

    // let data = content
    let data = content.toString()

    console.log(data)

    if (isSecret) {
      const decrypted = CryptoJS.AES.decrypt(data, key)
      data = decrypted.toString(CryptoJS.enc.Utf8)
    }
    preview.value = data
  })
}

// saveFileボタンが押されたとき
function saveFile () {
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
        let data = preview.value

        if (isSecret) {
          const encrypted = CryptoJS.AES.encrypt(data, key)
          data = encrypted.toString()
        }

        console.log(data)
        writeFile(fileName, data)
      }
    }
  )
}

// fileを保存（Pathと内容を指定）
function writeFile (path, data) {
  fs.writeFile(path, data, (error) => {
    if (error != null) {
      alert('save error.')
    }
  })
}
