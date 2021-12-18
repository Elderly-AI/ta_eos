-- +goose Up
-- +goose StatementBegin
ALTER TABLE metrics
    ADD COLUMN IF NOT EXISTS user_id integer,
    ADD CONSTRAINT metrics_userId
        FOREIGN KEY (user_id)
            REFERENCES users (user_id);

ALTER TABLE metrics
    DROP COLUMN IF EXISTS metric_id;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE metrics
    DROP COLUMN IF EXISTS user_id;
ALTER TABLE metrics
    ADD COLUMN IF NOT EXISTS metric_id SERIAL;
-- +goose StatementEnd
