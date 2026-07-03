import { create } from "zustand";

const useWorkspaceStore = create((set) => ({
  currentOrganization: JSON.parse(localStorage.getItem("org")) || null,
  currentProject: null,
  currentMember: JSON.parse(localStorage.getItem("member")) || null,

  setCurrentOrganization: (organization) => {
    localStorage.setItem("org", JSON.stringify(organization));

    set({
      currentOrganization: organization,
      currentProject: null,
    });
  },

  setCurrentMember: (member) => {
    localStorage.setItem("member", JSON.stringify(member));

    set({ currentMember: member });
  },

  setCurrentProject: (project) =>
    set({ currentProject: project }),

  clearWorkspace: () => {
    localStorage.removeItem("org");
    localStorage.removeItem("member");

    set({
      currentOrganization: null,
      currentProject: null,
      currentMember: null,
    });
  },
}));

export default useWorkspaceStore;