SELECT properties.id, properties.title, properties.cost_per_night, AVG(property_reviews.rating) AS average_rating
  FROM properties
  LEFT JOIN property_reviews ON property_id = properties.id
  WHERE city LIKE '%ancouv%'
  GROUP BY properties.id
  HAVING AVG(property_reviews.rating) >= 4
  ORDER BY cost_per_night
  LIMIT 10;

-- getting different answers even when copy and pasting code answers, avg ratings are different