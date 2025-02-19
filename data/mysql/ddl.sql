CREATE DATABASE shop;
USE shop;


-- Create tables
DROP TABLE IF EXISTS `auth`;
CREATE TABLE `auth`
(
    `id`         int          NOT NULL AUTO_INCREMENT,
    `user_id`    int          NOT NULL,
    `user_name`  varchar(255) NOT NULL,
    `salt`       varchar(50)  NOT NULL,
    `password`   varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `created_at` datetime     DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_name` (`user_name`) USING BTREE,
    KEY `user_id` (`user_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`
(
    `id`            int                            NOT NULL AUTO_INCREMENT,
    `phone_number`  VARCHAR(20),
    `user_name`     VARCHAR(255)                   NOT NULL UNIQUE,
    `email`         varchar(255) UNIQUE,
    `address`       VARCHAR(255),
    `first_name`    VARCHAR(255)                   NOT NULL,
    `last_name`     VARCHAR(255)                   NOT NULL,
    `date_of_birth` date,
    `gender`        enum ('male','female','other') NOT NULL DEFAULT 'other',
    `system_role`   ENUM ('admin','owner','sale_staff','warehouse_staff','technical_staff','finance_staff'),
    `avatar`        JSON,
    `status`        INT NOT NULL                                     DEFAULT 1,
    `created_at`    TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee`
(
    `id`            int                            NOT NULL AUTO_INCREMENT,
    `phone_number`  VARCHAR(20),
    `address`       VARCHAR(255),
    `first_name`    VARCHAR(255) NOT NULL ,
    `last_name`     VARCHAR(255) NOT NULL,
    `email`         varchar(255) UNIQUE,
    `date_of_birth` date,
    `gender`        enum ('male','female','other') NOT NULL DEFAULT 'other',
    `status`        INT NOT NULL                                     DEFAULT 1,
    `created_at`    TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer`
(
    `id`        INT NOT NULL AUTO_INCREMENT,
    `phone_number`  VARCHAR(20) NOT NULL UNIQUE,
    `address`       VARCHAR(255),
    `first_name`    VARCHAR(255) NOT NULL ,
    `last_name`     VARCHAR(255) NOT NULL,
    `date_of_birth` date,
    `payment_amount` INT NOT NULL DEFAULT 0,
    `gender`        enum ('male','female','other') NOT NULL DEFAULT 'other',
    `status`        INT NOT NULL                                     DEFAULT 1,
    `created_at`    TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

ALTER TABLE customer
    ADD COLUMN `discount_point` DECIMAL(15,2) DEFAULT 0 AFTER `payment_amount`;

ALTER TABLE customer
    DROP COLUMN `discount_point` ;

ALTER TABLE customer
    ADD COLUMN `discount_point`  INT UNSIGNED DEFAULT 0 AFTER `payment_amount`;


DROP TABLE IF EXISTS `provider`;
CREATE TABLE `provider`
(
    `id`           INT NOT NULL AUTO_INCREMENT,
    `name`         VARCHAR(255),
    `address`      VARCHAR(255),
    `email`        VARCHAR(255),
    `phone_number` VARCHAR(20),
    `status`       INT NOT NULL       DEFAULT 1,
    `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

alter table provider
add column `debt` DECIMAL(15, 2)  DEFAULT 0 AFTER `phone_number`;


DROP TABLE IF EXISTS `brand`;
CREATE TABLE `brand` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `status`       INT NOT NULL       DEFAULT 1,
    `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
)ENGINE = InnoDB
 DEFAULT CHARSET = utf8mb4;

# PRODUCT
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`
(
    `id`          INT NOT NULL AUTO_INCREMENT,
    `name`        VARCHAR(255),
    `level`       INT NOT NULL DEFAULT 0,
    `parent_id`   INT DEFAULT NULL,
    `image`       JSON,
    `status`      INT NOT NULL      DEFAULT 1,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `parent_id` (`parent_id`) USING BTREE,
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `category_to_brand`;
CREATE TABLE `category_to_brand`(
    `category_id` INT NOT NULL,
    `brand_id` INT NOT NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`category_id`,`brand_id`) USING BTREE
)ENGINE = InnoDB
 DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `spu`;
CREATE TABLE `spu`
(
    `id`           INT     NOT NULL AUTO_INCREMENT,
    `name`         VARCHAR(255),
    `brand_id`     INT NOT NULL,
    `description`  TEXT,
    `metadata`     JSON,
    `images`       JSON,
    `out_of_stock` BOOLEAN NOT NULL DEFAULT false,
    `status`       INT NOT NULL              DEFAULT 1,
    `time_warranty` INT DEFAULT 0,
    `time_return`  INT DEFAULT 0,
    `type_time_warranty` ENUM ('day','month','year') DEFAULT 'day',
    `type_time_return` ENUM ('day','month','year') DEFAULT 'day',
    `created_at`   TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   TIMESTAMP        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `brand_id` (`brand_id`) USING BTREE,
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


DROP TABLE IF EXISTS `spu_to_provider`;
CREATE TABLE `spu_to_provider`
(
    `provider_id` INT NOT NULL,
    `spu_id`      INT NOT NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`provider_id`, `spu_id`) USING BTREE,
    KEY `spu_id` (`spu_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- 1 to n
DROP TABLE IF EXISTS `category_to_spu`;
CREATE TABLE `category_to_spu`
(
    `category_id` INT NOT NULL,
    `spu_id`      INT NOT NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`category_id`, `spu_id`) USING BTREE,
    KEY `spu_id` (`spu_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `sku_attr`;
CREATE TABLE `sku_attr`
(
    `id`          INT NOT NULL AUTO_INCREMENT,
    `spu_id`      INT NOT NULL,
    `name`        VARCHAR(255),
    `data_type`   enum ('text','number','boolean'),
    `value`       JSON,
    `images`      JSON,
    `status`      INT NOT NULL       DEFAULT 1,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`) USING BTREE,
    KEY `status` (`status`) USING BTREE,
    KEY `spu_id` (`spu_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `sku`;
CREATE TABLE `sku`
(
    `id`            INT            NOT NULL AUTO_INCREMENT,
    `spu_id`        INT            NOT NULL,
    `sku_tier_idx`  JSON,
    `images`        JSON,
    `cost_price`         DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `price`         DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `stock`         INT            NOT NULL DEFAULT 0,
    `status`        INT NOT NULL                     DEFAULT 1,
    `created_at`    TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`) USING BTREE,
    KEY `spu_id` (`spu_id`) USING BTREE,
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `sku_retail_price_history`;
CREATE TABLE `sku_retail_price_history` (
    `id`           INT            NOT NULL AUTO_INCREMENT,
    `sku_id`       INT            NOT NULL,
    `new_price`    DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `old_price`    DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `created_at`    TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `sku_id` (`sku_id`) USING BTREE
)ENGINE = InnoDB
 DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `sku_wholesale_prices`;
CREATE TABLE `sku_wholesale_prices`
(
    `id`           INT            NOT NULL AUTO_INCREMENT,
    `sku_id`       INT            NOT NULL,
    `min_quantity` INT            NOT NULL COMMENT 'Số lượng tối thiểu',
    `price`        DECIMAL(15, 2) NOT NULL COMMENT 'Giá bán sỉ',
    PRIMARY KEY (`id`),
    KEY `sku_id` (`sku_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

# STOCK IN
DROP TABLE IF EXISTS `stock_in`;
CREATE TABLE `stock_in`
(
    `id`            INT NOT NULL AUTO_INCREMENT,
    `provider_id`   INT NOT NULL,
    `warehouse_men` INT NOT NULL,
    `status`        INT NOT NULL       DEFAULT 1,
    `updated_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE,
    KEY `provider_id` (`provider_id`) USING BTREE,
    KEY `warehouse_men` (`warehouse_men`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;
ALTER TABLE stock_in
    ADD COLUMN total_price DECIMAL(15,2)
        AFTER warehouse_men;

UPDATE stock_in s
 JOIN (
        SELECT s.id, SUM(d.total_price) as total
        FROM stock_in_detail d JOIN stock_in s ON s.id = d.stock_in_id GROUP BY s.id
        ) as sum_price
ON sum_price.id = s.id
SET s.total_price = sum_price.total;



SELECT * from stock_in;



DROP TABLE IF EXISTS `stock_in_detail`;
CREATE TABLE `stock_in_detail`
(
    `id`          INT NOT NULL AUTO_INCREMENT,
    `stock_in_id` INT NOT NULL,
    `sku_id`      INT NOT NULL,
    `amount`      INT NOT NULL DEFAULT 1,
    `created_at`  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    `status`      INT  NOT NULL         DEFAULT 1,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE,
    KEY `stock_in_id` (`stock_in_id`) USING BTREE,
    KEY `sku_id` (`sku_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;
ALTER TABLE stock_in_detail
    ADD COLUMN total_price INT NOT NULL
    AFTER amount;
ALTER TABLE stock_in_detail
    ADD COLUMN cost_price INT NOT NULL
    AFTER amount;


# REPORT
DROP TABLE IF EXISTS `inventory_report`;
CREATE TABLE `inventory_report`
(
    `id`              INT NOT NULL AUTO_INCREMENT,
    `warehouse_man_1` INT NOT NULL,
    `warehouse_man_2` INT,
    `warehouse_man_3` INT,
    `status`          INT  NOT NULL      DEFAULT 1,
    `updated_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;
alter table inventory_report
    add column note varchar(255);

DROP TABLE IF EXISTS `inventory_report_detail`;
CREATE TABLE `inventory_report_detail`
(
    `id`            INT     NOT NULL AUTO_INCREMENT,
    `inventory_report_id` INT  NOT NULL ,
    `sku_id`        INT     NOT NULL,
    `amount`        INT     NOT NULL,
    `inventory_dif` INT     NOT NULL DEFAULT 0,
    `is_true`       BOOLEAN NOT NULL DEFAULT true, #is inventory in report the same with database????
    `status`        INT   NOT NULL            DEFAULT 1,
    `note`          VARCHAR(255),
    `created_at`    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE,
    KEY `sku_id` (`sku_id`) USING BTREE,
    KEY `is_true` (`is_true`) USING BTREE,
    KEY `inventory_report_id` (`inventory_report_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;
alter table inventory_report_detail
    drop column note;
ALTER TABLE inventory_report_detail
    ADD COLUMN old_stock INT NOT NULL
    AFTER amount;

# STOCK OUT
DROP TABLE IF EXISTS `stock_out`;
CREATE TABLE `stock_out`
(
    `id`                  INT NOT NULL AUTO_INCREMENT,
    `warehouse_men`       INT NOT NULL,
    `stock_out_reason_id` INT NOT NULL,
    `status`              INT  NOT NULL     DEFAULT 1,
    `updated_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE,
    KEY `warehouse_men` (`warehouse_men`) USING BTREE,
    KEY `stock_out_reason_id` (`stock_out_reason_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;
ALTER TABLE stock_out
    ADD COLUMN total_price DECIMAL(15,2)
        AFTER stock_out_reason_id;

DROP TABLE IF EXISTS `stock_out_reason`;
CREATE TABLE `stock_out_reason`
(
    `id`          INT          NOT NULL AUTO_INCREMENT,
    `name`        VARCHAR(255) NOT NULL,
    `description` TEXT,
    `status`      INT  NOT NULL     DEFAULT 1,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;
ALTER TABLE `stock_out_reason`
    ADD COLUMN `stock_out_type` enum('chi','thu') default null
        AFTER description;


DROP TABLE IF EXISTS `stock_out_detail`;
CREATE TABLE `stock_out_detail`
(
    `id`           INT NOT NULL AUTO_INCREMENT,
    `stock_out_id` INT NOT NULL,
    `sku_id`       INT NOT NULL,
    `amount`       INT NOT NULL DEFAULT 1,
    `updated_at`   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at`   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    `status`       INT  NOT NULL        DEFAULT 1,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE,
    KEY `stock_out_id` (`stock_out_id`) USING BTREE,
    KEY `sku_id` (`sku_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;
ALTER TABLE stock_out_detail
    ADD COLUMN total_price INT NOT NULL
        AFTER amount;
ALTER TABLE stock_out_detail
    ADD COLUMN cost_price INT NOT NULL
        AFTER amount;

# WARRANTY
DROP TABLE IF EXISTS `warranty_form`;
CREATE TABLE `warranty_form`
(
    `id`                    INT NOT NULL AUTO_INCREMENT,
    `warranty_type` ENUM('new', 'fix', 'part', 'mf_fix'),

    `customer_id`           INT,
    `customer_phone_number` VARCHAR(255) NOT NULL,
    `stock_in_id`           INT,
    `sku_id`                INT NOT NULL,
    `order_id`              INT NOT NULL,

    `amount`                INT NOT NULL DEFAULT 0,

    `return_date`           TIMESTAMP,
    `note`                  TEXT,

    `status`                INT NOT NULL         DEFAULT 1,
    `created_at`            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    `updated_at`            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `warranty_type` (`warranty_type`) USING BTREE,
    KEY `sku_id` (`sku_id`) USING BTREE,
    KEY `order_id` (`order_id`) USING BTREE ,
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


# ORDER
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order`
(
    `id`          INT                          NOT NULL AUTO_INCREMENT,
    `customer_id` INT,
    `seller_id`   INT                          NOT NULL, # Reference to user_id
    `status`      INT NOT NULL                                  DEFAULT 1, # 0: soft delete, 1: ordering, 2: ordered
    `order_type`  ENUM ('retail', 'wholesale') NOT NULL DEFAULT 'retail',
    `created_at`  TIMESTAMP                             DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP                             DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE,
    KEY `customer_id` (`customer_id`) USING BTREE,
    KEY `seller_id` (`seller_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

ALTER TABLE `order`
ADD COLUMN `description` VARCHAR(255) AFTER `order_type`;

ALTER TABLE `order`
ADD COLUMN `total_amount` DECIMAL(15, 2) DEFAULT 0 AFTER `description`;

ALTER TABLE `order`
ADD COLUMN `discount_amount` DECIMAL(15, 2) DEFAULT 0 AFTER `total_amount`;

ALTER TABLE `order`
    ADD COLUMN `final_amount` DECIMAL(15, 2) DEFAULT 0 AFTER `discount_amount`;

ALTER TABLE `order`
    ADD COLUMN `point_used` INT UNSIGNED DEFAULT  0 AFTER `final_amount`;


DROP TABLE IF EXISTS `order_item`;
CREATE TABLE `order_item`
(
    `order_id`   INT    NOT NULL,
    `sku_id`     INT    NOT NULL,
    `amount`     INT    NOT NULL DEFAULT 1,
    `unit_price` DECIMAL(15, 2)  DEFAULT 0,
    `created_at` TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`order_id`, `sku_id`) USING BTREE,
    KEY `sku_id` (`sku_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


ALTER TABLE `order_item`
ADD COLUMN `description` VARCHAR(255) AFTER `amount`;

# PAYMENT
DROP TABLE IF EXISTS `bill`;
CREATE TABLE `bill`
(
    `id`         INT            NOT NULL AUTO_INCREMENT,
    `order_id`   INT            NOT NULL,
    `cashier_id` INT            NOT NULL, #Reference to user_id,
    `amount`     DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `status`     INT   NOT NULL                  DEFAULT 1,
    `created_at` TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE,
    KEY `order_id` (`order_id`) USING BTREE,
    KEY `casher_id` (`cashier_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment`
(
    `id`             INT NOT NULL AUTO_INCREMENT,
    `bill_id`        INT NOT NULL,
    `payment_method` enum ('cash','banking'),
    `state`          enum ('pending','success','failed'),
    `status`         INT  NOT NULL     DEFAULT 1,
    `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


DROP TABLE IF EXISTS `audit_log`;
CREATE TABLE `audit_log` (
     `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
     `user_id` INT NOT NULL COMMENT 'id = 0 if it is system action',
     `action` VARCHAR(50) NOT NULL,
     `object_type` VARCHAR(100) NOT NULL,
     `object_id` INT NOT NULL,
     `old_values` JSON,
     `new_values` JSON,
     `ip_address` VARCHAR(45) COMMENT 'id_address if it is system',
     `user_agent` VARCHAR(255),
     `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (`id`),
     KEY `idx_table_recauditord` (`object_type`, `object_id`) USING BTREE ,
     KEY `idx_user_id` (`user_id`) USING BTREE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'Tracks changes to database records';

DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE `system_settings` (
                                   `id` int NOT NULL AUTO_INCREMENT,
                                   `name` varchar(255) NOT NULL,
                                   `value` JSON DEFAULT NULL,
                                   `description` TEXT ,
                                   `status` INT DEFAULT 1,
                                   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                   PRIMARY KEY (`id`),
                                   UNIQUE `name` (`name`) USING BTREE,
                                   KEY `status` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;