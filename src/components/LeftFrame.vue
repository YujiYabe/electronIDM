<template>
    <v-app id="vappleft">
        <div class="sticky">
          <v-container fluid grid-list-md>
            <!-- -------------------------------------------------- -->
            <!-- <v-layout justify-center class="mt-5">
              <v-flex x12 v-if="this.dataSaveFile.historyList != 0">
                <v-btn @click.stop="dataDialog.open = true" width="100%" color="blue" depressed rounded dark>open
                </v-btn>
              </v-flex>

              <v-flex x12>
                <v-btn @click.stop="dataDialog.save = true" width="100%" color="blue" depressed rounded dark>save
                </v-btn>
              </v-flex>
            </v-layout> -->
            <!-- -------------------------------------------------- -->
            <!-- <v-layout justify-center class="mt-5">
              <v-flex xs12>
                <v-btn @click="methodAddItem" width="100%" color="primary" depressed rounded dark>add item
                  <v-icon dark right>mdi-plus-circle</v-icon>
                </v-btn>
              </v-flex>
            </v-layout> -->

            <!-- -------------------------------------------------- -->
            <!-- <v-layout justify-center class="mt-5">
              <v-flex xs12>
                <v-text-field outlined dense v-model="dataFreeWord" placeholder="filter" class="my-n3">
                </v-text-field>

              </v-flex>
            </v-layout> -->
          </v-container>
        </div>

        <!-- -------------------------------------------------- -->
        <!-- <v-layout justify-center v-for="(dataItem, index) in dataItemList" :key="index">
          <v-flex xs11>
            <v-card flat :id="index" :color="methodSetItemListColor(index)" :data-index="index"
              :data-name="dataItem.name" :data-id="dataItem.id" :data-password="dataItem.password"
              :data-other1="dataItem.other1" :data-other2="dataItem.other2" :data-text="dataItem.text"
              :data-tagid="dataItem.tagId" :data-tagpassword="dataItem.tagPassword"
              :data-tagother1="dataItem.tagOther1" :data-tagother2="dataItem.tagOther2"
              @click="selectDataCurrentItem(index)" class="px-2 py-2 my-1 is-hide"
              :class="methodFilterCondition(dataItem.name)">
              {{dataItem.name}}
            </v-card>
          </v-flex>
        </v-layout> -->

    </v-app>

</template>

<script>

export default {
  components: {
  },
  data () {
    return {
      isDragged: false,
      leftWidth: 200
    }
  },
  methods: {
    methodSetWidthFrame () {
      return 'width:' + this.leftWidth + 'px'
    },

    startResize () {
      this.isDragged = true
    }

  }
}
</script>
