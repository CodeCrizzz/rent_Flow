

CREATE SCHEMA IF NOT EXISTS "rentFlow_schema";
SET search_path TO "rentFlow_schema", public;

-- 1. Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) DEFAULT 'Single',
    capacity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    floor VARCHAR(50),
    description TEXT,
    status VARCHAR(50) DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'tenant',
    phone VARCHAR(50),
    gender VARCHAR(50),
    address TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
    date_moved_in DATE,
    contract_end_date DATE,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bills Table
CREATE TABLE IF NOT EXISTS bills (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
    billing_month VARCHAR(50) NOT NULL,
    due_date DATE NOT NULL,
    rent_amount DECIMAL(10, 2) DEFAULT 0,
    water_charges DECIMAL(10, 2) DEFAULT 0,
    electricity_charges DECIMAL(10, 2) DEFAULT 0,
    other_fees DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    balance DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Unpaid',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    bill_id INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    notes TEXT,
    proof_url VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Completed'
);

-- 5. Maintenance Requests Table
CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'Other',
    priority VARCHAR(50) DEFAULT 'Normal',
    status VARCHAR(50) DEFAULT 'Pending',
    attachment_url VARCHAR(255),
    admin_notes TEXT,
    assigned_to VARCHAR(255),
    scheduled_date TIMESTAMP,
    date_resolved TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sender_type VARCHAR(50) NOT NULL, -- 'tenant' or 'admin' 
    status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'read'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Admin Seed
-- PASSWORD: admin123
DELETE FROM users WHERE email = 'admin@rentflow.com';
INSERT INTO users (name, email, password, role, status) 
VALUES ('Admin User', 'admin@rentflow.com', '$2b$10$EqGLqdbJ3BgErTE7kN0/MO4xuhy28T484S90Pf6s/ioR9lFHNilzC', 'admin', 'Active');


-- Enable RLS for all your tables
ALTER TABLE "rentFlow_schema".users ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rentFlow_schema".bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rentFlow_schema".payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rentFlow_schema".requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rentFlow_schema".messages ENABLE ROW LEVEL SECURITY;

-- Create a policy for 'users' so authenticated users can read their own profile
CREATE POLICY "Users can read own profile" 
ON "rentFlow_schema".users
FOR SELECT
USING (auth.uid()::text = id::text); -- Assuming your ID is the auth.uid

-- Create a policy for 'bills' so tenants can read their own bills
CREATE POLICY "Tenants can read own bills" 
ON "rentFlow_schema".bills
FOR SELECT
USING (tenant_id::text = auth.uid()::text);


-- 1. Create the function that will be triggered
CREATE OR REPLACE FUNCTION "rentFlow_schema".handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO "rentFlow_schema".users (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'New Tenant'), 
    'tenant' -- Default role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger to execute the function on every auth sign-up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE "rentFlow_schema".handle_new_user();


  -- 1. Drop the existing foreign key references to the users table first (if any)
ALTER TABLE "rentFlow_schema".bills DROP CONSTRAINT IF EXISTS bills_tenant_id_fkey;
ALTER TABLE "rentFlow_schema".requests DROP CONSTRAINT IF EXISTS requests_tenant_id_fkey;
ALTER TABLE "rentFlow_schema".messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE "rentFlow_schema".messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;

-- 2. Change the ID type to UUID
ALTER TABLE "rentFlow_schema".users ALTER COLUMN id SET DATA TYPE UUID USING (gen_random_uuid());
ALTER TABLE "rentFlow_schema".users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Re-add foreign key constraints
ALTER TABLE "rentFlow_schema".bills ADD CONSTRAINT bills_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES "rentFlow_schema".users(id) ON DELETE CASCADE;
ALTER TABLE "rentFlow_schema".requests ADD CONSTRAINT requests_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES "rentFlow_schema".users(id) ON DELETE CASCADE;
-- (Repeat for other tables)