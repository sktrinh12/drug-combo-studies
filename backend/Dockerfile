FROM python:slim
ARG POSTGRES_PASSWORD=postgres
ARG POSTGRES_HOST
ARG POSTGRES_USER=postgres
ARG POSTGRES_DBNAME=postgres
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV POSTGRES_HOST=$POSTGRES_HOST
ENV POSTGRES_USER=$POSTGRES_USER
ENV POSTGRES_DBNAME=$POSTGRES_DBNAME

WORKDIR /app

COPY requirements.txt requirements.txt

RUN python -m pip install --upgrade pip

RUN pip3 install --no-cache-dir -r requirements.txt

# COPY . ./

CMD [ "python", "main.py"]
