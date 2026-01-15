// Shared Types for PainSense System
// This file acts as the contract between AI, Backend, and Frontend teams.

export interface PainPacket {
  timestamp: number;
  painLevel: number; // 0-10 scale (0 = No Pain, 10 = Worst Pain)
  confidence: number; // 0.0 to 1.0
  features: {
    browFurrow: number; // 0.0 to 1.0 (AU4)
    eyeSqueeze: number; // 0.0 to 1.0 (AU6)
    noseWrinkle: number; // 0.0 to 1.0 (AU9)
    mouthOpen: number; // 0.0 to 1.0 (AU25/26/27)
  };
  inferenceTimeMs: number;
  isFaceDetected: boolean;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    mrn: string; // Medical Record Number
    ward: string;
    bed: string;
    diagnosis: string;
    status: 'stable' | 'critical' | 'monitoring' | 'discharged';
    lastVitals: {
        hr: number;
        bp: string;
        spo2: number;
        respRate: number;
    };
}
