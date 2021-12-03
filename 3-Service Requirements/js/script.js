var charts = [
    { type: "location", chartName: "Month", title: "Behavior Events By Month", yTitle: "Events", chart: "column", height: 300 },
    { type: "location", chartName: "DayOfWeek", title: "Behavior Events By Day of Week", yTitle: "Events", chart: "column", height: 300 }
]

var cColors = ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
    '#FF9655', '#FFF263', '#6AF9C4']; //{"#FCFFC5","#89D1F3"}

var filters = [];
var studentCache = [];

function filterData(d) {

    d = $.Enumerable.From(d).Where(function (x) { return x.school_year.toString() == "2022" }).ToArray()

    filters.forEach(function (f) {
        switch (f.f) {
            
            case "chtMonth":

                d = $.Enumerable.From(d).Where(function (x) { return ((moment(x.event_date)._isUTC) ? moment(x.event_date).local().startOf('month').format('MMMM') : moment(x.event_date).utc().startOf('month').format('MMMM')) == f.v }).ToArray()

                break;
            case "chtDayOfWeek":

                d = $.Enumerable.From(d).Where(function (x) { return ((moment(x.event_date)._isUTC) ? moment(x.event_date).local().format('dddd') : moment(x.event_date).utc().format('dddd')) == f.v }).ToArray()

                break;
            
        }
    })

    return d
}


//Pass data in. DUH!
function buildChart(t, c, l, y, d, ct, h) {

    d = filterData(d);

    var groupedData = []
    switch (c) {
        
        case "Month":
            groupedData = $.Enumerable.From(d).OrderBy(function (c) { return moment(c.event_date).local() }).GroupBy(
                null, // (identity)
                null, // (identity)
                "{ school_year: $.school_year, label: ((moment($.event_date)._isUTC)?moment($.event_date).local().startOf('month').format('MMMM'):moment($.event_date).utc().startOf('month').format('MMMM')), events: $$.Count() }",
                "'' + $.school_year + '-' +((moment($.event_date)._isUTC)?moment($.event_date).local().startOf('month').format('MMMM'):moment($.event_date).utc().startOf('month').format('MMMM'))"
            )
                .ToArray()
            break;
        case "DayOfWeek":
            groupedData = $.Enumerable.From(d).OrderBy(function (c) { return moment(c.event_date).local().day() }).GroupBy(
                null, // (identity)
                null, // (identity)
                "{ school_year: $.school_year, label: ((moment($.event_date)._isUTC)?moment($.event_date).local().format('dddd'):moment($.event_date).utc().format('dddd')), events: $$.Count() }",
                "'' + $.school_year + '-' +((moment($.event_date)._isUTC)?moment($.event_date).local().day():moment($.event_date).utc().day())"
            )
                .ToArray()
            break;
    }




    var __ion_local_Data;
    var __ion_local_Categories = new Array();
    var __ion_local_Years = new Array();
    var xAxis = {};
    var yAxis = {};
    var height = h;


    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    __ion_local_Data = groupedData;

    ////First, put all the categories into an Array.
    if (c == "Month" || c == "DayOfWeek") {
        __ion_local_Categories = $.Enumerable.From(__ion_local_Data).Select(function (x) { return x.label }).Distinct().TojQuery();

    } else {
        __ion_local_Categories = $.Enumerable.From(__ion_local_Data).Select(function (x) { return x.label }).Distinct().OrderBy(function (x) { return x.label }).TojQuery();
        __ion_local_Categories = $.Enumerable.From(__ion_local_Categories).OrderBy(function (x) { return x }).TojQuery();

    }


    __ion_local_Years = [2022]


    var i = 0;
    var __ion_local_Series = new Array();

    $($.Enumerable.From(__ion_local_Years).OrderBy(function (x) { return x }).TojQuery()).each(function () {
        var tmpLY = parseInt(this.toString());
        var tmpSeries = { name: tmpLY.toString(), color: cColors[i], data: [] };

        $(__ion_local_Categories).each(function () {
            var tmpCat = this.toString();

            var tmpValue = $.Enumerable.From(__ion_local_Data).Where(function (x) { return x.school_year == tmpLY && x.label == tmpCat }).TojQuery()[0];
            if (typeof tmpValue !== 'undefined') {
                tmpSeries.data.push(tmpValue.events);
            } else {
                tmpSeries.data.push(0);
            }


        })
        i++;
        __ion_local_Series.push(tmpSeries);

        switch (ct) {
            case "column":
                zt = "x"
                xAxis = {
                    categories: __ion_local_Categories,
                    crosshair: true,
                    labels: {
                        rotation: 90,
                        style: {
                            fontSize: '10px',
                            fontFamily: 'Verdana, sans-serif'
                        },
                        formatter: function () {
                            //if (c == "Month")
                            //this.value = monthNames[this.value - 1];
                            //if (c == "DayOfWeek")
                            //this.value = dayNames[this.value - 1];

                            var words = (this.value).toString().split(/[\s]+/);
                            var numWordsPerLine = 2;
                            var str = '';

                            for (var word in words) {
                                if (parseInt(word) > 0 && parseInt(word) % numWordsPerLine == 0)
                                    str += '<br>';

                                if (typeof words[word] == "string")
                                    str += ' ' + words[word];
                            }
                            return str;
                        },
                        events: {
                            click: function (e) {
                                alert("col")
                            }
                        }
                    }
                }
                yAxis = {
                    min: 0,
                    title: {
                        text: y
                    }
                }
                break;
            case "bar":
                zt = "x"

                yAxis = {
                    min: 0,
                    title: {
                        text: y
                    }
                }
                xAxis = {
                    categories: __ion_local_Categories,
                    crosshair: true,
                    labels: {
                        style: {
                            fontSize: '10px',
                            fontFamily: 'Verdana, sans-serif'
                        },
                        formatter: function () {
                            if (c == "Month")
                                this.value = monthNames[this.value - 1];
                            if (c == "DayOfWeek")
                                this.value = dayNames[this.value - 1];

                            var words = (this.value).toString().split(/[\s]+/);
                            var numWordsPerLine = 2;
                            var str = '';

                            for (var word in words) {
                                if (parseInt(word) > 0 && parseInt(word) % numWordsPerLine == 0)
                                    str += '<br>';

                                if (typeof words[word] == "string")
                                    str += ' ' + words[word];
                            }
                            return str;
                        },
                        events: {
                            click: function (e) {
                                alert("hi")
                            }
                        }

                    }
                }

                break;
        }

        $('#cht' + c).highcharts({
            chart: {
                type: ct,
                zoomType: zt//,
                //height: height
            },
            title: {
                text: l
            },
            credits: {
                enabled: false
            },
            xAxis: xAxis,
            yAxis: yAxis,
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:0f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                },
                series: {
                    point: {
                        events: {
                            click: function (e) {

                                
                            }
                        }
                    }
                }

            },
            series: __ion_local_Series
        });

    })

}


function doBuildCharts() {

    charts.forEach(function (c) {

        buildChart(c.type, c.chartName, c.title, c.yTitle, data, c.chart);

    })

}


//Trigger the build
$(document).ready(function () {
    doBuildCharts()
})
