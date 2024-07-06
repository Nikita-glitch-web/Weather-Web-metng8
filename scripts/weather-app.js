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
<div class="submit_btn_wrapper">
<button class="submit_btn">Submit</button>
<button class="submit_btn favorite_btn" type="button">Favorites</button>

</div>
`;

const appId = "103d2bea1f0fea90b85f7ca4c51dcc4f";

const API_URL = `https://api.openweathermap.org`;
const API_URL_SECOND = ``;

const createRequestCityUrl = (cityName, units = 'metric') => {
  return `${API_URL}/geo/1.0/direct?units=${units}&q=${cityName}&appId=${appId}`;
};

class SearchCityForm {
  constructor(root) {
    console.log("this shit works");
    window.test = this;
    this.root = root;
    this.render();
    this.submit();  
    this.readFavorites();
    this.weekWeahter = [];
  }

  addToStorage() {
    localStorage.setItem('favorites', JSON.stringify(this.favoritesCities))
  }

  readFavorites() {
    const rawData = localStorage.getItem('favorites')
    const favorites = rawData ? JSON.parse(rawData) : [];
    console.log(favorites)
    this.favoritesCities = favorites;
    this.renderFavorites();
  }

  addToFavorites() {
    this.favoritesCities.push(this.data);
    console.log(this.favoritesCities);
    this.addToStorage();
    this.renderFavorites()
  }

  render() {
    console.log("asdfdsaf");
    this.formContainer = document.createElement("form");
    this.formContainer.classList.add("search_city_form");
    this.formContainer.innerHTML = searchCityFormTemplate;
    this.input = this.formContainer.querySelector("input");
    this.formContainer.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submit();
      console.log(this.input.value, 'input');
    });

    this.formContainer.addEventListener('click', (e) => {
      if(e.target.classList.contains('favorite_btn')) {
        console.log('Hello');
        this.addToFavorites()
      }
    })
    this.outputContainer = document.createElement("div");
    this.weekContainer = document.createElement('div');
    this.root.append(this.formContainer);
    this.root.append(this.weekContainer);
    this.root.append(this.outputContainer);
  }

  handleCityNameResponse(data) {
    console.log(data);
        const cityDetails = data[0];
        this.coordinates = {
          lat: cityDetails.lat,
          lon: cityDetails.lon,
        };
        this.weatherRequest();
        this.celsiusRequest();
        this.weekRequest();
        
        console.log(this.coordinates);
  }

  fetchCityInfo(value) {
    fetch(createRequestCityUrl(value))
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      this.handleCityNameResponse(data)
    });
  }

  submit() {
    const value = this.input.value;
    this.weekContainer.innerHTML = '';
    this.outputContainer.innerHTML = '';
    this.fetchCityInfo(value)
   
  }




  celsiusRequest() {
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
      console.log(responseData);
      this.data = parseWeatherResponse(responseData);
      console.log(this.data);
      this.renderCurrentWeather();
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

  favouriteCity() {
    const favouriteCities = localStorage.getItem();
    console.log(favouriteCities);
  }
 
   
  renderWeek() {
    this.weekContainer.innerHTML = ''
    const container = document.createElement("div");
    container.classList.add("week-weather-wrapper");
    const time = new Date();
    const nowTime = time.toLocaleString();
    const weekDays = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']
    console.log(nowTime);
    container.innerHTML = "";
    for (let i = 0; i < this.weekWeahter.length; i++) {
      console.log(new Intl.DateTimeFormat('en-US',  { weekday: 'long'}).format(this.weekWeahter[0].date))
      console.log("Цикл працює");
      container.innerHTML += `
            <div class="week-container">
              <p class="week-weather">${this.weekWeahter[i].temp}</p>
              <p class="week-weather week-weather-date">${this.weekWeahter[i].description}</p>
              <p class="week-weather-main-date">${new Intl.DateTimeFormat('en-US',  { weekday: 'long'}).format(this.weekWeahter[i].date)}</p>  
            </div>
            `;
    }
    this.weekContainer.append(container);
  }

 

  renderCurrentWeather() {

    const wrapper = document.createElement("div");
    wrapper.classList.add("weather-comments-wrapper");
    localStorage.wrapper; // дізнатись як працює localStorage , я не розумію
    wrapper.addEventListener('click', () => {  
      wrapper.querySelector("#unit-button");
      this.weatherRequest();
      this.celsiusRequest();
      this.renderFavorites();
    });
    this.outputContainer.innerHTML = "";
    const time = new Date();
    const now = time.toLocaleString();
    console.log(now);
    wrapper.innerHTML = `
        <div class="only-weather-container">
        <div class="weather-title-wrapper">
        <p class="weather-comments-title">${
          this.data.temp
        }  
        </p>
        </div>
        <div class="weather-description-wrapper">
        <p class="weather-comments"><span class="clouds">Feels like</span>${
          this.data.feels_like
        }%</p>
        <p class="weather-comments">${
          this.data.wind.speed
        }<span class="wind">wind-speed</span></p>
        <p class="weather-comments"><span class="humidity">humidity</span>${
          this.data.humidity
        }%</p>
        </div>
        </div>
        <div class="weather-location-wrapper">
        <p class="weather-comments-location">${this.data.country}</p>
        <p class="weather-comments-time">${time.getHours()}:${time.getMinutes()}</p>
        <p class="weather-comments-description">${
          this.data.description
        }<br>description</p>
        </div>
        <div class="max-min-weather-wrapper">
        <p class="max-min-weather-text">${this.data.temp_min}</p>
        <span class="max-min-weather-span">
        </span>
        <p class="max-min-weather-text">${this.data.temp_max}</p>
        </div>
        `;

    this.outputContainer.append(wrapper);
  }

  renderFavorites() {
    this.favoritesContainer = this.favoritesContainer || document.createElement('div');
    const time = new Date();
    const now = time.toLocaleString();
    this.favoritesContainer.classList.add('big-city-wrapper');
    this.favoritesContainer.innerHTML = '';
    let content = '';
    this.favoritesContainer.addEventListener('click', (e) => {
      console.log('favourites-wrapper', e, e.target);
      if(e.target.classList.contains('city__btn')) {
        console.log('if-target');
        const targetCity = this.favoritesCities.find((cityData) => {
          return cityData.city === e.target.id
        })
        console.log(targetCity)
        this.fetchCityInfo(e.target.id)
        
      }
      // зробити при кліці вивід на блок основної погоди , погоду з цього міста  
      
    });
    this.favoritesCities.forEach((cityData) => {
      content += `
      <div class="city">
          <h2 class="favourite-city-title">${cityData.name}</h2>
          <button class="city__btn" id="${cityData.city}">Open</button>
      </div>
      `
    })
    this.favoritesContainer .innerHTML = content;
    this.root.append(this.favoritesContainer)
  }
  
}

const t = new SearchCityForm(
  document.querySelector("body"),
  createRequestCityUrl()
);

// добавить кнопнку в форме submit
// переключение на фаренгейти кнопка
// накинуть addevent listener на кнопки градусов

//localStorage.setItem('myCat', 'Tom');
//Copy to Clipboard
//Считывать данные из localStorage для определённого ключа, можно следующим образом:
//let cat = localStorage.getItem('myCat');

