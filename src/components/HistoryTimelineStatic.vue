<template>
  <div id="history-timeline-static"
       v-bind:style="{width: maxWidth + 'px',height: windowHeight + 'px'}">

    <div style="position: fixed;tpo: 0px; left: 10px;">
      <el-button icon="el-icon-setting" circle size="mini" @click="configOnClick"></el-button>
    </div>

    <div style="position: fixed;tpo: 0px; right: 10px;">
      <el-checkbox-group v-model="searchTypeValue" size="mini" @change="searchTypeOnChange">
        <el-checkbox-button v-for="obj in searchTypes" :label="obj.title" :key="obj.title">
          {{ obj.title }}
        </el-checkbox-button>
      </el-checkbox-group>
    </div>

    <history-time-line-single :zoom="configData.zoom"
                              :hover-data="hoverData"
                              :origin-data="ancientEnconomyData"
                              v-on:show-range-time="showRangeTime"
                              v-on:toggle-search="wikiGo">
    </history-time-line-single>
    <history-time-line-single :zoom="configData.zoom"
                              :hover-data="hoverData"
                              :origin-data="ancientCultureData"
                              v-on:show-range-time="showRangeTime"
                              v-on:toggle-search="wikiGo">
    </history-time-line-single>
    <history-time-line-single :zoom="configData.zoom"
                              :hover-data="hoverData"
                              :origin-data="ancientPoliticsData"
                              v-on:show-range-time="showRangeTime"
                              v-on:toggle-search="wikiGo">
    </history-time-line-single>
    <history-time-line-single :zoom="configData.zoom"
                              :hover-data="hoverData"
                              :origin-data="ancientThoughtData"
                              v-on:show-range-time="showRangeTime"
                              v-on:toggle-search="wikiGo">
    </history-time-line-single>
    <history-time-line-bracket :zoom="configData.zoom"
                               :hover-data="hoverData"
                               :origin-data="ancientDynastyData"
                               v-on:show-range-time="showRangeTime"
                               v-on:toggle-search="wikiGo">
    </history-time-line-bracket>

    <div v-if="hoverVisiable" class="position-absolute"
         v-bind:style="{
            top:'0px',
            left: (hoverData.endLength + 9) + 'px',
            width: (hoverData.startLength - hoverData.endLength) + 'px',
            height: windowHeight + 'px',
            borderLeft: 'solid 1px #fad1d1',
            borderRight: 'solid 1px #fad1d1',
            pointerEvents: 'none'
         }">
    </div>
  </div>

  <div v-if="configData.visible" style="position: fixed;bottom: 10px; left: 10px;"
       :style="{ width: (windowWidth - 20) + 'px'}">
    <el-slider v-model="configData.zoom" :max="40" :min="1" show-stops :step="1" :marks="sliderMarks"
               @change="sliderOnChange"></el-slider>
  </div>
</template>

<script>
import useClipboard from 'vue-clipboard3'
import {getZoomValue, getConfigVisiableValue, datetime2height} from "../assets/util";
import HistoryTimeLineSingle from "./share/HistoryTimeLineSingle";
import HistoryTimeLineBracket from "./share/HistoryTimeLineBracket";

const {AncientEconomyData} = require("./share/AncientEconomyData");
const {AncientCultureData} = require("./share/AncientCultureData");
const {AncientPoliticsData} = require("./share/AncientPoliticsData");
const {AncientThoughtData} = require("./share/AncientThoughtData");
const {AncientDynastyData} = require("./share/AncientDynastyData");

export default {
  name: 'HistoryTimelineStatic',
  components: {HistoryTimeLineBracket, HistoryTimeLineSingle},
  props: {},
  data() {
    return {
      windowWidth: window.innerWidth,
      maxWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      configData: {
        zoom: null,
        visible: null,
      },
      searchTypeValue: [],
      searchTypes: [
        {title: '维基', link: 'https://zh.wikipedia.org/wiki/'},
        {title: '百度', link: 'https://baike.baidu.com/item/'},
      ],
      hoverData: null,
      hoverVisiable: false,
      sliderMarks: {},
      ancientEnconomyData: AncientEconomyData,
      ancientCultureData: AncientCultureData,
      ancientPoliticsData: AncientPoliticsData,
      ancientThoughtData: AncientThoughtData,
      ancientDynastyData: AncientDynastyData,
    }
  },
  created() {
    this.configData.zoom = getZoomValue();
    this.configData.visible = getConfigVisiableValue();

    if (window.localStorage.getItem('searchTypeValue')) {
      let data = window.localStorage.getItem('searchTypeValue').split(',');
      this.searchTypeValue = data;
    } else {
      this.searchTypeValue = this.searchTypes.map(obj => obj.title);
    }
  },
  mounted() {
    for (let i = 1; i <= 40; i++) {
      this.sliderMarks[i] = i + ''
    }
    this.windowWidthOnChange();
  },
  methods: {
    configOnClick() {
      this.configData.visible = this.configData.visible ? 0 : 1
      window.localStorage.setItem('configVisiable', this.configData.visible);
    },
    searchTypeOnChange() {
      window.localStorage.setItem('searchTypeValue', this.searchTypeValue.length ? this.searchTypeValue : ['none']);
    },
    sliderOnChange() {
      this.hoverVisiable = false;
      window.localStorage.setItem('zoom', this.configData.zoom);
      this.windowWidthOnChange();
    },
    windowWidthOnChange() {
      this.maxWidth = datetime2height(this.ancientDynastyData.minTime, this.configData.zoom);
    },
    wikiGo(title) {
      const {toClipboard} = useClipboard()
      toClipboard(title).then(() => {
      })
      this.searchTypeValue.forEach(value => {
        this.searchTypes.filter(type => type.title === value)
            .forEach(type => {
              window.open(type.link + title, '_blank')
            })
      })
    },
    showRangeTime(obj) {
      this.hoverData = obj;
      let desc = obj.desc ? obj.desc : '';
      desc = desc.replaceAll('\n', '<div style="height: 8px"></div>')

      if (obj['startLength'] && obj['endLength']) {
        this.hoverVisiable = true;
        this.$notify({
          title: obj.title,
          dangerouslyUseHTMLString: true,
          message: '' +
              '<p>' + obj.startTime + ' ~ ' + obj.endTime + '</p>' +
              '<br></<br>' +
              '<p>' + desc + '</p>',
          type: 'success',
          duration: 5000,
        });
      } else {
        this.hoverVisiable = false;
        this.$notify({
          title: obj.title,
          dangerouslyUseHTMLString: true,
          message: '' +
              '<p>时间：' + obj.curTime + '</p>' +
              '<br></<br>' +
              '<p>' + desc + '</p>',
          type: 'success',
          duration: 5000,
        });
      }
    }
  }
}
</script>

<style scoped lang="less">
#history-timeline-static {

}
</style>
