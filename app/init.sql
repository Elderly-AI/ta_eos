CREATE TABLE users
(
    user_id     SERIAL PRIMARY KEY,
    name        text,
    email       text,
    study_group text,
    password    text
)