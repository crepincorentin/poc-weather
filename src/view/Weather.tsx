import React, { useEffect, useState } from "react";
import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

interface WeatherData {
  temperature: number;
  description: string;
  speed: number;
  humidity: number;
  pressure: number;
  icon: string;
}

export const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeather = async (lat: number, lon: number) => {
      const cacheKey = `weather-${lat}-${lon}`;
      const cachedData = localStorage.getItem(cacheKey);
      const cacheExpiration = 10 * 60 * 1000; // 10 minutes

      if (cachedData) {
        const cachedWeather = JSON.parse(cachedData);
        const isCacheValid = new Date().getTime() - cachedWeather.timestamp < cacheExpiration;

        if (isCacheValid) {
          setWeather(cachedWeather.data);
          setLoading(false);
          return;
        }
      }

      try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            lat,
            lon,
            appid: API_KEY,
            units: 'metric',
            lang: 'fr'

          },
        });

        const weatherData: WeatherData = {
          temperature: response.data.main.temp,
          description: response.data.weather[0].description,
          speed: response.data.wind.speed,
          humidity: response.data.main.humidity,
          pressure: response.data.main.pressure,
          icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`,
        };

        setWeather(weatherData);
        localStorage.setItem(cacheKey, JSON.stringify({ data: weatherData, timestamp: new Date().getTime() }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          getWeather(latitude, longitude);
        },
        error => {
          console.error("Error getting geolocation:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!weather) {
    return <div>Unable to fetch weather data.</div>;
  }

  return (
    <>
    <div className="container">
      <div className="box">
          <div className="weathercon"><img src={weather.icon} alt={weather.description} /></div>
          <div className="info">
              <h1 className="temperature">{weather.temperature} <span className="unit">°C</span></h1>
              <h3 className="weatherdesc">{weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}</h3>
              <p>Humidité : {weather.humidity}%</p>
              <p>Vent : {weather.speed} km/h</p>
              <p>Pression : {weather.pressure} hPa</p>
          </div>
      </div>
    </div>
    </>
  );
};
