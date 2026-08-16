# base image
FROM python:3.11-slim

# workdir
WORKDIR /app

# copy requirements.txt
COPY requirements.txt .

# run
RUN pip install --no-cache-dir -r requirements.txt

# copy all files - so file changes still use the same preinstalled dependencies
COPY . .

# port
EXPOSE 8000

# command
CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]