// components
export { default as CourseBatchAddDialog } from "./component/course-batch-add";
export { CourseBatchTable } from "./component/course-batch-table";
export { CourseBatchDetailCard } from "./component/course-batch-detail-card";

// hooks
export { useCourseBatch, useCreateCourseBatch, useUpdateCourseBatch, useDeleteCourseBatch, useUploadCourseBatch } from "./hook";

// api
export { fetchCourseBatch, createCourseBatch, updateCourseBatch, deleteCourseBatch, uploadCourseBatch } from "./api";

// types
export type { CourseBatch, CourseBatchInput } from "./type";
