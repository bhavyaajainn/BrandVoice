import { useAppDispatch, useAppSelector } from "@/hooks/hooks"
import { createSchedule } from "./slices/createschedule";
import { updateSchedule } from "./slices/updateschedule";
import { deleteSchedule, resetDeleteState } from './slices/deleteschedule'

type ScheduleArgs = {
    userId: string
    content_id: string
    platforms: string[]
    run_at: string
    timezone: string
}

type Args = Parameters<typeof updateSchedule>[0]

const dispatch = useAppDispatch();

export const useCreateSchedule = () => {

    const { loading: createScheduleLoading, error: createScheduleError, data: createScheduleData } = useAppSelector((state) => state.createSchedule);

    const handelCreateSchedule = (args: ScheduleArgs) => {
        dispatch(
            createSchedule(args)
        );

    };
    return {
        createScheduleLoading,
        createScheduleError,
        createScheduleData,
        handelCreateSchedule,
    }
};

export const useUpdateSchedule = () => {
    const { data: updateScheduleData, loading: updateScheduleLoading, error: updateScheduleError } = useAppSelector((s) => s.updateSchedule)

    const submitUpdate = (args: Args) => {
        dispatch(updateSchedule(args))
    }

    return { updateScheduleData, updateScheduleLoading, updateScheduleError, submitUpdate }
};

export const useDeleteSchedule = () => {
    const { loading: deleteingScheduleLoading, error: deleteingScheduleError, success: deleteingScheduleSuccess } = useAppSelector((s) => s.deleteSchedule)

    const submitDelete = (userId: string, scheduleId: string) => {
        dispatch(deleteSchedule({ userId, scheduleId }))
    }

    return { deleteingScheduleLoading, deleteingScheduleError, deleteingScheduleSuccess, submitDelete, resetDelete: () => dispatch(resetDeleteState()) }
}