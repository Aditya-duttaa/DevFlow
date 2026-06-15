import { Router } from "express";

import { createOrganizationController,
        getMyOrganizationsController,
        getOrganizationByIdController,
        updateOrganizationController,
        inviteMemberController,
        removeMemberController,
        changeMemberRoleController
} from "../controllers/organizationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createOrganizationSchema,updateOrganizationSchema,addMemberSchema,updateMemberRoleSchema } from "../validators/organizationValidator.js";

const router = Router();

router.post(
    "/",
    protect,
    validate(createOrganizationSchema),
    createOrganizationController
);
router.get("/", protect, getMyOrganizationsController);
router.get("/:organizationId", protect, getOrganizationByIdController);
router.patch(
    "/:organizationId",
    protect,
    validate(updateOrganizationSchema),
    updateOrganizationController
);
router.post(
    "/:organizationId/members",
    protect,
    validate(addMemberSchema),
    inviteMemberController
);
router.delete(
    "/:organizationId/members/:memberId",
    protect,
    removeMemberController
);
router.patch(
    "/:organizationId/members/:memberId/role",
    protect,
    validate(updateMemberRoleSchema),
    changeMemberRoleController
);

export default router;