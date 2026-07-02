import { create } from "zustand";

const useWorkspaceStore = create((set) => ({
  currentOrganization: null,
  currentProject: null,

  // 👇 ADD THIS
  currentMember: null,

  setCurrentOrganization: (organization, userId) =>
    set({
      currentOrganization: organization,
      currentProject: null,

      // 👇 derive logged-in member
      currentMember:
        organization?.members?.find(
          (m) => m.userId === userId
        ) || null,
    }),

  setCurrentProject: (project) =>
    set({
      currentProject: project,
    }),

  clearWorkspace: () =>
    set({
      currentOrganization: null,
      currentProject: null,
      currentMember: null,
    }),
}));

export default useWorkspaceStore;