<?
	set_time_limit(180);

	session_start();
	include ('../init.php');
	include ('fn_common.php');
	checkUserSession();
	
	loadLanguage($_SESSION["language"], $_SESSION["units"]);
	
	// check privileges
	if ($_SESSION["privileges"] == 'subuser')
	{
		$user_id = $_SESSION["manager_id"];
	}
	else
	{
		$user_id = $_SESSION["user_id"];
	}
	
	if(@$_GET['format'] == 'evt')
	{		
		$result = array();
		$result['evt'] = '0.1v';
		$result['events'] = array();
		
		$q = "SELECT * FROM `gs_user_events` WHERE `user_id`='".$user_id."' ORDER BY `name` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{		
			$result['events'][] = array(	'type' => $row['type'],
							'name' => $row['name'],
							'active' => $row['active'],
							'duration_from_last_event' => $row['duration_from_last_event'],
							'duration_from_last_event_minutes' => $row['duration_from_last_event_minutes'],
							'week_days' => $row['week_days'],
							'day_time' => $row['day_time'],
							'imei' => $row['imei'],
							'checked_value' => $row['checked_value'],
							'route_trigger' => $row['route_trigger'],
							'zone_trigger' => $row['zone_trigger'],
							'routes' => $row['routes'],
							'zones' => $row['zones'],
							'notify_system' => $row['notify_system'],
							'notify_push' => $row['notify_push'],
							'notify_email' => $row['notify_email'],
							'notify_email_address' => $row['notify_email_address'],
							'notify_sms' => $row['notify_sms'],
							'notify_sms_number' => $row['notify_sms_number'],
							'notify_arrow' => $row['notify_arrow'],
							'notify_arrow_color' => $row['notify_arrow_color'],
							'notify_ohc' => $row['notify_ohc'],
							'notify_ohc_color' => $row['notify_ohc_color'],
							'email_template_id' => $row['email_template_id'],
							'sms_template_id' => $row['sms_template_id'],
							'webhook_send' => $row['webhook_send'],
							'webhook_url' => $row['webhook_url'],
							'cmd_send' => $row['cmd_send'],
							'cmd_gateway' => $row['cmd_gateway'],
							'cmd_type' => $row['cmd_type'],
							'cmd_string' => $row['cmd_string']
							);
		}
		
		$time = convUserTimezone(gmdate("Y-m-d H:i:s"));
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="events '.$time.'.evt"');
		echo json_encode($result);	
	}
	
	if(@$_GET['format'] == 'cte')
	{		
		$result = array();
		$result['cte'] = '0.1v';
		$result['templates'] = array();
		
		$q = "SELECT * FROM `gs_user_cmd` WHERE `user_id`='".$user_id."' ORDER BY `name` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{		
			$result['templates'][] = array(	'name' => $row['name'],
							'protocol' => $row['protocol'],
							'gateway' => $row['gateway'],
							'type' => $row['type'],
							'cmd' => $row['cmd']
							);
		}
		
		$time = convUserTimezone(gmdate("Y-m-d H:i:s"));
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="object_control_templates '.$time.'.cte"');
		echo json_encode($result);	
	}
	
	if(@$_GET['format'] == 'tem')
	{		
		$result = array();
		$result['tem'] = '0.1v';
		$result['templates'] = array();
		
		$q = "SELECT * FROM `gs_user_templates` WHERE `user_id`='".$user_id."' ORDER BY `name` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{		
			$result['templates'][] = array(	'name' => $row['name'],
							'desc' => $row['desc'],
							'message' => $row['message']
							);
		}
		
		$time = convUserTimezone(gmdate("Y-m-d H:i:s"));
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="templates '.$time.'.tem"');
		echo json_encode($result);	
	}
	
	if(@$_GET['format'] == 'otr')
	{		
		$result = array();
		$result['otr'] = '0.1v';
		$result['trailers'] = array();
		
		$q = "SELECT * FROM `gs_user_object_trailers` WHERE `user_id`='".$user_id."' ORDER BY `trailer_name` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{		
			$result['trailers'][] = array(	'trailer_name' => $row['trailer_name'],
							'trailer_assign_id' => $row['trailer_assign_id'],
							'trailer_model' => $row['trailer_model'],
							'trailer_vin' => $row['trailer_vin'],
							'trailer_plate_number' => $row['trailer_plate_number'],
							'trailer_desc' => $row['trailer_desc']
							);
		}
		
		$time = convUserTimezone(gmdate("Y-m-d H:i:s"));
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="object_trailers '.$time.'.otr"');
		echo json_encode($result);	
	}
	
	if(@$_GET['format'] == 'opa')
	{		
		$result = array();
		$result['opa'] = '0.1v';
		$result['passengers'] = array();
		
		$q = "SELECT * FROM `gs_user_object_passengers` WHERE `user_id`='".$user_id."' ORDER BY `passenger_name` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{		
			$result['passengers'][] = array('passenger_name' => $row['passenger_name'],
							'passenger_assign_id' => $row['passenger_assign_id'],
							'passenger_idn' => $row['passenger_idn'],
							'passenger_address' => $row['passenger_address'],
							'passenger_phone' => $row['passenger_phone'],
							'passenger_email' => $row['passenger_email'],
							'passenger_desc' => $row['passenger_desc']
							);
		}
		
		$time = convUserTimezone(gmdate("Y-m-d H:i:s"));
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="object_passengers '.$time.'.opa"');
		echo json_encode($result);	
	}
	
	if(@$_GET['format'] == 'odr')
	{		
		$result = array();
		$result['odr'] = '0.1v';
		$result['drivers'] = array();
		
		$q = "SELECT * FROM `gs_user_object_drivers` WHERE `user_id`='".$user_id."' ORDER BY `driver_name` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{		
			$result['drivers'][] = array(	'driver_name' => $row['driver_name'],
							'driver_assign_id' => $row['driver_assign_id'],
							'driver_idn' => $row['driver_idn'],
							'driver_address' => $row['driver_address'],
							'driver_phone' => $row['driver_phone'],
							'driver_email' => $row['driver_email'],
							'driver_desc' => $row['driver_desc'],
							'driver_img_file' => ''
							);
		}
		
		$time = convUserTimezone(gmdate("Y-m-d H:i:s"));
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="object_drivers '.$time.'.odr"');
		echo json_encode($result);	
	}
	
	if(@$_GET['format'] == 'ogr')
	{		
		$result = array();
		$result['ogr'] = '0.1v';
		$result['groups'] = array();
		
		$q = "SELECT * FROM `gs_user_object_groups` WHERE `user_id`='".$user_id."' ORDER BY `group_name` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{		
			$result['groups'][] = array(	'group_name' => $row['group_name'],
							'group_desc' => $row['group_desc']
							);
		}
		
		$time = convUserTimezone(gmdate("Y-m-d H:i:s"));
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="object_groups '.$time.'.ogr"');
		echo json_encode($result);	
	}
	
	if(@$_GET['format'] == 'pgr')
	{		
		$result = array();
		$result['pgr'] = '0.1v';
		$result['groups'] = array();
		
		$q = "SELECT * FROM `gs_user_places_groups` WHERE `user_id`='".$user_id."' ORDER BY `group_name` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{		
			$result['groups'][] = array(	'group_name' => $row['group_name'],
							'group_desc' => $row['group_desc']
							);
		}
		
		$time = convUserTimezone(gmdate("Y-m-d H:i:s"));
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="places_groups '.$time.'.pgr"');
		echo json_encode($result);	
	}
	
	if(@$_GET['format'] == 'sen')
	{
		$imei = $_GET["imei"];
		
		if (!checkUserToObjectPrivileges($user_id, $imei))
		{
			die;
		}
		
		$result = array();
		$result['sen'] = '0.1v';
		$result['sensors'] = array();
		
		$q = "SELECT * FROM `gs_object_sensors` WHERE `imei`='".$imei."' ORDER BY `sensor_id` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{			
			$result['sensors'][] = array(	'name' => $row['name'],
							'type' => $row['type'],
							'param' => $row['param'],
							'data_list' => $row['data_list'],
							'popup' => $row['popup'],
							'result_type' => $row['result_type'],
							'text_1' => $row['text_1'],
							'text_0' => $row['text_0'],
							'units' => $row['units'],
							'lv' => $row['lv'],
							'hv' => $row['hv'],
							'acc_ignore' => $row['acc_ignore'],
							'formula' => $row['formula'],
							'calibration' => $row['calibration'],
							'dictionary' => $row['dictionary']
							);
		}
		
		$time = convUserTimezone(gmdate("Y-m-d H:i:s"));
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="object_sensors '.$time.'.sen"');
		echo json_encode($result);	
	}
	
	if(@$_GET['format'] == 'ser')
	{
		$imei = $_GET["imei"];
		
		if (!checkUserToObjectPrivileges($user_id, $imei))
		{
			die;
		}
		
		$result = array();
		$result['ser'] = '0.1v';
		$result['services'] = array();
		
		$q = "SELECT * FROM `gs_object_services` WHERE `imei`='".$imei."' ORDER BY `service_id` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{			
			$result['services'][] = array(	'name' => $row['name'],
							'data_list' => $row['data_list'],
							'popup' => $row['popup'],
							'odo' => $row['odo'],
							'odo_interval' => $row['odo_interval'],
							'odo_last' => $row['odo_last'],
							'engh' => $row['engh'],
							'engh_interval' => $row['engh_interval'],
							'engh_last' => $row['engh_last'],
							'days' => $row['days'],
							'days_interval' => $row['days_interval'],
							'days_last' => $row['days_last'],
							'odo_left' => $row['odo_left'],
							'odo_left_num' => $row['odo_left_num'],
							'engh_left' => $row['engh_left'],
							'engh_left_num' => $row['engh_left_num'],
							'days_left' => $row['days_left'],
							'days_left_num' => $row['days_left_num'],
							'update_last' => $row['update_last']
							);
		}
		
		$time = convUserTimezone(gmdate("Y-m-d H:i:s"));
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="object_services '.$time.'.ser"');
		echo json_encode($result);	
	}
	
	if(@$_GET['format'] == 'cfl')
	{
		$imei = $_GET["imei"];
		
		if (!checkUserToObjectPrivileges($user_id, $imei))
		{
			die;
		}
		
		$result = array();
		$result['cfl'] = '0.1v';
		$result['fields'] = array();
		
		$q = "SELECT * FROM `gs_object_custom_fields` WHERE `imei`='".$imei."' ORDER BY `field_id` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{			
			$result['fields'][] = array(	'name' => $row['name'],
							'value' => $row['value'],
							'data_list' => $row['data_list'],
							'popup' => $row['popup']
							);
		}
		
		$time = convUserTimezone(gmdate("Y-m-d H:i:s"));
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="object_custom_fields '.$time.'.cfl"');
		echo json_encode($result);	
	}
	
	if(@$_GET['format'] == 'plc')
	{
		$result = array();
		$result['plc'] = '0.1v';
		$result['markers'] = array();
		$result['routes'] = array();
		$result['zones'] = array();
		
		$groups = array();
		
		$q = "SELECT * FROM `gs_user_places_groups` WHERE `user_id`='".$user_id."' ORDER BY `group_id` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{
			$groups[$row['group_id']] = $row['group_name'];
		}
		
		$q = "SELECT * FROM `gs_user_markers` WHERE `user_id`='".$user_id."' ORDER BY `marker_id` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{
			$group_name = '';
			
			if (isset($groups[$row['group_id']]))
			{
				$group_name = $groups[$row['group_id']];
			}
			
			$result['markers'][] = array(	'group_name' => $group_name,
											'name' => $row['marker_name'],
											'desc' => $row['marker_desc'],
											'icon' => $row['marker_icon'],
											'visible' => $row['marker_visible'],
											'lat' => $row['marker_lat'],
											'lng' => $row['marker_lng'],
											'radius' => $row['marker_radius']
											);
		}
		
		$q = "SELECT * FROM `gs_user_routes` WHERE `user_id`='".$user_id."' ORDER BY `route_name` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{
			$group_name = '';
			
			if (isset($groups[$row['group_id']]))
			{
				$group_name = $groups[$row['group_id']];
			}
			
			$result['routes'][] = array(	'group_name' => $group_name,
											'name' => $row['route_name'],
											'color' => $row['route_color'],
											'visible' => $row['route_visible'],
											'name_visible' => $row['route_name_visible'],
											'deviation' => $row['route_deviation'],
											'points' => $row['route_points']
											);
		}
		
		$q = "SELECT * FROM `gs_user_zones` WHERE `user_id`='".$user_id."' ORDER BY `zone_name` ASC";
		$r = mysqli_query($ms, $q);
		
		while($row=mysqli_fetch_array($r))
		{
			$group_name = '';
			
			if (isset($groups[$row['group_id']]))
			{
				$group_name = $groups[$row['group_id']];
			}
			
			$result['zones'][] = array(	'group_name' => $group_name,
										'name' => $row['zone_name'],
										'color' => $row['zone_color'],
										'visible' => $row['zone_visible'],
										'name_visible' => $row['zone_name_visible'],
										'area' => $row['zone_area'],
										'vertices' => $row['zone_vertices']
										);
		}
		
		$time = convUserTimezone(gmdate("Y-m-d H:i:s"));
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="places '.$time.'.plc"');
		echo json_encode($result);	
	}
	
	if ((@$_GET['format'] == 'gsr') || (@$_GET['format'] == 'kml') || (@$_GET['format'] == 'gpx') || (@$_GET['format'] == 'history_csv'))
	{
		include ('fn_route.php');
		
		$imei = $_GET['imei'];
		$name = $_GET['name'];
		$dtf = $_GET['dtf'];
		$dtt = $_GET['dtt'];
	}

	if(@$_GET['format'] == 'gsr')
	{
		$min_stop_duration = $_GET['min_stop_duration'];
		
		if (!checkUserToObjectPrivileges($user_id, $imei))
		{
			die;
		}
		
		$route = getRoute($user_id, $imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $min_stop_duration, true);
		
		$result = array();
		$result['gsr'] = '0.2v';
		$result['imei'] = $imei;
		$result['name'] = $name;
		$result['route'] = $route;
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="'.$name.' '.$dtf.' - '.$dtt.'.gsr"');
		echo json_encode($result);
	}
	
	if (@$_GET['format'] == 'kml')
	{
		if (!checkUserToObjectPrivileges($user_id, $imei))
		{
			die;
		}
		
		$accuracy = getObjectAccuracy($imei);
		
		$route = getRouteRaw($imei, $accuracy, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt));
		
		$coords = '';
		
		header('Content-type: application/vnd.google-earth.kml+xml');
		header('Content-Disposition: attachment; filename="'.$name.' '.$dtf.' - '.$dtt.'.kml"');
		echo '<?xml version="1.0" encoding="UTF-8"?>';
		echo '<kml xmlns="http://www.opengis.net/kml/2.2">';
		echo '<Document>';
		echo '<name>'.$name.'</name>';
		echo '<Style id="style1">';
		echo '<LineStyle><color>7F0000E6</color><width>4</width></LineStyle>';
		echo '</Style>';
		echo '<Placemark>';
		echo '<name><![CDATA[Track from '.$dtf.' to '.$dtt.'  UTC]]></name>';
		echo '<styleUrl>#style1</styleUrl>';
		echo '<MultiGeometry><LineString><tessellate>1</tessellate>';
		echo '<altitudeMode>clampToGround</altitudeMode>';
		echo '<coordinates>';
		
		for ($i=0; $i<count($route); ++$i)
		{
			$coords = $coords.$route[$i][2].','.$route[$i][1].','.$route[$i][3].' ';
		}
		
		echo $coords;
		echo '</coordinates></LineString></MultiGeometry></Placemark></Document></kml> ';
	}
	
	if (@$_GET['format'] == 'gpx')
	{
		if (!checkUserToObjectPrivileges($user_id, $imei))
		{
			die;
		}
		
		$accuracy = getObjectAccuracy($imei);
		
		$route = getRouteRaw($imei, $accuracy, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt));
		
		header('Content-type: text/plain');
		header('Content-Disposition: attachment; filename="'.$name.' '.$dtf.'-'.$dtt.'.gpx"');
		echo '<?xml version="1.0" encoding="UTF-8"?>';
		echo '<gpx creator="'.$gsValues['NAME'].'" version="1.0" xmlns="http://www.topografix.com/GPX/1/0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd">';
		echo '<trk>';
		echo '<name>Track from '.$dtf.' to '.$dtt.'  UTC</name>';
		echo '<type>GPS Tracklog</type>';
		echo '<trkseg>';
		
		for ($i=0; $i<count($route); ++$i)
		{
			$lat = $route[$i][1];
			$lng = $route[$i][2];
			$speed = $route[$i][5] * 0.277778;
			$speed = sprintf('%0.2f', $speed);
			$dt_tracker = $route[$i][0];
			echo '<trkpt lat="'.$lat.'" lon="'.$lng.'"><speed>'.$speed.'</speed><ele>'.$i.'</ele><time>'.$dt_tracker.'</time></trkpt>';
		}
		
		echo "</trkseg></trk></gpx>";
	}
	
	if (@$_GET['format'] == 'events_csv')
	{
		// check privileges
		if ($_SESSION["privileges"] == 'subuser')
		{
			$q = "SELECT * FROM `gs_user_last_events_data` WHERE `user_id`='".$user_id."' AND `imei` IN (".$_SESSION["privileges_imei"].") ORDER BY `dt_tracker` DESC";
		}
		else
		{
			$q = "SELECT * FROM `gs_user_last_events_data` WHERE `user_id`='".$user_id."' ORDER BY `dt_tracker` DESC";			
		}		
		$r = mysqli_query($ms, $q);
		
		header('Content-type: text/csv; charset=utf-8');
		header('Content-Disposition: attachment; filename="events.csv"');
		
		echo 'dt,imei,object,model,vin,plate_number,device,sim_number,event,lat,lng,altitude,angle,speed,params';
		echo "\r\n";
		
		while($row=mysqli_fetch_array($r))
		{
			$q2 = "SELECT * FROM `gs_objects` WHERE `imei`='".$row['imei']."'";
			$r2 = mysqli_query($ms, $q2);
			$row2 = mysqli_fetch_array($r2);
			
			if ($gsValues['SIM_NUMBER'] == 'false')
			{
				$row2['sim_number'] = '';
			}
			
			$dt = $row['dt_tracker'];			
			$imei = $row['imei'];
			$name = $row2['name'];
			$model = $row2['model'];
			$vin = $row2['vin'];
			$plate_number = $row2['plate_number'];
			$device= $row2['device'];
			$sim_number = $row2['sim_number'];			
			$event = $row['event_desc'];
			$lat = $row['lat'];
			$lng = $row['lng'];
			$altitude = $row['altitude'];
			$angle = $row['angle'];
			$speed = $row['speed'];
			$params = json_decode($row['params'],true);
			
			$arr_params = array();
					
			foreach ($params as $key => $value)
			{
				array_push($arr_params, $key.'='.$value);
			}
			
			$params_ = implode(', ', $arr_params);
			
			echo $dt.','.$imei.','.$name.','.$model.','.$vin.','.$plate_number.','.$device.','.$sim_number.','.$event.','.$lat.','.$lng.','.$altitude.','.$angle.','.$speed.',"'.$params_.'"';
			echo "\r\n";
		}	
	}
	
	if (@$_GET['format'] == 'history_csv')
	{
		if (!checkUserToObjectPrivileges($user_id, $imei))
		{
			die;
		}
		
		$accuracy = getObjectAccuracy($imei);
		
		$route = getRouteRaw($imei, $accuracy, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt));
		
		header('Content-type: text/csv; charset=utf-8');
		header('Content-Disposition: attachment; filename="'.$name.' '.$dtf.'-'.$dtt.'.csv"');
		
		echo 'dt,lat,lng,altitude,angle,speed,params';
		echo "\r\n";
		
		for ($i=0; $i<count($route); ++$i)
		{
			$dt = $route[$i][0];
			$lat = $route[$i][1];
			$lng = $route[$i][2];
			$altitude = $route[$i][3];
			$angle = $route[$i][4];
			$speed = $route[$i][5];
			$params = $route[$i][6];
			
			$arr_params = array();
					
			foreach ($params as $key => $value)
			{
				array_push($arr_params, $key.'='.$value);
			}
			
			$params_ = implode(', ', $arr_params);
			
			echo $dt.','.$lat.','.$lng.','.$altitude.','.$angle.','.$speed.',"'.$params_.'"';
			echo "\r\n";
		}
	}
	
	if (@$_GET['format'] == 'tasks_csv')
	{
		if (isset($_GET['dtf']) && isset($_GET['dtt']))
		{
			header('Content-type: text/csv; charset=utf-8');
			header('Content-Disposition: attachment; filename="tasks '.$_GET['dtf'].'-'.$_GET['dtt'].'.csv"');	
		}
		else
		{
			header('Content-type: text/csv; charset=utf-8');
			header('Content-Disposition: attachment; filename="tasks.csv"');	
		}
		
		echo 'dt,name,object,priority,status,desc,start_address,start_from_dt,start_to_dt,end_address,end_from_dt,end_to_dt';
		echo "\r\n";
		
		if ($_SESSION["privileges"] == 'subuser')
		{
			$q = "SELECT * FROM `gs_object_tasks` WHERE `imei` IN (".$_SESSION["privileges_imei"].")";
		}
		else
		{
			$q = "SELECT * FROM `gs_object_tasks` WHERE `imei` IN (".getUserObjectIMEIs($user_id).")";
		}
		
		if (isset($imei))
		{
			$q .= ' AND `imei`="'.$imei.'"';
		}
		
		if (isset($_GET['dtf']) && isset($_GET['dtt']))
		{
			$q .= " AND dt_task BETWEEN '".convUserUTCTimezone($_GET['dtf'])."' AND '".convUserUTCTimezone($_GET['dtt'])."'";
		}
		
		$q .=  " ORDER BY dt_task desc";
		
		$r = mysqli_query($ms, $q);
		
		if (!$r){die;}
		
		while($row = mysqli_fetch_array($r))
		{
			$dt_task = convUserTimezone($row['dt_task']);
			$name = $row['name'];
			$imei = $row['imei'];
			$priority = $row["priority"];
			$status = $row["status"];
			$desc = $row["desc"];
			$start_address = $row["start_address"];
			$start_from_dt = $row["start_from_dt"];
			$start_to_dt = $row["start_to_dt"];
			$end_address = $row["end_address"];
			$end_from_dt = $row["end_from_dt"];
			$end_to_dt = $row["end_to_dt"];
			
			$object_name = getObjectName($imei);
			
			echo $dt_task.',"'.$name.'","'.$object_name.'","'.$priority.'","'.$status.'","'.$desc.'","'.$start_address.'","'.$start_from_dt.'","'.$start_to_dt.'","'.$end_address.'","'.$end_from_dt.'","'.$end_to_dt.'"';
			echo "\r\n";
		}
	}
	
	if (@$_GET['format'] == 'rilogbook_csv')
	{
		if (isset($_GET['dtf']) && isset($_GET['dtt']))
		{
			header('Content-type: text/csv; charset=utf-8');
			header('Content-Disposition: attachment; filename="rilogbook '.$_GET['dtf'].'-'.$_GET['dtt'].'.csv"');	
		}
		else
		{
			header('Content-type: text/csv; charset=utf-8');
			header('Content-Disposition: attachment; filename="rilogbook.csv"');	
		}
		
		echo 'dt,object,group,name,position';
		echo "\r\n";
		
		if ($_SESSION["privileges"] == 'subuser')
		{
			$q = "SELECT * FROM `gs_rilogbook_data` WHERE `imei` IN (".$_SESSION["privileges_imei"].")";
		}
		else
		{
			$q = "SELECT * FROM `gs_rilogbook_data` WHERE `imei` IN (".getUserObjectIMEIs($user_id).")";
		}
		
		if (isset($imei))
		{
			$q .= ' AND `imei`="'.$imei.'"';
		}
		
		$group = '';
		if ($_GET['drivers'] == 'true')
		{
			$group .= '"da",';
		}
		if ($_GET['passengers'] == 'true')
		{
			$group .= '"pa",';
		}
		if ($_GET['trailers'] == 'true')
		{
			$group .= '"ta",';
		}
		if ($group == '')
		{
			$group = '""';
		}
		$group = rtrim($group, ',');
		$q .= ' AND `group` IN ('.$group.')';
		
		if (isset($_GET['dtf']) && isset($_GET['dtt']))
		{
			$q .= " AND dt_server BETWEEN '".convUserUTCTimezone($_GET['dtf'])."' AND '".convUserUTCTimezone($_GET['dtt'])."'";
		}
		
		$q .=  " ORDER BY dt_tracker desc";
		
		$r = mysqli_query($ms, $q);
		
		if (!$r){die;}
		
		while($row = mysqli_fetch_array($r))
		{
			$dt_tracker = convUserTimezone($row['dt_tracker']);
			$imei = $row['imei'];
			$group = $row["group"];
			$assign_id = strtoupper($row["assign_id"]);
			$lat = $row["lat"];
			$lng = $row["lng"];
			
			$object_name = getObjectName($imei);
			
			if ($group == 'da')
			{
				$q2 = "SELECT * FROM `gs_user_object_drivers` WHERE `user_id`='".$user_id."' AND `driver_assign_id`='".$assign_id."'";
				$r2 = mysqli_query($ms, $q2);
				$row2 = mysqli_fetch_array($r2);
				
				if ($row2)
				{
					$assign_id = $row2["driver_name"];
				}
				
				$group = $la['DRIVER'];
			}
			else if ($group == 'pa')
			{
				$q2 = "SELECT * FROM `gs_user_object_passengers` WHERE `user_id`='".$user_id."' AND `passenger_assign_id`='".$assign_id."'";
				$r2 = mysqli_query($ms, $q2);
				$row2 = mysqli_fetch_array($r2);
				
				if ($row2)
				{
					$assign_id = $row2["passenger_name"];
				}
				
				$group = $la['PASSENGER'];
			}
			else if ($group == 'ta')
			{
				$q2 = "SELECT * FROM `gs_user_object_trailers` WHERE `user_id`='".$user_id."' AND `trailer_assign_id`='".$assign_id."'";
				$r2 = mysqli_query($ms, $q2);
				$row2 = mysqli_fetch_array($r2);
				
				if ($row2)
				{
					$assign_id = $row2["trailer_name"];
				}
				
				$group = $la['TRAILER'];
			}
			
			$position = $lat.', '.$lng;
			
			if ($row["address"] != '')
			{
				$position .= ' - '.$row["address"];	
			}
			
			echo $dt_tracker.',"'.$object_name.'",'.$group.',"'.$assign_id.'","'.$position.'"';
			echo "\r\n";
		}
	}
	
	if (@$_GET['format'] == 'dtc_csv')
	{
		if (isset($_GET['dtf']) && isset($_GET['dtt']))
		{
			header('Content-type: text/csv; charset=utf-8');
			header('Content-Disposition: attachment; filename="dtc '.$_GET['dtf'].'-'.$_GET['dtt'].'.csv"');	
		}
		else
		{
			header('Content-type: text/csv; charset=utf-8');
			header('Content-Disposition: attachment; filename="dtc.csv"');	
		}
		
		echo 'dt,object,code,position';
		echo "\r\n";
		
		if ($_SESSION["privileges"] == 'subuser')
		{
			$q = "SELECT * FROM `gs_dtc_data` WHERE `imei` IN (".$_SESSION["privileges_imei"].")";
		}
		else
		{
			$q = "SELECT * FROM `gs_dtc_data` WHERE `imei` IN (".getUserObjectIMEIs($user_id).")";
		}
		
		if (isset($imei))
		{
			$q .= ' AND `imei`="'.$imei.'"';
		}
		
		if (isset($_GET['dtf']) && isset($_GET['dtt']))
		{
			$q .= " AND dt_server BETWEEN '".convUserUTCTimezone($_GET['dtf'])."' AND '".convUserUTCTimezone($_GET['dtt'])."'";
		}
		
		$q .=  " ORDER BY dt_tracker desc";
		
		$r = mysqli_query($ms, $q);
		
		if (!$r){die;}
		
		while($row = mysqli_fetch_array($r))
		{
			$dt_tracker = convUserTimezone($row['dt_tracker']);
			$imei = $row['imei'];
			$code = strtoupper($row["code"]);
			$lat = $row["lat"];
			$lng = $row["lng"];
			
			$object_name = getObjectName($imei);
			
			$position = $lat.', '.$lng;
			
			if ($row["address"] != '')
			{
				$position .= ' - '.$row["address"];	
			}
			
			echo $dt_tracker.',"'.$object_name.'",'.$code.'","'.$position.'"';
			echo "\r\n";
		}
	}
	die;
?>