import { createProjectService,
         getProjectsByOrganization
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