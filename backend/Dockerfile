# offical python base image
FROM python:3.10.7-slim-bullseye

# set work directory
WORKDIR /backend

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependancies - if bcrypt doesn't come prebuild in a wheel, gcc and other build tools may have to be installed
RUN pip install --upgrade pip
COPY ./requirements.txt /backend
RUN pip install -r ./requirements.txt

# copy project
COPY . ./

# start gunicorn
EXPOSE 5000
CMD ["gunicorn", "-b", ":5000", "app:app"]