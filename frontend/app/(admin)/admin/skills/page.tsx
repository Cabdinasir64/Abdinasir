import SkillListClient from "../../../components/admin/skills/SkillList";

export const metadata = {
  title: "Admin | Skills",
  description: "Manage all your skills in the admin panel",
};

interface Skill {
  id: string;
  name: string;
  level: string;
  skillImage?: string;
  category: string[];
  createdAt: string;
  updatedAt: string;
}

async function fetchSkills(): Promise<Skill[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skills`, {
    cache: "no-store",
  })

  if (!res.ok) throw new Error("Failed to fetch skills");

  const data = await res.json();
  return data.skills;
}

export default async function SkillsPage() {
  const skills = await fetchSkills();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Skills</h1>
      <SkillListClient initialSkills={skills} />
    </div>
  );
}
