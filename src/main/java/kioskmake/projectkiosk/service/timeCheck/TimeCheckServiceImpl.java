package kioskmake.projectkiosk.service.timeCheck;

import kioskmake.projectkiosk.domain.timeCheck.TimeCheckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TimeCheckServiceImpl implements TimeCheckService {
    private final TimeCheckRepository timeCheckRepository;

    @Override
    public boolean timeCheckByEventType(String eventType) throws Exception {
        return timeCheckRepository.checkTimeByEventType(eventType.replaceAll("-", "_")) == 1;
    }
}