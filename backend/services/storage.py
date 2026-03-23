import json
import os
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
RESULTS_FILE = os.path.join(DATA_DIR, "results.json")

os.makedirs(DATA_DIR, exist_ok=True)

class LocalStore:
    def __init__(self):
        if not os.path.exists(RESULTS_FILE):
            with open(RESULTS_FILE, "w", encoding="utf-8") as f:
                json.dump([], f)

    def save_result(self, result_data):
        results = self.get_all_results()
        
        # Add timestamp and ID
        result_data["id"] = len(results) + 1
        result_data["created_at"] = datetime.utcnow().isoformat()
        
        results.append(result_data)
        
        with open(RESULTS_FILE, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)
            
        return result_data

    def get_all_results(self):
        try:
            if not os.path.exists(RESULTS_FILE):
                return []
            with open(RESULTS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def get_result_by_id(self, result_id):
        results = self.get_all_results()
        for r in results:
            if str(r.get("id")) == str(result_id):
                return r
        return None

storage = LocalStore()
