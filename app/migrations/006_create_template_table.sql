-- +goose Up
-- +goose StatementBegin

CREATE TABLE IF NOT EXISTS templates
(
    user_id    SERIAL PRIMARY KEY,
    kr_name    VARCHAR(256) default '',
    template   jsonb        default null,
    saved_date timestamp
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE templates;

-- +goose StatementEnd