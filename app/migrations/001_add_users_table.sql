-- +goose Up
-- +goose StatementBegin

CREATE TABLE users (
    user_id     SERIAL PRIMARY KEY,
    name        VARCHAR(20)  default '',
    email       VARCHAR(20)  default '',
    study_group VARCHAR(5)   default '',
    password    VARCHAR(256) default ''
)
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE users;

-- +goose StatementEnd