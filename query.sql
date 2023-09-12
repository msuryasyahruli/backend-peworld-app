CREATE DATABASE peworld;

CREATE TABLE worker(
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
    worker_role VARCHAR,
    verify text not null,
    updated_on timestamp default CURRENT_TIMESTAMP not null,
);

CREATE  FUNCTION update_updated_on_worker()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';


CREATE TRIGGER update_worker_updated_on
    BEFORE UPDATE
    ON
        worker
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_worker();


create table worker_verification (
    id text not null ,
    worker_id text ,
    token text ,
    created_on timestamp default CURRENT_TIMESTAMP not null	,
    constraint 	worker foreign key(worker_id) 	references 	worker(worker_id) ON DELETE CASCADE,
primary key (id)
);

---------------------------------------------------------------------------------------------------------------------||
CREATE TABLE skill(
    skill_id VARCHAR PRIMARY KEY NOT NULL,
    skill_name VARCHAR(255),
    WorkerID VARCHAR,
    FOREIGN KEY (WorkerID) REFERENCES worker(worker_id)
);

CREATE TABLE exp(
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

CREATE TABLE portfolio(
    portfolio_id VARCHAR PRIMARY KEY NOT NULL,
    link_repo VARCHAR(255),
    tipe VARCHAR(255),
    app_name VARCHAR(255),
    photo VARCHAR,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    workerid VARCHAR,
    FOREIGN KEY (workerid) REFERENCES worker(worker_id)
);
---------------------------------------------------------------------------------------------------------------------||

CREATE TABLE recruiter (
    recruiter_id VARCHAR PRIMARY KEY NOT NULL,
    recruiter_email VARCHAR,
    recruiter_name VARCHAR,
    recruiter_password VARCHAR,
    recruiter_phone VARCHAR,
    recruiter_province VARCHAR,
    recruiter_city VARCHAR,
    company_name VARCHAR,
    company_email VARCHAR,
    company_field VARCHAR,
    company_phone VARCHAR,
    company_info VARCHAR,
    role VARCHAR,
    verify TEXT not null,
    updated_on TIMESTAMP default CURRENT_TIMESTAMP not null,
);

CREATE  FUNCTION update_updated_on_recruiter()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';


CREATE TRIGGER update_recruiter_updated_on
    BEFORE UPDATE
    ON
        recruiter
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_recruiter();


create table recruiter_verification (
    id text not null ,
    recruiter_id text ,
    token text ,
    created_on timestamp default CURRENT_TIMESTAMP not null	,
    constraint 	recruiter foreign key(recruiter_id) 	references 	recruiter(recruiter_id) ON DELETE CASCADE,
primary key (id)
);