<template lang="html">
  <div id="wrapper">
    <div id="input-wrapper">
      <label
        id="input-title"
        v-bind:class="{ 'error': errorMessage }">
        {{ $t(inputName) }}
      </label>
      <input
        type="text"
        v-bind:value="date"
        v-on:click="toggleDatePicker"
        readonly/>
      <label
        v-show="errorMessage"
        id="input-error-message">
        {{ $t(errorMessage) }}
      </label>
      <label
        v-show="!errorMessage"
        id="input-helper-message">
        {{ $t(helperMessage) }}
      </label>
    </div>
    <div
      id="calendar"
      v-if="isOpen">
      <div id="header">
        <div id="controller">
          <ButtonIcon
            buttonIcon="keyboard_arrow_left"
            v-bind:buttonAction="previousMonth"/>
          <p id="date-info">
            {{ getMonthName(currentMonth) }}
            {{ this.currentYear }}
          </p>
          <ButtonIcon
            buttonIcon="keyboard_arrow_right"
            v-bind:buttonAction="nextMonth"/>
        </div>
        <div id="days-labels">
          <div
            class="day-label"
            v-for="dayLabel in dayLabels">
            {{ dayLabel }}
          </div>
        </div>
      </div>
      <div id="body">
        <div
          class="day-number"
          v-for="monthDayNumber in totalCurrentMonthDays">
          <button
            v-if="monthDayNumber"
            v-bind:class="{
              'day-number-button': true,
              'current': isCurrentDate(monthDayNumber),
              'selected': monthDayNumber === selectedMonthNumberDay,
              'active': isActiveDate(monthDayNumber)
            }"
            v-on:click="onClickNumberMonth(monthDayNumber)">
            {{ monthDayNumber }}
          </button>
        </div>
      </div>
      <div id="footer">
        <Button
          buttonIcon="close"
          v-bind:buttonAction="onCancel"
          style="margin-left: 4px;">
          {{ $t('Cancel') }}
        </Button>
        <Button
          buttonIcon="done"
          v-bind:buttonAction="onDone"
          style="margin-left: 4px;">
          {{ $t('Accept') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonIcon from './button-icon.vue'
import Button from './button.vue'

export default {
  props: [
    'doneAction',
    'data',
    'date',
    'inputName',
    'errorMessage',
    'helperMessage',
  ],
  components: {
    ButtonIcon,
    Button,
  },
  data () {
    return {
      dayLabels: ['S', 'M', 'T', 'W', 'Th', 'F', 'S'],
      monthLabels: [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September',
        'October', 'November', 'December',
      ],
      currentDate: moment(new Date()).format('YYYY-MM-DD'),
      activeDate: '',
      totalCurrentMonthDays: 0,
      countMonthDay: 0,
      currentYear: 2019,
      currentMonth: 1,
      currentDay: 1,
      currentMonthDays: [],
      selectedMonthNumberDay: -1,
      selectedMomentDate: '',
      isOpen: false,
    }
  },
  watch: {
    date: function (newVal, oldVal) {
      this.date = newVal
      this.setDefaults()
    },
    isOpen: function (newVal, oldVal) {
      this.isOpen = newVal
      if (this.isOpen)
        this.setDefaults()
    },
  },
  methods: {
    setDefaults: function () {
      let momentDate = ''
      if (this.date && this.date !== '0000-00-00')
        momentDate = moment(this.date, 'YYYY-MM-DD')
      else
        momentDate = moment(this.currentDate, 'YYYY-MM-DD')
      this.activeDate = momentDate.format('YYYY-MM-DD')
      this.currentYear = parseInt(momentDate.format('YYYY'))
      this.currentMonth = parseInt(momentDate.format('MM'))
      this.currentDay = parseInt(momentDate.format('DD'))
      this.generateMonthDays()
    },
    isActiveDate: function (monthDayNumber) {
      let date = `${ this.currentYear }-${ ('0' + this.currentMonth).slice(-2) }-${ ('0' + monthDayNumber).slice(-2) }`
      let dateFormated = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
      if (this.activeDate === dateFormated)
        return true

      return false
    },
    generateMonthDays: function () {
      let startNumberDayOfWeek = this.getFirstDayNumberWeekOfMonth(this.currentMonth, this.currentYear)
      let monthDays = this.getMonthTotalDays(this.currentMonth, this.currentYear)
      let numberDay = 1
      let monthNumberDays = []
      let totalMonthDays = monthDays + startNumberDayOfWeek
      for (let index = 0; index < totalMonthDays; index++)
        if (index >= startNumberDayOfWeek)
          monthNumberDays.push(numberDay++)
        else
          monthNumberDays.push(false)
      this.totalCurrentMonthDays = monthNumberDays
    },
    getMonthTotalDays: function (monthNumber, yearNumber) {
      return new Date(yearNumber, monthNumber, 0).getDate()
    },
    getFirstDayNumberWeekOfMonth: function (month, year) {
      let date = `${ year }-${ ('0' + month).slice(-2) }-01`
      return moment(date).day()
    },
    getMonthName: function (monthNumber) {
      let monthLabel = ''
      for (let index = 1; index <= this.monthLabels.length; index++)
        if (index == monthNumber) {
          monthLabel = this.monthLabels[index - 1]
          break
        }
      return monthLabel
    },
    previousMonth: function () {
      let monthNumber = this.currentMonth
      if (this.currentMonth - 1 < 1) {
        monthNumber = 12
        this.currentYear--
      } else
        monthNumber--
      this.selectedMonthNumberDay = -1
      this.currentMonth = monthNumber
      this.generateMonthDays()
    },
    nextMonth: function () {
      let monthNumber = this.currentMonth
      if (monthNumber + 1 > 12) {
        monthNumber = 1
        this.currentYear++
      } else
        monthNumber++
      this.selectedMonthNumberDay = -1
      this.currentMonth = monthNumber
      this.generateMonthDays()
    },
    isCurrentDate: function (monthDayNumber) {
      let date = `${ this.currentYear }-${ ('0' + this.currentMonth).slice(-2) }-${ ('0' + monthDayNumber).slice(-2) }`
      let dateFormated = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
      if (this.currentDate === dateFormated)
        return true

      return false
    },
    onClickNumberMonth: function (monthDayNumber) {
      let date = `${ this.currentYear }-${ ('0' + this.currentMonth).slice(-2) }-${ ('0' + monthDayNumber).slice(-2) }`
      this.selectedMomentDate = moment(date, 'YYYY-MM-DD')
      this.selectedMonthNumberDay = monthDayNumber
    },
    onCancel: function () {
      this.isOpen = false
    },
    onDone: function () {
      this.isOpen = false
      this.doneAction(this.selectedMomentDate, this.data)
    },
    toggleDatePicker: function () {
      if (this.isOpen) {
        this.isOpen = false
        return
      }
      this.isOpen = true
    },
  },
}
</script>

<style scoped lang="css">
#wrapper {
  max-width: 320px;
  position: relative;
}

#input-wrapper {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  height: 40px;
  margin: 0;
  padding-top: 15px;
  position: relative;
}

