-- Runs once, against an empty database. Changes to an existing table need step 19 (migrations).
CREATE TABLE links (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    url text NOT NULL,
    title text,
    created_at timestamptz NOT NULL DEFAULT now()
);
