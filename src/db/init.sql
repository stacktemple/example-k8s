CREATE table IF NOT EXISTS sects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    power INTEGER CHECK (power >= 0 AND power <= 100)
);

INSERT INTO dojos (name, power) VALUES
    ('Azure Dragon Sect', 95),
    ('Phoenix Gate Academy', 88),
    ('Shadow Moon Clan', 92),
    ('Golden Lion School', 85),
    ('Jade Lotus Sanctuary', 90);