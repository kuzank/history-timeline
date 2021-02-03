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
                top: (originData.height - 40 - obj.appendHeight) + 'px' ,
                left: (obj.startLength - (obj.startLength - obj.endLength) / 2 - obj.title.length * 6) + 'px',
                color: hoverActive && hoverData.title == obj.title ? originData.activeColor : originData.color
             }">
      {{ obj.title }}
    </small>
    <div v-if="!hideData" class="position-absolute"
         v-bind:style="{
                top: (260 - obj.appendHeight) + 'px',
                left: obj.endLength + 'px',
                height: obj.appendHeight > 50 ? '25px' : '35px',
                width: (obj.startLength - obj.endLength) + 'px',
                borderLeft: 'solid 1px ' + (hoverActive && hoverData.title == obj.title ? originData.activeColor : originData.borderColor),
                borderRight: 'solid 1px ' + (hoverActive && hoverData.title == obj.title ? originData.activeColor : originData.borderColor),
                borderTop: 'solid 2px ' + (hoverActive && hoverData.title == obj.title ? originData.activeColor : originData.borderColor),
                borderTopLeftRadius: originData.borderRadius + 'px',
                borderTopRightRadius: originData.borderRadius + 'px',
                pointerEvents: 'none'
         }">
    </div>
    <div v-if="!hideData && obj.startTimeStr" class="position-absolute"
         v-bind:style="{ top: '300px' , left: (obj.startLength - 12) + 'px'}">
      <small class="font-size-mini">{{ obj.startTimeStr }}</small>
    </div>
    <div v-if="!hideData && obj.endTimeStr" class="position-absolute"
         v-bind:style="{ top: '300px', left: (obj.endLength - 12) + 'px'}">
      <small class="font-size-mini">{{ obj.endTimeStr }}</small>
    </div>
  </div>
  <div v-if="!hideData" class="position-absolute"
       v-bind:style="{
          top: (originData.height + 25) + 'px',
          width: maxLength + 'px',
          borderBottom: 'solid 1px ' + originData.color,
          pointerEvents: 'none'
       }">
  </div>
</template>

<script>
import {formHistoryData, getConfigVisiableValue, getBooleanValue, datetime2height} from "../../assets/util";

export default {
  name: "HistoryTimeLineBracket",
  props: {
    originData: Object,
    zoom: Number,
    hoverData: Object,
  },
  data() {
    return {
      hideTitle: null,
      hideData: false,
      dataForShow: [],
      hoverDataCopy: null,
      hoverActive: false,
      maxLength: window.innerWidth,
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
      this.maxLength = datetime2height(this.originData.minTime, this.zoom)

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
