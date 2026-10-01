import sys
import os
import json
import pytest

# Ensure bundled site-packages and server directory are discoverable
server_dir = os.path.abspath(os.path.dirname(__file__))
site_packages = os.path.join(server_dir, "site-packages")
if os.path.exists(site_packages) and site_packages not in sys.path:
    sys.path.insert(0, site_packages)
if server_dir not in sys.path:
    sys.path.insert(0, server_dir)

from skill_matcher import SemanticSkillMatcher, skill_matcher
from skill_matcher_api import app


@pytest.fixture(scope="session")
def matcher():
    """Shared SemanticSkillMatcher instance."""
    return SemanticSkillMatcher(model_name="all-MiniLM-L6-v2")


@pytest.fixture
def client():
    """Flask test client fixture."""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


class TestSemanticSkillMatcher:
    def test_model_initialization_and_encoding(self, matcher):
        """Test that the model initializes and encodes skill strings into 384-dim normalized vectors."""
        skills = ["Panchakarma Therapy", "Nadi Pariksha", "Ayurvedic Pharmacology"]
        embeddings = matcher.encode(skills)
        
        assert embeddings.shape[0] == 3
        assert embeddings.shape[1] == 384  # all-MiniLM-L6-v2 produces 384-dimensional embeddings

    def test_exact_skill_matches(self, matcher):
        """Identical skills should produce a match percentage close to 100%."""
        student_skills = ["Panchakarma Procedures", "Nadi Pariksha", "Dravyaguna Standardization"]
        required_skills = ["Panchakarma Procedures", "Nadi Pariksha", "Dravyaguna Standardization"]

        result = matcher.calculate_match_score(student_skills, required_skills)

        assert result["match_percentage"] >= 99.0
        assert result["fit_level"] == "High Fit"
        assert len(result["matched_skills"]) == 3
        assert len(result["missing_skills"]) == 0
        assert len(result["breakdown"]) == 3

    def test_semantic_synonym_matching(self, matcher):
        """
        Verify that AYUSH domain synonyms and semantically equivalent phrases
        (e.g., 'Pulse Diagnosis' vs 'Nadi Pariksha', 'Herbal Medicine Formulation' vs 'Ayurvedic Drug Standardization')
        are recognized with high cosine similarity.
        """
        student_skills = [
            "Ayurvedic Pulse Diagnosis (Nadi Pariksha)",
            "Panchakarma Detoxification & Cleansing",
            "Herbal Medicine Formulation & Quality Testing"
        ]
        required_skills = [
            "Nadi Pariksha",
            "Panchakarma Procedures",
            "Herbal Drug Standardization"
        ]

        result = matcher.calculate_match_score(student_skills, required_skills)

        assert result["match_percentage"] >= 75.0
        assert result["fit_level"] == "High Fit"
        assert len(result["matched_skills"]) == 3
        for item in result["breakdown"]:
            assert item["similarity_score"] > 0.65
            assert item["is_matched"] is True

    def test_dissimilar_skill_rejection(self, matcher):
        """Candidate with unrelated tech skills should score very low against clinical AYUSH requirements."""
        student_skills = ["React.js", "Docker Containers", "Kubernetes Clustering", "SQL Databases"]
        required_skills = [
            "Ksharsutra Anorectal Surgery",
            "Ayurvedic Pulse Diagnosis (Nadi Pariksha)",
            "Panchakarma Vamana & Virechana"
        ]

        result = matcher.calculate_match_score(student_skills, required_skills, similarity_threshold=0.5)

        assert result["match_percentage"] < 35.0
        assert result["fit_level"] == "Developing"
        assert len(result["missing_skills"]) >= 2

    def test_weighted_skill_scoring(self, matcher):
        """
        Test that high-weighted core skills carry proportionally more impact
        than low-weighted secondary skills.
        """
        student_skills = ["Nadi Pariksha", "Patient History Taking"]
        required_skills = [
            {"skill": "Nadi Pariksha", "weight": 3.0},
            {"skill": "Rasa Shastra Formulation", "weight": 3.0},
            {"skill": "Basic Vitals Recording", "weight": 1.0}
        ]

        result = matcher.calculate_match_score(student_skills, required_skills)

        assert "match_percentage" in result
        assert 30.0 <= result["match_percentage"] <= 75.0
        assert result["breakdown"][0]["weight"] == 3.0
        assert result["breakdown"][1]["weight"] == 3.0
        assert result["breakdown"][2]["weight"] == 1.0

    def test_empty_student_skills(self, matcher):
        """Empty student skill list should return 0% match and categorize all required skills as missing."""
        required_skills = ["Nadi Pariksha", "Abhyanga Massage"]
        result = matcher.calculate_match_score([], required_skills)

        assert result["match_percentage"] == 0.0
        assert result["fit_level"] == "Developing"
        assert result["matched_skills"] == []
        assert result["missing_skills"] == ["Nadi Pariksha", "Abhyanga Massage"]
        assert result["student_skill_count"] == 0

    def test_empty_required_skills(self, matcher):
        """Empty listing requirements should handle gracefully without crashing."""
        student_skills = ["Nadi Pariksha", "Abhyanga Massage"]
        result = matcher.calculate_match_score(student_skills, [])

        assert result["match_percentage"] == 100.0
        assert result["required_skill_count"] == 0
        assert result["breakdown"] == []


class TestMatchScoreEndpoint:
    def test_endpoint_health(self, client):
        """Test GET /health on Flask service."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.get_json()
        assert data["status"] == "ok"
        assert "all-MiniLM-L6-v2" in data["model"]

    def test_endpoint_match_score_success(self, client):
        """Test POST /match-score with valid student and required skill lists."""
        payload = {
            "student_skills": [
                "Ayurvedic Pulse Diagnosis (Nadi Pariksha)",
                "Panchakarma Setup & Sterilization",
                "Abhyanga & Swedana Procedures"
            ],
            "required_skills": [
                {"skill": "Nadi Pariksha", "weight": 2.0},
                {"skill": "Panchakarma Administration", "weight": 1.5},
                {"skill": "Tele-Consultation in Ayurveda", "weight": 1.0}
            ],
            "similarity_threshold": 0.5
        }

        response = client.post(
            "/match-score",
            data=json.dumps(payload),
            content_type="application/json"
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["success"] is True
        assert "match_percentage" in data
        assert "fit_level" in data
        assert "breakdown" in data
        assert isinstance(data["breakdown"], list)
        assert len(data["breakdown"]) == 3
        assert data["match_percentage"] > 50.0

    def test_endpoint_camel_case_compatibility(self, client):
        """Test POST /match-score with frontend camelCase parameters."""
        payload = {
            "studentSkills": ["Herbal Medicine Standardization", "GMP Documentation"],
            "requiredSkills": ["WHO-GMP Compliance", "Herbal Quality Control"],
            "similarityThreshold": 0.55
        }

        response = client.post(
            "/match-score",
            data=json.dumps(payload),
            content_type="application/json"
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data["success"] is True
        assert data["match_percentage"] >= 60.0

    def test_endpoint_invalid_payload(self, client):
        """Test POST /match-score with invalid types."""
        payload = {
            "student_skills": "Not a list",
            "required_skills": ["Nadi Pariksha"]
        }

        response = client.post(
            "/match-score",
            data=json.dumps(payload),
            content_type="application/json"
        )

        assert response.status_code == 400
        data = response.get_json()
        assert data["success"] is False
