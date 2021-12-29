-- +goose Up
-- +goose StatementBegin

ALTER TABLE metrics ADD COLUMN id BIGINT GENERATED ALWAYS AS IDENTITY;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

ALTER TABLE metrics DROP COLUMN id;

-- +goose StatementEnd
