import { create } from "zustand";

const safeJsonParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const getStoredWorkspace = () => {
  const authUserId = localStorage.getItem("authUserId");
  const workspaceUserId = localStorage.getItem("workspaceUserId");

  if (!authUserId || authUserId !== workspaceUserId) {
    localStorage.removeItem("org");
    localStorage.removeItem("member");
    localStorage.removeItem("workspaceUserId");

    return {
      currentOrganization: null,
      currentMember: null,
    };
  }

  return {
    currentOrganization: safeJsonParse(localStorage.getItem("org")),
    currentMember: safeJsonParse(localStorage.getItem("member")),
  };
};

const storedWorkspace = getStoredWorkspace();

const useWorkspaceStore = create((set) => ({
  currentOrganization: storedWorkspace.currentOrganization,
  currentProject: null,
  currentMember: storedWorkspace.currentMember,

  setCurrentOrganization: (organization) => {
    localStorage.setItem(
      "workspaceUserId",
      localStorage.getItem("authUserId") || ""
    );
    localStorage.setItem("org", JSON.stringify(organization));

    set({
      currentOrganization: organization,
      currentProject: null,
    });
  },

  setCurrentOrganizationDetails: (organization) => {
    localStorage.setItem(
      "workspaceUserId",
      localStorage.getItem("authUserId") || ""
    );
    localStorage.setItem("org", JSON.stringify(organization));

    set({
      currentOrganization: organization,
    });
  },

  setCurrentMember: (member) => {
    localStorage.setItem(
      "workspaceUserId",
      localStorage.getItem("authUserId") || ""
    );
    localStorage.setItem("member", JSON.stringify(member));

    set({ currentMember: member });
  },

  setCurrentProject: (project) =>
    set({ currentProject: project }),

  clearWorkspace: () => {
    localStorage.removeItem("org");
    localStorage.removeItem("member");
    localStorage.removeItem("workspaceUserId");

    set({
      currentOrganization: null,
      currentProject: null,
      currentMember: null,
    });
  },
}));

export default useWorkspaceStore;
