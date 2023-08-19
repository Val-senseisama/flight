const express = require("express");
const bodyparser = require("body-parser");
const asyncHandler = require("express-async-handler");
const axios = require("axios");

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

const params = {
  access_key: "dc528adfe90db0b34678e970f1103070",
};

const getFlights = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(
      "http://api.aviationstack.com/v1/flights",
      {
        params,
      }
    );
    const data = response.data.data;
    res.json(data);
  } catch (error) {
    console.error(error);
  }
});

const searchFlights = asyncHandler(async (req, res) => {
  try {
    if (!req.query) {
      return res.status(400).json({ error: "No search parameters entered" });
    } else {
      const { departureDate, from, to, airline, flightNumber } =
        req.query || req.body;
      const response = await axios.get(
        "http://api.aviationstack.com/v1/flights",
        {
          params,
        }
      );
      const data = response.data.data;
      const searchResults = data.filter((flight) => {
        if (
          flight.flight_date === departureDate ||
          flight.departure.airport.includes(from) ||
          flight.arrival.airport.includes(to) ||
          flight.airline.name === airline ||
          flight.flight.number === flightNumber
        ) {
          return flight;
        }
      });
      if (searchResults) {
        res.json(searchResults);
      } else {
        return res.json({ message: "No matching flights" });
      }
    }
  } catch (error) {
    console.error(error);
  }
});

app.get("/", getFlights);
app.get("/search", searchFlights);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
