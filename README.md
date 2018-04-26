# Ripe Banana:
### A server for actors, films, studios, and reviews stored with Mongo DB. Built as a student exercise for Alchemy Code Lab.

### Author: Charly Welch        
<blwbiology@gmail.com>

## Description
Sign in as a reviewer to add reviews to movies. 
Admin can update data for films, studios, reviews

### All users:
GET films, reviews, and studios

### Reviewers: 
POST reviews

### Admin:
PUT/POST/DELETE films, reviews and movies

## Routes:

* `/auth/signup`: create a reviewer
* `/auth/signin`: sign in as a reviewer
* `/studios`
    * `/` : post to studios or get all studios
    * `/:id`: get a studio by id, update or delete a studio
* `/actors`
    * `/` : post to actors or get all actors
    * `/:id`: get a actor by id, update or delete a actor
* `/films`
    * `/` : post to films or get all films
    * `/:id`: get a film by id, update or delete a film
* `/reviews`
    * `/` : get all reviews or post a review

## Dependencies:
- chai
- chai-http
- dotenv
- express
- mongoose
- jsonwebtoken
- bcryptjs