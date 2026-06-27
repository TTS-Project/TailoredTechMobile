#!/usr/bin/env python3
"""
Backend API Tests for AI Readiness Diagnostic Intake Endpoint
Tests the POST /api/intake and GET /api/intake/count endpoints
"""

import requests
import json
from datetime import datetime

# Get backend URL from frontend .env
BACKEND_URL = "https://custom-ai-build-7.preview.emergentagent.com"
INTAKE_ENDPOINT = f"{BACKEND_URL}/api/intake"
COUNT_ENDPOINT = f"{BACKEND_URL}/api/intake/count"
STATUS_ENDPOINT = f"{BACKEND_URL}/api/status"
ROOT_ENDPOINT = f"{BACKEND_URL}/api/"

print("=" * 80)
print("AI READINESS DIAGNOSTIC INTAKE ENDPOINT TESTS")
print("=" * 80)
print(f"Backend URL: {BACKEND_URL}")
print(f"Testing endpoints: {INTAKE_ENDPOINT}, {COUNT_ENDPOINT}")
print("=" * 80)

# Track test results
test_results = []
initial_count = None

def log_test(test_name, passed, details=""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status} - {test_name}")
    if details:
        print(f"   {details}")
    test_results.append({"test": test_name, "passed": passed, "details": details})

def create_valid_payload(name="John Smith", email="john.smith@example.com", company="Acme Corp"):
    """Create a valid intake submission payload"""
    return {
        "contact": {
            "name": name,
            "email": email,
            "company": company
        },
        "answers": {
            "q1": "We provide consulting services for small businesses",
            "q2": "5-10 employees",
            "q3": ["Administrative tasks", "Customer follow-ups"],
            "q4": "Scaling operations without losing quality",
            "q5": 7,
            "q6": "Referrals and word of mouth",
            "q7": "They go into a spreadsheet for manual follow-up",
            "q8": "Excel spreadsheets and email",
            "q9": "Weekly - it's a real problem",
            "q10": "Client communication and project tracking would break down",
            "q11": "Basic - comfortable with standard tools",
            "q12": "After initial contact, before proposal stage",
            "q13": 6,
            "q14": "Some recurring, mostly project-based",
            "q15": "Inconsistently - when we have time",
            "q16": "Time and not knowing what to create",
            "q17": ["ChatGPT for writing", "Basic automation tools"],
            "q18": "Cost and learning curve for the team",
            "q19": "Automating client follow-ups and lead nurturing",
            "q20": "Double revenue with same team size through better systems",
            "q21": "Getting consistent with marketing and lead follow-up"
        },
        "meta": {
            "total": 21,
            "answered": 21,
            "userAgent": "Mozilla/5.0 (Testing Agent)",
            "submittedAt": datetime.utcnow().isoformat() + "Z"
        }
    }

# ============================================================================
# TEST 0: Get initial count
# ============================================================================
print("\n" + "=" * 80)
print("TEST 0: Get initial intake count")
print("=" * 80)
try:
    response = requests.get(COUNT_ENDPOINT, timeout=10)
    if response.status_code == 200:
        data = response.json()
        initial_count = data.get("count", 0)
        log_test("Get initial count", True, f"Initial count: {initial_count}")
    else:
        log_test("Get initial count", False, f"Status: {response.status_code}, Body: {response.text}")
        initial_count = 0
except Exception as e:
    log_test("Get initial count", False, f"Exception: {str(e)}")
    initial_count = 0

