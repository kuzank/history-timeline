<template>
  <history-timeline v-if="false"></history-timeline>
  <history-timeline-static></history-timeline-static>
</template>

<script>
import HistoryTimeline from "./components/HistoryTimeline";
import HistoryTimelineStatic from "./components/HistoryTimelineStatic";

export default {
  name: 'App',
  components: {
    HistoryTimelineStatic,
    HistoryTimeline,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-notification {
  width: 550px !important;
}
</style>
