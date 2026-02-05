import { useQuery } from "@tanstack/react-query";
import StatisticServices from "@/services/statistics.services";
import {STALE_10_MIN} from '@/constant/constant'

class StatisticsHook {
    static useGetStatistic(){
        return useQuery({
            queryKey: ["statistic"],
            queryFn: () => StatisticServices.getStatistic(),
            staleTime: STALE_10_MIN
        })
    }
}

export default StatisticsHook