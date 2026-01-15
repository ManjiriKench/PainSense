// Mock Data for PainSense Hackathon Demo

export const MOCK_PATIENTS = [
    {
        id: '101',
        name: 'Robert Fox',
        age: 64,
        ward: 'ICU-A',
        bed: '01',
        diagnosis: 'Post-Op Coronary Bypass',
        status: 'stable',
        painLevel: 2, // Current Pain
        lastUpdate: '2 mins ago'
    },
    {
        id: '123',
        name: 'Esther Howard',
        age: 72,
        ward: 'ICU-A',
        bed: '04',
        diagnosis: 'Stroke / Aphasia',
        status: 'monitoring', // This is our Demo Patient
        painLevel: 7, // High Pain!
        lastUpdate: 'Live'
    },
    {
        id: '105',
        name: 'Jenny Wilson',
        age: 28,
        ward: 'ICU-A',
        bed: '05',
        diagnosis: 'TBI (Traumatic Brain Injury)',
        status: 'critical',
        painLevel: 1,
        lastUpdate: '5 mins ago'
    }
];

export const MOCK_HISTORY = [
    { time: '10:00', value: 1 },
    { time: '10:05', value: 2 },
    { time: '10:10', value: 2 },
    { time: '10:15', value: 4 },
    { time: '10:20', value: 6 },
    { time: '10:25', value: 8 }, // Spike
    { time: '10:30', value: 7 },
    { time: '10:35', value: 7 },
];
