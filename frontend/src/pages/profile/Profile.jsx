import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../../api/profileApi";
import useAuthStore from "../../store/authStore";

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
});

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Not available";

const fallbackAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=4f46e5&color=fff`;

export default function Profile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const [preview, setPreview] = useState("");

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const profile = profileQuery.data;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "" },
  });

  const watchedName = watch("name");

  useEffect(() => {
    if (profile) {
      reset({ name: profile.name ?? "" });
      setUser(profile);
    }
  }, [profile, reset, setUser]);

  const avatarUrl = useMemo(
    () => preview || profile?.avatarUrl || fallbackAvatar(watchedName),
    [preview, profile?.avatarUrl, watchedName]
  );

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile"], updated);
      setUser(updated);
      reset({ name: updated.name ?? "" });
      toast.success("Profile updated");
    },
    onError: (e) => {
      toast.error(
        e.response?.data?.message || "Failed to update profile"
      );
    },
  });

  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile"], updated);
      setUser(updated);
      setPreview("");
      toast.success("Avatar uploaded");
    },
    onError: (e) => {
      toast.error(
        e.response?.data?.message || "Failed to upload avatar"
      );
    },
  });

  function submit(values) {
    updateMutation.mutate({ name: values.name.trim() });
  }

  function selectAvatar(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));
    avatarMutation.mutate(file);
  }

  if (profileQuery.isLoading) {
    return (
      <div className="max-w-4xl rounded-xl bg-white p-8 shadow">
        Loading profile...
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div className="max-w-4xl rounded-xl bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold text-red-600">
          Profile unavailable
        </h1>
        <button
          onClick={() => profileQuery.refetch()}
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-gray-500">
          Manage your personal information.
        </p>
      </div>

      <div className="rounded-xl bg-white p-8 shadow">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <img
            src={avatarUrl}
            alt=""
            className="h-28 w-28 rounded-full border object-cover"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile?.name}</h2>
            <p className="mt-1 text-gray-500">{profile?.email}</p>
            <div className="mt-4 grid gap-2 text-sm text-gray-500 sm:grid-cols-2">
              <p>Joined: {formatDate(profile?.createdAt)}</p>
              <p>Last Updated: {formatDate(profile?.updatedAt)}</p>
            </div>
            <label className="mt-5 inline-block cursor-pointer rounded-lg bg-slate-200 px-5 py-3 hover:bg-slate-300">
              {avatarMutation.isPending ? "Uploading..." : "Upload Avatar"}
              <input
                type="file"
                accept="image/*"
                onChange={selectAvatar}
                disabled={avatarMutation.isPending}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        className="rounded-xl bg-white p-8 shadow"
      >
        <div className="grid gap-5">
          <div>
            <label className="mb-2 block font-semibold">Name</label>
            <input
              className="w-full rounded-lg border p-3"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-semibold">Email</label>
            <input
              value={profile?.email ?? ""}
              readOnly
              className="w-full rounded-lg border bg-slate-100 p-3 text-gray-600"
            />
          </div>
        </div>

        {isDirty && (
          <p className="mt-5 text-sm text-amber-700">
            You have unsaved changes.
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || updateMutation.isPending || !isDirty}
            className="rounded-lg bg-indigo-600 px-6 py-3 text-white disabled:bg-indigo-300"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            disabled={!isDirty}
            onClick={() => reset({ name: profile?.name ?? "" })}
            className="rounded-lg bg-slate-200 px-6 py-3 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
