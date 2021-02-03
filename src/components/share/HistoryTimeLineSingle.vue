<template>
  <div style="position: fixed;left: 5px;font-weight:bold"
       :style="{top: originData.height + 'px'}">
    <small class="pointer" @click="tagOnClick" :style="{color: originData.color}">
      <span style="padding-right: 5px">{{ originData.title }}</span>
      <span v-if="hideData">👻</span>
      <span v-if="!hideData">✅</span>
    </small>
  </div>
  <div v-for="obj in dataForShow" v-bind:key="obj.title" class="position-relative">
    <small v-if="!hideData" class="position-absolute pointer"
           @click="titleOnClick(obj)"
           :style="{
                top: (originData.height - 7 - obj.appendHeight) + 'px' ,
                left: (obj.curLength - obj.title.length * 6) + 'px',
                color: hoverActive && hoverData.title == obj.title ? originData.activeColor : originData.color
             }">
      {{ obj.title }}
    </small>
    <div v-if="!hideData" class="position-absolute key_border"
         v-bind:style="{
              top: (originData.height + 10 - obj.appendHeight) + 'px',
              left: obj.curLength + 'px',
              height: (290 - originData.height + obj.appendHeight) + 'px',
              borderLeft: 'solid 0.1px ' + (hoverActive && hoverData.title == obj.title ? originData.activeColor : originData.borderColor),
              pointerEvents: 'none'
         }">
    </div>
  </div>
</template>

<script>
import {formHistoryData, getConfigVisiableValue, getBooleanValue} from "../../assets/util";

export default {
  name: "HistoryTimeLineSingle",
  props: {
    originData: Object,
    zoom: Number,
    hoverData: Object,
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      hideTitle: null,
      hideData: false,
      dataForShow: [],
      hoverDataCopy: null,
      hoverActive: false,
    }
  },
  watch: {
    zoom: function () {
      this.toggleChange();
    },
    hoverData: function () {
      if (this.hoverDataCopy && this.hoverData && this.hoverDataCopy.title == this.hoverData.title) {
        this.hoverActive = true;
      } else {
        this.hoverActive = false;
      }
    }
  },
  created() {
    this.hideTitle = getConfigVisiableValue();
    this.hideData = getBooleanValue(this.originData.title);
  },
  mounted() {
    this.toggleChange();
  },
  methods: {
    toggleChange() {
      this.dataForShow = [];
      let data = formHistoryData(this.originData.datas, this.zoom);
      this.dataForShow = data
    },
    toggleSearch(obj) {
      this.$emit('toggleSearch', obj.title);
    },
    tagOnClick() {
      this.hideData = !this.hideData;
      window.localStorage.setItem(this.originData.title, this.hideData)
    },
    titleOnClick(obj) {
      this.hoverDataCopy = obj
      this.$emit('showRangeTime', obj);
      this.toggleSearch(obj)
    },
  }
}
</script>

<style scoped lang="less">

</style>
