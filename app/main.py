from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.api.routes import health, analysis

app = FastAPI(
    title="Medical Interaction API",
    description="AI-powered medicine extraction and drug interaction analysis API",
    version="1.0.0"
)

# ---------------------------------------------------------------
# CORS
# Required so the React frontend (Vite dev server on :5173) can
# call this API from the browser. Existing routes are unchanged.
# ---------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(analysis.router)


@app.get("/")
def root():
    return {
        "message": "Medical Interaction API is running",
        "docs": "/docs"
    }

def custom_openapi():

    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    # Use OpenAPI 3.0 format so Swagger UI renders
    # UploadFile correctly as a file picker.
    openapi_schema["openapi"] = "3.0.3"

    schema = openapi_schema["components"]["schemas"].get(
        "Body_analyze_images_analysis_analyze_images_post"
    )

    if schema:
        files_schema = schema["properties"].get("files")

        if files_schema:
            files_schema["type"] = "array"
            files_schema["items"] = {
                "type": "string",
                "format": "binary"
            }

    app.openapi_schema = openapi_schema

    return app.openapi_schema


app.openapi = custom_openapi