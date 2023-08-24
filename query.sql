CREATE DATABASE peworld;

------------------------------------------------------------

CREATE TABLE
    worker(
        worker_id VARCHAR PRIMARY KEY NOT NULL,
        worker_name VARCHAR,
        worker_email VARCHAR,
        worker_phone VARCHAR,
        worker_password VARCHAR,
        worker_jobdesk VARCHAR,
        worker_photo VARCHAR,
        worker_province VARCHAR,
        worker_city VARCHAR,
        worker_workplace VARCHAR,
        worker_description VARCHAR,
        worker_role VARCHAR
    );

INSERT INTO
    worker(
        worker_id,
        worker_name,
        worker_email,
        worker_phone,
        worker_password,
        worker_jobdesk,
        worker_photo
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

SELECT skill.*, worker.worker_name, worker.worker_jobdesk, worker.worker_province, worker.worker_city FROM skill join worker ON skill.workerid = worker.worker_id;
SELECT skill.*, worker.* FROM skill join worker ON skill.workerid = worker.worker_id;

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
        photo VARCHAR,
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
        photo,
        workerid
    )
VALUES (
        '68d8210d-7936-4b70-9bce-71cf4d57c0d4',
        'https://github.com/msuryasyahruli/intermediate-frontend.git',
        'aplikasi web',
        'Blanja',
        'poto.png',
        '4fa11315-2d83-47a1-beb5-ff11febafbb3'
    );

SELECT * FROM portfolio;
