//103d2bea1f0fea90b85f7ca4c51dcc4f openweather api-key

const searchCityFormTemplate = `

<div class="search-city-inpit-wrapper">
<input 
type="text" 
name="city"
class="search-city-input" 
placeholder="City"
required/>
<label class="input-label" for="City">City</label>
</div>

`;

const appId = "103d2bea1f0fea90b85f7ca4c51dcc4f";

const API_URL = `http://api.openweathermap.org`;
const API_URL_SECOND = ``;

const createRequestCityUrl = (cityName) => {
  return `${API_URL}/geo/1.0/direct?units=metric&q=${cityName}&appId=${appId}`;
};

class SearchCityForm {
  constructor(root) {
    console.log("this shit works");
    this.root = root;
    this.render();
    this.submit();
    this.weekWeahter = [];
  }

  render() {
    console.log("asdfdsaf");
    this.container = document.createElement("form");
    this.container.classList.add("search_city_form");
    this.container.innerHTML = searchCityFormTemplate;
    this.input = this.container.querySelector("input");
    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submit();
    });
    this.outputContainer = document.createElement("div");
    this.root.append(this.container);
    this.root.append(this.outputContainer);
  }

  submit() {
    const value = this.input.value;
    fetch(createRequestCityUrl(value))
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        const cityDetails = data[0];
        this.coordinates = {
          lat: cityDetails.lat,
          lon: cityDetails.lon,
        };
        this.weatherRequest();
        this.weekRequest();
        console.log(this.coordinates);
      });
  }

  weatherRequest() {
    const value = this.input.value;
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${this.coordinates.lat}&lon=${this.coordinates.lon}&appid=103d2bea1f0fea90b85f7ca4c51dcc4f`,
      {
        method: "GET",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((responseData) => {
        console.log(responseData),
          (this.data = parseWeatherResponse(responseData));
        console.log(this.data);
        this.renderCurrentWeather();
      });
  }

  weekRequest() {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${this.coordinates.lat}&lon=${this.coordinates.lon}&appid=103d2bea1f0fea90b85f7ca4c51dcc4f`,
      {
        method: "GET",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data.list, "week");
        const t = reduceForecast(data.list);
        console.log(t, "week");
        this.weekWeahter = t;
        console.log(this.weekWeahter);
        this.renderWeek();
      });
  }

  renderWeek() {
    const container = document.createElement("div");
    container.classList.add("week-weather-wrapper");
    container.innerHTML = "";
    for (let i = 0; i < this.weekWeahter.length; i++) {
      console.log("Цикл працює", this.weekWeahter[i]);
      container.innerHTML = `
            <div class="week-container">
            <p class="week-weather">${this.data.temp}</p>
            <p class="week-weather">${this.data.description}</p>
            </div>
            `;
        this.container.append(container);
    }
  }

  renderCurrentWeather() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("weather-comments-wrapper");
    this.outputContainer.innerHTML = "";
    const time = new Date();
    const now = time.toLocaleString();
    console.log(now);
    wrapper.innerHTML = `
        <div class="only-weather-container">
        <div class="weather-title-wrapper">
        <p class="weather-comments-title">${
          this.data.temp
        } <span class="digrease">°C</span></p>
        </div>
        <div class="weather-description-wrapper">
        <p class="weather-comments"><span class="clouds">Clouds</span>${
          this.data.clouds
        }%</p>
        <p class="weather-comments">${
          this.data.wind.speed
        }<span class="wind">wind-speed</span></p>
        <p class="weather-comments"><span class="humidity">humidity</span>${
          this.data.humidity
        }%</p>
        </div>
        </div>
        <div>
        <p class="weather-comments-location">${this.data.country}</p>
        <p class="weather-comments-time">${time.getHours()}:${time.getMinutes()}</p>
        <p class="weather-comments-description">${
          this.data.description
        }<br>description</p>
        </div>
        `;

    this.outputContainer.append(wrapper);
  }
}

const t = new SearchCityForm(
  document.querySelector("body"),
  createRequestCityUrl()
);
