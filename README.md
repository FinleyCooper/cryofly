# CryoFly
Full-stack app for accessing lessons and homeworks from Firefly and displaying them in a much clearer and navigable way with added customisation.  
Uses React on the frontend and Flask on the backend with a SQLite database for user data storage and a redis database for session token storage.  
To run install docker and docker-compose and add to `backend/.env` a `SECRET_KEY` token and `MAIL_PASSWORD` and `MAIL_USERNAME` for the email token verification. Finally run
```
docker-compose up
```
to run the app on port 80 on the local machine.  