"""
Flask API Service for Semantic Skill Matching in AyushConnect
Exposes POST /match-score and GET /health
"""

import os
import sys

# Add bundled site-packages and server directory to path
server_dir = os.path.dirname(os.path.abspath(__file__))
SITE_PACKAGES = os.path.abspath(os.path.join(server_dir, "site-packages"))
if os.path.exists(SITE_PACKAGES) and SITE_PACKAGES not in sys.path:
    sys.path.insert(0, SITE_PACKAGES)
if server_dir not in sys.path:
    sys.path.insert(0, server_dir)

from flask import Flask, request, jsonify
from flask_cors import CORS
from skill_matcher import skill_matcher

app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok",
        "service": "AyushConnect Semantic Skill Matching Service",
        "model": skill_matcher.model_name
    })


@app.route("/match-score", methods=["POST", "OPTIONS"])
@app.route("/api/match-score", methods=["POST", "OPTIONS"])
def match_score_endpoint():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json(force=True, silent=True) or {}
    except Exception as e:
        return jsonify({"success": False, "error": f"Invalid JSON payload: {str(e)}"}), 400

    # Support both snake_case and camelCase parameters
    student_skills = data.get("student_skills") or data.get("studentSkills") or []
    required_skills = data.get("required_skills") or data.get("requiredSkills") or data.get("listing_skills") or []
    weights = data.get("weights")
    similarity_threshold = float(data.get("similarity_threshold") or data.get("similarityThreshold") or 0.5)

    if not isinstance(student_skills, list):
        return jsonify({"success": False, "error": "student_skills must be a list of strings"}), 400
    if not isinstance(required_skills, list):
        return jsonify({"success": False, "error": "required_skills must be a list"}), 400

    try:
        result = skill_matcher.calculate_match_score(
            student_skills=student_skills,
            required_skills=required_skills,
            weights=weights,
            similarity_threshold=similarity_threshold,
        )
        return jsonify({
            "success": True,
            **result
        }), 200
    except Exception as err:
        return jsonify({
            "success": False,
            "error": f"Failed to compute match score: {str(err)}"
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PYTHON_PORT", 5001))
    print(f"[Semantic Skill Matcher] Starting service on port {port} with model {skill_matcher.model_name}...")
    app.run(host="0.0.0.0", port=port, debug=False)
