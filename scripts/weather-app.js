
//103d2bea1f0fea90b85f7ca4c51dcc4f openweather api-key


const searchCityFormTemplate = `
<div class="search-city-form-wrapper">
<input 
type="text" 
name="city" 
class="search-city-input" 
placeholder="City"
required/>
</div>
`;

const appId = '103d2bea1f0fea90b85f7ca4c51dcc4f'

const API_URL = `http://api.openweathermap.org`;
const API_URL_SECOND = ``;

const createRequestCityUrl = (cityName) => {
    return`${API_URL}/geo/1.0/direct?units=metric&q=${cityName}&appId=${appId}`;
}





class SearchCityForm {
    constructor(root) {
        console.log('this shit works')
        this.root = root;
        this.render();
        this.submit();
    }

   render() {
    console.log('asdfdsaf')
        this.container = document.createElement("form");
        this.container.classList.add("search_city_form");      
        this.container.innerHTML = searchCityFormTemplate;
        this.input = this.container.querySelector('input');
        this.container.addEventListener('submit', (e) => {
                e.preventDefault();
            this.submit()
        })
        this.outputContainer = document.createElement('div')
        this.root.append(this.container);
        this.root.append(this.outputContainer)
    }

    submit() {
      
           
            const value = this.input.value
            fetch(createRequestCityUrl(value))
            .then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data);
                const cityDetails = data[0]
                this.coordinates = {
                    lat: cityDetails.lat,
                    lon: cityDetails.lon
                }
                this.weatherRequest();
                console.log(this.coordinates)
            });

    }

    weatherRequest() {
        const value = this.input.value;
        fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${this.coordinates.lat}&lon=${this.coordinates.lon}&appid=103d2bea1f0fea90b85f7ca4c51dcc4f`, {
            method: 'GET',
        }) 
        .then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data),
            this.data = data;
            this.renderCurrentWeather();
        })
    }

    renderCurrentWeather() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('weather-comments-wrapper')
        
        this.outputContainer.innerHTML = '';
       
        wrapper.innerHTML = `
        <title class="weather-title">${this.data.state}</title>
        <p class="weather-comments">${this.data.clouds.all}%<br>Clouds</p>
        <p class="weather-comments">${this.data.main.temp} <br>Temp</p>
        <p class="weather-comments">${this.data.weather[0].description}<br>description</p>
        <p class="weather-comments">${this.data.wind.speed}<br>wind-speed</p>
        `;

        this.outputContainer.append(wrapper);
    }
}


const t = new SearchCityForm(document.querySelector('body'), createRequestCityUrl());