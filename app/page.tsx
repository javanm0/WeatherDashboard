'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [data, setData] = useState([]);
  const weatherServerUrl = process.env.NEXT_PUBLIC_WEATHER_SERVER_URL;
  const weatherApiKey = process.env.NEXT_PUBLIC_GET_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      if (!weatherServerUrl) {
        console.error('NEXT_PUBLIC_WEATHER_SERVER_URL is not defined');
        return;
      }

      if (!weatherApiKey) {
        console.error('NEXT_PUBLIC_GET_API_KEY is not defined');
        return;
      }

      try {
        const response = await fetch(weatherServerUrl, {
          headers: {
            'x-api-key': weatherApiKey
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        const filteredData = data.filter((entry: { logtime: string }) => new Date(entry.logtime) >= fiveMinutesAgo);
        setData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error instanceof Error) {
          console.error('Stack trace:', error.stack);
        }
      }
    };
  
    fetchData();
    const interval = setInterval(fetchData, 1000);
  
    return () => clearInterval(interval);
  }, [weatherServerUrl, weatherApiKey]);

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <header style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontWeight: 'bold', fontSize: '2em' }}>Javan&apos;s Weather Dashboard</h1>
      </header>
      <h2>Temperature (°F)</h2>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="logtime" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h2>Humidity (%)</h2>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="logtime" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}