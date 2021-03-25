FROM python:3.7

RUN python -m pip install flask flask-cors gunicorn numpy tensorflow pillow

WORKDIR /app

ADD image.py image.py
ADD mnist_recognizer.py mnist_recognizer.py
ADD model.h5 model.h5

EXPOSE 5000

CMD [ "gunicorn", "--bind", "0.0.0.0:5000", "mnist_recognizer:app" ]

