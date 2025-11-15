import SkillFormClient from "../../../../components/admin/skills/add/SkillFormClient";

export const metadata = {
  title: "Admin | Add Skill",
  description: "Add or Edit a skill in the admin panel",
};


export default async function AddSkillPage() {

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
      </h1>
      <SkillFormClient/>
    </div>
  );
}
