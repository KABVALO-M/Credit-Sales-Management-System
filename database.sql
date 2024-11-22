-- Creating the necessary tables for the credit sales management system

-- ProductCategory table must be created first as it is referenced by Product
CREATE TABLE ProductCategory (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Customer table created next since it's referenced by other tables like CreditAgreement
CREATE TABLE Customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    employment_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    email VARCHAR(100),
    date_of_birth DATE,
    employment_position VARCHAR(100),
    department VARCHAR(100),
    work_address VARCHAR(255),
    residential_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Product table to store product details
CREATE TABLE Product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    product_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES ProductCategory(category_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- User table to manage system users
CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Salesperson') NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- CreditAgreement table to track the credit sales agreements
CREATE TABLE CreditAgreement (
    agreement_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    product_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    months_to_pay INT NOT NULL,
    monthly_installment DECIMAL(10, 2) NOT NULL,
    status ENUM('Active', 'Completed', 'Defaulted') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- PaymentMethod table to manage different methods of payment
CREATE TABLE PaymentMethod (
    payment_method_id INT PRIMARY KEY AUTO_INCREMENT,
    method_name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Payment table to track the payments made by customers
CREATE TABLE Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    agreement_id INT,
    payment_date DATE NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_method_id INT,
    FOREIGN KEY (agreement_id) REFERENCES CreditAgreement(agreement_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method_id) REFERENCES PaymentMethod(payment_method_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Sales table to log sales transactions
CREATE TABLE Sales (
    sale_id INT PRIMARY KEY AUTO_INCREMENT,
    agreement_id INT,
    sale_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (agreement_id) REFERENCES CreditAgreement(agreement_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ActionLog table to track user actions (audit log)
CREATE TABLE ActionLog (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action_description TEXT NOT NULL,
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- AuditLog table for detailed database auditing
CREATE TABLE AuditLog (
    audit_id INT PRIMARY KEY AUTO_INCREMENT,
    action_type ENUM('Insert', 'Update', 'Delete') NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_by INT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (changed_by) REFERENCES User(user_id)
) ENGINE=InnoDB;

-- Notification table to store notifications for users/customers
CREATE TABLE Notification (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    user_id INT,
    notification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT NOT NULL,
    status ENUM('Sent', 'Received', 'Read') DEFAULT 'Sent',
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
) ENGINE=InnoDB;

-- ProductStock table to manage the product stock levels
CREATE TABLE ProductStock (
    stock_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    quantity_in_stock INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
) ENGINE=InnoDB;

