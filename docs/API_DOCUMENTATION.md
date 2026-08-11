# KrishiSetu-FarmX – API Documentation

## Base URL
`http://localhost:5000/api`

---

## Endpoints

### 1. GET `/farm`
Retrieves current state of user profile, 9 farm plots, and crop definitions.

**Response:**
```json
{
  "success": true,
  "user": {
    "coins": 500,
    "level": 1,
    "experience": 0,
    "waterLevel": 100,
    "totalHarvests": 0,
    "totalEarnings": 0
  },
  "plots": [
    {
      "plotIndex": 0,
      "state": "empty",
      "cropType": null,
      "progress": 0,
      "secondsRemaining": 0
    }
  ]
}
```

### 2. POST `/plant`
Plants a crop on a specific farm plot.

**Request Body:**
```json
{
  "plotIndex": 0,
  "cropType": "wheat"
}
```

### 3. POST `/harvest`
Harvests a ready crop, awards coins & XP.

**Request Body:**
```json
{
  "plotIndex": 0
}
```

### 4. POST `/water`
Refills user water level to 100%.

### 5. GET `/stats`
Returns total earnings, harvest logs, and 7-day aggregation.

### 6. GET `/advisor`
Returns AI advisor recommendations and crop tips.
