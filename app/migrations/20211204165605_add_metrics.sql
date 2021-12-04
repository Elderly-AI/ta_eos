-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS metrics(
    metric_id SERIAL,
    method_name text,
    date timestamp,
    metric_data jsonb DEFAULT null
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE metrics;
-- +goose StatementEnd
