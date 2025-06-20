-- Insert five users
INSERT INTO Users (username, email, password_hash, role)
VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('davidwalker', 'david@example.com', 'hashed101', 'walker'),
('emilyowner', 'emily@example.com', 'hashed102', 'owner');

-- Insert five dogs using subqueries to find owner_id from username
INSERT INTO Dogs (owner_id, name, size)
VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
((SELECT user_id FROM Users WHERE username = 'emilyowner'), 'Rocky', 'large'),
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Luna', 'small'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Charlie', 'medium');

-- Insert five walk requests using subqueries to find dog_id from dog name
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES
((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
((SELECT dog_id FROM Dogs WHERE name = 'Rocky'), '2025-06-11 07:00:00', 60, 'River Trail', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Luna'), '2025-06-11 10:00:00', 30, 'Central Park', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Charlie'), '2025-06-12 08:30:00', 40, 'Sunset Blvd', 'cancelled');
