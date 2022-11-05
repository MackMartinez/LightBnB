SELECT properties.id, properties.title, properties.cost_per_night, AVG(property_reviews.rating) AS average_rating
  FROM properties
  LEFT JOIN property_reviews ON property_id = properties.id
  GROUP BY properties.id
  HAVING AVG(property_reviews.rating) >= 3
  ORDER BY cost_per_night
  LIMIT 10;