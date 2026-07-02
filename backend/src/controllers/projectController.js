import {
    createProjectService,
    getProjectsByOrganization,
    getProjectService,
    updateProjectService,
    deleteProjectService
} from "../services/projectService.js";

export const createProjectController = async (req, res, next) => {
    try {
        const project = await createProjectService(req.body, req.user.id);

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project
        });
    } catch (error) {
        next(error);
    }
};

export const getProjectsController = async (req, res, next) => {
    try {
        const projects = await getProjectsByOrganization(
            req.query.organizationId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: projects
        });
    } catch (error) {
        next(error);
    }
};
export const getProjectController = async (
    req,
    res,
    next
) => {
    try {
        const project =
            await getProjectService(
                req.params.projectId,
                req.user.id
            );

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        next(error);
    }
};

export const updateProjectController = async (
    req,
    res,
    next
) => {
    try {
        const project =
            await updateProjectService(
                req.params.projectId,
                req.user.id,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProjectController = async (
    req,
    res,
    next
) => {
    try {
        await deleteProjectService(
            req.params.projectId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};