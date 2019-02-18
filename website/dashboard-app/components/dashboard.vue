<template lang="html">
  <BoxWrapper>
    <div class="settings-wrapper">
      <div class="header">
        <NavigationButtons />
        <h2>Dashboard</h2>
      </div>
      <div class="content-wrapper">
        <h2>Activity</h2>
        <div class="dashboard-activity">
          <div class="section" v-for="model in dashboard.models">
            <span class="model">
              {{ model.get("model") }}: {{ model.get("total") }}
            </span>
            <div class="activity-items">
              <div
                class="activity-item"
                v-if="model.get('model') === 'user'"
                v-for="item in model.get('last')"
              >
                <div>
                  <span class="tag">
                    ID:
                  </span>
                  {{ item.id }}
                </div>
                <div>
                  <span class="tag">
                    Name:
                  </span>
                  {{ item.user_name }}
                </div>
                <div>
                  <span class="tag">
                    Date:
                  </span>
                  {{ item.user_registration_date }}
                </div>
              </div>
              <div
                class="activity-item"
                v-if="model.get('model') === 'post'"
                v-for="item in model.get('last')"
              >
                <div>
                  <span class="tag">
                    ID:
                  </span>
                  {{ item.id }}
                </div>
                <div>
                  <span class="tag">
                    Title:
                  </span>
                  {{ item.post_title }}
                </div>
                <div>
                  <span class="tag">
                    Date:
                  </span>
                  {{ item.post_date }}
                </div>
              </div>
              <div
                class="activity-item"
                v-if="model.get('model') === 'page'"
                v-for="item in model.get('last')"
              >
                <div>
                  <span class="tag">
                    ID:
                  </span>
                  {{ item.id }}
                </div>
                <div>
                  <span class="tag">
                    Title:
                  </span>
                  {{ item.page_title }}
                </div>
                <div>
                  <span class="tag">
                    Date:
                  </span>
                  {{ item.page_date }}
                </div>
              </div>
              <div
                class="activity-item"
                v-if="model.get('model') === 'media'"
                v-for="item in model.get('last')"
              >
                <div>
                  <span class="tag">
                    ID:
                  </span>
                  {{ item.id }}
                </div>
                <div>
                  <span class="tag">
                    Name:
                  </span>
                  {{ item.media_original_name }}
                </div>
                <div>
                  <span class="tag">
                    Date:
                  </span>
                  {{ item.media_date }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BoxWrapper>
</template>


<script>
import BoxWrapper from './templates/box-wrapper.vue'
import NavigationButtons from './templates/navigation-buttons.vue'

export default {
  data() {
    return {
      dashboard: new this.$models.Dashboard(),
    }
  },
  components: {
    BoxWrapper,
    NavigationButtons,
  },
  created() {
    this.getDashboardData()
  },
  methods: {
    getDashboardData: function() {
      this.dashboard
        .fetch()
        .then(data => {
          if (data.getData().status_code) {
            this.$eventHub.$emit(
              'dashboard-app-error',
              data.getData().status_msg,
            )
            return
          }
        })
        .catch(err => {
          this.$eventHub.$emit('dashboard-app-error', err.message)
        })
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
}

h2 {
  color: #616161;
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  font-weight: bold;
  margin-top: 7px;
  text-transform: uppercase;
}

.buttons-wrapper {
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  padding: 0px;
  right: 0;
}

.content-wrapper {
  box-sizing: content-box;
}

.model {
  color: #616161;
  font-size: 13px;
  font-weight: bold;
  text-transform: capitalize;
}

.dashboard-activity {
  display: flex;
  flex-flow: row wrap;
  flex-wrap: wrap;
}

.section {
  flex-grow: 1;
  width: 250px;
}

.activity-items {
    margin-bottom: 10px;
}

.activity-item {
  color: #616161;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  margin: 0px 10px 10px 10px;
}

.tag {
  font-weight: bold;
}
</style>
