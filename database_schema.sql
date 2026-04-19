-- Hostel Management System Database Schema

-- =========================
-- 1. Students
-- =========================
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    course VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    is_preloaded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 2. Management
-- =========================
CREATE TABLE IF NOT EXISTS management (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'management',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 3. Rooms
-- =========================
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(20) UNIQUE NOT NULL,
    block VARCHAR(20) NOT NULL,
    capacity INTEGER NOT NULL,
    occupied INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 4. Room Allocations
-- =========================
CREATE TABLE IF NOT EXISTS room_allocations (
    id SERIAL PRIMARY KEY,
    student_id INTEGER UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 5. Room Preferences
-- =========================
CREATE TABLE IF NOT EXISTS room_preferences (
    id SERIAL PRIMARY KEY,
    student_id INTEGER UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    preferred_block VARCHAR(20),
    preferred_room_type VARCHAR(50),
    special_request TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 6. Mess Menu
-- =========================
CREATE TABLE IF NOT EXISTS mess_menu (
    id SERIAL PRIMARY KEY,
    day VARCHAR(20),
    meal_type VARCHAR(20),
    items TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 7. Mess Attendance
-- =========================
CREATE TABLE IF NOT EXISTS mess_attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    meal_date DATE NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 8. Mess Feedback
-- =========================
CREATE TABLE IF NOT EXISTS mess_feedback (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    feedback_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 9. Mess Charges
-- =========================
CREATE TABLE IF NOT EXISTS mess_charges (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    month VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 10. Leave Requests
-- =========================
CREATE TABLE IF NOT EXISTS leave_requests (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 11. Maintenance Requests
-- =========================
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    issue_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    room_number VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 12. Community Posts
-- =========================
CREATE TABLE IF NOT EXISTS community_posts (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    posted_by_role VARCHAR(20) DEFAULT 'student',
    posted_by_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 13. Roommate Preferences
-- =========================
CREATE TABLE IF NOT EXISTS roommate_preferences (
    id SERIAL PRIMARY KEY,
    student_id INTEGER UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    sleep_schedule VARCHAR(50),
    study_habit VARCHAR(50),
    cleanliness_level VARCHAR(50),
    smoking_preference VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 14. Roommate Requests
-- =========================
CREATE TABLE IF NOT EXISTS roommate_requests (
    id SERIAL PRIMARY KEY,
    from_student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    to_student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SAMPLE DATA
-- =========================

-- Rooms
INSERT INTO rooms (room_number, block, capacity, occupied)
VALUES
('A101', 'A', 2, 0),
('A102', 'A', 2, 0),
('B201', 'B', 3, 0)
ON CONFLICT (room_number) DO NOTHING;

-- Mess Menu
INSERT INTO mess_menu (day, meal_type, items)
VALUES
('Monday', 'Breakfast', 'Bread, Butter, Tea'),
('Monday', 'Lunch', 'Rice, Dal, Paneer, Salad'),
('Monday', 'Dinner', 'Chapati, Mix Veg, Curd'),
('Tuesday', 'Breakfast', 'Poha, Tea'),
('Tuesday', 'Lunch', 'Rice, Rajma, Salad'),
('Tuesday', 'Dinner', 'Chapati, Aloo Gobi, Dal');

-- Optional sample management record
-- Replace password hash with your real bcrypt hash if needed
INSERT INTO management (full_name, email, password, role)
VALUES
('Hostel Admin', 'admin@hcl.com', '$2a$10$abcdefghijklmnopqrstuv', 'management')
ON CONFLICT (email) DO NOTHING;
