CREATE DATABASE peworld;

------------------------------------------------------------

CREATE TABLE
    worker(
        worker_id VARCHAR PRIMARY KEY NOT NULL,
        worker_name VARCHAR(255),
        worker_email VARCHAR(255),
        worker_phone VARCHAR(255),
        worker_password VARCHAR(255),
        worker_province VARCHAR(255),
        worker_city VARCHAR(255),
        worker_workplace VARCHAR(255),
        worker_description VARCHAR(255)
    );

INSERT INTO
    worker(
        worker_id,
        worker_name,
        worker_email,
        worker_phone,
        worker_password
    )
VALUES (
        '1',
        'blabla',
        '123@gmail.com',
        '08987654321',
        '123'
    );

SELECT * FROM worker;

UPDATE worker
SET
    worker_name = 'punya kuasa',
    worker_province = 'jawa barat',
    worker_city = 'bandung',
    worker_workplace = '-',
    worker_description = 'lulusan smk'
WHERE
    worker_id = 'b0a3b0da-0dfb-4578-8d36-f1f0382f6e2e';

SELECT *
FROM worker
WHERE
    worker_id = 'b0a3b0da-0dfb-4578-8d36-f1f0382f6e2e';

------------------------------------------------------------

CREATE TABLE
    skill(
        skill_id VARCHAR PRIMARY KEY NOT NULL,
        skill_name VARCHAR(255),
        WorkerID VARCHAR,
        FOREIGN KEY (WorkerID) REFERENCES worker(worker_id)
    );

SELECT * FROM skill;

INSERT INTO
    skill(skill_id, skill_name, WorkerID)
VALUES (
        '2',
        'HTML',
        '4fa11315-2d83-47a1-beb5-ff11febafbb3'
    );

UPDATE skill
SET
    skill_name = 'HTML',
    WorkerID = '4fa11315-2d83-47a1-beb5-ff11febafbb3'
WHERE skill_id = '1';

------------------------------------------------------------

CREATE TABLE
    exp(
        exp_id VARCHAR PRIMARY KEY NOT NULL,
        position VARCHAR(255),
        company_name VARCHAR(255),
        working_start VARCHAR(255),
        working_end VARCHAR(255),
        description VARCHAR(255),
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        workerid VARCHAR,
        FOREIGN KEY (workerid) REFERENCES worker(worker_id)
    );

INSERT INTO
    exp(
        exp_id,
        position,
        company_name,
        working_start,
        working_end,
        description,
        workerid
    )
VALUES (
        '68d8210d-7936-4b70-9bce-71cf4d57c0d4',
        'dev enginer',
        'google',
        '2018',
        '2019',
        'google bagus',
        '4fa11315-2d83-47a1-beb5-ff11febafbb3'
    );

SELECT * FROM exp;

------------------------------------------------------------

CREATE TABLE
    portfolio(
        portfolio_id VARCHAR PRIMARY KEY NOT NULL,
        link_repo VARCHAR(255),
        tipe VARCHAR(255),
        app_name VARCHAR(255),
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        workerid VARCHAR,
        FOREIGN KEY (workerid) REFERENCES worker(worker_id)
    );

INSERT INTO
    portfolio(
        portfolio_id,
        link_repo,
        tipe,
        app_name,
        workerid
    )
VALUES (
        '68d8210d-7936-4b70-9bce-71cf4d57c0d4',
        'https://github.com/msuryasyahruli/intermediate-frontend.git',
        'aplikasi web',
        'Blanja',
        '4fa11315-2d83-47a1-beb5-ff11febafbb3'
    );

SELECT * FROM portfolio;

------------------------------------------------------------||------------------------------------------------------------

------------------------------------------------------------||------------------------------------------------------------

SELECT * FROM products;

SELECT * FROM products ORDER BY name acs LIMIT limit OFFSET offset;

SELECT
    products.id,
    products.name,
    products.price,
    products.image,
    products.brand,
    category.name AS category
FROM products
    join category ON products.id_category = category.id
WHERE products.id = 1;

SELECT
    products.*,
    category.name AS category
FROM products
    join category ON products.id_category = category.id
WHERE id = 1;

INSERT INTO
    products(
        id,
        name,
        price,
        stock,
        photo,
        description,
        id_category
    )
VALUES (
        1,
        'kaos',
        50000,
        25,
        'kaos.img',
        'eiger',
        1
    );

UPDATE products
SET
    name = 'kaos putih',
    price = 45000,
    stock = 19,
    image = 'kaosputih.img',
    brand = 'eiger'
WHERE id = 1;

DELETE FROM products WHERE id=1;

SELECT COUNT(*) FROM products;

SELECT id FROM products WHERE id=1;

SELECT
    products.id,
    products.name,
    products.price,
    products.image,
    products.brand,
    category.name AS category
FROM products
    join category ON products.id_category = category.id;

SELECT
    products.id,
    products.name,
    products.price,
    products.image,
    products.brand,
    category.name AS category
FROM products
    join category ON products.id_category = category.id
WHERE products.name ILIKE 'ja';

------------------------------------------------------------

SELECT * FROM category;

INSERT INTO category(id,name) VALUES(1,'T-shirt');

INSERT INTO category(id,name) VALUES(2,'short');

INSERT INTO category(id,name) VALUES(3,'pants');

INSERT INTO category(id,name) VALUES(4,'jacket');

UPDATE category SET name='T-shirt' WHERE id=1;

DELETE FROM category WHERE id=1;

SELECT COUNT(*) FROM category;

SELECT id FROM category WHERE id=1;

------------------------------------------------------------

SELECT * FROM orders;

INSERT INTO
    orders(
        id,
        date,
        address,
        shipping,
        total_price,
        id_product
    )
VALUES (
        1,
        '17 juni 2011',
        'jl.gatot subroto no 35',
        'JNE',
        50000,
        id_product
    );

UPDATE orders
SET
    date = '18 juni 2011',
    address = 'jl.gatot subroto no 35',
    shipping = 'JNT reg',
    total_price = 45000,
    id_product = 1
WHERE id = 1;

DELETE FROM orders WHERE id=1;

SELECT COUNT(*) FROM orders;

SELECT id FROM orders WHERE id=1;

------------------------------------------------------------

SELECT * FROM users;

INSERT INTO
    users(
        id,
        email,
        password,
        fullname,
        role
    )
VALUES (
        '1',
        'blabla',
        '123',
        'bebas',
        'apasaja'
    );

DELETE FROM users WHERE id=1;