"""
Basic tests for Thorpie backend.
Run with: python -m pytest tests/ -v
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

from backend.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "reight grand"


def test_ask_empty_question():
    response = client.post("/ask", json={"question": ""})
    assert response.status_code == 400


def test_ask_whitespace_question():
    response = client.post("/ask", json={"question": "   "})
    assert response.status_code == 400


@patch("backend.main.ask_thorpie", return_value="By 'eck, that's a mardy question.")
def test_ask_valid_question(mock_ask):
    response = client.post("/ask", json={"question": "What is the capital of France?"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert len(data["answer"]) > 0
