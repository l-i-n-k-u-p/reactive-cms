<template lang="html">
  <div class="settings-wrapper">
    <div class="header">
      <NavigationButtons />
      <h2>Dashboard</h2>
    </div>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper
      style="background-color: transparent; box-shadow: none;"
    >
      <div class="content-wrapper">
        <div class="dashboard-activity">
          <div
            id="global-chart"
            v-if="chartDataReady"
            >
            <pie-chart
              v-bind:chartdata="globalData"
              v-bind:options="options"
            />
          </div>
          <div class="section" v-for="model in dashboard.models">
            <div class="model">
              {{ model.get("model") }} - Operations: {{ model.get("total") }}
            </div>
            <div class="activity-items">
              <div
                class="activity-item"
                v-if="model.get('model') === 'user'"
                v-for="item in model.get('items')"
              >
                <div>
                  <span class="tag">
                    Operation:
                  </span>
                  {{ item.log_operation }}
                </div>
                <div>
                  <span class="tag">
                    ID:
                  </span>
                  {{ item._id }}
                </div>
                <div>
                  <span class="tag">
                    Title:
                  </span>
                  {{ item.log_operation_data.user_name }}
                </div>
                <div>
                  <span class="tag">
                    Date:
                  </span>
                  {{ item.log_date }}
                </div>
              </div>
              <div
                class="activity-item"
                v-if="model.get('model') === 'post'"
                v-for="item in model.get('items')"
              >
                <div>
                  <span class="tag">
                    Operation:
                  </span>
                  {{ item.log_operation }}
                </div>
                <div>
                  <span class="tag">
                    ID:
                  </span>
                  {{ item._id }}
                </div>
                <div>
                  <span class="tag">
                    Title:
                  </span>
                  {{ item.log_operation_data.post_title }}
                </div>
                <div>
                  <span class="tag">
                    Date:
                  </span>
                  {{ item.log_date }}
                </div>
              </div>
              <div
                class="activity-item"
                v-if="model.get('model') === 'page'"
                v-for="item in model.get('items')"
              >
                <div>
                  <span class="tag">
                    Operation:
                  </span>
                  {{ item.log_operation }}
                </div>
                <div>
                  <span class="tag">
                    ID:
                  </span>
                  {{ item._id }}
                </div>
                <div>
                  <span class="tag">
                    Title:
                  </span>
                  {{ item.log_operation_data.page_title }}
                </div>
                <div>
                  <span class="tag">
                    Date:
                  </span>
                  {{ item.log_date }}
                </div>
              </div>
              <div
                class="activity-item"
                v-if="model.get('model') === 'media'"
                v-for="item in model.get('items')"
              >
                <div>
                  <span class="tag">
                    Operation:
                  </span>
                  {{ item.log_operation }}
                </div>
                <div>
                  <span class="tag">
                    ID:
                  </span>
                  {{ item._id }}
                </div>
                <div>
                  <span class="tag">
                    Name:
                  </span>
                  {{ item.log_operation_data.media_original_name }}
                </div>
                <div>
                  <span class="tag">
                    Date:
                  </span>
                  {{ item.log_date }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BoxWrapper>
  </div>
</template>


<script>
import BoxWrapper from './templates/box-wrapper.vue'
import NavigationButtons from './templates/navigation-buttons.vue'
import LoadingBar from './templates/loading-bar.vue'
import pieChart from './chart/pie-chart.vue'

export default {
  data() {
    return {
      dashboard: new this.$models.DashboardCollection(),
      isLoading: false,
      chartDataReady: false,
      globalData: {
          datasets: [{
              data: [],
              backgroundColor: [],
              borderWidth: 0,
          }],
          labels: [],
      },
      options: {},
    }
  },
  components: {
    BoxWrapper,
    NavigationButtons,
    LoadingBar,
    pieChart,
  },
  created() {
    this.getDashboardData()
  },
  methods: {
    getDashboardData: function() {
      this.isLoading = true
      this.dashboard
        .fetch()
        .then(data => {
          this.isLoading = false
          this.generateChartData()
        })
        .catch(err => {
          this.isLoading = false
        })
    },
    generateChartData: function() {
      let labels = []
      let colors = []
      let values = []
      for (let item of this.dashboard.models) {
        labels.push(item.model)
        colors.push(this.$getHexColor(item.model, true))
        values.push(item.total)
      }
      this.globalData.labels = labels
      this.globalData.datasets[0].data = values
      this.globalData.datasets[0].backgroundColor = colors
      this.chartDataReady = true
    },
  },
}
</script>

<style scoped lang="css">

.settings-wrapper {
  position: relative;
}

.header {
  display: flex;
  margin: 0 20px 5px 20px;
}

h2 {
  align-self: center;
  color: #616161;
  display: flex;
  flex-grow: 1;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  text-transform: uppercase;
}

.buttons-wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}

.content-wrapper {
  box-sizing: content-box;
}

.model {
  background-color: white;
  color: #616161;
  font-size: 14px;
  font-weight: bold;
  padding: 10px;
  position: -webkit-sticky;
  position: sticky;
  text-transform: capitalize;
  top: 0;
  width: calc(100% - 30px);
}

.dashboard-activity {
  display: flex;
  flex-flow: row wrap;
  flex-wrap: wrap;
  justify-content: center;
}

.section {
  background-color: white;
  border-radius: 3px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  flex-grow: 1;
  height: 300px;
  margin: 5px;
  overflow-y: auto;
  overflow: auto;
  position: relative;
  width: 300px;
  max-width: 300px;
}

.activity-item {
  border-bottom: 1px solid #f4f4f4;
  color: #616161;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  margin: 0;
  padding: 10px;
}

.activity-item:last-child {
  border-bottom: 0;
}

.tag {
  display: block;
  font-weight: bold;
}

#global-chart {
  background-color: white;
  border-radius: 3px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  flex-grow: 1;
  height: auto;
  justify-content: center;
  margin: 5px;
  position: relative;
  max-width: 280px;
  padding: 10px;
}
</style>
