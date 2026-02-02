from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime


# class ExtractedData(BaseModel):
    # pageTitle:str
    # sourceUrl:str

    # extractedData:Dict[str, Any]
    # extractorVersion: str = "v1"

    # textData: Optional[List[str]] = []
    # tableData: Optional[List[Dict[str, Any]]] = []
    # graphData: Optional[Dict[str, Any]] = {}

    # metadata: Optional[Dict[str, Any]] = {}
    # rawData: Optional[Dict[str, Any]] = {}

# changes made here
class ExtractionType(str, Enum):
    FULL_PAGE = "full_page"
    SELECTED_TEXT = "selected_text"
    STRUCTURED = "structured"

class Metadata(BaseModel):
    headings: List[Dict[str, str]] = []
    links: List[Dict[str, str]] = []
    images: List[Dict[str, str]] = []

class StructuredData(BaseModel):
    tables: List[List[List[str]]] = []
    lists: List[List[str]] = []

class ExtractedData(BaseModel):
    url: str
    title: str
    extraction_type: ExtractionType = ExtractionType.FULL_PAGE
    full_text: Optional[str] = None
    selected_text: Optional[str] = None
    metadata: Optional[Metadata] = None
    structured_data: Optional[StructuredData] = None
    raw_html: Optional[str] = None
    tags: List[str] = []
    domain: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)

class ExtractionResponse(BaseModel):
    id: str
    url: str
    title: str
    extraction_type: str
    timestamp: datetime
    tags: List[str]

# Helper function to prepare response
def extraction_helper(extraction) -> dict:
    return {
        "id": str(extraction["_id"]),
        "url": extraction["url"],
        "title": extraction["title"],
        "extraction_type": extraction["extraction_type"],
        "timestamp": extraction["timestamp"],
        "tags": extraction.get("tags", [])
    }
