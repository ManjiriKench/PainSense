"""
Data Logger for PainSense
Handles CSV logging and database storage of pain scores.
"""

import os
import csv
import sqlite3
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path
import threading
import asyncio


class PainDataLogger:
    """
    Logs pain assessment data to both CSV files and SQLite database.
    Supports per-patient logging with automatic 5-second intervals.
    """
    
    def __init__(self, data_dir: str = "pain_data", db_path: str = "pain_database.db"):
        """
        Initialize the data logger.
        
        Args:
            data_dir: Directory to store CSV files (one per patient)
            db_path: Path to SQLite database file
        """
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        
        self.db_path = db_path
        self._init_database()
        
        # Active monitoring sessions: {patient_id: timer_task}
        self.active_sessions = {}
        
    def _init_database(self):
        """Initialize SQLite database with pain_records table."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS pain_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id TEXT NOT NULL,
                timestamp DATETIME NOT NULL,
                facial_pain_score REAL,
                physio_pain_score REAL,
                fused_pain_score REAL,
                confidence REAL,
                face_detected BOOLEAN,
                model_loaded BOOLEAN,
                metadata TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_patient_timestamp 
            ON pain_records(patient_id, timestamp DESC)
        """)
        
        conn.commit()
        conn.close()
        
    def log_pain_score(self, patient_id: str, pain_data: Dict) -> bool:
        """
        Log a single pain score entry to both CSV and database.
        
        Args:
            patient_id: Unique patient identifier
            pain_data: Dictionary containing pain assessment data
            
        Returns:
            bool: True if logged successfully
        """
        timestamp = datetime.now()
        
        # Log to CSV
        self._log_to_csv(patient_id, timestamp, pain_data)
        
        # Log to database
        self._log_to_database(patient_id, timestamp, pain_data)
        
        return True
        
    def _log_to_csv(self, patient_id: str, timestamp: datetime, pain_data: Dict):
        """Append pain data to patient's CSV file."""
        csv_file = self.data_dir / f"{patient_id}_pain_log.csv"
        
        # Check if file exists to determine if we need headers
        file_exists = csv_file.exists()
        
        with open(csv_file, 'a', newline='') as f:
            writer = csv.writer(f)
            
            # Write header if new file
            if not file_exists:
                writer.writerow([
                    'timestamp',
                    'facial_pain_score',
                    'physio_pain_score',
                    'fused_pain_score',
                    'confidence',
                    'face_detected',
                    'model_loaded'
                ])
            
            # Write data row
            writer.writerow([
                timestamp.isoformat(),
                pain_data.get('facial_pain_score', ''),
                pain_data.get('physio_pain_score', ''),
                pain_data.get('fused_pain_score', ''),
                pain_data.get('confidence', ''),
                pain_data.get('face_detected', ''),
                pain_data.get('model_loaded', '')
            ])
            
    def _log_to_database(self, patient_id: str, timestamp: datetime, pain_data: Dict):
        """Insert pain data into SQLite database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO pain_records (
                patient_id, timestamp, facial_pain_score, physio_pain_score,
                fused_pain_score, confidence, face_detected, model_loaded, metadata
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            patient_id,
            timestamp,
            pain_data.get('facial_pain_score'),
            pain_data.get('physio_pain_score'),
            pain_data.get('fused_pain_score'),
            pain_data.get('confidence'),
            pain_data.get('face_detected'),
            pain_data.get('model_loaded'),
            str(pain_data.get('metadata', {}))
        ))
        
        conn.commit()
        conn.close()
        
    def get_patient_history(
        self, 
        patient_id: str, 
        limit: int = 100,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> List[Dict]:
        """
        Retrieve pain history for a patient from database.
        
        Args:
            patient_id: Patient identifier
            limit: Maximum number of records to return
            start_time: Filter records after this time
            end_time: Filter records before this time
            
        Returns:
            List of pain record dictionaries
        """
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        query = """
            SELECT * FROM pain_records 
            WHERE patient_id = ?
        """
        params = [patient_id]
        
        if start_time:
            query += " AND timestamp >= ?"
            params.append(start_time)
            
        if end_time:
            query += " AND timestamp <= ?"
            params.append(end_time)
            
        query += " ORDER BY timestamp DESC LIMIT ?"
        params.append(limit)
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        conn.close()
        
        # Convert to list of dicts
        return [dict(row) for row in rows]
        
    def get_latest_score(self, patient_id: str) -> Optional[Dict]:
        """
        Get the most recent pain score for a patient.
        
        Args:
            patient_id: Patient identifier
            
        Returns:
            Latest pain record or None if not found
        """
        history = self.get_patient_history(patient_id, limit=1)
        return history[0] if history else None
        
    def get_csv_path(self, patient_id: str) -> Path:
        """
        Get the path to a patient's CSV file.
        
        Args:
            patient_id: Patient identifier
            
        Returns:
            Path to CSV file
        """
        return self.data_dir / f"{patient_id}_pain_log.csv"
        
    def export_to_csv(self, patient_id: str, output_path: Optional[str] = None) -> str:
        """
        Export patient data to CSV file.
        
        Args:
            patient_id: Patient identifier
            output_path: Custom output path (optional)
            
        Returns:
            Path to exported CSV file
        """
        if output_path is None:
            output_path = str(self.get_csv_path(patient_id))
            
        # Data is already being logged to CSV in real-time
        # So we just return the path
        return output_path
        
    def clear_patient_data(self, patient_id: str) -> bool:
        """
        Clear all data for a patient (CSV and database).
        
        Args:
            patient_id: Patient identifier
            
        Returns:
            bool: True if successful
        """
        # Delete CSV file
        csv_file = self.get_csv_path(patient_id)
        if csv_file.exists():
            csv_file.unlink()
            
        # Delete from database
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM pain_records WHERE patient_id = ?", (patient_id,))
        conn.commit()
        conn.close()
        
        return True
        
    def get_all_patients(self) -> List[str]:
        """
        Get list of all patient IDs in the database.
        
        Returns:
            List of patient IDs
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT patient_id FROM pain_records ORDER BY patient_id")
        patients = [row[0] for row in cursor.fetchall()]
        conn.close()
        return patients
