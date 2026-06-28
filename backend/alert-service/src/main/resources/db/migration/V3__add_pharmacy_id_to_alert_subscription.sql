ALTER TABLE alert_subscriptions
    ADD COLUMN pharmacy_id BIGINT;

ALTER TABLE alert_subscriptions
    ADD CONSTRAINT unique_subscription UNIQUE(user_email, medicine_id, pharmacy_id);