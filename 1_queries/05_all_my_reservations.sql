SELECT reservations.id, title, start_date, cost_per_night, start_date, AVG(rating) AS average_rating
  FROM properties
  JOIN reservations ON reservations.property_id = properties.id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE owner_id = 1
  GROUP BY reservations.id, properties.id
  ORDER BY start_date
  LIMIT 10;