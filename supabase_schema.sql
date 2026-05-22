-- Create Schema
CREATE SCHEMA IF NOT EXISTS "rentFlow_schema";
SET search_path TO "rentFlow_schema", public;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "public";

-- Create Rooms Table
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(100),
    capacity INT,
    price DECIMAL(10, 2) NOT NULL,
    floor VARCHAR(50),
    description TEXT,
    status VARCHAR(50) DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'tenant',
    phone VARCHAR(50),
    gender VARCHAR(20),
    address TEXT,
    status VARCHAR(50) DEFAULT 'Active',
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Bills Table
CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    billing_month VARCHAR(50) NOT NULL,
    due_date DATE NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    water_charges DECIMAL(10, 2) DEFAULT 0,
    electricity_charges DECIMAL(10, 2) DEFAULT 0,
    other_fees DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    balance DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Unpaid',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(100),
    notes TEXT,
    proof_url TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Maintenance Requests Table
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Other',
    priority VARCHAR(50) DEFAULT 'Normal',
    attachment_url TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    assigned_to VARCHAR(255),
    admin_notes TEXT,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    date_resolved TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sender_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
