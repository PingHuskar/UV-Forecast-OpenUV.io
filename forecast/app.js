const searchParam = new URLSearchParams(location.search)

const KEY = searchParam.get(`key`) || localStorage.getItem(`openuvkey`)
const LAT = searchParam.get(`lat`) || localStorage.getItem(`lat`)
const LNG = searchParam.get(`lng`) || localStorage.getItem(`lng`)

document.querySelector(`#forecastgeo`).innerHTML = `Forecast Location : 
<a href="https://pinghuskar.github.io/X-Marks-Leaflet?lat=${LAT}&lng=${LNG}" target="_blank">
${LAT},${LNG}
</a>
`


const UVWORD = (UVINDEX) => {
  if (UVINDEX < 3) {
    return `Low`
  } else if (UVINDEX < 6) {
    return `Moderate`
  } else if (UVINDEX < 8) {
    return `High`
  } else if (UVINDEX < 11) {
    return `Very High`
  } else {
    return `Extreme`
  }
}

const UVWORDSHORT = (UVINDEX) => {
  if (UVINDEX < 3) {
    return `Low`
  } else if (UVINDEX < 6) {
    return `Mod`
  } else if (UVINDEX < 8) {
    return `High`
  } else if (UVINDEX < 11) {
    return `VHigh`
  } else {
    return `Extr`
  }
}

let arrData = [];
let d3data = [];

let myHeaders = new Headers();
myHeaders.append("x-access-token", KEY);
myHeaders.append("Content-Type", "application/json");

let requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch(`https://api.openuv.io/api/v1/forecast?lat=${LAT}&lng=${LNG}&alt=100`, requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result)
    for (let data of result.result) {
        arrData.push({uv:data.uv,time:data.uv_time})
        d3data.push({uv:data.uv,time: new Date(data.uv_time)})
    }
  })
  .then(() => {
    const table = document.querySelector(`table`)
    for (let record of arrData) {
        table.innerHTML += `<tr class="${UVWORDSHORT(record.uv)}">
        <td>${new Date(record.time).toLocaleDateString()} ${new Date(record.time).toLocaleTimeString()}</td>
        <td>${Math.round(record.uv)}</td>
        <td>${UVWORD(record.uv)}</td>
        </tr>`
    }
    console.log(d3data)
    var chart = d3_timeseries()
                  .addSerie(d3data,{x:'time',y:'uv'},{interpolate:'monotone',color:"#333"})
                //   .width(820)
    
    chart('#chart')
    document.querySelector(`.d3_timeseries.line`).setAttribute(`stroke`,`red`)
  })
  .catch(error => {
    alert(error)
    localStorage.setItem(`lat`,`13.761513`)
    localStorage.setItem(`lng`,`100.569491`)
  });
