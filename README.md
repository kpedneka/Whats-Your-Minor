# What's Your Minor
---
A web app for you to see which majors and minors you're missing out on.


# Getting started
---
Clone this repository on your local machine
 ``` sh 
 $ cd /path/to/repository
 $ npm install
 $ nodemon
 ```
 App listens on port 3000
 [Go to localhost:3000/](http://localhost:3000/)
 
 # Routes & methods
 ---
 ### Router: courses
 | route | method | result |
 |-------|--------|--------|
 | /courses | GET | gets all courses from db, redirects to /courses/all |
 | /courses/all | GET | gets all courses from db |
 | /courses/:course_no | GET | gets single course by course_no |
 
 ### Router: majors
 | route | method | result |
 |-------|--------|--------|
 | /majors/all | GET | gets all majors from db |
 | /majors | GET | adds new course from excel, redirects to /minors/all |
 
  ### Router: minors
 | route | method | result |
 |-------|--------|--------|
 | /minors/all | GET | gets all minors from db |
 | /minors | GET | adds new course from excel, redirects to /minors/all |
 
 ### Router: users
 | route | method | result |
 |-------|--------|--------|
 | /users | GET | gets all courses from db|
 | /users/:username | GET | gets single user from db|
 | /users | POST | adds new user |
 | /users/:username | PUT | updates entry in db|

 # LICENSE
 ---
 MIT