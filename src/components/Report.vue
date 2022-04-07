<template>
  <div>
    <div class="row mt-5">
      <div class="col-md-3 mb-3">Report Covid 19</div>
    </div>

    <select @change="onChange($event)">
      <option v-for="(item, index) in items" :key="index" :value="item.value">
        {{ item.label }}
      </option>
    </select>
    <apexchart
      ref="realtimeChart"
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>

    <table class="table table-striped mt-5">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">วันที่ (เดือน/วัน/ปี)</th>
          <th scope="col">ผู้ติดเชื้อทั้งหมด (ทั่วโลก)</th>
          <th scope="col">ผู้ติดเชื้อรายใหม่ (ทั่วโลก)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in dataTable" :key="index">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ item.date }}</td>
          <td>{{ item.cases.toLocaleString() }} ราย</td>
          <td>{{ item.newcase.toLocaleString()}} ราย</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      items: [
        { label: "2 สัปดาห์", value: 15 },
        { label: "30 วัน", value: 31 },
      ],
      series: [
        {
          name: "ผู้ติดเชื้อรายใหม่",
          data: [],
          type: "column",
        },
      ],
      chartOptions: {
        chart: {
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: [],
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      dataTable: "report/dataTable",
    }),
  },
  async mounted() {
    this.update(15);
  },
  methods: {
    ...mapActions({
      report: "report/report",
    }),
    onChange(event) {
      this.update(event.target.value);
    },
    async update(number) {
      // call api store
      const dataObj = await this.report(number);

      this.$refs.realtimeChart.updateSeries(
        [
          {
            data: dataObj.new_case,
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
  },
};
</script>
