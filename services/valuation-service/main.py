from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import logging
from datetime import datetime
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app instance
app = FastAPI(
    title="EmlakOS Türkiye - Valuation Service",
    description="AI destekli gayrimenkul değerleme servisi",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class PropertyFeatures(BaseModel):
    sq_meters: float = Field(..., description="Metrekare", gt=0)
    room_count: int = Field(..., description="Oda sayısı", ge=1)
    building_age: int = Field(..., description="Bina yaşı", ge=0)
    floor: Optional[int] = Field(None, description="Kat numarası")
    total_floors: Optional[int] = Field(None, description="Toplam kat sayısı")
    heating_type: Optional[str] = Field(None, description="Isıtma tipi")
    has_parking: bool = Field(False, description="Otopark var mı?")
    has_balcony: bool = Field(False, description="Balkon var mı?")
    is_furnished: bool = Field(False, description="Eşyalı mı?")

class LocationInfo(BaseModel):
    city: str = Field(..., description="Şehir")
    district: str = Field(..., description="İlçe")
    latitude: Optional[float] = Field(None, description="Enlem")
    longitude: Optional[float] = Field(None, description="Boylam")

class ValuationRequest(BaseModel):
    property_type: str = Field(..., description="Mülk tipi (daire, villa, dükkan)")
    features: PropertyFeatures
    location: LocationInfo
    current_market_price: Optional[float] = Field(None, description="Mevcut piyasa fiyatı")

class ValuationResponse(BaseModel):
    estimated_price: float = Field(..., description="Tahmini fiyat (TL)")
    confidence_score: float = Field(..., description="Güven skoru (0-1)")
    price_range: dict = Field(..., description="Fiyat aralığı")
    factors: dict = Field(..., description="Değerleme faktörleri")
    timestamp: datetime = Field(..., description="Değerleme zamanı")
    model_version: str = Field(..., description="Model versiyonu")

# Mock AI model - gerçek uygulamada scikit-learn modeli kullanılacak
class ValuationModel:
    def __init__(self):
        self.version = "1.0.0"
        self.city_multipliers = {
            "istanbul": 1.5,
            "ankara": 1.2,
            "izmir": 1.3,
            "antalya": 1.4,
            "bursa": 1.1
        }
        
        self.property_type_multipliers = {
            "daire": 1.0,
            "villa": 1.8,
            "dükkan": 1.3,
            "ofis": 1.2,
            "arsa": 0.7
        }
    
    def predict(self, features: PropertyFeatures, location: LocationInfo) -> dict:
        """Basit değerleme algoritması - gerçek uygulamada ML modeli kullanılacak"""
        
        # Base price per square meter (TL)
        base_price_per_sqm = 15000
        
        # Location multiplier
        city = location.city.lower()
        location_multiplier = self.city_multipliers.get(city, 1.0)
        
        # Property type multiplier
        prop_type = features.property_type.lower()
        type_multiplier = self.property_type_multipliers.get(prop_type, 1.0)
        
        # Age factor (newer = more expensive)
        age_factor = max(0.7, 1.0 - (features.building_age * 0.01))
        
        # Room count factor
        room_factor = 1.0 + (features.room_count - 1) * 0.1
        
        # Amenities factor
        amenities_factor = 1.0
        if features.has_parking:
            amenities_factor += 0.1
        if features.has_balcony:
            amenities_factor += 0.05
        if features.is_furnished:
            amenities_factor += 0.15
        
        # Floor factor (middle floors are preferred)
        floor_factor = 1.0
        if features.floor and features.total_floors:
            if features.floor == 1:  # Ground floor
                floor_factor = 0.9
            elif features.floor == features.total_floors:  # Top floor
                floor_factor = 0.95
            else:  # Middle floors
                floor_factor = 1.0
        
        # Calculate estimated price
        estimated_price = (
            base_price_per_sqm *
            features.sq_meters *
            location_multiplier *
            type_multiplier *
            age_factor *
            room_factor *
            amenities_factor *
            floor_factor
        )
        
        # Confidence score based on data quality
        confidence_score = 0.85  # Base confidence
        
        if features.latitude and features.longitude:
            confidence_score += 0.05
        
        if features.heating_type:
            confidence_score += 0.05
        
        confidence_score = min(confidence_score, 0.95)
        
        # Price range (±15%)
        price_range = {
            "min": estimated_price * 0.85,
            "max": estimated_price * 1.15
        }
        
        # Factors breakdown
        factors = {
            "base_price_per_sqm": base_price_per_sqm,
            "location_multiplier": location_multiplier,
            "type_multiplier": type_multiplier,
            "age_factor": age_factor,
            "room_factor": room_factor,
            "amenities_factor": amenities_factor,
            "floor_factor": floor_factor
        }
        
        return {
            "estimated_price": round(estimated_price, 2),
            "confidence_score": round(confidence_score, 3),
            "price_range": {
                "min": round(price_range["min"], 2),
                "max": round(price_range["max"], 2)
            },
            "factors": factors
        }

# Initialize model
valuation_model = ValuationModel()

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "service": "EmlakOS Türkiye Valuation Service",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

# Main valuation endpoint
@app.post("/api/valuation/estimate", response_model=ValuationResponse)
async def estimate_property_value(request: ValuationRequest):
    """
    Gayrimenkul değerleme tahmini yapar.
    
    Bu endpoint, verilen mülk özelliklerine göre AI destekli değerleme yapar.
    """
    try:
        logger.info(f"Valuation request received for {request.property_type} in {request.location.city}")
        
        # Get prediction from model
        prediction = valuation_model.predict(request.features, request.location)
        
        # Create response
        response = ValuationResponse(
            estimated_price=prediction["estimated_price"],
            confidence_score=prediction["confidence_score"],
            price_range=prediction["price_range"],
            factors=prediction["factors"],
            timestamp=datetime.now(),
            model_version=valuation_model.version
        )
        
        logger.info(f"Valuation completed: {prediction['estimated_price']} TL")
        
        return response
        
    except Exception as e:
        logger.error(f"Valuation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Değerleme sırasında hata oluştu: {str(e)}"
        )

# Get valuation factors explanation
@app.get("/api/valuation/factors")
async def get_valuation_factors():
    """Değerleme faktörlerinin açıklamasını döner"""
    return {
        "factors": {
            "location": "Şehir ve ilçe bazında piyasa değeri",
            "property_type": "Mülk tipine göre değer faktörü",
            "size": "Metrekare bazında temel fiyat",
            "age": "Bina yaşı (yeni binalar daha değerli)",
            "rooms": "Oda sayısı ve düzeni",
            "amenities": "Otopark, balkon, eşya gibi özellikler",
            "floor": "Kat konumu ve toplam kat sayısı"
        },
        "model_info": {
            "version": valuation_model.version,
            "description": "Makine öğrenmesi tabanlı değerleme modeli",
            "last_updated": "2024-01-15"
        }
    }

# Get supported cities
@app.get("/api/valuation/cities")
async def get_supported_cities():
    """Desteklenen şehirleri döner"""
    return {
        "cities": list(valuation_model.city_multipliers.keys()),
        "total": len(valuation_model.city_multipliers)
    }

# Get property types
@app.get("/api/valuation/property-types")
async def get_property_types():
    """Desteklenen mülk tiplerini döner"""
    return {
        "property_types": list(valuation_model.property_type_multipliers.keys()),
        "total": len(valuation_model.property_type_multipliers)
    }

# Batch valuation endpoint
@app.post("/api/valuation/batch")
async def batch_valuation(requests: List[ValuationRequest]):
    """
    Birden fazla mülk için toplu değerleme yapar.
    """
    try:
        results = []
        
        for i, request in enumerate(requests):
            try:
                prediction = valuation_model.predict(request.features, request.location)
                
                result = {
                    "index": i,
                    "success": True,
                    "estimated_price": prediction["estimated_price"],
                    "confidence_score": prediction["confidence_score"],
                    "price_range": prediction["price_range"]
                }
                
            except Exception as e:
                result = {
                    "index": i,
                    "success": False,
                    "error": str(e)
                }
            
            results.append(result)
        
        return {
            "message": f"{len(requests)} mülk için değerleme tamamlandı",
            "results": results,
            "total_processed": len(requests),
            "successful": len([r for r in results if r["success"]]),
            "failed": len([r for r in results if not r["success"]])
        }
        
    except Exception as e:
        logger.error(f"Batch valuation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Toplu değerleme sırasında hata oluştu: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8083))
    
    logger.info(f"🚀 EmlakOS Türkiye Valuation Service başlatılıyor... Port: {port}")
    logger.info(f"📚 API Dokümantasyonu: http://localhost:{port}/docs")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
