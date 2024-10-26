CREATE DATABASE shop;
USE shop;

-- Create tables
DROP TABLE IF EXISTS `auth`;
CREATE TABLE `auth`
(
    `id`         int          NOT NULL AUTO_INCREMENT,
    `user_id`    int          NOT NULL,
    `user_name`  varchar(255) NOT NULL,
    `salt`       varchar(50)                        DEFAULT NULL,
    `password`   varchar(100) CHARACTER SET utf8mb4 DEFAULT NULL,
    `created_at` datetime                           DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime                           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
    `status`        INT                                     DEFAULT 1,
    `created_at`    TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer`
(
    `id`            int                            NOT NULL AUTO_INCREMENT,
    `phone_number`  VARCHAR(20),
    `address`       VARCHAR(255),
    `first_name`    VARCHAR(255),
    `last_name`     VARCHAR(255),
    `date_of_birth` date,
    `gender`        enum ('male','female','other') NOT NULL DEFAULT 'other',
    `status`        INT                                     DEFAULT 1,
    `created_at`    TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP                               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `provider`;
CREATE TABLE `provider`
(
    `id`           INT NOT NULL AUTO_INCREMENT,
    `name`         VARCHAR(255),
    `address`      VARCHAR(255),
    `email`        VARCHAR(255),
    `phone_number` VARCHAR(20),
    `status`       INT       DEFAULT 1,
    `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

# PRODUCT
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`
(
    `id`          INT NOT NULL AUTO_INCREMENT,
    `name`        VARCHAR(255),
    `description` TEXT,
    `metadata`    JSON,
    `images`      JSON,
    `status`      INT       DEFAULT 1,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


DROP TABLE IF EXISTS `spu`;
CREATE TABLE `spu`
(
    `id`           INT     NOT NULL AUTO_INCREMENT,
    `name`         VARCHAR(255),
    `description`  TEXT,
    `metadata`     JSON,
    `images`       JSON,
    `out_of_stock` BOOLEAN NOT NULL DEFAULT false,
    `status`       INT              DEFAULT 1,
    `created_at`   TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   TIMESTAMP        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
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
    `description` TEXT,
    `data_type`   enum ('text','number','boolean'),
    `value`       JSON,
    `status`      INT       DEFAULT 1,
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
    `id`         INT            NOT NULL AUTO_INCREMENT,
    `sku_no`     VARCHAR(32)    NOT NULL, -- {provider_id}{spu-id}{attr1}{attr2}.....
    `images`     JSON,
    `price`      DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `stock`      INT            NOT NULL DEFAULT 0,
    `status`     INT                     DEFAULT 1,
    `created_at` TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`) USING BTREE,
    KEY `status` (`status`) USING BTREE,
    KEY `sku_no` (`sku_no`) USING BTREE
) ENGINE = InnoDB
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

