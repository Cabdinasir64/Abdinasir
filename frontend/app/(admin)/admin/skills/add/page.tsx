import SkillFormClient from "../../../../../components/admin/skills/add/SkillFormClient";
import { Suspense } from "react";
import { Loader } from "lucide-react";

export const metadata = {
  title: "Admin | Add Skill",
  description: "Add or Edit a skill in the admin panel",
};

export default async function AddSkillPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4"></h1>

      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading form...</p>
            </div>
          </div>
        }
      >
        <SkillFormClient />
      </Suspense>
    </div>
  );
}
