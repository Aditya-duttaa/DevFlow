import { searchUsers } from "../repositories/userRepository.js";

export const searchUsersService = async (query) => {
    const normalizedQuery = query?.trim() || "";

    if (normalizedQuery.length < 2) {
        return [];
    }

    return searchUsers(normalizedQuery, 10);
};
