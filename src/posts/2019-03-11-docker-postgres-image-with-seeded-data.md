---
title: Postgresql Docker Image with Seeded Data
date: "2019-03-11"
template: "post"
draft: false
slug: "docker-postgres-image-with-seeded-data"
category: "Programming"
tags:
  - "postgres"
  - "postgresql"
  - "database"
  - "docker"
  - "alpine-linux"
  - "data"
  - "seeded-data"
description: "Recently, I decided that one of my goals for 2019 was to familiarize myself more with Docker. I've been exposed to using Docker for the past couple of years, but I don't use it on a day to day basis."
socialImage: 
---

Recently, I decided that one of my goals for 2019 was to familiarize myself more with Docker. I've been exposed to using Docker for the past couple of years, but I don't use it on a day to day basis. Every once in a while, I would need to update a Dockerfile or a script and I would realize I needed to brush up on mostly everything because it had been so long since the last time I looked at anything Docker related. I decided I would just dive in and read a book to familiarize myself with any concepts I had glossed over before so I started reading [Learn Docker – Fundamentals of Docker 18.x]( https://www.amazon.com/Learn-Docker-Fundamentals-containerizing-applications/dp/1788997026). It was during a tutorial where some seeded data was needed in a Postgresql database that I was had a bit of an aha moment. I can build images that have data in them already?!' I thought to myself; this could actually really help out on local development if I had a copy of a production database. 

I thought I would put together a quick little tutorial on how you can create a Postgresql Docker image with seeded data that anyone could use.

To start off, I created a new Rails application and generated a migration that created 100 users. You can find the code for that application [here](https://github.com/jer-k/postgres_docker_image_with_data/tree/master/postgres_data) (if you want to follow along using that database, simply replace instances of `my_database_name` in this article with `postgres_data_development`). Once the users are in the database, [pg_dump](https://www.postgresql.org/docs/10/app-pgdump.html) can be used to create the file needed to seed the database in our image.

```bash
$ pg_dump my_database_name -O -x > my_database_name.sql
```

The `-O -x` flags tell `pg_dump` to have no owner and no privileges so that the data can be imported into a new database without worrying about user accounts. You can see the generated `.sql` file from my example project [here](https://github.com/jer-k/postgres_docker_image_with_data/blob/master/pg_data.sql).

Generating a `.sql` file will work, but imagine a database much larger than the 100 users I created. A good alternative would be to use [gzip](https://www.gnu.org/software/gzip/) to compress the file and reduce the Docker image size.

```bash
$ pg_dump my_database_name -O -x | gzip -9 > my_database_name.sql.gz
```

With the compressed database, it’s time to start building the Dockerfile.

```bash
FROM postgres:10.6-alpine
COPY database_name.sql.gz /docker-entrypoint-initdb.d/
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=my_database_name
```

That’s it! As of writing the latest version of [postgres](https://hub.docker.com/_/postgres) 10 is `10.6-alpine`. Simply `COPY` the compressed database into the `docker-entrypoint-initdb.d` directory and then the Postgresql base image understands to unzip and initialize the database with the dump file. The only other thing needed is to set the environment variables so that there is a user to access the database with.

Build the image using the `-t` flag to name it so that it can be referenced it when running a container.

```bash
$ docker image build -t my_database_image .
```

Now run the image using the `-d` flag to run it in detached mode. The last argument `postgres` is the command to start the database.

```bash
$ docker run -d --name my_running_database --rm my_database_image postgres
```

To ensure everything worked properly, there should be 100 users in the database when queried.

```bash
$ docker exec my_running_database psql -U postgres my_database_name -c “select count(*) from users;”
count 
-------
   100
(1 row)
```

Success! We created a Docker image with seeded data that anyone could use. Also, don't forget to stop the container that was started earlier!

```bash
$ docker stop my_running_database
```
