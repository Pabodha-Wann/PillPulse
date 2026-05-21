CREATE TABLE medicines (
                           id              BIGSERIAL PRIMARY KEY,
                           name            VARCHAR(255) NOT NULL,
                           generic_name    VARCHAR(255),
                           category        VARCHAR(100),
                           description     VARCHAR(500),
                           manufacturer    VARCHAR(255),
                           created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           updated_at      TIMESTAMP
);

CREATE TYPE stock_status AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK');

CREATE TABLE pharmacy_medicines (
                                    id                  BIGSERIAL PRIMARY KEY,
                                    pharmacy_id         BIGINT NOT NULL,
                                    medicine_id         BIGINT NOT NULL REFERENCES medicines(id),
                                    quantity_in_stock   INT DEFAULT 0,
                                    status              stock_status NOT NULL DEFAULT 'OUT_OF_STOCK',
                                    price               DECIMAL(10,2),
                                    updated_at          TIMESTAMP,
                                    UNIQUE(pharmacy_id, medicine_id)
);