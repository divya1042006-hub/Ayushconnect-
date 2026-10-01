"""
Semantic Skill Matching Module for AyushConnect Backend
Uses sentence-transformers ('all-MiniLM-L6-v2') to compute cosine similarity
and weighted match scores between candidate skill profiles and role requirements.
"""

import os
import sys
from typing import List, Dict, Any, Optional, Union

# Ensure bundled site-packages are on sys.path
SITE_PACKAGES = os.path.abspath(os.path.join(os.path.dirname(__file__), "site-packages"))
if os.path.exists(SITE_PACKAGES) and SITE_PACKAGES not in sys.path:
    sys.path.insert(0, SITE_PACKAGES)

import numpy as np
from sentence_transformers import SentenceTransformer


class SemanticSkillMatcher:
    """
    Semantic skill matching engine powered by all-MiniLM-L6-v2.
    Encodes student and job requirement skills into dense semantic vector representations,
    computes pairwise cosine similarity, and calculates a weighted match percentage.
    """

    def __init__(self, model_name: str = "all-MiniLM-L6-v2", device: Optional[str] = None):
        self.model_name = model_name
        self.device = device
        self._model = None

    @property
    def model(self) -> SentenceTransformer:
        """Lazy-loads the SentenceTransformer model on first usage."""
        if self._model is None:
            self._model = SentenceTransformer(self.model_name, device=self.device)
        return self._model

    def encode(self, texts: List[str]) -> np.ndarray:
        """
        Encodes a list of skill strings into normalized embedding vectors.
        """
        if not texts:
            return np.empty((0, 384), dtype=np.float32)
        return self.model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)

    def calculate_match_score(
        self,
        student_skills: List[str],
        required_skills: Union[List[str], List[Dict[str, Any]]],
        weights: Optional[List[float]] = None,
        similarity_threshold: float = 0.5,
    ) -> Dict[str, Any]:
        """
        Calculates semantic match score between student skills and required skills.

        Args:
            student_skills: List of skills possessed by the candidate/student.
            required_skills: List of required skill strings or dicts with {'skill': str, 'weight': float}.
            weights: Optional explicit weights for each required skill.
            similarity_threshold: Cosine similarity cutoff to consider a skill matched (default: 0.5).

        Returns:
            Dictionary containing match_percentage, match_score, fit_level,
            matched_skills, missing_skills, and detailed per-skill breakdown.
        """
        req_names = []
        parsed_weights = []

        for idx, item in enumerate(required_skills):
            if isinstance(item, dict):
                skill_name = item.get("skill") or item.get("name") or str(item)
                w = float(item.get("weight", 1.0))
            else:
                skill_name = str(item)
                w = float(weights[idx]) if (weights is not None and idx < len(weights)) else 1.0

            clean_name = skill_name.strip()
            if clean_name:
                req_names.append(clean_name)
                parsed_weights.append(max(0.0, w))

        # Edge case: No required skills
        if not req_names:
            return {
                "match_percentage": 100.0 if student_skills else 0.0,
                "match_score": 1.0 if student_skills else 0.0,
                "fit_level": "High Fit" if student_skills else "Developing",
                "matched_skills": [],
                "missing_skills": [],
                "breakdown": [],
                "student_skill_count": len(student_skills) if student_skills else 0,
                "required_skill_count": 0,
            }

        # Filter empty strings from student skills
        clean_student_skills = [s.strip() for s in (student_skills or []) if s and str(s).strip()]

        # Edge case: Student has no skills
        if not clean_student_skills:
            breakdown = [
                {
                    "required_skill": req,
                    "weight": round(weight, 2),
                    "best_matching_skill": None,
                    "similarity_score": 0.0,
                    "is_matched": False,
                    "status": "gap",
                }
                for req, weight in zip(req_names, parsed_weights)
            ]
            return {
                "match_percentage": 0.0,
                "match_score": 0.0,
                "fit_level": "Developing",
                "matched_skills": [],
                "missing_skills": req_names,
                "breakdown": breakdown,
                "student_skill_count": 0,
                "required_skill_count": len(req_names),
            }

        # Encode both skill lists with all-MiniLM-L6-v2
        student_embeddings = self.encode(clean_student_skills)
        required_embeddings = self.encode(req_names)

        # Compute cosine similarity matrix: (M required x N student)
        # Normalized vectors: dot product == cosine similarity
        sim_matrix = np.dot(required_embeddings, student_embeddings.T)

        breakdown = []
        matched_skills = []
        missing_skills = []
        weighted_score_sum = 0.0
        total_weight = sum(parsed_weights) if sum(parsed_weights) > 0 else float(len(req_names))

        for i, req_skill in enumerate(req_names):
            w = parsed_weights[i]
            row_sims = sim_matrix[i]
            best_idx = int(np.argmax(row_sims))
            best_sim = float(np.clip(row_sims[best_idx], 0.0, 1.0))
            best_matching_student_skill = clean_student_skills[best_idx]

            is_matched = bool(best_sim >= similarity_threshold)
            if is_matched:
                matched_skills.append(req_skill)
            else:
                missing_skills.append(req_skill)

            status = "high_fit" if best_sim >= 0.75 else ("moderate_fit" if is_matched else "gap")

            breakdown.append({
                "required_skill": req_skill,
                "weight": round(w, 2),
                "best_matching_skill": best_matching_student_skill,
                "similarity_score": round(best_sim, 4),
                "is_matched": is_matched,
                "status": status,
            })

            weighted_score_sum += best_sim * w

        raw_match_score = weighted_score_sum / total_weight
        match_percentage = round(float(np.clip(raw_match_score * 100.0, 0.0, 100.0)), 2)

        if match_percentage >= 75.0:
            fit_level = "High Fit"
        elif match_percentage >= 50.0:
            fit_level = "Medium Fit"
        else:
            fit_level = "Developing"

        return {
            "match_percentage": match_percentage,
            "match_score": round(float(raw_match_score), 4),
            "fit_level": fit_level,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "breakdown": breakdown,
            "student_skill_count": len(clean_student_skills),
            "required_skill_count": len(req_names),
        }


# Global singleton instance for easy import and reuse
skill_matcher = SemanticSkillMatcher()


if __name__ == "__main__":
    import json
    import sys

    # Allow CLI execution via JSON argument or stdin
    payload_raw = None
    if len(sys.argv) > 1:
        payload_raw = sys.argv[1]
    elif not sys.stdin.isatty():
        payload_raw = sys.stdin.read()

    if payload_raw:
        try:
            data = json.loads(payload_raw)
            student_skills = data.get("student_skills") or data.get("studentSkills") or []
            required_skills = data.get("required_skills") or data.get("requiredSkills") or data.get("listing_skills") or []
            weights = data.get("weights")
            threshold = float(data.get("similarity_threshold") or data.get("similarityThreshold") or 0.5)

            matcher = SemanticSkillMatcher()
            result = matcher.calculate_match_score(
                student_skills=student_skills,
                required_skills=required_skills,
                weights=weights,
                similarity_threshold=threshold,
            )
            print(json.dumps(result, indent=2))
        except Exception as e:
            print(json.dumps({"error": str(e)}), file=sys.stderr)
            sys.exit(1)
    else:
        # Self-test demonstration
        print("SemanticSkillMatcher initialized. Run with JSON input or invoke via tests.")

