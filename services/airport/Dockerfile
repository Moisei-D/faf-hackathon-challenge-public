# gunicorn runs 1 worker: gate state lives in-process, so extra workers would diverge.
FROM public.ecr.aws/docker/library/python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 3001
CMD ["gunicorn", "-w", "1", "--threads", "8", "-b", "0.0.0.0:3001", "--timeout", "120", "app:app"]
