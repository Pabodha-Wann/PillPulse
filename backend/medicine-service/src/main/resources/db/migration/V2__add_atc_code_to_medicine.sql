ALTER TABLE medicines ADD COLUMN atc_code VARCHAR(50);
ALTER TABLE medicines ADD CONSTRAINT unique_name_atc_code UNIQUE (name, atc_code);
