# Note Making Application

## To run application use command:
`npm run dev`

##### User Registration/Signup:
* api/v1/auth/registration

##### User Login
* api/v1/auth/login

##### Teacher Registration/Signup:
* api/v1/auth/registration/teacher

##### Teacher Login: 
* api/v1/auth/login/teacher

##### Get All Notes: (only teacher can access)
* api/v1/notes

##### Get Single Notes: (only owner (student) can view/edit/delete their own note )
* api/v1/notes/:id

#### **Note: Teacher can view/edit/delete any student's notes **