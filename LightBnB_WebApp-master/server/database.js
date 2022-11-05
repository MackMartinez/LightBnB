const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query (`SELECT * FROM users WHERE email = $1;`, [email])
    .then ((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query (`SELECT * FROM users WHERE id = $1;`, [id])
    .then((result) => {
      return result.rows[0]
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
    .query(`INSERT INTO users (name,email,password) 
      VALUES ($1, $2, $3)
      RETURNING *;`, [user.name, user.email, user.password])
    .then((results) => {
      return results.rows[0]
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query (`SELECT reservations.*,properties.*, AVG(rating) AS average_rating
    FROM properties
    JOIN reservations ON reservations.property_id = properties.id
    JOIN property_reviews ON property_reviews.property_id = properties.id
    JOIN users ON owner_id = users.id
    WHERE users.id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY start_date
    LIMIT $2;`,[guest_id, limit])

// Guest ID is req.session.userId. Can't console log to see what this returns
// so I can query it. assumption right now is that it's the e-mail we login

    .then((results) => {
      console.log("results:", results.rows);
      return results.rows;
    })
    .catch((err) => {
      console.log(err.message);
    })
};
  

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit = 10) => {

  const queryParams = [];

  let queryString = `SELECT properties.*, AVG(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON property_id = properties.id
  `;     

// if city searched, add city to query string
  if(options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
console.log("city added:", queryString);
console.log("params:", queryParams.length);
// if owner id, return properties for that owner
if (options.owner_id) {
  queryParams.push(`${options.owner_id}`);
  queryString += `AND owner_id IS $${queryParams.length} `;
}

// if min price, return properties greater than that price
if(options.minimum_price_per_night) {
  let convertToCentsMin = options.minimum_price_per_night * 100;
  queryParams.push(`${convertToCentsMin}`);
  queryString += `AND cost_per_night >= $${queryParams.length} `
}

// if max price, return properties less than that price
if(options.maximum_price_per_night) {
  let convertToCentsMax = options.maximum_price_per_night * 100;
  queryParams.push(`${convertToCentsMax}`);
  queryString += `AND cost_per_night <= $${queryParams.length} `
}

queryString += `GROUP BY properties.id `

// if min_rating, return properties greater than that rating
if(options.minimum_rating) {
  queryParams.push(`${options.minimum_rating}`);
  queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length}`
}

console.log("after HAVING line:", queryString);
// add limit param to query string
  queryParams.push(limit);
  queryString += `ORDER BY cost_per_night
  LIMIT $${queryParams.length};`;

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryParams = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms];

  const queryString = `INSERT INTO properties 
  (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *`

  return pool
    .query(queryString, queryParams)
    .then((results) => {
      return results.rows
    })
    .catch((err) => {
      console.log(err.message)
    })
};
exports.addProperty = addProperty;
