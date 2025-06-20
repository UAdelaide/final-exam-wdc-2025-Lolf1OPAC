INSERT INTO Users (username, email, password_hash, role)
VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('thanos2007', 'thanos@example.com', 'hashed420', 'owner'),
('iamironman69', 'ironman@example.com', 'hashed999', 'walker');

INSERT INTO Dogs (owner_id, name, size)
VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
((SELECT user_id FROM Users WHERE username = 'thanos2007'), 'JeffBezos', 'large'),
((SELECT user_id FROM Users WHERE username = 'iamironman69'), 'Thanos', 'small'),
((SELECT user_id FROM Users WHERE username = 'thanos2007'), 'HulkyBoy', 'large');

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES
((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
((SELECT dog_id FROM Dogs WHERE name = 'JeffBezos'), '2025-06-20 09:00:00', 3000, 'Nowhere', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Thanos'), '2025-06-20 11:00:00', 3000, 'Nothing', 'accepted'),
((SELECT dog_id FROM Dogs WHERE name = 'HulkyBoy'), '2025-06-20 08:45:00', 40000, 'Something', 'cancelled');