#input-title {
  background-color: transparent;
  color: #616161;
  font-size: 12px;
  font-weight: 400;
  pointer-events: none;
  position: absolute;
  top: 0;
  transition-duration: 50ms;
}

#input-wrapper input {
  background: transparent;
  border-bottom: 1px solid #616161;
  border-left: none;
  border-right: none;
  border-top: none;
  box-sizing: border-box;
  caret-color: #1a73e8;
  color: #616161;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  margin: 0;
  outline: none;
  padding: 3px 0;
  width: 100%;
}

#input-error-message,
#input-helper-message {
  font-size: 12px;
  font-weight: 400;
  position: relative;
  top: 0;
  width: 100%;
}

#input-error-message {
  color: #ff0000;
}

#input-helper-message {
  color: #777;
}

#calendar {
  background-color: #ffffff;
  border-radius: 4px;
  bottom: calc(100% - 200px);
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  padding: 8px;
  position: absolute;
  width: 213px;
  z-index: 2;
}

#controller {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 5fr 1fr;
  margin: 0 0 16px 0;
  text-align: center;
}

#header {
  position: relative;
}

#body,
#footer {
  display: flex;
  flex-wrap: wrap;
}

#body {
  height: 200px;
}

#footer {
  justify-content: flex-end;
  margin: 0;
}

#days-labels {
  display: flex;
  flex-wrap: wrap;
  position: relative;
}

#date-info {
  align-self: center;
  color: #616161;
  font-size: 12px;
  font-weight: bold;
  margin: 0;
  padding: 0;
}

.day-label {
  color: #616161;
  font-size: 12px;
  font-weight: bold;
  height: 25px;
  position: relative;
  text-align: center;
  width: 30px;
}

.day-number {
  color: #616161;
  font-size: 12px;
  height: 30px;
  position: relative;
  text-align: center;
  width: 30px;
}

.day-number-button {
  background-color: #ffffff;
  border-radius: 4px;
  border: 0;
  cursor: pointer;
  height: 100%;
  outline: none;
  padding: 0;
  width: 100%;
  color: #616161;
}

.day-number-button:hover {
  background-color: #1a73e81c;
}

.day-number-button:active {
  background-color: #1a73e81c;
  color: #1a73e8;
}

.day-number-button.current {
  color: #1a73e8;
  font-weight: bold;
}

.day-number-button.selected {
  background-color: #1a73e81c;
  color: #1a73e8;
  font-weight: bold;
}

.day-number-button.active {
  color: #1a73e8;
  font-weight: bold;
  border: 1px solid #1a73e8;
}

.current-month-day {
  background-color: red;
}
</style>
