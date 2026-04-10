-- Initialize inventory schema and seed data
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL,
  description TEXT
);

INSERT INTO products (name, price, quantity, description) VALUES
  ('Widget', 9.99, 100, 'Basic widget'),
  ('Gadget', 19.99, 50, 'Gadget device'),
  ('Thingamajig', 4.99, 200, 'Useful thingamajig');
