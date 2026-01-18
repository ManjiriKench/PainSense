import StaffProfile from '../pages/StaffProfile';
import DoctorProfile from '../pages/DoctorProfile';

export default function ProfileRouter() {
    const role = localStorage.getItem('role'); // 'nurse' | 'doctor'

    if (role === 'doctor') {
        return <DoctorProfile />;
    }

    return <StaffProfile />;
}
