CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(15),
    city VARCHAR(100),
    dob DATE,
    email VARCHAR(100),
    image_url VARCHAR(255)
);

CREATE TABLE policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    policy_no VARCHAR(100),
    plan VARCHAR(100),
    sum_insured DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    status ENUM('Active','Expired','Cancelled'),
    cancel_reason VARCHAR(255),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);
