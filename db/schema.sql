/*
*********************************************************************************************************
 *  @Schema Name      : healthsure
 *  @Author           : Siddhant Mahato
 *  @Company          : Antrazal
 *  @Date             : 16-12-2025
 *  @Description      :
 *      Database schema for HealthSure Policy Operations Portal.
 *      Contains master table for patients and transactional
 *      table for insurance policies.
 *
 *********************************************************************************************************
*/


/*
*********************************************************************************************************
 *  TABLE NAME        : patients
 *  DESCRIPTION       :
 *      Stores patient master information including
 *      personal details and profile image reference.
 *********************************************************************************************************
*/
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,      -- Unique identifier for each patient
    name VARCHAR(100),                       -- Full name of the patient
    phone VARCHAR(15),                       -- Contact phone number
    city VARCHAR(100),                       -- City / address information
    dob DATE,                                -- Date of birth
    email VARCHAR(100),                      -- Email address
    image_url VARCHAR(255)                  -- Path to uploaded patient image
);


/*
*********************************************************************************************************
 *  TABLE NAME        : policies
 *  DESCRIPTION       :
 *      Stores insurance policy details associated
 *      with patients. Supports policy lifecycle
 *      such as active, expired, and cancelled states.
 *********************************************************************************************************
*/
CREATE TABLE policies (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique identifier for each policy record
    patient_id INT,                          -- Reference to patients.id
    policy_no VARCHAR(100),                  -- Policy number (business identifier)
    plan VARCHAR(100),                       -- Policy plan name
    sum_insured DECIMAL(12,2),               -- Total sum insured amount
    start_date DATE,                         -- Policy start date
    end_date DATE,                           -- Policy end / expiry date
    status ENUM('Active','Expired','Cancelled'), -- Current policy status
    cancel_reason VARCHAR(255),              -- Reason for policy cancellation
    FOREIGN KEY (patient_id) 
        REFERENCES patients(id) 
        ON DELETE CASCADE                    -- Deletes policies if patient is removed
);
