import axios from "axios";

export const getWeather = async (req, res) => {
  const { city } = req.query;

  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    // Current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const currentResponse = await axios.get(currentUrl);
    const currentData = currentResponse.data;

    const currentDate = new Date(currentData.dt * 1000).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const forecastResponse = await axios.get(forecastUrl);
    const forecastData = forecastResponse.data.list.slice(0, 5).map((entry) => ({
      date: new Date(entry.dt * 1000).toLocaleString("en-US", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: entry.main.temp,
      description: entry.weather[0].description,
      icon: entry.weather[0].icon,
    }));

    res.status(200).json({
      city: currentData.name,
      current: {
        temperature: currentData.main.temp,
        humidity: currentData.main.humidity,
        wind: currentData.wind.speed,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        date: currentDate,
      },
      forecast: forecastData,
    });
  } catch (error) {
    console.error("Weather fetch failed:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};