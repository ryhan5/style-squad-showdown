# Virtual Try-On Backend

This is the backend service for the Virtual Try-On application, providing APIs for image processing, virtual try-on functionality, and real-time updates.

## Features

- **Image Upload**: Upload user and garment images
- **Virtual Try-On**: Process images to create virtual try-on results
- **Real-time Processing**: WebSocket support for real-time updates
- **Video Processing**: Support for video stream processing
- **RESTful API**: Standardized API endpoints for integration

## Tech Stack

- **Framework**: FastAPI
- **Computer Vision**: OpenCV
- **Real-time**: WebSockets
- **Image Processing**: NumPy, OpenCV
- **API Documentation**: Auto-generated with OpenAPI (Swagger UI)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   SECRET_KEY=your-secret-key
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_STORAGE_BUCKET_NAME=your-bucket-name
   AWS_S3_REGION=your-region
   ```

5. **Create required directories**
   ```bash
   mkdir -p uploads static/results
   ```

## Running the Application

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:

- **Interactive API Docs**: `http://localhost:8000/docs`
- **Alternative API Docs**: `http://localhost:8000/redoc`

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Image Upload
- `POST /api/upload/image` - Upload an image file

### Virtual Try-On
- `POST /api/try-on` - Process virtual try-on with provided images
- `GET /api/try-on/ws/{client_id}` - WebSocket endpoint for real-time try-on

## WebSocket API

Connect to `ws://localhost:8000/api/ws/try-on/{client_id}` for real-time updates.

**Example Message Format:**
```json
{
  "type": "try_on",
  "user_image": "path/to/user/image.jpg",
  "garment_image": "path/to/garment/image.jpg"
}
```

## Deployment

For production deployment, consider using:

1. **Gunicorn** with Uvicorn workers
   ```bash
   pip install gunicorn
   gunicorn -k uvicorn.workers.UvicornWorker main:app
   ```

2. **Docker** (create a Dockerfile)
   ```Dockerfile
   FROM python:3.9-slim
   
   WORKDIR /app
   COPY . .
   
   RUN pip install --no-cache-dir -r requirements.txt
   
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