# ============================================================================
# TEST 1: POST complete valid payload
# ============================================================================
print("\n" + "=" * 80)
print("TEST 1: POST complete valid payload with all 21 answers")
print("=" * 80)
try:
    payload = create_valid_payload()
    print(f"Payload: {json.dumps(payload, indent=2)[:500]}...")
    
    response = requests.post(INTAKE_ENDPOINT, json=payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        # Check response structure
        has_ok = data.get("ok") == True
        has_id = "id" in data and len(data["id"]) > 0
        has_stored = data.get("stored") == True
        has_emailed = "emailed" in data  # Can be true or false
        
        if has_ok and has_id and has_stored and has_emailed:
            log_test("POST valid payload - Response structure", True, 
                    f"ok={data['ok']}, id={data['id'][:8]}..., stored={data['stored']}, emailed={data['emailed']}")
            
            # Verify emailed is false (SMTP not configured)
            if data["emailed"] == False:
                log_test("POST valid payload - Email status", True, "emailed=false as expected (SMTP not configured)")
            else:
                log_test("POST valid payload - Email status", True, f"emailed={data['emailed']} (SMTP may be configured)")
        else:
            log_test("POST valid payload - Response structure", False, 
                    f"Missing fields: ok={has_ok}, id={has_id}, stored={has_stored}, emailed={has_emailed}")
    else:
        log_test("POST valid payload", False, f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("POST valid payload", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 2: POST with INVALID email
# ============================================================================
print("\n" + "=" * 80)
print("TEST 2: POST with INVALID email (expect 422)")
print("=" * 80)
try:
    payload = create_valid_payload(email="not-an-email")
    print(f"Invalid email: {payload['contact']['email']}")
    
    response = requests.post(INTAKE_ENDPOINT, json=payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 422:
        log_test("POST invalid email - Validation error", True, "Got 422 validation error as expected")
    else:
        log_test("POST invalid email - Validation error", False, 
                f"Expected 422, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("POST invalid email", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 3: POST with missing contact.name
# ============================================================================
print("\n" + "=" * 80)
print("TEST 3: POST with missing contact.name (expect 422)")
print("=" * 80)
try:
    payload = create_valid_payload()
    del payload["contact"]["name"]
    print(f"Contact without name: {payload['contact']}")
    
    response = requests.post(INTAKE_ENDPOINT, json=payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 422:
        log_test("POST missing name - Validation error", True, "Got 422 validation error as expected")
    else:
        log_test("POST missing name - Validation error", False, 
                f"Expected 422, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("POST missing name", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 4: POST with empty answers object
# ============================================================================
print("\n" + "=" * 80)
print("TEST 4: POST with empty answers object (should succeed)")
print("=" * 80)
try:
    payload = create_valid_payload()
    payload["answers"] = {}
    print(f"Payload with empty answers: {json.dumps(payload, indent=2)}")
    
    response = requests.post(INTAKE_ENDPOINT, json=payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") and data.get("stored"):
            log_test("POST empty answers - Success", True, "Empty answers accepted, stored=true")
        else:
            log_test("POST empty answers - Success", False, f"Unexpected response: {data}")
    else:
        log_test("POST empty answers", False, f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("POST empty answers", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 5: GET /api/intake/count - Verify count increased
# ============================================================================
print("\n" + "=" * 80)
print("TEST 5: GET /api/intake/count - Verify count increased")
print("=" * 80)
try:
    response = requests.get(COUNT_ENDPOINT, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        current_count = data.get("count", 0)
        
        # We successfully posted 2 submissions (test 1 and test 4)
        expected_min_count = initial_count + 2
        
        if current_count >= expected_min_count:
            log_test("GET count - Increased correctly", True, 
                    f"Count increased from {initial_count} to {current_count} (expected >= {expected_min_count})")
        else:
            log_test("GET count - Increased correctly", False, 
                    f"Count is {current_count}, expected >= {expected_min_count} (initial: {initial_count})")
    else:
        log_test("GET count", False, f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("GET count", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 6: Verify MongoDB persistence - POST and check count increases by 1
# ============================================================================
print("\n" + "=" * 80)
print("TEST 6: Verify MongoDB persistence - POST and check count increases by 1")
print("=" * 80)
try:
    # Get current count
    response = requests.get(COUNT_ENDPOINT, timeout=10)
    count_before = response.json().get("count", 0) if response.status_code == 200 else 0
    print(f"Count before POST: {count_before}")
    
    # POST a new submission
    payload = create_valid_payload(name="Jane Doe", email="jane.doe@example.com", company="Test Co")
    response = requests.post(INTAKE_ENDPOINT, json=payload, timeout=10)
    print(f"POST Status: {response.status_code}")
    
    if response.status_code == 200:
        # Get count after
        response = requests.get(COUNT_ENDPOINT, timeout=10)
        count_after = response.json().get("count", 0) if response.status_code == 200 else 0
        print(f"Count after POST: {count_after}")
        
        if count_after == count_before + 1:
            log_test("MongoDB persistence - Count increment", True, 
                    f"Count increased by exactly 1: {count_before} → {count_after}")
        else:
            log_test("MongoDB persistence - Count increment", False, 
                    f"Count did not increase by 1: {count_before} → {count_after}")
    else:
        log_test("MongoDB persistence", False, f"POST failed with status {response.status_code}")
except Exception as e:
    log_test("MongoDB persistence", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 7: CORS verification (check headers)
# ============================================================================
print("\n" + "=" * 80)
print("TEST 7: CORS verification - Check CORS headers")
print("=" * 80)
try:
    # Send OPTIONS request (preflight)
    headers = {
        "Origin": "https://custom-ai-build-7.preview.emergentagent.com",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type"
    }
    response = requests.options(INTAKE_ENDPOINT, headers=headers, timeout=10)
    print(f"OPTIONS Status Code: {response.status_code}")
    print(f"CORS Headers: {dict(response.headers)}")
    
    # Check for CORS headers
    has_allow_origin = "access-control-allow-origin" in response.headers
    has_allow_methods = "access-control-allow-methods" in response.headers
    
    if has_allow_origin:
        log_test("CORS - Allow Origin header", True, 
                f"access-control-allow-origin: {response.headers.get('access-control-allow-origin')}")
    else:
        log_test("CORS - Allow Origin header", False, "Missing access-control-allow-origin header")
    
    if has_allow_methods:
        log_test("CORS - Allow Methods header", True, 
                f"access-control-allow-methods: {response.headers.get('access-control-allow-methods')}")
    else:
        log_test("CORS - Allow Methods header", False, "Missing access-control-allow-methods header")
        
except Exception as e:
    log_test("CORS verification", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 8: Regression test - Existing endpoints still work
# ============================================================================
print("\n" + "=" * 80)
print("TEST 8: Regression test - Existing endpoints still work")
print("=" * 80)

# Test GET /api/
try:
    response = requests.get(ROOT_ENDPOINT, timeout=10)
    print(f"GET /api/ - Status: {response.status_code}, Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        if "message" in data:
            log_test("Regression - GET /api/", True, f"Response: {data}")
        else:
            log_test("Regression - GET /api/", False, f"Unexpected response: {data}")
    else:
        log_test("Regression - GET /api/", False, f"Status {response.status_code}: {response.text}")
except Exception as e:
    log_test("Regression - GET /api/", False, f"Exception: {str(e)}")

# Test GET /api/status
try:
    response = requests.get(STATUS_ENDPOINT, timeout=10)
    print(f"GET /api/status - Status: {response.status_code}, Response: {response.text[:200]}")
    
    if response.status_code == 200:
        log_test("Regression - GET /api/status", True, "Endpoint working")
    else:
        log_test("Regression - GET /api/status", False, f"Status {response.status_code}: {response.text}")
except Exception as e:
    log_test("Regression - GET /api/status", False, f"Exception: {str(e)}")

# Test POST /api/status
try:
    payload = {"client_name": "Test Client for Regression"}
    response = requests.post(STATUS_ENDPOINT, json=payload, timeout=10)
    print(f"POST /api/status - Status: {response.status_code}, Response: {response.text[:200]}")
    
    if response.status_code == 200:
        data = response.json()
        if "id" in data and "client_name" in data:
            log_test("Regression - POST /api/status", True, f"Created status check with id: {data['id'][:8]}...")
        else:
            log_test("Regression - POST /api/status", False, f"Unexpected response: {data}")
    else:
        log_test("Regression - POST /api/status", False, f"Status {response.status_code}: {response.text}")
except Exception as e:
    log_test("Regression - POST /api/status", False, f"Exception: {str(e)}")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("TEST SUMMARY")
print("=" * 80)

passed_tests = [t for t in test_results if t["passed"]]
failed_tests = [t for t in test_results if not t["passed"]]

print(f"\nTotal Tests: {len(test_results)}")
print(f"Passed: {len(passed_tests)} ✅")
print(f"Failed: {len(failed_tests)} ❌")

if failed_tests:
    print("\n❌ FAILED TESTS:")
    for test in failed_tests:
        print(f"  - {test['test']}")
        if test['details']:
            print(f"    {test['details']}")

if passed_tests:
    print("\n✅ PASSED TESTS:")
    for test in passed_tests:
        print(f"  - {test['test']}")

print("\n" + "=" * 80)
if len(failed_tests) == 0:
    print("🎉 ALL TESTS PASSED!")
else:
    print(f"⚠️  {len(failed_tests)} TEST(S) FAILED")
print("=" * 80)
