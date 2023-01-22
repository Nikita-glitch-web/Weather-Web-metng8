class Weather {
	/***
	 *
	 * @param weatherResponse
	 * @param {object} weatherResponse.main
	 */
	constructor(weatherResponse) {
		const {
			main: {
				temp,
				feels_like,
				temp_min,
				temp_max,
				pressure,
				humidity
			},
			wind,
			sys: {country},
			name,
			weather
		} = weatherResponse;
		this.temp = temp;
		this.feels_like = feels_like;
		this.temp_min = temp_min;
		this.temp_max = temp_max;
		this.pressure = pressure;
		this.humidity = humidity;
		this.wind = wind;
		this.setIcon(weather);
		this.setDescription(weather);
		this.setCity(name);
		this.setCountry(country);
		this.setDate(weatherResponse);
	}

	setDescription(weatherArr) {
		const [current] = weatherArr;
		if(current.description) {
			this.description = current.description;
		}
	}

	setIcon(weatherArr) {
		const [current] = weatherArr;
		if(current.icon) {
			this.icon = current.icon;
		}
	}

	setCity(city) {
		if (city) {
			this.city = city;
		}
	}

	setCountry(country) {
		if (country) {
			this.country = country;
		}
	}

	setDate(weatherResponse) {
		const unixDate = weatherResponse.dt + (weatherResponse.timezone ? weatherResponse.timezone : 0);
		this.date = new Date(unixDate * 1000);
	}
}