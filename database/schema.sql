CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    row INTEGER NOT NULL,
    seat_number INTEGER NOT NULL,
    is_reserved BOOLEAN DEFAULT FALSE,
    reserved_by INTEGER REFERENCES users(id)
);