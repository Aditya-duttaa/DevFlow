import AppError from "../utils/AppError.js";
import { findUserByEmail } from "../repositories/userRepository.js";
import {
    createOrganizationWithOwner,
    findOrganizationBySlug,
    findOrganizationsByUserId,
    findOrganizationById,
    updateOrganizationById,
    addOrganizationMember,
    deleteOrganizationMember,
    updateMemberRole
} from "../repositories/organizationRepository.js";
import { nextTick } from "node:process";

const createSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

export const createOrganization = async (data, userId) => {
    const slug = createSlug(data.name);

    const existingOrganization = await findOrganizationBySlug(slug);

    if (existingOrganization) {
        throw new AppError("Organization already exists", 409);
    }

    return createOrganizationWithOwner({
        name: data.name,
        slug,
        description: data.description,
        userId
    });
};

export const getMyOrganizations = async (userId) => {
    return findOrganizationsByUserId(userId);
};

export const getOrganizationById = async (organizationId, userId) => {
    const organization = await findOrganizationById(organizationId);

    if (!organization) {
        throw new AppError("Organization not found", 404);
    }

    const isMember = organization.members.some(
        (member) => member.userId === userId
    );

    if (!isMember) {
        throw new AppError("Forbidden", 403);
    }

    return organization;
};

export const updateOrganization = async (organizationId, userId, data) => {
    const organization = await findOrganizationById(organizationId);

    if (!organization) {
        throw new AppError("Organization not found", 404);
    }

    const member = organization.members.find(
        (member) => member.userId === userId
    );

    if (!member) {
        throw new AppError("Forbidden", 403);
    }

    if (!["OWNER", "ADMIN"].includes(member.role)) {
        throw new AppError("Only owner or admin can update organization", 403);
    }

    return updateOrganizationById(organizationId, data);
};

export const inviteMember = async (
    organizationId,
    currentUserId,
    email,
    role
) => {
    const organization = await findOrganizationById(organizationId);

    if (!organization) {
        throw new AppError("Organization not found", 404);
    }

    const currentMember = organization.members.find(
        (member) => member.userId === currentUserId
    );

    if (!currentMember) {
        throw new AppError("Forbidden", 403);
    }

    if (!["OWNER", "ADMIN"].includes(currentMember.role)) {
        throw new AppError("Only owner or admin can invite members", 403);
    }

    const userToInvite = await findUserByEmail(email);

    if (!userToInvite) {
        throw new AppError("User not found", 404);
    }

    const alreadyMember = organization.members.some(
        (member) => member.userId === userToInvite.id
    );

    if (alreadyMember) {
        throw new AppError("User is already a member", 409);
    }

    const member = await addOrganizationMember(
        organizationId,
        userToInvite.id,
        role
    );

    return member;
};

export const removeMember = async (
    organizationId,
    currentUserId,
    memberId
) => {
    const organization = await findOrganizationById(organizationId);

    if (!organization) {
        throw new AppError("Organization not found", 404);
    }

    const currentMember = organization.members.find(
        (member) => member.userId === currentUserId
    );

    if (!currentMember) {
        throw new AppError("Forbidden", 403);
    }

    if (!["OWNER", "ADMIN"].includes(currentMember.role)) {
        throw new AppError("Only owner or admin can remove members", 403);
    }

    const memberToRemove = organization.members.find(
        (member) => member.id === memberId
    );

    if (!memberToRemove) {
        throw new AppError("Member not found", 404);
    }

    if (memberToRemove.role === "OWNER") {
        throw new AppError("Owner cannot be removed", 403);
    }

    return deleteOrganizationMember(memberId);
};

export const changeMemberRole = async (
    organizationId,
    currentUserId,
    memberId,
    role
) => {
    const organization = await findOrganizationById(organizationId);

    if (!organization) {
        throw new AppError("Organization not found", 404);
    }

    const currentMember = organization.members.find(
        (member) => member.userId === currentUserId
    );

    if (!currentMember) {
        throw new AppError("Forbidden", 403);
    }

    if (!["OWNER", "ADMIN"].includes(currentMember.role)) {
        throw new AppError("Only owner or admin can change roles", 403);
    }

    const targetMember = organization.members.find(
        (member) => member.id === memberId
    );

    if (!targetMember) {
        throw new AppError("Member not found", 404);
    }

    if (targetMember.role === "OWNER") {
        throw new AppError("Owner role cannot be changed", 403);
    }

    if (
        currentMember.role === "ADMIN" &&
        targetMember.role === "ADMIN"
    ) {
        throw new AppError("Admin cannot change another admin", 403);
    }

    return updateMemberRole(memberId, role);
};
