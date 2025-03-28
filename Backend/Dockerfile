# Usa la imagen oficial de Python
FROM python:3.12.6

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia y instala las dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código del backend al contenedor
COPY . .

# Expone el puerto 8000 para el backend
EXPOSE 8000

# Aplica migraciones y ejecuta el servidor
CMD ["sh", "-c", "python Uapp/manage.py migrate && gunicorn -b 0.0.0.0:8000 Uapp.wsgi:application"]
