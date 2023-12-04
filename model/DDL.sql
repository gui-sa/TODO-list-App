;
CREATE DATABASE  sql_app;
\c sql_app;

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    birth DATE
);

CREATE TABLE IF NOT EXISTS todos(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    description VARCHAR(255),
    completed BOOLEAN DEFAULT FALSE,
    user_id INT NOT NULL,
    todo_parent_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (todo_parent_id) REFERENCES todos(id) ON DELETE CASCADE ON UPDATE CASCADE
);

;
\c postgres;
CREATE DATABASE  test_sql_app;
\c test_sql_app;

CREATE TABLE  IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    birth DATE
);

CREATE TABLE  IF NOT EXISTS todos(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    description VARCHAR(255),
    completed BOOLEAN DEFAULT FALSE,
    user_id INT NOT NULL,
    todo_parent_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (todo_parent_id) REFERENCES todos(id) ON DELETE CASCADE ON UPDATE CASCADE
);