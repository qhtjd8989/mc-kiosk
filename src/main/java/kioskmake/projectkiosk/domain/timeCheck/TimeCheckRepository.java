package kioskmake.projectkiosk.domain.timeCheck;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TimeCheckRepository {
    public int checkTimeByEventType(String event_type) throws Exception;
}