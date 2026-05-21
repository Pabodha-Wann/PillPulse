CREATE TABLE alert_subscriptions (
                                     id              BIGSERIAL PRIMARY KEY,
                                     user_email      VARCHAR(255) NOT NULL,
                                     medicine_id     BIGINT NOT NULL,
                                     medicine_name   VARCHAR(255) NOT NULL,
                                     is_active       BOOLEAN DEFAULT true,
                                     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alert_history (
                               id              BIGSERIAL PRIMARY KEY,
                               user_email      VARCHAR(255) NOT NULL,
                               medicine_id     BIGINT NOT NULL,
                               medicine_name   VARCHAR(255) NOT NULL,
                               pharmacy_id     BIGINT NOT NULL,
                               message         VARCHAR(500) NOT NULL,
                               sent_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);