SELECT reservations.id, reservations.guest_id, users.id, title, start_date, cost_per_night, AVG(rating) AS average_rating
  FROM properties
  JOIN reservations ON reservations.property_id = properties.id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  JOIN users ON owner_id = users.id
  WHERE users.id = 1
  GROUP BY reservations.id, properties.id, users.id
  ORDER BY start_date
  LIMIT 10;