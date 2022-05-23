window.onload = () => {
  handleDataFromServer()
}

function $(elm) {
  return document.querySelector(elm)
}

async function getWeather(cityName = "london") {
  let request = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=ca7ec552bc034514a9792135211812&q=${cityName}&aqi=no`
    // "./test.json"
  )

  let response = await request.json()

  return { request, response }
}

async function handleDataFromServer() {
  let result = $(".result")
  let city = $("input")
  let searchBtn = $(".search-btn")
  let clearBtn = $(".clear")

  let { request, response } = await getWeather()

  populateDom(request, response)

  searchBtn.onclick = async () => {
    let { request, response } = await getWeather(city.value)
    populateDom(request, response)
  }

  clearBtn.onclick = () => {
    result.innerHTML = ""
    city.value = ""
    document.querySelector("#result").innerHTML = `RESULT:`
  }
}

async function populateDom(request, response) {
  let result = $(".result")
  console.log(request)

  if (request.status === 200) {
    let data = response
    const localInfo = data.location.localtime
    const name = data.location.name
    const icon = data.current.condition.icon
    const text = data.current.condition.text
    const temp = data.current.temp_c
    const humidity = data.current.humidity
    const country = data.location.country
    const windSpeed = data.current.wind_kph

    result.innerHTML = `
          <p id="local-info">Local Info: ${localInfo} hr</p>
          <p id="condition-text">Condition: ${text}<img src="${icon}"/></p>
          <p id ="current-temp">Temp: ${temp}°C</p>
          <p id="current-humidity">Humidity: ${humidity}%</p>
          <p id="current-windspeed">Wind speed: ${windSpeed}km/hr</p>
      `
    document.querySelector(
      "#result"
    ).innerHTML = `Showing results for: <br> ${name} in ${country} <br><br>`
    return
  } else if (request.status === 400) {
    result.innerHTML = `<p id="error-message">Ouch, location not found</p>`
    document.querySelector("#result").innerHTML = ""
  } else {
    result.innerHTML = `
          <p id="error-message>Ouch,location not found<p>
      `
    document.querySelector("#result").innerHTML = ""
  }
}
