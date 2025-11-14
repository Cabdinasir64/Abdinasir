import ProfileForm from '../../../components/admin/profile/ProfileForm';

export const metadata = {
    title: " Admin Profile - Abdinasir's Portfolio",
    description: "Edit and update your profile information in Abdinasir's portfolio admin dashboard.",
    keywords: ["Abdinasir", "Profile", "Portfolio", "Admin", "Edit Profile"],
    authors: [{ name: "Abdinasir" }],
    robots: "index, follow",
    icons: {
        icon: "favicon.ico",
    },
};

const Profile = () => {
    return <ProfileForm />;
};

export default Profile;
