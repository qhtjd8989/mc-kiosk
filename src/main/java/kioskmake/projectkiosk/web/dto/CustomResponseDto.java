package kioskmake.projectkiosk.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomResponseDto<T> {
    private int code;
    private String message;
    private T data;
}