-- +goose Up
-- +goose StatementBegin

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS grades jsonb not null default '{}'::jsonb;
INSERT INTO users(user_id, name, email, study_group, password, role)
    VALUES('1', 'admin@admin.ru', 'admin', 'admin', 'admin', 'admin');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

ALTER TABLE users
    DROP COLUMN grades;

-- +goose StatementEnd
