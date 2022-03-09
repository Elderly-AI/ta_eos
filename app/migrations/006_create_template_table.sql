-- +goose Up
-- +goose StatementBegin

CREATE TABLE IF NOT EXISTS templates
(
    user_id    SERIAL PRIMARY KEY,
    template   VARCHAR(256) default '',
    saved_date timestamp
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE templates;

-- +goose StatementEnd