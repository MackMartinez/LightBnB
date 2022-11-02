INSERT INTO users (name, email, password)
VALUES ('Max', 'max@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Stacy', 'stacy@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Trent', 'trent@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'Denham House', 'description', 'imagethumb1', 'imagecover1', 55, 2, 2, 3, 'CANADA', '225 Checkers Rd', 'Orilia', 'Ontario', 'M2T 5K9'),
(2, 'Trace House', 'description', 'imagethumb2', 'imagecover2', 100, 2, 2, 5, 'CANADA', '99 Overwatch Blvd', 'Muskoka', 'Ontario', 'L2P 1K9'),
(3, 'Moira House', 'description', 'imagethumb3', 'imagecover3', 200, 4, 3, 7, 'CANADA', '101 Cottage Rd', 'Muskoka', 'Ontario', 'L2P 2K8');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2022-09-11', '2022-09-26', 1, 1),
('2022-11-15', '2022-11-26', 2, 3),
('2022-12-20', '2023-01-01', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 3, 'message'),
(2, 3, 2, 4, 'message'),
(3, 2, 3, 5, 'message');