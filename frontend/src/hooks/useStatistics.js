import { useQuery } from "@tanstack/react-query";
import StatisticServices from "@/services/statistics.services";
import {STALE_10_MIN} from '@/constant/constant'


function useGetStatistics() {
    return useQuery({
        queryKey: ["statistics"],
        queryFn: () => StatisticServices.getStatistic(),
        staleTime: STALE_10_MIN
    })
}

export default {
    getStatistics: useGetStatistics
}