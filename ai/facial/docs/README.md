# Facial Pain Signal Module (PAIC-based)

This module implements real-time facial pain recognition using
clinically validated, rule-based facial indicators instead of
black-box machine learning models.

## Clinical Basis
- PAIC (Pain Assessment in Impaired Cognition)
- Abbey Pain Scale
- Facial Action Coding System (FACS-inspired geometry)

## Why Rule-Based?
- Clinically interpretable
- Subject-relative (baseline calibrated)
- Robust in real-world conditions
- No dataset bias
- Instant inference (CPU-only)

## Output
The module produces a **Facial Pain Signal (0–10)** based on:
- Eye tightening
- Brow lowering
- Mouth opening
- Grimacing
- Facial asymmetry
- Temporal persistence

This signal is designed for **multimodal fusion** with
physiological pain indicators.

## Disclaimer
This system is a *support tool* and not a medical diagnosis device.
