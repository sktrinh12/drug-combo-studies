FROM postgres:alpine

ARG USERNAME=postgres
ENV HOME /home/$USERNAME
ENV POSTGRES_PASSWORD=postgres

RUN apk add --update sudo curl

# RUN mkdir -p $HOME \
#   && cd $HOME \
#   && curl -O http://drugcombdb.denglab.org/download/drugcombs_response.csv

# RUN cd $HOME \
#   && sed -i '6103012d' drugcombs_response.csv

COPY drugcombs_response.csv /home/postgres/ 

ADD setup.sql /docker-entrypoint-initdb.d
RUN chmod a+r /docker-entrypoint-initdb.d/*

USER $USERNAME
WORKDIR $HOME

EXPOSE 5432 
