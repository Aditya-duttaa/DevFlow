import {
    findPreferenceByUserId,
    upsertPreference
} from "../repositories/preferenceRepository.js";
import { updatePreferenceSchema } from "../validators/preferenceValidator.js";

export const getPreferencesService = async (userId) => {
    const preference = await findPreferenceByUserId(userId);

    if (preference) {
        return preference;
    }

    return upsertPreference(userId, {});
};

export const updatePreferencesService = async (userId, data) => {
    const validatedData = updatePreferenceSchema.parse(data);

    return upsertPreference(userId, validatedData);
};
