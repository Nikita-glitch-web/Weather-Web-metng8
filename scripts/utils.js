

const getDayStr = (date) => {
	const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', ];
	return days[date.getUTCDay()];
};

const normaliseTime = (time) => {
	return time < 10 ? '0' + time : time;
}

const getTimeStr = (date) => {
	const h = date.getUTCHours();
	const m = date.getUTCMinutes();
	return `${ normaliseTime(h) }:${ normaliseTime(m) }`
};

const parseWeatherResponse = (weatherResponse) => {
	return new Weather(weatherResponse)
};
/**
 *
 * @param {Object[]} list WeatherResponse
 * @returns {Promise<Weather[]>}
 */
const reduceForecast = (list = []) => {
	const groupedForecastByDays = [];
	let i = 0;
	let finished = false;
	while (!finished) {
		for (let j = 0; j < list.length; j += 1) {
			const tmp = parseWeatherResponse(list[j]);
			if (!groupedForecastByDays[i]) {
				groupedForecastByDays.push([ tmp ]);
			} else {
				if (tmp.date.getDay() === groupedForecastByDays[i][groupedForecastByDays[i].length - 1].date.getDay()) {
					groupedForecastByDays[i].push(tmp);
				} else {
					i++;
				}
			}
			if (j === list.length - 1) {
				finished = true;
			}
		}
	}

	const checkProperty = (weather, weatherData) => {
		for (let key in weather) {
			if (weather.hasOwnProperty(key)) {
				if (typeof weather[key] === "number" && key.indexOf('max') >= 0  && weather[key] > weatherData[key]) {
					weatherData[key] = weather[key]
				} else if (typeof weather[key] === "number" && key.indexOf('min') >= 0 && weather[key] < weatherData[key]) {
					weatherData[key] = weather[key]
				} else if (typeof weather[key] === "number" && weather[key] > weatherData[key]) {
					weatherData[key] = weather[key]
				} else if (weatherData[key] instanceof Date) {
					weatherData[key] = weather[key]
				} else if (typeof weather[key] === "object") {
					checkProperty(weather[key], weatherData[key])
				}
			}
		}
	};

	const forecast = groupedForecastByDays.reduce((days, weatherForDay) => {
		const weatherData = weatherForDay[0];
		for (let weather of weatherForDay) {
			checkProperty(weather, weatherData)
		}
		days.push(weatherData);
		return days;
	}, []);
	return forecast;
};


const makeUrl = (url, query) => {
	if (query.q) {
		url += `&q=${ query.q }`;
	} else if (query.lon && query.lat) {
		url += `&lat=${ query.lat }&lon=${ query.lon }`;
	}

	return url;
}



