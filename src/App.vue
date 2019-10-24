<template>

  <div id="app">

    <div class="content" @mousemove="resizeFrame">

      <!-- <div class="left-frame inner" :style="{width:leftWidth + 'px'}"> -->
      <div class="left-frame inner" :style="methodSetWidthFrame('left')">
      </div>
      <div class="cent-frame inner" :style="{ left:leftWidth + 'px', width:centWidth + 'px'}"  :class="changeWitdh()" @mousedown="startResize">
      </div>
      <div class="rght-frame inner">
      </div>

    </div>
  </div>

</template>

<script>
// import LeftFrame from './components/LeftFrame'
// import RightFrame from './components/RightFrame'

const LEFT_FRAME_MIN_WIDTH = 45
const FRAME_ADJUSTED_SETTING = -4

export default {
  components: {
    // LeftFrame,
    // RightFrame
  },
  data () {
    return {
      isDragged: false,
      centWidth: 10,
      leftWidth: 200
    }
  },
  methods: {
    methodSetWidthFrame (name) {
      // this.isDragged = true
      return 'width:' + this.leftWidth + 'px'
    },

    startResize () {
      this.isDragged = true
    },

    changeWitdh () {
      return this.isDragged ? 'pink ' : 'grey'
      // return this.isDragged ? '' : ''
    },
    resizeFrame (event) {
      if (event.buttons === 0) {
        this.endResizeFrame()
        return
      }
      if (this.isDragged) {
        if (event.clientX + FRAME_ADJUSTED_SETTING < LEFT_FRAME_MIN_WIDTH) {
          this.leftWidth = LEFT_FRAME_MIN_WIDTH
          return
        }
        this.leftWidth = event.clientX + FRAME_ADJUSTED_SETTING
      }
    },
    endResizeFrame () {
      this.isDragged = false
    }
  }
}
</script>

<style scoped>
  .pink {
background-color : pink   }

  .grey {
background-color : lightgrey
  }

  .left-frame {
    background-color: rgb(240, 240, 255);
    height: 100vh;
  }

  .cent-frame {
    height: 100vh;
    /* background-color: lightgrey; */
    /* border: solid 0.5px white; */
    /* border-left: solid 0.5px rgb(170, 170, 170); */
    /* border-right: solid 0.5px black; */
  }

  .cent-frame:hover {
    cursor: col-resize;
    /* background-color: pink; */
  }

  .rght-frame {
    background-color: white;
    flex-grow: 1;
    /* padding-left: 10px; */
  }

  .content {
    display: flex;
  }

  .inner {
    display: inline-flex;
  }

.frame {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.dragged * {
  cursor: col-resize;
}
</style>
