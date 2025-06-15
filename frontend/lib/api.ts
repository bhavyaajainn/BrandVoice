import { useAppDispatch, useAppSelector } from "@/hooks/hooks"
import { createSchedule } from "./slices/createschedule";

type ScheduleArgs = {
    userId: string
    content_id: string
    platforms: string[]
    run_at: string
    timezone: string
}

export const useCreateSchedule = () => {
    const dispatch = useAppDispatch();
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