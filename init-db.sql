-- Create egov_user with SUPERUSER privileges
CREATE USER egov_user
WITH
    SUPERUSER PASSWORD 'egov_password';

-- Create egov_db owned by egov_user
CREATE DATABASE egov_db OWNER egov_user;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE egov_db TO egov_user;