DROP TABLE IF EXISTS `sku_to_spu`;
CREATE TABLE `sku_to_spu`
(
    `spu_id`     INT NOT NULL,
    `sku_id`     INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`spu_id`, `sku_id`) USING BTREE,
    KEY `sku_id` (`sku_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


DROP TABLE IF EXISTS `sku_to_attr`;
CREATE TABLE `sku_to_attr`
(
    `sku_attr_id` INT NOT NULL,
    `sku_id`      INT NOT NULL,
    `status`      INT       DEFAULT 1,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`sku_attr_id`, `sku_id`) USING BTREE,
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

# STOCK IN
DROP TABLE IF EXISTS `stock_in`;
CREATE TABLE `stock_in`
(
    `id`            INT NOT NULL AUTO_INCREMENT,
    `provider_id`   INT NOT NULL,
    `warehouse_men` INT NOT NULL,
    `status`        INT       DEFAULT 1,
    `updated_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE,
    KEY `provider_id` (`provider_id`) USING BTREE,
    KEY `warehouse_men` (`warehouse_men`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `stock_in_detail`;
CREATE TABLE `stock_in_detail`
(
    `id`          INT NOT NULL AUTO_INCREMENT,
    `stock_in_id` INT NOT NULL,
    `sku_id`      INT NOT NULL,
    `amount`      INT NOT NULL DEFAULT 1,
    `created_at`  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    `status`      INT          DEFAULT 1,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE,
    KEY `stock_in_id` (`stock_in_id`) USING BTREE,
    KEY `sku_id` (`sku_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

# REPORT
DROP TABLE IF EXISTS `inventory_report`;
CREATE TABLE `inventory_report`
(
    `id`              INT NOT NULL AUTO_INCREMENT,
    `warehouse_man_1` INT NOT NULL,
    `warehouse_man_2` INT,
    `warehouse_man_3` INT,
    `status`          INT       DEFAULT 1,
    `updated_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `inventory_report_detail`;
CREATE TABLE `inventory_report_detail`
(
    `id`            INT     NOT NULL AUTO_INCREMENT,
    `sku_id`        INT     NOT NULL,
    `amount`        INT     NOT NULL,
    `inventory_dif` INT     NOT NULL DEFAULT 0,
    `is_true`       BOOLEAN NOT NULL DEFAULT true, #is inventory in report the same with database????
    `status`        INT              DEFAULT 1,
    `created_at`    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE,
    KEY `sku_id` (`sku_id`) USING BTREE,
    KEY `is_true` (`is_true`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

# STOCK OUT
DROP TABLE IF EXISTS `stock_out`;
CREATE TABLE `stock_out`
(
    `id`                  INT NOT NULL AUTO_INCREMENT,
    `warehouse_men`       INT NOT NULL,
    `stock_out_reason_id` INT NOT NULL,
    `status`              INT       DEFAULT 1,
    `updated_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE,
    KEY `warehouse_men` (`warehouse_men`) USING BTREE,
    KEY `stock_out_reason_id` (`stock_out_reason_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `stock_out_reason`;
CREATE TABLE `stock_out_reason`
(
    `id`          INT          NOT NULL AUTO_INCREMENT,
    `name`        VARCHAR(255) NOT NULL,
    `description` TEXT,
    `status`      INT       DEFAULT 1,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `stock_out_detail`;
CREATE TABLE `stock_out_detail`
(
    `id`           INT NOT NULL AUTO_INCREMENT,
    `stock_out_id` INT NOT NULL,
    `sku_id`       INT NOT NULL,
    `amount`       INT NOT NULL DEFAULT 1,
    `updated_at`   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at`   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    `status`       INT          DEFAULT 1,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE,
    KEY `stock_out_id` (`stock_out_id`) USING BTREE,
    KEY `sku_id` (`sku_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


# WARRANTY
DROP TABLE IF EXISTS `warranty_form`;
CREATE TABLE `warranty_form`
(
    `id`            INT NOT NULL AUTO_INCREMENT,
    `order_item_id` INT NOT NULL,
    `amount`        INT NOT NULL DEFAULT 0,
    `status`        INT          DEFAULT 1,
    `created_at`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `order_item_id` (`order_item_id`) USING BTREE,
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


# ORDER
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order`
(
    `id`          INT                          NOT NULL AUTO_INCREMENT,
    `customer_id` INT                          NOT NULL,
    `seller_id`   INT                          NOT NULL, # Reference to user_id
    `status`      INT                                   DEFAULT 1,
    `order_type`  ENUM ('retail', 'wholesale') NOT NULL DEFAULT 'retail',
    `created_at`  TIMESTAMP                             DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP                             DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE,
    KEY `customer_id` (`customer_id`) USING BTREE,
    KEY `seller_id` (`seller_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `order_item`;
CREATE TABLE `order_item`
(
    `id`         BIGINT NOT NULL,
    `order_id`   INT    NOT NULL,
    `sku_id`     INT    NOT NULL,
    `amount`     INT    NOT NULL DEFAULT 1,
    `unit_price` DECIMAL(15, 2)  DEFAULT 0,
    `created_at` TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY (`order_id`, `sku_id`) USING BTREE,
    KEY `sku_id` (`sku_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


# PAYMENT
DROP TABLE IF EXISTS `bill`;
CREATE TABLE `bill`
(
    `id`         INT            NOT NULL AUTO_INCREMENT,
    `order_id`   INT            NOT NULL,
    `cashier_id` INT            NOT NULL, #Reference to user_id,
    `amount`     DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `status`     INT                     DEFAULT 1,
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
    `status`         INT       DEFAULT 1,
    `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `status` (`status`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;



# DROP TABLE IF EXISTS `ledger`;
# CREATE TABLE `ledger` (
#     `id` int not null auto_increment,
#     `payment_id` int not null,
#     `account_id` int not null,
#     `debit` DECIMAL(15,2) ,
#     `credit` DECIMAL(15,2),
#     `currency` VARCHAR(3),
#     `status` int NOT NULL DEFAULT '1',
#     `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
#     `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#     PRIMARY KEY (`id`),
#     KEY `account_id` (`account_id`) USING BTREE ,
#     KEY `payment_id` (`payment_id`) USING BTREE ,
#     KEY `status` (`status`) USING BTREE
# ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
