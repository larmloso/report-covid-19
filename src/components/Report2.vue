<template>
  <div id="report2">
    <div class="mt-5">
      <div class="mb-1">Report Covid 19</div>
      <div class="mb-3">
        {{ timestamp }}
      </div>
    </div>

    <div class="mt-4 card p-4">
      <div class="row">
        <div class="col-md-6">
          <div>
            <div class="image-flag mb-3 mt-1">
              <img
                v-if="this.country == 'All'"
                src="https://disease.sh/assets/img/flags/th.png"
                width="80px"
              />
              <img
                v-if="this.country != 'All'"
                :src="
                  'https://disease.sh/assets/img/flags/' +
                  this.country.toLowerCase() +
                  '.png'
                "
                width="80px"
              />
            </div>
            <div class="row">
              <div class="col-md-6">
                <span class="title">ผู้ติดเชื้อภายในประเทศรวม</span>
                <p class="case-number">
                  {{ dataCountryObj.cases.toLocaleString() }}
                </p>
                <span class="title">ผู้ติดเชื้อวันนี้</span>
                <p>+{{ dataCountryObj.todayCases.toLocaleString() }}</p>
              </div>
              <div class="col-md-6">
                <span class="title">ผู้เสียชีวิตภายในประเทศรวม</span>
                <p class="case-number">
                  {{ dataCountryObj.deaths.toLocaleString() }}
                </p>
                <span class="title">ผู้เสียชีวิตวันนี้</span>
                <p>+{{ dataCountryObj.todayDeaths.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div>
            <div class="image-flag mb-3">
              <img
                src="https://icon-library.com/images/world-icon-png/world-icon-png-4.jpg"
                width="60px"
              />
            </div>
            <div class="row">
              <div class="col-md-6">
                <span class="title">ผู้ติดเชื้อทั่วโลกรวม</span>
                <p class="case-number">
                  {{ dataAllObj.cases.toLocaleString() }}
                </p>
                <span class="title">ผู้ติดเชื้อวันนี้</span>
                <p>+{{ dataAllObj.todayCases.toLocaleString() }}</p>
              </div>
              <div class="col-md-6">
                <span class="title">ผู้เสียชีวิตทั่วโลกรวม</span>
                <p class="case-number">
                  {{ dataAllObj.deaths.toLocaleString() }}
                </p>
                <span class="title">ผู้เสียชีวิตวันนี้</span>
                <p>+{{ dataAllObj.todayDeaths.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-md-4 col-sm-12">
        <select @change="onChangeCountries($event)" class="form-control mt-2">
          <option
            v-for="(item, index) in myCountries"
            :key="index"
            :value="item.countryInfo.iso2"
          >
            {{ item.country }}
          </option>
        </select>
      </div>
      <div class="col-md-2 col-sm-12">
        <select @change="onChangeDays($event)" class="form-control mt-2">
          <option
            v-for="(item, index) in items"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </select>
      </div>
    </div>

    <div id="chart" class="mt-5">
      <apexchart
        ref="realtimeChart"
        type="bar"
        height="350"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
    <table class="table table-striped mt-5">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">วันที่ (เดือน/วัน/ปี)</th>
          <th scope="col">ผู้ติดเชื้อรายใหม่ </th>
          <th scope="col">ผู้เสียชีวิต</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in dataTables" :key="index">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ item.date }}</td>
          <td>{{ item.case.toLocaleString() }} ราย</td>
          <td>{{ item.deaths.toLocaleString() }} ราย</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { abc, getTotal, getAll } from "../function/test2";
import countries from "../assets/countries.json";

export default {
  created() {
    setInterval(this.getNow, 1000);
  },
  data() {
    return {
      timestamp: "",
      days: 15,
      country: "All",
      myCountries: countries,
      dataCountryObj: null,
      dataAllObj: null,
      dataTables: null,
      items: [
        { label: "2 สัปดาห์", value: 15 },
        { label: "30 วัน", value: 31 },
      ],
      series: [
        {
          name: "ผู้ติดเชื้อรายใหม่",
          data: [],
        },
        {
          name: "ผู้เสียชีวิต",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [],
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val.toLocaleString() + " คน";
            },
          },
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      dataTable: "report2/dataTable",
    }),
  },
  async mounted() {
    this.dataCountryObj = await getTotal("th");
    this.dataAllObj = await getAll();
    this.update(15, this.country);

    console.log("all", this.dataAllObj);
  },
  methods: {
    ...mapActions({
      report: "report2/report",
    }),
    onChangeDays(event) {
      this.days = event.target.value;
      this.update(this.days, this.country);
    },
    onChangeCountries(event) {
      this.country = event.target.value;
      this.update(this.days, this.country);
      console.log("event", event);
    },
    async update(days, country) {
      // call api store
      this.dataCountryObj = await getTotal(country);
      this.dataAllObj = await getAll();
      // const dataObj = await this.report(days);
      const dataObj = await abc(days, country);
      this.dataTables = dataObj.dataTable

      console.log("aabcc", this.dataTable);

      this.$refs.realtimeChart.updateSeries(
        [
          {
            data: dataObj.case,
          },
          {
            data: dataObj.deaths,
          },
        ],
        false,
        true
      );
      this.$refs.realtimeChart.updateOptions(
        {
          xaxis: {
            categories: dataObj.date,
          },
        },
        false,
        true
      );
    },

    getNow: function () {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + " " + time;
      this.timestamp = dateTime;
    },
  },
};
</script>

<style scoped>
.select-control {
  border-radius: 5px;
  height: 2rem;
}

.case-number {
  font-size: 30px;
}

.title {
  color: rgb(100, 100, 100);
}
</style>
