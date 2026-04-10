-- Simple seed data for inventory
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL,
  description TEXT
);

INSERT INTO products (name, price, quantity, description) VALUES
  ('Alpha', 10.0, 100, 'Sample Alpha product'),
  ('Beta', 20.0, 60, 'Sample Beta product'),
  ('Gamma', 15.5, 80, 'Sample Gamma product'),
  ('Delta', 7.25, 120, 'Sample Delta product');
