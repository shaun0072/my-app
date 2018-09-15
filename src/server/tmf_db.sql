CREATE DATABASE tmf_db;

USE tmf_db;

CREATE TABLE products (
  product_id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	product_name VARCHAR(150) NOT NULL,
  model_number VARCHAR(100),
  category_id INT(5) UNSIGNED
);

CREATE TABLE vendors (
  vendor_id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vendor_name VARCHAR(100) NOT NULL
);

CREATE TABLE product_vendor_info (
  product_vendor_info_id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vendor_id INT(11) UNSIGNED NOT NULL,
  product_id INT(11) UNSIGNED NOT NULL,
  item_number INT(11) UNSIGNED,
  vendor_link VARCHAR(150)
);

CREATE TABLE tags (
  tags_id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT(11) UNSIGNED NOT NULL,
  tags VARCHAR(150) NOT NULL
);

CREATE TABLE locations (
  location_id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT(11) UNSIGNED,
  location VARCHAR(150) NOT NULL,
  current_qty INT(5) UNSIGNED,
  min_qty INT(5) UNSIGNED
);

CREATE TABLE categories (
  category_id INT(5) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(80) NOT NULL
);

-- Initiate Values
INSERT INTO categories VALUES('', 'Lab');
INSERT INTO categories VALUES('', 'Warehouse');
INSERT INTO categories VALUES('', 'Office');
INSERT INTO categories VALUES('', 'Bulk Chemistry');
INSERT INTO categories VALUES('', 'Storage');
INSERT INTO categories VALUES('', 'Paint');
INSERT INTO vendors VALUES ('', 'Haviland');
INSERT INTO vendors VALUES ('', 'ABrite');
INSERT INTO vendors VALUES ('', 'Grainger');
INSERT INTO vendors VALUES ('', 'Dangler Guys');
INSERT INTO vendors VALUES ('', 'Harcros');
INSERT INTO vendors VALUES ('', 'Accu-Labs');
INSERT INTO vendors VALUES ('', 'Anchor Paint');
