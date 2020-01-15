DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INT NOT NULL auto_increment,
product_name VARCHAR(20) NOT NULL,
department_name VARCHAR(20) NOT NULL,
price DECIMAL(8,2) NOT NULL,
stock_quantity INT(4),
PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES("Paperclip", "Office_Supplies", .5, 1000),
("Paper", "Office_Supplies", .10, 5000),
("Staple", "Office_Supplies", .01, 9999),
("Holepuncher", "Office_Supplies", 24.99, 50),
("Toner", "Office_Supplies", 36.00, 100),
("Plate", "Kitchen_Supplies", 12.00, 320),
("Spoon", "Kitchen_Supplies", 4.00, 1500),
("Cup", "Kitchen_Supplies", 2.99, 1500);