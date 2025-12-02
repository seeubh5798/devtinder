# devTidner APIs
# authRouter
 - POST /signup
 - POST /login
 - POST /logout

# profileRouter
 - PATCH /profile/edit
 - PATCH /profile/password
 - GET  /profile/view

- POST /request/send/interested/:toUserId
- POST /request/send/ignored/:toUserId
these 2 APIs can be clubbed into one:
- POST /request/send/:status/:toUserId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId
these 2 APIs can be clubbed into one:
 POST /request/review/:status/:requestId


# userRouter
- GET /user/connections
- GET /user/request/
- GET /user/feed


 
