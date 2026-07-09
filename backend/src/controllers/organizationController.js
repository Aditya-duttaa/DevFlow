import { createOrganization,
        getMyOrganizations,
        getOrganizationById,
        updateOrganization ,
        inviteMember,
        removeMember,
        changeMemberRole

} from "../services/organizationService.js";

export const createOrganizationController = async (req, res, next) => {
    try {
        const organization = await createOrganization(req.body, req.user.id);

        res.status(201).json({
            success: true,
            message: "Organization created successfully",
            data: organization
        });
    } catch (error) {
        next(error);
    }
};
export const getMyOrganizationsController = async (req, res, next) => {
    try {
        const organizations = await getMyOrganizations(req.user.id);

        res.status(200).json({
            success: true,
            data: organizations
        });
    } catch (error) {
        next(error);
    }
};

export const getOrganizationByIdController = async (req, res, next) => {
    try {
        const organization = await getOrganizationById(
            req.params.organizationId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: organization
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrganizationController = async (req, res, next) => {
    try {
        const organization = await updateOrganization(
            req.params.organizationId,
            req.user.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Organization updated successfully",
            data: organization
        });
    } catch (error) {
        next(error);
    }
};

export const inviteMemberController = async (req, res, next) => {
    try {
        const member = await inviteMember(
            req.params.organizationId,
            req.user.id,
            {
                email: req.body.email,
                userId: req.body.userId
            },
            req.body.role
        );

        res.status(201).json({
            success: true,
            message: "Member added successfully",
            data: member
        });
    } catch (error) {
        next(error);
    }
};

export const removeMemberController = async (req, res, next) => {
    try {
        await removeMember(
            req.params.organizationId,
            req.user.id,
            req.params.memberId
        );

        res.status(200).json({
            success: true,
            message: "Member removed successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const changeMemberRoleController = async (req, res, next) => {
    try {
        const member = await changeMemberRole(
            req.params.organizationId,
            req.user.id,
            req.params.memberId,
            req.body.role
        );

        res.status(200).json({
            success: true,
            message: "Member role updated successfully",
            data: member
        });
    } catch (error) {
        next(error);
    }
};
