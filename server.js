const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET, POST',
  allowedHeaders: 'Content-Type',
};

app.use(cors(corsOptions));

app.use(express.json());

const port = 3000;

// Creates client
const client = new Client({
    user: 'postgres',
    host: 'HIDDEN',
    database: 'postgres',
    password: 'HIDDEN',
    port: 5432,
});

// Connects to the databse
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((error) => {
    console.error('Error connecting to PostgreSQL database:', error);
  });

// Gets city data from database
app.get('/api/fetch_cities', async (req, res) => {
  try {
    const result = await client.query('SELECT DISTINCT ON (city_name, city_country, city_lon, city_lat) * FROM saved_cities');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No cities found!' });
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data from the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Searches city based on name and coordinates
app.get('/api/search_city', async (req, res) => {
  const { city_name, city_lon, city_lat } = req.query;

  if (!city_name) {
    return res.status(400).json({ error: 'Insert a city name! '});
  }

  const query = 'SELECT * FROM saved_cities WHERE city_name = $1 AND city_lon = $2 AND city_lat = $3';

  try {
    const result = await client.query(query, [city_name, city_lon, city_lat]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'City not found!'});
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error searching for a city', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Adds a city to the databse 
app.post('/api/add_cities', async (req, res) => {
    const { time, city_name, city_country, city_lon, city_lat, temp, weather_desc } = req.body;
    const query = 'INSERT INTO saved_cities (time, city_name, city_country, city_lon, city_lat, temp, weather_desc) VALUES ($1, $2, $3, $4, $5, $6, $7)';
  
    try {     
        const response = await client.query(query, [time, city_name, city_country, city_lon, city_lat, temp, weather_desc]);
        console.log(response);
      
      res.json({ message: 'Data inserted successfully' });
    } catch (error) {
      console.error('Error inserting data into the database:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Deletes cities by city name, also deletes any null entries in the database
app.delete('/api/delete_cities', async (req, res) => {
  const { city_name } = req.body;

  if (!city_name) {
    return res.status(400).json({ error: 'City name is required for deletion.' });
  }

  const query = 'DELETE FROM saved_cities WHERE city_name = $1 OR time IS NULL OR city_name IS NULL OR city_country IS NULL OR city_lon IS NULL OR city_lat IS NULL OR temp IS NULL OR weather_desc IS NULL ';

  try {
    await client.query(query, [city_name]);
    res.json({ message: `Rows for city ${city_name} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting data from the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Port to listen on
app.listen(port, () => {
  console.log(`Server is running on http://${client.host}:${port}`);
});