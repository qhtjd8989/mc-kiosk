package kioskmake.projectkiosk.domain.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
	private int id;
	private String user_name;
	private String user_phone_number;
	private int point;
	private String point_status;
}
