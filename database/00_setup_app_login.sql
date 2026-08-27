-- setup_app_login.sql
-- Run this ONCE manually against your SQL Server instance (not part of the numbered schema scripts)
-- Replace <YOUR_PASSWORD_HERE> with a real strong password before running
USE master;

CREATE LOGIN expense_app_user
    WITH PASSWORD = '<YOUR_PASSWORD_HERE>';

USE ExpenseBudgetManager;

CREATE USER expense_app_user FOR LOGIN expense_app_user;

ALTER ROLE db_owner ADD MEMBER expense_app_user;