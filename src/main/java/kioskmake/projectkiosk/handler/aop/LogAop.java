package kioskmake.projectkiosk.handler.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.CodeSignature;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Aspect
@Component
public class LogAop {

    @Pointcut("@annotation(kioskmake.projectkiosk.handler.aop.annotation.Log)")
    private void enableLog(){}

    @Around("enableLog()")
    public Object printLog(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        Object result = null;
        String methodName = proceedingJoinPoint.getSignature().getName();
        Map<String, Object> argsMap = getArgs(proceedingJoinPoint);

        log.info(">>>>>>>>>>>>>>>>> Method Call: {}, {}", methodName, argsMap);

        result = proceedingJoinPoint.proceed();

        log.info(">>>>>>>>>>>>>>>>> Method End: {}, {}", methodName, result);

        return result;
    }

    private Map<String, Object> getArgs(ProceedingJoinPoint proceedingJoinPoint) {
        Map<String, Object> argsMap = new HashMap<>();

        CodeSignature codeSignature =  (CodeSignature) proceedingJoinPoint.getSignature();
        int index = 0;

        for(Object arg : proceedingJoinPoint.getArgs()) {
            argsMap.put(codeSignature.getParameterNames()[index], arg);
            index++;
        }

        return argsMap;
    }

}