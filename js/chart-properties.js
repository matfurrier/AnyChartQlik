define(["./charts-definition"], function() {
  "use strict";

  var palettes = null;

  var typeAndSubtype = {
    label: "General",
    type: "items",
    items: {
      chartType: {
        ref: "opt.chartType",
        type: "integer",
        component: "dropdown",
        label: "Chart type",
        options: chartPresets,
        defaultValue: chartTypes.LINE_CHART
      },
      chartSubtype: {
        ref: "opt.chartSubtype",
        type: "string",
        label: "Default series type",
        component: "dropdown",
        //defaultValue: chartSubtypes.LINE_CHART,
        options: function(data) {
          var chartDef = getChartTypePreset(data["opt"]["chartType"]);
          return chartDef.subtypes;
        }
      },
      palette: {
        ref: "opt.chart.paletteCALL",
        type: "string",
        label: "Palette",
        component: "dropdown",
        defaultValue: "defaultPalette",
        options: function() {
          if (!palettes) {
            palettes = [];
            var ns = window["anychart"]["palettes"];
            var i, label, palette;
            for (i in ns) {
              palette = ns[i];
              if (Array.isArray(palette)) {
                label = i.charAt(0).toUpperCase() + i.slice(1);
                palettes.push({label: label, value: i});
              }
            }
          }
          return palettes;
        }
      }
    }
  };

  var legend = {
    label: "Legend",
    type: "items",
    items: {
      legend: {
        ref: "opt.chart.legendCALL",
        type: "boolean",
        label: "Legend",
        defaultValue: false
      },
      layout: {
        ref: "opt.chart.legendCALL_itemsLayoutCALL",
        type: "string",
        label: "Layout",
        component: "dropdown",
        options: [
          {value: "horizontal", label: "Horizontal"},
          {value: "vertical", label: "Vertical"}
        ],
        show: function(d) {
          return d.opt.chart["legendCALL"];
        }
      },
      position: {
        ref: "opt.chart.legendCALL_positionCALL",
        type: "string",
        label: "Orientation",
        component: "dropdown",
        options: [
          {value: "top", label: "Top"},
          {value: "bottom", label: "Bottom"},
          {value: "left", label: "Left"},
          {value: "right", label: "Right"}
        ],
        show: function(d) {
          return d.opt.chart["legendCALL"];
        }
      },
      align: {
        ref: "opt.chart.legendCALL_alignCALL",
        type: "string",
        label: "Align",
        component: "dropdown",
        options: function(d) {
          var options = [{value: "center", label: "Center"}];
          var pos = d.opt.chart.legendCALL_positionCALL;
          var concat = (pos == "left" || pos == "right") ?
              [{value: "top", label: "Top"}, {value: "bottom", label: "Bottom"}] :
              [{value: "left", label: "Left"}, {value: "right", label: "Right"}];
          return options.concat(concat);
        },
        show: function(d) {
          return d.opt.chart["legendCALL"];
        }
      }
    }
  };

  var dataLabels = {
    label: "Data Labels",
    type: "items",
    items: {
      chartLabels: {
        ref: "opt.vary.chart.labelsCALL",
        type: "boolean",
        label: "Labels chart",
        defaultValue: true,
        show: function(d) {
          return !getChartTypePreset(d.opt.chartType)['isSeriesBased'];
        }
      },
      seriesLabels: {
        ref: "opt.vary.series.labelsCALL",
        type: "boolean",
        label: "Labels series",
        defaultValue: false,
        show: function(d) {
          return getChartTypePreset(d.opt.chartType)['isSeriesBased'];
        }
      },
      labelsFormatter: {
        ref: "opt.vary.both.labelsCALL_textFormatterCALL",
        type: "string",
        defaultValue: "{%Value}{decimalsCount:2}",
        //defaultValue: "{%PercentValue}{decimalsCount:1,zeroFillDecimals:true}%",
        show: function(d) {
          return d.opt.vary.chart && d.opt.vary.chart.labelsCALL || d.opt.vary.series && d.opt.vary.series.labelsCALL;
        }
      }
    }
  };

  var xAxis = {
    label: "X-Axis",
    type: "items",
    show: function(d){
      return getChartTypePreset(d.opt.chartType)['isSeriesBased'];
    },
    items: {
      xaxis: {
        ref: "opt.chart.xAxisCALL",
        type: "boolean",
        label: "X-Axis",
        defaultValue: true
      },
      orientation: {
        ref: "opt.chart.xAxisCALL_orientationCALL",
        type: "string",
        label: "Axis orientation",
        component: "dropdown",
        defaultValue: "bottom",
        options: [
          {value: "bottom", label: "Bottom"},
          {value: "left", label: "Left"},
          {value: "right", label: "Right"},
          {value: "top", label: "Top"}
        ],
        show: function(d) {
          return d.opt.chart.xAxisCALL;
        }
      },
      title: {
        ref: "opt.chart.xAxisCALL_titleCALL",
        type: "boolean",
        label: "Title"
      },
      titleText: {
        ref: "opt.chart.xAxisCALL_titleCALL_textCALL",
        type: "string",
        defaultValue: "X-Axis",
        show: function(d) {
          return d.opt.chart.xAxisCALL_titleCALL;
        }
      },
      align: {
        ref: "opt.chart.xAxisCALL_titleCALL_alignCALL",
        type: "string",
        label: "Title align",
        component: "dropdown",
        options: function(d) {
          var options = [{value: "center", label: "Center"}];
          var aOrientaion = d.opt.chart.xAxisCALL_orientationCALL;
          var concat = (aOrientaion == "left" || aOrientaion == "right") ?
              [{value: "top", label: "Top"}, {value: "bottom", label: "Bottom"}] :
              [{value: "left", label: "Left"}, {value: "right", label: "Right"}];
          return options.concat(concat);
        },
        show: function(d) {
          return d.opt.chart.xAxisCALL_titleCALL;
        }
      },
      labels: {
        ref: "opt.chart.xAxisCALL_labelsCALL",
        type: "boolean",
        label: "Labels",
        defaultValue: true
      },
      labelsFormatter: {
        ref: "opt.chart.xAxisCALL_labelsCALL_textFormatterCALL",
        type: "string",
        defaultValue: "{%Value}{decimalsCount:10}",
        show: function(d) {
          return d.opt.chart.xAxisCALL_labelsCALL;
        }
      }
    }
  };

  var yAxis = {
    label: "Y-Axis",
    type: "items",
    show: function(d){
      return getChartTypePreset(d.opt.chartType)['isSeriesBased'];
    },
    items: {
      xaxis: {
        ref: "opt.chart.yAxisCALL",
        type: "boolean",
        label: "Y-Axis",
        defaultValue: true
      },
      orientation: {
        ref: "opt.chart.yAxisCALL_orientationCALL",
        type: "string",
        label: "Axis orientation",
        component: "dropdown",
        defaultValue: "left",
        options: [
          {value: "bottom", label: "Bottom"},
          {value: "left", label: "Left"},
          {value: "right", label: "Right"},
          {value: "top", label: "Top"}
        ],
        show: function(d) {
          return d.opt.chart.yAxisCALL;
        }
      },
      title: {
        ref: "opt.chart.yAxisCALL_titleCALL",
        type: "boolean",
        label: "Title"
      },
      titleText: {
        ref: "opt.chart.yAxisCALL_titleCALL_textCALL",
        type: "string",
        defaultValue: "Y-Axis",
        show: function(d) {
          return d.opt.chart.yAxisCALL_titleCALL;
        }
      },
      align: {
        ref: "opt.chart.yAxisCALL_titleCALL_alignCALL",
        type: "string",
        label: "Title align",
        component: "dropdown",
        options: function(d) {
          var options = [{value: "center", label: "Center"}];
          var aOrientaion = d.opt.chart.yAxisCALL_orientationCALL;
          var concat = (aOrientaion == "left" || aOrientaion == "right") ?
              [{value: "top", label: "Top"}, {value: "bottom", label: "Bottom"}] :
              [{value: "left", label: "Left"}, {value: "right", label: "Right"}];
          return options.concat(concat);
        },
        show: function(d) {
          return d.opt.chart.yAxisCALL_titleCALL;
        }
      },
      labels: {
        ref: "opt.chart.yAxisCALL_labelsCALL",
        type: "boolean",
        label: "Labels",
        defaultValue: true
      },
      labelsFormatter: {
        ref: "opt.chart.yAxisCALL_labelsCALL_textFormatterCALL",
        type: "string",
        defaultValue: "{%Value}{decimalsCount:10}",
        show: function(d) {
          return d.opt.chart.yAxisCALL_labelsCALL;
        }
      }
    }
  };

  return {
    label: "Chart",
    component: "expandable-items",
    items: {
      typeAndSubtype: typeAndSubtype,
      legend: legend,
      dataLabels: dataLabels,
      xAxis: xAxis,
      yAxis: yAxis
    }
  };
});