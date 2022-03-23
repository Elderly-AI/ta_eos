-- +goose Up
-- +goose StatementBegin

DROP TABLE templates;
CREATE TABLE IF NOT EXISTS templates
(
    template_id SERIAL PRIMARY KEY,
    user_id     text,
    kr_name     VARCHAR(256) default '',
    template    jsonb        default null,
    saved_date  timestamp
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE templates;

-- +goose StatementEnd