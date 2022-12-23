var shareData = new Array;

function sharePositionOpen() {
	utilsCheckPrivileges("subuser") && $("#dialog_share_position").dialog("open")
}

function sharePositionGenerateSU() {
	var e = settingsUserData.email + moment();
	return CryptoJS.MD5(e).toString().toUpperCase()
}

function sharePositionCheck() {
	1 == document.getElementById("dialog_share_position_expire").checked ? document.getElementById("dialog_share_position_expire_dt").disabled = !1 : document.getElementById("dialog_share_position_expire_dt").disabled = !0
}

function sharePositionDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_share_position",
				share_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_share.php",
				data: a,
				success: function (e) {
					"OK" == e && $("#share_position_list_grid").trigger("reloadGrid")
				}
			})
		}
	})
}

function sharePositionDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#share_position_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_share_positions",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_share.php",
					data: a,
					success: function (e) {
						"OK" == e && $("#share_position_list_grid").trigger("reloadGrid")
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function sharePositionProperties(e) {
	switch (e) {
		default:
			var t = e;
			shareData.edit_share_position_id = t;
			var a = {
				cmd: "load_share_position",
				share_id: shareData.edit_share_position_id
			};
			$.ajax({
				type: "POST",
				url: "func/fn_share.php",
				data: a,
				dataType: "json",
				cache: !1,
				success: function (e) {
					document.getElementById("dialog_share_position_active").checked = strToBoolean(e.active), document.getElementById("dialog_share_position_name").value = e.name, document.getElementById("dialog_share_position_email").value = e.email, document.getElementById("dialog_share_position_phone").value = e.phone;
					var t = document.getElementById("dialog_share_position_object_list"),
						a = e.imei.split(",");
					multiselectSetValues(t, a), $("#dialog_share_position_object_list").multipleSelect("refresh");
					var i = strToBoolean(e.expire);
					document.getElementById("dialog_share_position_expire").checked = i, document.getElementById("dialog_share_position_expire_dt").value = 1 == i ? e.expire_dt : "", document.getElementById("dialog_share_position_delete_expired").checked = strToBoolean(e.delete_expired), document.getElementById("dialog_share_position_send_email").checked = !1, document.getElementById("dialog_share_position_send_sms").checked = !1, shareData.share_position_su = e.su, "" == shareData.share_position_su && (shareData.share_position_su = sharePositionGenerateSU()), document.getElementById("dialog_share_position_su").value = gsValues.url_root + "/index.php?su=" + shareData.share_position_su, document.getElementById("dialog_share_position_su_mobile").value = gsValues.url_root + "/index.php?su=" + shareData.share_position_su + "&m=true", sharePositionCheck()
				}
			}), $("#dialog_share_position_properties").dialog("open");
			break;
		case "add":
			shareData.edit_share_position_id = !1, document.getElementById("dialog_share_position_active").checked = !0, document.getElementById("dialog_share_position_name").value = "", document.getElementById("dialog_share_position_email").value = "", document.getElementById("dialog_share_position_phone").value = "", $("#dialog_share_position_object_list option:selected").removeAttr("selected"), $("#dialog_share_position_object_list").multipleSelect("refresh"), document.getElementById("dialog_share_position_expire").checked = !1, document.getElementById("dialog_share_position_expire_dt").value = "", document.getElementById("dialog_share_position_delete_expired").checked = !1, document.getElementById("dialog_share_position_send_email").checked = !0, document.getElementById("dialog_share_position_send_sms").checked = !0, shareData.share_position_su = sharePositionGenerateSU(), document.getElementById("dialog_share_position_su").value = gsValues.url_root + "/index.php?su=" + shareData.share_position_su, document.getElementById("dialog_share_position_su_mobile").value = gsValues.url_root + "/index.php?su=" + shareData.share_position_su + "&m=true", sharePositionCheck(), $("#dialog_share_position_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_share_position_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var i = document.getElementById("dialog_share_position_active").checked,
				o = document.getElementById("dialog_share_position_name").value,
				s = document.getElementById("dialog_share_position_email").value,
				n = document.getElementById("dialog_share_position_phone").value,
				l = multiselectGetValues(document.getElementById("dialog_share_position_object_list")),
				d = document.getElementById("dialog_share_position_expire").checked,
				r = document.getElementById("dialog_share_position_expire_dt").value,
				_ = document.getElementById("dialog_share_position_delete_expired").checked,
				c = document.getElementById("dialog_share_position_send_email").checked,
				g = document.getElementById("dialog_share_position_send_sms").checked;
			if ("" == o) return void notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
			if ("" == l) return void notifyBox("error", la.ERROR, la.AT_LEAST_ONE_OBJECT_SELECTED);
			if (c && !isEmailValid(s)) {
				notifyBox("error", la.ERROR, la.THIS_EMAIL_IS_NOT_VALID);
				break
			}
			if (g && "" == n) {
				notifyBox("error", la.ERROR, la.PHONE_CANT_BE_EMPTY);
				break
			}
			if (1 == d) {
				if ("" == r) return void notifyBox("error", la.ERROR, la.DATE_CANT_BE_EMPTY, !0)
			} else r = "";
			a = {
				cmd: "save_share_position",
				share_id: shareData.edit_share_position_id,
				active: i,
				name: o,
				email: s,
				phone: n,
				imei: l,
				expire: d,
				expire_dt: r,
				delete_expired: _,
				send_email: c,
				send_sms: g,
				su: shareData.share_position_su
			};
			$.ajax({
				type: "POST",
				url: "func/fn_share.php",
				data: a,
				cache: !1,
				success: function (e) {
					"OK" == e && ($("#dialog_share_position_properties").dialog("close"), $("#share_position_list_grid").trigger("reloadGrid"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function tachographOpen() {
	utilsCheckPrivileges("tachograph") && $("#dialog_tachograph").dialog("open")
}
shareData.edit_share_position_id = !1;
var dashboardData = new Array,
	timer_dashboardInit;

function dashboardOpen() {
	utilsCheckPrivileges("dashboard") && $("#dialog_dashboard").dialog("open"), dashboardInit(!1)
}

function dashboardResize() {
	var e = $(window).width() - 30,
		t = $(window).height() - 30;
	$("#dialog_dashboard").dialog("option", "width", e), $("#dialog_dashboard").dialog("option", "height", t), e -= 30, t -= 30, dashboardData.container_height = (t - 36 - 10) / 2, document.getElementById("dialog_dashboard_objects").style.height = dashboardData.container_height + "px", document.getElementById("dialog_dashboard_events").style.height = dashboardData.container_height + "px", null != document.getElementById("dialog_dashboard_tasks") && (document.getElementById("dialog_dashboard_tasks").style.height = dashboardData.container_height + "px"), null != document.getElementById("dialog_dashboard_maintenance") && (document.getElementById("dialog_dashboard_maintenance").style.height = dashboardData.container_height + "px"), document.getElementById("dialog_dashboard_odometer").style.height = dashboardData.container_height + "px", document.getElementById("dialog_dashboard_mileage").style.height = dashboardData.container_height + "px", null != document.getElementById("dashboard_objects_graph_plot") && (document.getElementById("dashboard_objects_graph_plot").style.height = dashboardData.container_height - 30 - 20 + "px"), null != document.getElementById("dashboard_objects_text") && (document.getElementById("dashboard_objects_text").style.height = dashboardData.container_height - 30 - 20 + "px"), null != document.getElementById("dashboard_events_graph_plot") && (document.getElementById("dashboard_events_graph_plot").style.height = dashboardData.container_height - 30 - 20 + "px"), null != document.getElementById("dashboard_events_text") && (document.getElementById("dashboard_events_text").style.height = dashboardData.container_height - 30 - 20 + "px"), null != document.getElementById("dashboard_maintenance_graph_plot") && (document.getElementById("dashboard_maintenance_graph_plot").style.height = dashboardData.container_height - 30 - 20 + "px"), null != document.getElementById("dashboard_maintenance_text") && (document.getElementById("dashboard_maintenance_text").style.height = dashboardData.container_height - 30 - 20 + "px"), null != document.getElementById("dashboard_tasks_graph_plot") && (document.getElementById("dashboard_tasks_graph_plot").style.height = dashboardData.container_height - 30 - 20 + "px"), null != document.getElementById("dashboard_tasks_text") && (document.getElementById("dashboard_tasks_text").style.height = dashboardData.container_height - 30 - 20 + "px"), null != document.getElementById("dashboard_odometer_graph_plot") && (document.getElementById("dashboard_odometer_graph_plot").style.height = dashboardData.container_height - 30 - 20 + "px"), null != document.getElementById("dashboard_odometer_text") && (document.getElementById("dashboard_odometer_text").style.height = dashboardData.container_height - 30 - 20 + "px"), null != document.getElementById("dashboard_mileage_graph_plot") && (document.getElementById("dashboard_mileage_graph_plot").style.height = dashboardData.container_height - 30 - 20 + "px"), null != document.getElementById("dashboard_mileage_text") && (document.getElementById("dashboard_mileage_text").style.height = dashboardData.container_height - 30 - 20 + "px")
}

function dashboardInit(e) {
	1 == $("#dialog_dashboard").dialog("isOpen") ? (e ? (1 == settingsUserData.privileges_maintenance && dashboardInitMaintenance(), 1 == settingsUserData.privileges_tasks && dashboardInitTasks(), dashboardInitOdometer(), dashboardInitMileage()) : (dashboardInitObjects(), dashboardInitEvents(), 1 == settingsUserData.privileges_maintenance && dashboardInitMaintenance(), 1 == settingsUserData.privileges_tasks && dashboardInitTasks(), dashboardInitOdometer(), dashboardInitMileage()), clearTimeout(timer_dashboardInit), timer_dashboardInit = setTimeout("dashboardInit(true);", 1e3 * gsValues.dashboard_refresh)) : clearTimeout(timer_dashboardInit)
}

function dashboardInitObjectsSetResult(e) {
	dashboardData.objects_result = e, dashboardInitObjects()
}

function dashboardInitObjects() {
	if (Object.keys(objectsData).length > 0) {
		var e = [],
			t = 0,
			a = 0,
			i = 0,
			o = 0,
			s = 0;
		for (var n in objectsData) {
			var l = objectsData[n].status;
			0 == l ? t += 1 : "off" == l ? a += 1 : "s" == l ? i += 1 : "m" == l ? o += 1 : "i" == l && (s += 1)
		}
		e.push({
			label: la.NO_DATA,
			data: t
		}), e.push({
			label: la.OFFLINE,
			data: a
		}), e.push({
			label: la.STOPPED,
			data: i
		}), e.push({
			label: la.MOVING,
			data: o
		}), e.push({
			label: la.IDLE,
			data: s
		});
		var d = '<div class="dashboard-container-header">';
		d += '<div class="dashboard-container-header-icon"><span class="icon-objects"></span></div>', d += '<div class="dashboard-container-header-title">' + la.OBJECTS + "</div>", d += '<div class="dashboard-container-header-menu"><a href="#" id="dashboard_objects_action_menu_button"><span class="icon-action2"></span></a></div></div>', d += '<div id="dashboard_objects_graph_plot"></div>', document.getElementById("dialog_dashboard_objects").innerHTML = d, document.getElementById("dashboard_objects_graph_plot").style.height = dashboardData.container_height - 30 - 20 + "px";
		var r = $("#dashboard_objects_graph_plot");
		$.plot(r, e, {
			series: {
				pie: {
					innerRadius: .5,
					show: !0,
					radius: 1,
					label: {
						show: !0,
						radius: .75,
						formatter: function (e, t) {
							if ("percentage" == dashboardData.objects_result) var a = Math.round(t.percent) + "%";
							else a = t.data[0][1];
							return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + e + "<br/>" + a + "</div>"
						},
						background: {
							opacity: .5
						}
					}
				}
			},
			legend: {
				show: !1
			}
		})
	} else {
		d = '<div class="dashboard-container-header">';
		d += '<div class="dashboard-container-header-icon"><span class="icon-objects"></span></div>', d += '<div class="dashboard-container-header-title">' + la.OBJECTS + "</div>", d += '<div class="dashboard-container-header-menu"><a href="#" id="dashboard_objects_action_menu_button"><span class="icon-action2"></span></a></div></div>', d += '<div id="dashboard_objects_text" class="dashboard-container-text">' + la.NO_DATA_HAS_BEEN_COLLECTED_YET + "</div>", document.getElementById("dialog_dashboard_objects").innerHTML = d, document.getElementById("dashboard_objects_text").style.height = dashboardData.container_height - 30 - 20 + "px"
	}
	$("#dashboard_objects_action_menu_button").click(function () {
		return $("#dashboard_events_action_menu").hide(), $("#dashboard_tasks_action_menu").hide(), $("#dashboard_objects_action_menu").toggle().position({
			my: "right top",
			at: "right-5 top+17",
			of: this
		}), $(document).one("click", function () {
			$("#dashboard_objects_action_menu").hide()
		}), !1
	})
}

function dashboardInitEventsSetPeriod(e) {
	dashboardData.events_period = e, dashboardInitEvents()
}

function dashboardInitEvents() {
	if ("today" == dashboardData.events_period) var e = moment().format("YYYY-MM-DD") + " 00:00:00",
		t = moment().add("days", 1).format("YYYY-MM-DD") + " 00:00:00";
	else if ("this_week" == dashboardData.events_period) e = moment().isoWeekday(1).format("YYYY-MM-DD") + " 00:00:00", t = moment().add("days", 1).format("YYYY-MM-DD") + " 00:00:00";
	else if ("this_month" == dashboardData.events_period) e = moment().startOf("month").format("YYYY-MM-DD") + " 00:00:00", t = moment().add("days", 1).format("YYYY-MM-DD") + " 00:00:00";
	var a = {
		cmd: "load_events_data",
		period: dashboardData.events_period,
		dtf: e,
		dtt: t
	};
	$.ajax({
		type: "POST",
		url: "func/fn_dashboard.php",
		data: a,
		dataType: "json",
		cache: !1,
		success: function (e) {
			if (Object.keys(e).length > 0) {
				var t = [];
				for (var a in e) {
					var i = e[a].name,
						o = e[a].count;
					t.push({
						label: i,
						data: o
					})
				}
				var s = la.EVENTS;
				"today" == dashboardData.events_period ? s += " (" + la.TODAY.toLowerCase() + ")" : "this_week" == dashboardData.events_period ? s += " (" + la.THIS_WEEK.toLowerCase() + ")" : "this_month" == dashboardData.events_period && (s += " (" + la.THIS_MONTH.toLowerCase() + ")");
				var n = '<div class="dashboard-container-header">';
				n += '<div class="dashboard-container-header-icon"><span class="icon-route-event"></span></div>', n += '<div class="dashboard-container-header-title">' + s + "</div>", n += '<div class="dashboard-container-header-menu"><a href="#" id="dashboard_events_action_menu_button"><span class="icon-action2"></span></a></div></div>', n += '<div id="dashboard_events_graph_plot"></div>', document.getElementById("dialog_dashboard_events").innerHTML = n, document.getElementById("dashboard_events_graph_plot").style.height = dashboardData.container_height - 30 - 20 + "px";
				var l = $("#dashboard_events_graph_plot");
				$.plot(l, t, {
					series: {
						pie: {
							innerRadius: .5,
							show: !0,
							radius: 1,
							label: {
								show: !0,
								radius: .75,
								formatter: function (e, t) {
									return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + e + "<br/>" + Math.round(t.percent) + "%</div>"
								},
								background: {
									opacity: .5
								}
							}
						}
					},
					legend: {
						show: !1
					}
				})
			} else {
				s = la.EVENTS;
				"today" == dashboardData.events_period ? s += " (" + la.TODAY.toLowerCase() + ")" : "this_week" == dashboardData.events_period ? s += " (" + la.THIS_WEEK.toLowerCase() + ")" : "this_month" == dashboardData.events_period && (s += " (" + la.THIS_MONTH.toLowerCase() + ")");
				n = '<div class="dashboard-container-header">';
				n += '<div class="dashboard-container-header-icon"><span class="icon-route-event"></span></div>', n += '<div class="dashboard-container-header-title">' + s + "</div>", n += '<div class="dashboard-container-header-menu"><a href="#" id="dashboard_events_action_menu_button"><span class="icon-action2"></span></a></div></div>', n += '<div id="dashboard_events_text" class="dashboard-container-text">' + la.NO_DATA_HAS_BEEN_COLLECTED_YET + "</div>", document.getElementById("dialog_dashboard_events").innerHTML = n, document.getElementById("dashboard_events_text").style.height = dashboardData.container_height - 30 - 20 + "px"
			}
			$("#dashboard_events_action_menu_button").click(function () {
				return $("#dashboard_objects_action_menu").hide(), $("#dashboard_tasks_action_menu").hide(), $("#dashboard_events_action_menu").toggle().position({
					my: "right top",
					at: "right-5 top+17",
					of: this
				}), $(document).one("click", function () {
					$("#dashboard_events_action_menu").hide()
				}), !1
			})
		}
	})
}

function dashboardInitMaintenance() {
	$.ajax({
		type: "POST",
		url: "func/fn_dashboard.php",
		data: {
			cmd: "load_maintenance_data"
		},
		dataType: "json",
		cache: !1,
		success: function (e) {
			if (Object.keys(e).length > 0) {
				var t = [],
					a = 0,
					i = 0;
				for (var o in e) {
					var s = e[o].odometer_left_val,
						n = e[o].engine_hours_left_val,
						l = e[o].days_left_val;
					s < 0 || n < 0 || l < 0 ? i += 1 : a += 1
				}
				t.push({
					label: la.VALID,
					data: a,
					color: "#4DA74D"
				}), t.push({
					label: la.EXPIRED,
					data: i,
					color: "#CB4B4B"
				});
				var d = '<div class="dashboard-container-header">';
				d += '<a href="#" onclick="dashboardOpenMaintenance();"><div class="dashboard-container-header-icon"><span class="icon-maintenance"></span></div><div class="dashboard-container-header-title">' + la.MAINTENANCE + "</div></a></div>", d += '<div id="dashboard_maintenance_graph_plot"></div>', document.getElementById("dialog_dashboard_maintenance").innerHTML = d, document.getElementById("dashboard_maintenance_graph_plot").style.height = dashboardData.container_height - 30 - 20 + "px";
				var r = $("#dashboard_maintenance_graph_plot");
				$.plot(r, t, {
					series: {
						pie: {
							innerRadius: .5,
							show: !0,
							radius: 1,
							label: {
								show: !0,
								radius: .75,
								formatter: function (e, t) {
									return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + e + "<br/>" + Math.round(t.percent) + "%</div>"
								},
								background: {
									opacity: .5
								}
							}
						}
					},
					legend: {
						show: !1
					}
				})
			} else {
				d = '<div class="dashboard-container-header">';
				d += '<a href="#" onclick="dashboardOpenMaintenance();"><div class="dashboard-container-header-icon"><span class="icon-maintenance"></span></div><div class="dashboard-container-header-title">' + la.MAINTENANCE + "</div></a></div>", d += '<div id="dashboard_maintenance_text" class="dashboard-container-text">' + la.NO_DATA_HAS_BEEN_COLLECTED_YET + "</div>", document.getElementById("dialog_dashboard_maintenance").innerHTML = d, document.getElementById("dashboard_maintenance_text").style.height = dashboardData.container_height - 30 - 20 + "px"
			}
		}
	})
}

function dashboardInitTasksSetPeriod(e) {
	dashboardData.tasks_period = e, dashboardInitTasks()
}

function dashboardInitTasks() {
	if ("today" == dashboardData.tasks_period) var e = moment().format("YYYY-MM-DD") + " 00:00:00",
		t = moment().add("days", 1).format("YYYY-MM-DD") + " 00:00:00";
	else if ("this_week" == dashboardData.tasks_period) e = moment().isoWeekday(1).format("YYYY-MM-DD") + " 00:00:00", t = moment().add("days", 1).format("YYYY-MM-DD") + " 00:00:00";
	else if ("this_month" == dashboardData.tasks_period) e = moment().startOf("month").format("YYYY-MM-DD") + " 00:00:00", t = moment().add("days", 1).format("YYYY-MM-DD") + " 00:00:00";
	var a = {
		cmd: "load_tasks_data",
		dtf: e,
		dtt: t
	};
	$.ajax({
		type: "POST",
		url: "func/fn_dashboard.php",
		data: a,
		dataType: "json",
		cache: !1,
		success: function (e) {
			if (Object.keys(e).length > 0) {
				var t = [];
				for (var a in e) {
					var i = e[a].name,
						o = e[a].count;
					color = "", 0 == a ? color = "#AFD8F8" : 1 == a ? color = "#EDC240" : 2 == a ? color = "#4DA74D" : 3 == a && (color = "#CB4B4B"), t.push({
						data: [
							[i, o]
						],
						color: color
					})
				}
				var s = la.TASKS;
				"today" == dashboardData.tasks_period ? s += " (" + la.TODAY.toLowerCase() + ")" : "this_week" == dashboardData.tasks_period ? s += " (" + la.THIS_WEEK.toLowerCase() + ")" : "this_month" == dashboardData.tasks_period && (s += " (" + la.THIS_MONTH.toLowerCase() + ")");
				var n = '<div class="dashboard-container-header">';
				n += '<a href="#" onclick="dashboardOpenTasks();"><div class="dashboard-container-header-icon"><span class="icon-tasks"></span></div>', n += '<div class="dashboard-container-header-title">' + s + "</div></a>", n += '<div class="dashboard-container-header-menu"><a href="#" id="dashboard_tasks_action_menu_button"><span class="icon-action2"></span></a></div></div>', n += '<div id="dashboard_tasks_graph_plot" class="dashboard-container-graph-plot"></div>', document.getElementById("dialog_dashboard_tasks").innerHTML = n, document.getElementById("dashboard_tasks_graph_plot").style.height = dashboardData.container_height - 30 - 20 + "px";
				var l = $("#dashboard_tasks_graph_plot");
				$.plot(l, t, {
					series: {
						bars: {
							show: !0,
							fill: !0,
							barWidth: .5,
							lineWidth: 0,
							align: "center",
							fillColor: {
								colors: [{
									opacity: 1
								}, {
									opacity: 1
								}]
							}
						}
					},
					xaxis: {
						mode: "categories",
						showTicks: !1,
						gridLines: !1
					}
				})
			} else {
				s = la.TASKS;
				"today" == dashboardData.tasks_period ? s += " (" + la.TODAY.toLowerCase() + ")" : "this_week" == dashboardData.tasks_period ? s += " (" + la.THIS_WEEK.toLowerCase() + ")" : "this_month" == dashboardData.tasks_period && (s += " (" + la.THIS_MONTH.toLowerCase() + ")");
				n = '<div class="dashboard-container-header">';
				n += '<a href="#" onclick="dashboardOpenTasks();"><div class="dashboard-container-header-icon"><span class="icon-tasks"></span></div>', n += '<div class="dashboard-container-header-title">' + s + "</div></a>", n += '<div class="dashboard-container-header-menu"><a href="#" id="dashboard_tasks_action_menu_button"><span class="icon-action2"></span></a></div></div>', n += '<div id="dashboard_tasks_text" class="dashboard-container-text">' + la.NO_DATA_HAS_BEEN_COLLECTED_YET + "</div>", document.getElementById("dialog_dashboard_tasks").innerHTML = n, document.getElementById("dashboard_tasks_text").style.height = dashboardData.container_height - 30 - 20 + "px"
			}
			$("#dashboard_tasks_action_menu_button").click(function () {
				return $("#dashboard_objects_action_menu").hide(), $("#dashboard_events_action_menu").hide(), $("#dashboard_tasks_action_menu").toggle().position({
					my: "right top",
					at: "right-5 top+17",
					of: this
				}), $(document).one("click", function () {
					$("#dashboard_tasks_action_menu").hide()
				}), !1
			})
		}
	})
}

function dashboardInitOdometer() {
	$.ajax({
		type: "POST",
		url: "func/fn_dashboard.php",
		data: {
			cmd: "load_odometer_data"
		},
		dataType: "json",
		cache: !1,
		success: function (e) {
			if (Object.keys(e).length > 0) {
				var t = [];
				for (var a in e) t.push({
					label: e[a].name,
					data: [
						[e[a].name, e[a].odometer]
					]
				});
				var i = '<div class="dashboard-container-header">';
				i += '<div class="dashboard-container-header-icon"><span class="icon-odometer"></span></div><div class="dashboard-container-header-title">' + la.ODOMETER_TOP_10 + " (" + la.UNIT_DISTANCE + ")</div></div>", i += '<div id="dashboard_odometer_graph_plot" class="dashboard-container-graph-plot"></div>', document.getElementById("dialog_dashboard_odometer").innerHTML = i, document.getElementById("dashboard_odometer_graph_plot").style.height = dashboardData.container_height - 30 - 20 + "px";
				var o = $("#dashboard_odometer_graph_plot");
				$.plot(o, t, {
					legend: {
						show: !0,
						margin: 10,
						backgroundOpacity: .5,
						noColumns: 2,
						position: "ne",
						labelFormatter: function (e, t) {
							return '<div style="color:#444444">' + e + "</div>"
						}
					},
					series: {
						bars: {
							show: !0,
							fill: !0,
							barWidth: .5,
							lineWidth: 0,
							align: "center",
							fillColor: {
								colors: [{
									opacity: 1
								}, {
									opacity: 1
								}]
							}
						}
					},
					yaxes: {
						min: 0
					},
					xaxis: {
						show: !1,
						mode: "categories",
						showTicks: !1,
						gridLines: !1
					}
				})
			} else {
				i = '<div class="dashboard-container-header">';
				i += '<div class="dashboard-container-header-icon"><span class="icon-odometer"></span></div><div class="dashboard-container-header-title">' + la.ODOMETER + " (" + la.UNIT_DISTANCE + ")</div></div>", i += '<div id="dashboard_odometer_text" class="dashboard-container-text">' + la.NO_DATA_HAS_BEEN_COLLECTED_YET + "</div>", document.getElementById("dialog_dashboard_odometer").innerHTML = i, document.getElementById("dashboard_odometer_text").style.height = dashboardData.container_height - 30 - 20 + "px"
			}
		}
	})
}

function dashboardInitMileage() {
	$.ajax({
		type: "POST",
		url: "func/fn_dashboard.php",
		data: {
			cmd: "load_mileage_data"
		},
		dataType: "json",
		cache: !1,
		success: function (e) {
			if (Object.keys(e).length > 0) {
				var t = [];
				t.push([
					[e.mileage_dt_5, e.mileage_5]
				]), t.push([
					[e.mileage_dt_4, e.mileage_4]
				]), t.push([
					[e.mileage_dt_3, e.mileage_3]
				]), t.push([
					[e.mileage_dt_2, e.mileage_2]
				]), t.push([
					[e.mileage_dt_1, e.mileage_1]
				]);
				var a = '<div class="dashboard-container-header">';
				a += '<div class="dashboard-container-header-icon"><span class="icon-odometer"></span></div><div class="dashboard-container-header-title">' + la.MILEAGE + " (" + la.UNIT_DISTANCE + ")</div></div>", a += '<div id="dashboard_mileage_graph_plot" class="dashboard-container-graph-plot"></div>', document.getElementById("dialog_dashboard_mileage").innerHTML = a, document.getElementById("dashboard_mileage_graph_plot").style.height = dashboardData.container_height - 30 - 20 + "px";
				var i = $("#dashboard_mileage_graph_plot");
				$.plot(i, t, {
					series: {
						bars: {
							show: !0,
							fill: !0,
							barWidth: .5,
							lineWidth: 0,
							align: "center",
							fillColor: {
								colors: [{
									opacity: 1
								}, {
									opacity: 1
								}]
							}
						}
					},
					yaxes: {
						min: 0
					},
					xaxis: {
						mode: "categories",
						showTicks: !1,
						gridLines: !1
					}
				})
			} else {
				a = '<div class="dashboard-container-header">';
				a += '<div class="dashboard-container-header-icon"><span class="icon-odometer"></span></div><div class="dashboard-container-header-title">' + la.MILEAGE + " (" + la.UNIT_DISTANCE + ")</div></div>", a += '<div id="dashboard_mileage_text" class="dashboard-container-text">' + la.NO_DATA_HAS_BEEN_COLLECTED_YET + "</div>", document.getElementById("dialog_dashboard_mileage").innerHTML = a, document.getElementById("dashboard_mileage_text").style.height = dashboardData.container_height - 30 - 20 + "px"
			}
		}
	})
}

function dashboardOpenMaintenance() {
	maintenanceOpen()
}

function dashboardOpenTasks() {
	tasksOpen()
}

function dtcOpen() {
	utilsCheckPrivileges("dtc") && ($("#dialog_dtc").bind("resize", function () {
		$("#dtc_list_grid").setGridHeight($("#dialog_dtc").height() - 133)
	}).trigger("resize"), $("#dialog_dtc").bind("resize", function () {
		$("#dtc_list_grid").setGridWidth($("#dialog_dtc").width())
	}).trigger("resize"), $("#dialog_dtc").dialog("open"))
}

function dtcClose() {
	$("#dialog_dtc").unbind("resize")
}

function dtcShow() {
	var e = "func/fn_dtc.php?cmd=load_dtc_list",
		t = document.getElementById("dialog_dtc_object_list").value,
		a = document.getElementById("dialog_dtc_date_from").value + " " + document.getElementById("dialog_dtc_hour_from").value + ":" + document.getElementById("dialog_dtc_minute_from").value + ":00",
		i = document.getElementById("dialog_dtc_date_to").value + " " + document.getElementById("dialog_dtc_hour_to").value + ":" + document.getElementById("dialog_dtc_minute_to").value + ":00";
	"" != t && (e += "&imei=" + t), a != i && (e += "&dtf=" + a + "&dtt=" + i), $("#dtc_list_grid").jqGrid("setGridParam", {
		url: e
	}).trigger("reloadGrid")
}

function dtcDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_record",
				dtc_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_dtc.php",
				data: a,
				success: function (e) {
					"OK" == e && dtcShow()
				}
			})
		}
	})
}

function dtcDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#dtc_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_records",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_dtc.php",
					data: a,
					success: function (e) {
						"OK" == e && dtcShow()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function dtcDeleteAll() {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_DTC_RECORDS, function (e) {
		if (e) {
			$.ajax({
				type: "POST",
				url: "func/fn_dtc.php",
				data: {
					cmd: "delete_all_records"
				},
				success: function (e) {
					"OK" == e && dtcShow()
				}
			})
		}
	})
}

function dtcExportCSV() {
	var e = "func/fn_export.php?format=dtc_csv",
		t = document.getElementById("dialog_dtc_object_list").value,
		a = document.getElementById("dialog_dtc_date_from").value + " " + document.getElementById("dialog_dtc_hour_from").value + ":" + document.getElementById("dialog_dtc_minute_from").value + ":00",
		i = document.getElementById("dialog_dtc_date_to").value + " " + document.getElementById("dialog_dtc_hour_to").value + ":" + document.getElementById("dialog_dtc_minute_to").value + ":00";
	"" != t && (e += "&imei=" + t), a != i && (e += "&dtf=" + a + "&dtt=" + i), window.location = e
}

function maintenanceOpen() {
	utilsCheckPrivileges("maintenance") && ($("#dialog_maintenance").bind("resize", function () {
		$("#maintenance_list_grid").setGridHeight($("#dialog_maintenance").height() - 81)
	}).trigger("resize"), $("#dialog_maintenance").bind("resize", function () {
		$("#maintenance_list_grid").setGridWidth($("#dialog_maintenance").width())
	}).trigger("resize"), $("#dialog_maintenance").dialog("open"), $("#maintenance_list_grid").trigger("reloadGrid"))
}

function maintenanceClose() {
	$("#dialog_maintenance").unbind("resize")
}

function maintenanceObjectServiceProperties(e, t) {
	settingsEditData.object_imei = e, settingsObjectServiceProperties(t)
}

function maintenanceServiceProperties(e) {
	switch (e) {
		case "add":
			$("#dialog_maintenance_service_object_list option:selected").removeAttr("selected"), $("#dialog_maintenance_service_object_list").multipleSelect("refresh"), document.getElementById("dialog_maintenance_service_name").value = "", document.getElementById("dialog_maintenance_service_data_list").checked = !1, document.getElementById("dialog_maintenance_service_popup").checked = !1, document.getElementById("dialog_maintenance_service_odo").checked = !1, document.getElementById("dialog_maintenance_service_odo_interval").value = "", document.getElementById("dialog_maintenance_service_odo_last").value = "", document.getElementById("dialog_maintenance_service_engh").checked = !1, document.getElementById("dialog_maintenance_service_engh_interval").value = "", document.getElementById("dialog_maintenance_service_engh_last").value = "", document.getElementById("dialog_maintenance_service_days").checked = !1, document.getElementById("dialog_maintenance_service_days_interval").value = "", document.getElementById("dialog_maintenance_service_days_last").value = "", document.getElementById("dialog_maintenance_service_odo_left").checked = !1, document.getElementById("dialog_maintenance_service_odo_left_num").value = "", document.getElementById("dialog_maintenance_service_engh_left").checked = !1, document.getElementById("dialog_maintenance_service_engh_left_num").value = "", document.getElementById("dialog_maintenance_service_days_left").checked = !1, document.getElementById("dialog_maintenance_service_days_left_num").value = "", document.getElementById("dialog_maintenance_service_update_last").checked = !1, maintenanceServiceCheck(), $("#dialog_maintenance_service_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_maintenance_service_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var t = document.getElementById("dialog_maintenance_service_name").value,
				a = document.getElementById("dialog_maintenance_service_object_list"),
				i = document.getElementById("dialog_maintenance_service_data_list").checked,
				o = document.getElementById("dialog_maintenance_service_popup").checked,
				s = document.getElementById("dialog_maintenance_service_odo").checked,
				n = document.getElementById("dialog_maintenance_service_odo_interval").value,
				l = document.getElementById("dialog_maintenance_service_odo_last").value,
				d = document.getElementById("dialog_maintenance_service_engh").checked,
				r = document.getElementById("dialog_maintenance_service_engh_interval").value,
				_ = document.getElementById("dialog_maintenance_service_engh_last").value,
				c = document.getElementById("dialog_maintenance_service_days").checked,
				g = document.getElementById("dialog_maintenance_service_days_interval").value,
				m = document.getElementById("dialog_maintenance_service_days_last").value,
				u = document.getElementById("dialog_maintenance_service_odo_left").checked,
				p = document.getElementById("dialog_maintenance_service_odo_left_num").value,
				y = document.getElementById("dialog_maintenance_service_engh_left").checked,
				h = document.getElementById("dialog_maintenance_service_engh_left_num").value,
				v = document.getElementById("dialog_maintenance_service_days_left").checked,
				b = document.getElementById("dialog_maintenance_service_days_left_num").value,
				E = document.getElementById("dialog_maintenance_service_update_last").checked;
			if ("" == t) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if (!multiselectIsSelected(a)) return void notifyBox("error", la.ERROR, la.AT_LEAST_ONE_OBJECT_SELECTED);
			if (1 == s && ("" == n || "" == l)) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if (1 == d && ("" == r || "" == _)) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if (1 == c && ("" == g || "" == m)) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if (parseFloat(n) <= parseFloat(p) && 1 == u) {
				notifyBox("error", la.ERROR, la.INTERVAL_VALUE_SHOULD_BE_GREATER_THAN_LEFT_VALUE);
				break
			}
			if (parseFloat(r) <= parseFloat(h) && 1 == y) {
				notifyBox("error", la.ERROR, la.INTERVAL_VALUE_SHOULD_BE_GREATER_THAN_LEFT_VALUE);
				break
			}
			if (parseFloat(g) <= parseFloat(b) && 1 == v) {
				notifyBox("error", la.ERROR, la.INTERVAL_VALUE_SHOULD_BE_GREATER_THAN_LEFT_VALUE);
				break
			}
			var f = {
				cmd: "save_service",
				name: t,
				imei: multiselectGetValues(a),
				data_list: i,
				popup: o,
				odo: s,
				odo_interval: n,
				odo_last: l,
				engh: d,
				engh_interval: r,
				engh_last: _,
				days: c,
				days_interval: g,
				days_last: m,
				odo_left: u,
				odo_left_num: p,
				engh_left: y,
				engh_left_num: h,
				days_left: v,
				days_left_num: b,
				update_last: E
			};
			$.ajax({
				type: "POST",
				url: "func/fn_maintenance.php",
				data: f,
				cache: !1,
				success: function (e) {
					"OK" == e && (settingsReloadObjects(), $("#dialog_maintenance_service_properties").dialog("close"), $("#maintenance_list_grid").trigger("reloadGrid"))
				}
			})
	}
}

function maintenanceServiceDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_service",
				service_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_maintenance.php",
				data: a,
				success: function (e) {
					"OK" == e && $("#maintenance_list_grid").trigger("reloadGrid")
				}
			})
		}
	})
}

function maintenanceServiceDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#maintenance_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_services",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_maintenance.php",
					data: a,
					success: function (e) {
						"OK" == e && $("#maintenance_list_grid").trigger("reloadGrid")
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function maintenanceServiceCheck() {
	1 == document.getElementById("dialog_maintenance_service_odo").checked ? (document.getElementById("dialog_maintenance_service_odo_interval").disabled = !1, document.getElementById("dialog_maintenance_service_odo_last").disabled = !1, document.getElementById("dialog_maintenance_service_odo_left").disabled = !1, document.getElementById("dialog_maintenance_service_odo_left_num").disabled = !1) : (document.getElementById("dialog_maintenance_service_odo_interval").disabled = !0, document.getElementById("dialog_maintenance_service_odo_last").disabled = !0, document.getElementById("dialog_maintenance_service_odo_left").disabled = !0, document.getElementById("dialog_maintenance_service_odo_left_num").disabled = !0), 1 == document.getElementById("dialog_maintenance_service_engh").checked ? (document.getElementById("dialog_maintenance_service_engh_interval").disabled = !1, document.getElementById("dialog_maintenance_service_engh_last").disabled = !1, document.getElementById("dialog_maintenance_service_engh_left").disabled = !1, document.getElementById("dialog_maintenance_service_engh_left_num").disabled = !1) : (document.getElementById("dialog_maintenance_service_engh_interval").disabled = !0, document.getElementById("dialog_maintenance_service_engh_last").disabled = !0, document.getElementById("dialog_maintenance_service_engh_left").disabled = !0, document.getElementById("dialog_maintenance_service_engh_left_num").disabled = !0), 1 == document.getElementById("dialog_maintenance_service_days").checked ? (document.getElementById("dialog_maintenance_service_days_interval").disabled = !1, document.getElementById("dialog_maintenance_service_days_last").disabled = !1, document.getElementById("dialog_maintenance_service_days_left").disabled = !1, document.getElementById("dialog_maintenance_service_days_left_num").disabled = !1) : (document.getElementById("dialog_maintenance_service_days_interval").disabled = !0, document.getElementById("dialog_maintenance_service_days_last").disabled = !0, document.getElementById("dialog_maintenance_service_days_left").disabled = !0, document.getElementById("dialog_maintenance_service_days_left_num").disabled = !0), 1 == document.getElementById("dialog_maintenance_service_odo").checked || 1 == document.getElementById("dialog_maintenance_service_engh").checked || 1 == document.getElementById("dialog_maintenance_service_days").checked ? document.getElementById("dialog_maintenance_service_update_last").disabled = !1 : document.getElementById("dialog_maintenance_service_update_last").disabled = !0
}
dashboardData.container_height = 0, dashboardData.objects_result = "percentage", dashboardData.events_period = "today", dashboardData.tasks_period = "today";
var expensesData = new Array;

function expensesOpen() {
	utilsCheckPrivileges("expenses") && ($("#dialog_expenses").bind("resize", function () {
		$("#expenses_list_grid").setGridHeight($("#dialog_expenses").height() - 81)
	}).trigger("resize"), $("#dialog_expenses").bind("resize", function () {
		$("#expenses_list_grid").setGridWidth($("#dialog_expenses").width())
	}).trigger("resize"), $("#dialog_expenses").dialog("open"), $("#expenses_list_grid").trigger("reloadGrid"))
}

function expensesClose() {
	$("#dialog_expenses").unbind("resize")
}

function expensesObjectChange() {
	var e = document.getElementById("dialog_expense_object_list").value;
	void 0 !== settingsObjectData[e] && (document.getElementById("dialog_expense_odo").value = settingsObjectData[e].odometer, document.getElementById("dialog_expense_engh").value = settingsObjectData[e].engine_hours)
}

function expensesDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_expense",
				expense_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_expenses.php",
				data: a,
				success: function (e) {
					"OK" == e && $("#expenses_list_grid").trigger("reloadGrid")
				}
			})
		}
	})
}

function expensesDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#expenses_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_expenses",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_expenses.php",
					data: a,
					success: function (e) {
						"OK" == e && $("#expenses_list_grid").trigger("reloadGrid")
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function expensesProperties(e) {
	switch (e) {
		default:
			var t = e;
			expensesData.edit_expense_id = t;
			var a = {
				cmd: "load_expense",
				expense_id: expensesData.edit_expense_id
			};
			$.ajax({
				type: "POST",
				url: "func/fn_expenses.php",
				data: a,
				dataType: "json",
				cache: !1,
				success: function (e) {
					document.getElementById("dialog_expense_name").value = e.name, document.getElementById("dialog_expense_object_list").value = e.imei, $("#dialog_expense_object_list").multipleSelect("refresh"), document.getElementById("dialog_expense_date").value = e.dt_expense, document.getElementById("dialog_expense_quantity").value = e.quantity, document.getElementById("dialog_expense_cost").value = e.cost, document.getElementById("dialog_expense_supplier").value = e.supplier, document.getElementById("dialog_expense_buyer").value = e.buyer, document.getElementById("dialog_expense_odo").value = e.odometer, document.getElementById("dialog_expense_engh").value = e.engine_hours, document.getElementById("dialog_expense_desc").value = e.desc
				}
			}), $("#dialog_expense_properties").dialog("open");
			break;
		case "add":
			expensesData.edit_expense_id = !1, document.getElementById("dialog_expense_name").value = "", $("#dialog_expense_object_list option:selected").removeAttr("selected"), $("#dialog_expense_object_list").multipleSelect("refresh"), document.getElementById("dialog_expense_date").value = moment().format("YYYY-MM-DD"), document.getElementById("dialog_expense_quantity").value = "0", document.getElementById("dialog_expense_cost").value = "0", document.getElementById("dialog_expense_supplier").value = "", document.getElementById("dialog_expense_buyer").value = "", document.getElementById("dialog_expense_odo").value = "", document.getElementById("dialog_expense_engh").value = "", document.getElementById("dialog_expense_desc").value = "", expensesObjectChange(), $("#dialog_expense_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_expense_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var i = document.getElementById("dialog_expense_name").value,
				o = document.getElementById("dialog_expense_object_list").value,
				s = document.getElementById("dialog_expense_date").value,
				n = document.getElementById("dialog_expense_quantity").value,
				l = document.getElementById("dialog_expense_cost").value,
				d = document.getElementById("dialog_expense_supplier").value,
				r = document.getElementById("dialog_expense_buyer").value,
				_ = document.getElementById("dialog_expense_odo").value,
				c = document.getElementById("dialog_expense_engh").value,
				g = document.getElementById("dialog_expense_desc").value;
			if ("" == i) return void notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
			if ("" == o) {
				notifyBox("error", la.ERROR, la.NO_OBJECT_SELECTED);
				break
			}
			if ("" == s) return void notifyBox("error", la.ERROR, la.DATE_CANT_BE_EMPTY);
			a = {
				cmd: "save_expense",
				expense_id: expensesData.edit_expense_id,
				name: i,
				imei: o,
				date: s,
				quantity: n,
				cost: l,
				supplier: d,
				buyer: r,
				odometer: _,
				engine_hours: c,
				desc: g
			};
			$.ajax({
				type: "POST",
				url: "func/fn_expenses.php",
				data: a,
				cache: !1,
				success: function (e) {
					"OK" == e && ($("#dialog_expense_properties").dialog("close"), $("#expenses_list_grid").trigger("reloadGrid"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function datalistBottomResize() {
	void 0 !== settingsUserData && "bottom_panel" == settingsUserData.datalist && ("none" == document.getElementById("side_panel").style.display ? ($("#bottom_panel_datalist_object_data_list").css("width", $(window).width() - 24), $("#bottom_panel_datalist_event_data_list").css("width", $(window).width() - 24), $("#bottom_panel_datalist_route_data_list").css("width", $(window).width() - 24)) : ($("#bottom_panel_datalist_object_data_list").css("width", $(window).width() - 384), $("#bottom_panel_datalist_event_data_list").css("width", $(window).width() - 384), $("#bottom_panel_datalist_route_data_list").css("width", $(window).width() - 384)), $("#bottom_panel_datalist_object_data_list").css("height", guiDragbars.bottom_panel - 51), $("#bottom_panel_datalist_event_data_list").css("height", guiDragbars.bottom_panel - 51), $("#bottom_panel_datalist_route_data_list").css("height", guiDragbars.bottom_panel - 51))
}

function datalistBottomSwitch(e) {
	if ("bottom_panel" == settingsUserData.datalist) switch (e) {
		case "object":
			document.getElementById("bottom_panel_datalist_object_data_list").style.display = "", document.getElementById("bottom_panel_datalist_event_data_list").style.display = "none", document.getElementById("bottom_panel_datalist_route_data_list").style.display = "none";
			break;
		case "event":
			document.getElementById("bottom_panel_datalist_object_data_list").style.display = "none", document.getElementById("bottom_panel_datalist_event_data_list").style.display = "", document.getElementById("bottom_panel_datalist_route_data_list").style.display = "none";
			break;
		case "route":
			document.getElementById("bottom_panel_datalist_object_data_list").style.display = "none", document.getElementById("bottom_panel_datalist_event_data_list").style.display = "none", document.getElementById("bottom_panel_datalist_route_data_list").style.display = ""
	}
}

function datalistBottomShowData(e, t, a) {
	1 != gsValues.datalist_first_show || "object" != e && "event" != e || (showBottomPanel(), gsValues.datalist_first_show = !1);
	var o = "odd",
		s = "",
		n = "",
		l = settingsUserData.datalist_items.split(",");
	switch (e) {
		case "object":
			n = "bottom_panel_datalist_object_data_list";
			break;
		case "event":
			n = "bottom_panel_datalist_event_data_list";
			break;
		case "route":
			n = "bottom_panel_datalist_route_data_list"
	}
	if (document.getElementById(n).innerHTML = "", "" != a) {
		var d = new Array;
		switch (e) {
			case "object":
				if (-1 !== l.indexOf("odometer")) - 1 != (m = getObjectOdometer(t, !1)) && d.push({
					icon: "icon-odometer",
					name: la.ODOMETER,
					value: m + " " + la.UNIT_DISTANCE
				});
				if (-1 !== l.indexOf("engine_hours")) - 1 != (u = getObjectEngineHours(t, !1)) && d.push({
					icon: "icon-engine-hours",
					name: la.ENGINE_HOURS,
					value: u
				});
				if (-1 !== l.indexOf("status")) {
					var r = objectsData[t].status_string;
					"" != r && d.push({
						icon: "icon-status",
						name: la.STATUS,
						value: r
					})
				}
				var _ = settingsObjectData[t].custom_fields;
				for (var c in _) {
					var g = _[c];
					"true" == g.data_list && d.push({
						icon: "icon-default-custom-fields",
						name: g.name,
						value: textToLinks(g.value)
					})
				}
				break;
			case "event":
			case "route":
				var m, u;
				if (-1 !== l.indexOf("odometer")) - 1 != (m = getObjectOdometer(t, a.params)) && d.push({
					icon: "icon-odometer",
					name: la.ODOMETER,
					value: m + " " + la.UNIT_DISTANCE
				});
				if (-1 !== l.indexOf("engine_hours")) - 1 != (u = getObjectEngineHours(t, a.params)) && d.push({
					icon: "icon-engine-hours",
					name: la.ENGINE_HOURS,
					value: u
				})
		}
		if (-1 !== l.indexOf("model")) {
			var p = settingsObjectData[t].model;
			"" != p && d.push({
				icon: "icon-model",
				name: la.MODEL,
				value: p
			})
		}
		if (-1 !== l.indexOf("vin")) {
			var y = settingsObjectData[t].vin;
			"" != y && d.push({
				icon: "icon-vin",
				name: la.VIN,
				value: y
			})
		}
		if (-1 !== l.indexOf("plate_number")) {
			var h = settingsObjectData[t].plate_number;
			"" != h && d.push({
				icon: "icon-plate-number",
				name: la.PLATE,
				value: h
			})
		}
		if (-1 !== l.indexOf("sim_number") && 1 == gsValues.sim_number) {
			var v = settingsObjectData[t].sim_number;
			"" != v && d.push({
				icon: "icon-sim",
				name: la.SIM_CARD_NUMBER,
				value: v
			})
		}
		if (-1 !== l.indexOf("driver")) {
			var b = getDriver(t, a.params);
			if (0 != b) {
				var E = '<a href="#" onclick="utilsShowDriverInfo(\'' + b.driver_id + "');\">" + b.name + "</a>";
				d.push({
					icon: "icon-user",
					name: la.DRIVER,
					value: E
				})
			}
		}
		if (-1 !== l.indexOf("trailer")) {
			var f = getTrailer(t, a.params);
			if (0 != f) {
				var I = '<a href="#" onclick="utilsShowTrailerInfo(\'' + f.trailer_id + "');\">" + f.name + "</a>";
				d.push({
					icon: "icon-trailer",
					name: la.TRAILER,
					value: I
				})
			}
		}
		d = sortArrayByElement(d, "name");
		var B = "";
		for (i = 0; i < d.length; i += 1) {
			B += datalistBottomAddItem(o = "odd" == o ? "even" : "odd", (M = d[i]).icon, M.name, M.value)
		}
		s += B;
		var D = new Array;
		switch (e) {
			case "object":
			case "event":
				-1 !== l.indexOf("time_position") && D.push({
					icon: "icon-time",
					name: la.TIME_POSITION,
					value: a.dt_tracker
				}), -1 !== l.indexOf("time_server") && D.push({
					icon: "icon-time",
					name: la.TIME_SERVER,
					value: a.dt_server
				})
		}
		switch (e) {
			case "object":
				if (-1 !== l.indexOf("address") && 1 == gsValues.address_display_object_data_list) {
					geocoderGetAddress(a.lat, a.lng, function (e) {
						document.getElementById(n + "_address").innerHTML = e, document.getElementById(n + "_address").title = e, objectsData[t].address = e
					});
					var O = '<span id="' + n + '_address">' + objectsData[t].address + "</span>";
					D.push({
						icon: "icon-address",
						name: la.ADDRESS,
						value: O
					})
				}
				break;
			case "event":
				if (-1 !== l.indexOf("address") && 1 == gsValues.address_display_event_data_list) {
					geocoderGetAddress(a.lat, a.lng, function (e) {
						document.getElementById(n + "_address").innerHTML = e, document.getElementById(n + "_address").title = e, objectsData[t].address = e
					});
					O = '<span id="' + n + '_address">' + objectsData[t].address + "</span>";
					D.push({
						icon: "icon-address",
						name: la.ADDRESS,
						value: O
					})
				}
				break;
			case "route":
				if (-1 !== l.indexOf("address") && 1 == gsValues.address_display_history_route_data_list) {
					geocoderGetAddress(a.lat, a.lng, function (e) {
						document.getElementById(n + "_address").innerHTML = e, document.getElementById(n + "_address").title = e, objectsData[t].address = e
					});
					O = '<span id="' + n + '_address">' + objectsData[t].address + "</span>";
					D.push({
						icon: "icon-address",
						name: la.ADDRESS,
						value: O
					})
				}
		}
		if (-1 !== l.indexOf("position") && D.push({
			icon: "icon-marker",
			name: la.POSITION,
			value: urlPosition(a.lat, a.lng)
		}), -1 !== l.indexOf("speed") && D.push({
			icon: "icon-speed",
			name: la.SPEED,
			value: a.speed + " " + la.UNIT_SPEED
		}), -1 !== l.indexOf("altitude") && D.push({
			icon: "icon-altitude ",
			name: la.ALTITUDE,
			value: a.altitude + " " + la.UNIT_HEIGHT
		}), -1 !== l.indexOf("angle") && D.push({
			icon: "icon-angle ",
			name: la.ANGLE,
			value: a.angle + " &deg;"
		}), -1 !== l.indexOf("nearest_zone")) {
			var k = getNearestZone(t, a.lat, a.lng);
			"" != k.name && D.push({
				icon: "icon-nearest-zone",
				name: la.NEAREST_ZONE,
				value: k.name + " (" + k.distance + ")"
			})
		}
		if (-1 !== l.indexOf("nearest_marker")) {
			var j = getNearestMarker(t, a.lat, a.lng);
			"" != j.name && D.push({
				icon: "icon-nearest-marker",
				name: la.NEAREST_MARKER,
				value: j.name + " (" + j.distance + ")"
			})
		}
		D = sortArrayByElement(D, "name");
		var T = "";
		for (i = 0; i < D.length; i += 1) {
			T += datalistBottomAddItem(o = "odd" == o ? "even" : "odd", (M = D[i]).icon, M.name, M.value)
		}
		s += T;
		var R = new Array,
			S = settingsObjectData[t].sensors;
		for (var c in S) {
			var w = S[c];
			if ("true" == w.data_list) {
				var L = "icon-default-sensor";
				if ("batt" == w.type) {
					if (L = "icon-battery-lev-3", "percentage" == w.result_type) (A = getSensorValue(a.params, w)).value <= 25 ? L = "icon-battery-lev-0" : A.value <= 50 ? L = "icon-battery-lev-1" : A.value <= 75 ? L = "icon-battery-lev-2" : A.value <= 100 ? L = "icon-battery-lev-3" : A.value > 100 && (L = "icon-battery-lev-3")
				} else "di" == w.type ? L = "icon-di" : "do" == w.type ? L = "icon-do" : "fuel" == w.type ? L = "icon-fuel" : "fuelsumup" == w.type ? L = "icon-fuel" : "gsm" == w.type ? L = "icon-gsm" : "gps" == w.type ? L = "icon-gps" : "acc" == w.type ? L = "icon-engine" : "temp" == w.type && (L = "icon-temperature");
				if ("fuelsumup" == w.type) {
					var A = getSensorValueFuelLevelSumUp(t, a.params, w);
					R.push({
						icon: L,
						name: w.name,
						value: A.value_full
					})
				} else {
					A = getSensorValue(a.params, w);
					R.push({
						icon: L,
						name: w.name,
						value: A.value_full
					})
				}
			}
		}
		R = sortArrayByElement(R, "name");
		var x = "";
		for (i = 0; i < R.length; i += 1) {
			x += datalistBottomAddItem(o = "odd" == o ? "even" : "odd", (M = R[i]).icon, M.name, M.value)
		}
		s += x;
		var $ = new Array;
		switch (e) {
			case "object":
				var N = objectsData[t].service;
				for (var c in N) "true" == N[c].data_list && $.push({
					icon: "icon-warning",
					name: N[c].name,
					value: N[c].status
				})
		}
		$ = sortArrayByElement($, "name");
		var C = "";
		for (i = 0; i < $.length; i += 1) {
			var M;
			C += datalistBottomAddItem(o = "odd" == o ? "even" : "odd", (M = $[i]).icon, M.name, M.value)
		}
		s += C, document.getElementById(n).innerHTML = s
	} else switch (e) {
		case "object":
			document.getElementById(n).innerHTML = '<div class="data-item-text">' + la.NO_DATA_HAS_BEEN_RECEIVED_YET + "</div>"
	}
}

function datalistBottomAddItem(e, t, a, i) {
	var o = '<div class="datalist-item ' + e + '">';
	return o += 0 == t ? '<span class="datalist-item-icon"></span>' : '<span class="datalist-item-icon ' + t + '"></span>', o += '<div class="datalist-item-name">' + a + "</div>", o += '<div class="datalist-item-value">' + i + "</div>", o += "</div>"
}

function datalistClear(e) {
	if ("bottom_panel" == settingsUserData.datalist) switch (e) {
		case "object":
			document.getElementById("bottom_panel_datalist_object_data_list").innerHTML = '<div class="data-item-text">' + la.NO_OBJECT_SELECTED + "</div>";
			break;
		case "event":
			document.getElementById("bottom_panel_datalist_event_data_list").innerHTML = '<div class="data-item-text">' + la.NO_EVENT_SELECTED + "</div>";
			break;
		case "route":
			document.getElementById("bottom_panel_datalist_route_data_list").innerHTML = '<div class="data-item-text">' + la.NO_HISTORY_LOADED + "</div>"
	} else switch (e) {
		case "object":
			$("#side_panel_objects_object_data_list_grid").clearGridData(!0);
			break;
		case "event":
			$("#side_panel_events_event_datalist_grid").clearGridData(!0);
			break;
		case "route":
			$("#side_panel_history_route_datalist_grid").clearGridData(!0)
	}
}

function datalistShowData(e, t, a) {
	if ("bottom_panel" != settingsUserData.datalist) {
		var i = [],
			o = "",
			s = "",
			n = settingsUserData.datalist_items.split(",");
		switch (e) {
			case "object":
				s = "side_panel_objects_object_data_list_grid", o = $("#side_panel_objects_object_data_list_grid");
				break;
			case "event":
				s = "side_panel_events_event_datalist_grid", o = $("#side_panel_events_event_datalist_grid");
				break;
			case "route":
				s = "side_panel_history_route_datalist_grid", o = $("#side_panel_history_route_datalist_grid")
		}
		for (var l = 0; l < 5; l++) null != document.getElementById(s + "ghead_0_" + l) && ($("#" + s + "ghead_0_" + l).find("span").hasClass("ui-icon-circlesmall-minus") ? gsValues.datalist_groups_colapsed[e][l] = !1 : gsValues.datalist_groups_colapsed[e][l] = !0);
		var d = o.closest(".ui-jqgrid-bdiv").scrollTop();
		if (o.clearGridData(!0), "" != a) {
			var r = a.dt_server,
				_ = a.dt_tracker,
				c = a.lat,
				g = a.lng,
				m = a.speed,
				u = a.altitude,
				p = a.angle,
				y = (m = a.speed, a.params);
			switch (e) {
				case "object":
					if (-1 !== n.indexOf("odometer")) - 1 != (I = getObjectOdometer(t, !1)) && i.push({
						group_name: la.GENERAL,
						data: la.ODOMETER,
						value: I + " " + la.UNIT_DISTANCE
					});
					if (-1 !== n.indexOf("engine_hours")) - 1 != (B = getObjectEngineHours(t, !1)) && i.push({
						group_name: la.GENERAL,
						data: la.ENGINE_HOURS,
						value: B
					});
					if (-1 !== n.indexOf("status")) {
						var h = objectsData[t].status_string;
						"" != h && i.push({
							group_name: la.GENERAL,
							data: la.STATUS,
							value: h
						})
					} - 1 !== n.indexOf("time_position") && i.push({
						group_name: la.LOCATION,
						data: la.TIME_POSITION,
						value: _
					}), -1 !== n.indexOf("time_server") && i.push({
						group_name: la.LOCATION,
						data: la.TIME_SERVER,
						value: r
					});
					var v = objectsData[t].service;
					for (var b in v) "true" == v[b].data_list && i.push({
						group_name: la.SERVICE,
						data: v[b].name,
						value: v[b].status
					});
					var E = settingsObjectData[t].custom_fields;
					for (var b in E) {
						var f = E[b];
						"true" == f.data_list && i.push({
							group_name: la.GENERAL,
							data: f.name,
							value: textToLinks(f.value)
						})
					}
					break;
				case "event":
					if (-1 !== n.indexOf("odometer")) - 1 != (I = getObjectOdometer(t, a.params)) && i.push({
						group_name: la.GENERAL,
						data: la.ODOMETER,
						value: I + " " + la.UNIT_DISTANCE
					});
					if (-1 !== n.indexOf("engine_hours")) - 1 != (B = getObjectEngineHours(t, a.params)) && i.push({
						group_name: la.GENERAL,
						data: la.ENGINE_HOURS,
						value: B
					}); - 1 !== n.indexOf("time_position") && i.push({
						group_name: la.LOCATION,
						data: la.TIME_POSITION,
						value: _
					}), -1 !== n.indexOf("time_server") && i.push({
						group_name: la.LOCATION,
						data: la.TIME_SERVER,
						value: r
					});
					break;
				case "route":
					var I, B;
					if (-1 !== n.indexOf("odometer")) - 1 != (I = getObjectOdometer(t, a.params)) && i.push({
						group_name: la.GENERAL,
						data: la.ODOMETER,
						value: I + " " + la.UNIT_DISTANCE
					});
					if (-1 !== n.indexOf("engine_hours")) - 1 != (B = getObjectEngineHours(t, a.params)) && i.push({
						group_name: la.GENERAL,
						data: la.ENGINE_HOURS,
						value: B
					})
			}
			if (-1 !== n.indexOf("model")) {
				var D = settingsObjectData[t].model;
				"" != D && i.push({
					group_name: la.GENERAL,
					data: la.MODEL,
					value: D
				})
			}
			if (-1 !== n.indexOf("vin")) {
				var O = settingsObjectData[t].vin;
				"" != O && i.push({
					group_name: la.GENERAL,
					data: la.VIN,
					value: O
				})
			}
			if (-1 !== n.indexOf("plate_number")) {
				var k = settingsObjectData[t].plate_number;
				"" != k && i.push({
					group_name: la.GENERAL,
					data: la.PLATE,
					value: k
				})
			}
			if (-1 !== n.indexOf("sim_number") && 1 == gsValues.sim_number) {
				var j = settingsObjectData[t].sim_number;
				"" != j && i.push({
					group_name: la.GENERAL,
					data: la.SIM_CARD_NUMBER,
					value: j
				})
			}
			if (-1 !== n.indexOf("driver")) {
				var T = getDriver(t, a.params);
				if (0 != T) {
					var R = '<a href="#" onclick="utilsShowDriverInfo(\'' + T.driver_id + "');\">" + T.name + "</a>";
					i.push({
						group_name: la.GENERAL,
						data: la.DRIVER,
						value: R
					})
				}
			}
			if (-1 !== n.indexOf("trailer")) {
				var S = getTrailer(t, a.params);
				if (0 != S) {
					var w = '<a href="#" onclick="utilsShowTrailerInfo(\'' + S.trailer_id + "');\">" + S.name + "</a>";
					i.push({
						group_name: la.GENERAL,
						data: la.TRAILER,
						value: w
					})
				}
			}
			switch (e) {
				case "object":
					if (-1 !== n.indexOf("address") && 1 == gsValues.address_display_object_data_list) {
						geocoderGetAddress(c, g, function (e) {
							document.getElementById(s + "_address").innerHTML = e, document.getElementById(s + "_address").title = e, objectsData[t].address = e
						});
						var L = '<span id="' + s + '_address">' + objectsData[t].address + "</span>";
						i.push({
							group_name: la.LOCATION,
							data: la.ADDRESS,
							value: L
						})
					}
					break;
				case "event":
					if (-1 !== n.indexOf("address") && 1 == gsValues.address_display_event_data_list) {
						geocoderGetAddress(c, g, function (e) {
							document.getElementById(s + "_address").innerHTML = e, document.getElementById(s + "_address").title = e, objectsData[t].address = e
						});
						L = '<span id="' + s + '_address">' + objectsData[t].address + "</span>";
						i.push({
							group_name: la.LOCATION,
							data: la.ADDRESS,
							value: L
						})
					}
					break;
				case "route":
					if (-1 !== n.indexOf("address") && 1 == gsValues.address_display_history_route_data_list) {
						geocoderGetAddress(c, g, function (e) {
							document.getElementById(s + "_address").innerHTML = e, document.getElementById(s + "_address").title = e, objectsData[t].address = e
						});
						L = '<span id="' + s + '_address">' + objectsData[t].address + "</span>";
						i.push({
							group_name: la.LOCATION,
							data: la.ADDRESS,
							value: L
						})
					}
			}
			if (-1 !== n.indexOf("position")) {
				var A = urlPosition(c, g);
				i.push({
					group_name: la.LOCATION,
					data: la.POSITION,
					value: A
				})
			}
			if (-1 !== n.indexOf("speed") && i.push({
				group_name: la.LOCATION,
				data: la.SPEED,
				value: m + " " + la.UNIT_SPEED
			}), -1 !== n.indexOf("altitude") && i.push({
				group_name: la.LOCATION,
				data: la.ALTITUDE,
				value: u + " " + la.UNIT_HEIGHT
			}), -1 !== n.indexOf("angle") && i.push({
				group_name: la.LOCATION,
				data: la.ANGLE,
				value: p + " &deg;"
			}), -1 !== n.indexOf("nearest_zone")) {
				var x = getNearestZone(t, c, g);
				"" != x.name && i.push({
					group_name: la.LOCATION,
					data: la.NEAREST_ZONE,
					value: x.name + " (" + x.distance + ")"
				})
			}
			if (-1 !== n.indexOf("nearest_marker")) {
				var N = getNearestMarker(t, c, g);
				"" != N.name && i.push({
					group_name: la.LOCATION,
					data: la.NEAREST_MARKER,
					value: N.name + " (" + N.distance + ")"
				})
			}
			var C = settingsObjectData[t].sensors;
			for (var b in C) {
				var M = C[b];
				if ("true" == M.data_list)
					if ("fuelsumup" == M.type) {
						var P = getSensorValueFuelLevelSumUp(t, y, M);
						i.push({
							group_name: la.SENSORS,
							data: M.name,
							value: P.value_full
						})
					} else {
						P = getSensorValue(y, M);
						i.push({
							group_name: la.SENSORS,
							data: M.name,
							value: P.value_full
						})
					}
			}
			for (l = 0; l < i.length; l++) o.jqGrid("addRowData", l, i[l]);
			o.setGridParam({
				sortname: "data",
				sortorder: "asc"
			}).trigger("reloadGrid");
			for (l = 0; l < gsValues.datalist_groups_colapsed[e].length; l++) null != document.getElementById(s + "ghead_0_" + l) && 1 == gsValues.datalist_groups_colapsed[e][l] && o.jqGrid("groupingToggle", s + "ghead_0_" + l);
			o.closest(".ui-jqgrid-bdiv").scrollTop(d)
		}
	} else datalistBottomShowData(e, t, a)
}
expensesData.edit_expense_id = !1, $(window).bind("resize", function () {
	datalistBottomResize()
}).trigger("resize");
var billingData = new Array,
	timer_billingLoadData;

function billingOpen() {
	utilsCheckPrivileges("subuser") && $("#dialog_billing").dialog("open")
}

function billingClose() { }

function billingLoadData() {
	clearTimeout(timer_billingLoadData), timer_billingLoadData = setTimeout("billingLoadData();", 1e3 * gsValues.billing_refresh), billingUpdateCount(), 1 == $("#dialog_billing").dialog("isOpen") && billingReload()
}

function billingReload() {
	$("#billing_plan_list_grid").trigger("reloadGrid")
}

function billingUpdateCount() {
	$.ajax({
		type: "POST",
		url: "func/fn_billing.php",
		data: {
			cmd: "get_billing_plan_total_objects"
		},
		dataType: "json",
		cache: !1,
		success: function (e) {
			null != document.getElementById("billing_plan_count") && (document.getElementById("billing_plan_count").innerHTML = e.objects)
		}
	})
}

function billingPlanPurchase() {
	if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser")) {
		$.ajax({
			type: "POST",
			url: "func/fn_billing.php",
			data: {
				cmd: "load_billing_plan_purchase_list"
			},
			cache: !1,
			success: function (e) {
				"" == e ? notifyBox("error", la.ERROR, la.NO_BILLING_PLANS_FOUND) : (document.getElementById("billing_plan_purchase_list").innerHTML = e, $("#dialog_billing_plan_purchase").dialog("open"))
			}
		})
	}
}

function billingPlanUse(e) {
	if (utilsCheckPrivileges("subuser")) {
		billingPlanUseObjectLoadList();
		var t = {
			cmd: "load_billing_plan",
			plan_id: e
		};
		$.ajax({
			type: "POST",
			url: "func/fn_billing.php",
			data: t,
			dataType: "json",
			cache: !1,
			success: function (e) {
				if (billingData.plan = e, document.getElementById("dialog_billing_plan_use_objects").innerHTML = billingData.plan.objects, 1 == billingData.plan.period) var t = la[billingData.plan.period_type.slice(0, -1).toUpperCase()];
				else t = la[billingData.plan.period_type.toUpperCase()];
				var a = billingData.plan.period + " " + t.toLowerCase();
				document.getElementById("dialog_billing_plan_use_period").innerHTML = a, document.getElementById("dialog_billing_plan_use_selected").innerHTML = 0, $("#dialog_billing_plan_use").dialog("option", "title", la.BILLING_PLAN + " - " + billingData.plan.name), $("#dialog_billing_plan_use").dialog("open")
			}
		})
	}
}

function billingPlanUseObjectLoadList() {
	var e = $("#billing_plan_object_list_grid");
	for (var t in e.clearGridData(!0), settingsObjectData) {
		var a = settingsObjectData[t],
			i = a.name.toLowerCase(),
			o = a.name,
			s = a.active,
			n = a.object_expire,
			l = a.object_expire_dt;
		s = "true" == s ? '<img src="theme/images/tick-green.svg" />' : '<img src="theme/images/remove-red.svg" style="width:12px;" />', "true" == n && e.jqGrid("addRowData", t, {
			name_sort: i,
			name: o,
			imei: t,
			active: s,
			object_expire_dt: l
		})
	}
	e.setGridParam({
		sortname: "name_sort",
		sortorder: "asc"
	}).trigger("reloadGrid")
}

function billingPlanUseUpdateSelection() {
	var e = $("#billing_plan_object_list_grid").jqGrid("getGridParam", "selarrrow"),
		t = e.length;
	t > billingData.plan.objects ? (document.getElementById("dialog_billing_plan_use_objects").innerHTML = 0, document.getElementById("dialog_billing_plan_use_selected").innerHTML = e.length + ' <font color="red">(' + la.TOO_MANY + ")</font>") : (document.getElementById("dialog_billing_plan_use_objects").innerHTML = billingData.plan.objects - t, document.getElementById("dialog_billing_plan_use_selected").innerHTML = e.length)
}

function billingPlanUseActivate() {
	if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser")) {
		var e = $("#billing_plan_object_list_grid").jqGrid("getGridParam", "selarrrow");
		if ("" != e) {
			var t = e.length;
			if (t > billingData.plan.objects) notifyBox("error", la.ERROR, la.TOO_MANY_OBJECTS_SELECTED);
			else {
				var a = !1;
				for (i = 0; i < t; i++) {
					var o = e[i];
					if ("true" == settingsObjectData[o].active) {
						a = !0;
						break
					}
				}
				var s = la.ARE_YOU_SURE_YOU_WANT_TO_ACTIVATE_SELECTED_OBJECTS;
				a && (s = la.THERE_ARE_STILL_ACTIVE_OBJECTS + " " + s), confirmDialog(s, function (a) {
					if (a) {
						var i = JSON.stringify(e),
							o = {
								cmd: "use_billing_plan",
								plan: billingData.plan,
								imeis: i
							};
						$.ajax({
							type: "POST",
							url: "func/fn_billing.php",
							data: o,
							cache: !1,
							success: function (e) {
								"OK" == e ? (loadSettings("objects", function () {
									objectReloadData(), billingReload(), billingPlanUseObjectLoadList(), billingUpdateCount(), billingData.plan.objects -= t, billingPlanUseUpdateSelection()
								}), notifyBox("info", la.INFORMATION, la.OBJECTS_ACTIVATED_SUCCESSFULLY)) : "ERROR_VERIFY" == e ? notifyBox("error", la.ERROR, la.PLAN_VERIFICATION_FAILED) : "ERROR_ACTIVATE" == e && notifyBox("error", la.ERROR, la.OBJECT_ACTIVATION_FAILED)
							}
						})
					}
				})
			}
		} else notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function billingPlanDelete(e) {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_billing_plan",
				plan_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_billing.php",
				data: a,
				success: function (e) {
					"OK" == e && billingReload()
				}
			})
		}
	})
}
billingData.plan = new Array;
var chatData = new Array,
	timer_chatLoadData, timer_chatMsgsDTHide;
chatData.imei = !1, chatData.first_msg_id = !1, chatData.last_msg_id = !1, chatData.msg_count = new Array;
var chatMsgsScrollHandler = function () {
	0 == $(this).scrollTop() && 0 != chatData.first_msg_id && chatLoadMsgs("old"), $("#chat_msgs div").each(function () {
		if ($(this).position().top > 0) {
			var e = $(this).attr("title");
			if (null != e && e.length > 10) return "none" == document.getElementById("chat_msgs_dt").style.display && (document.getElementById("chat_msgs_dt").style.display = "block"), clearTimeout(timer_chatMsgsDTHide), timer_chatMsgsDTHide = setTimeout(function () {
				$("#chat_msgs_dt").fadeOut("slow")
			}, 3e3), document.getElementById("chat_msgs_dt").innerHTML = e.substring(0, 10), !1
		}
	})
},
	timer_imgLoadData;

function chatOpen() {
	utilsCheckPrivileges("chat") && ($("#dialog_chat").bind("resize", function () {
		scrollToBottom("chat_msgs")
	}), $("#dialog_chat").bind("resize", function () {
		$("#chat_object_list_grid").setGridHeight($("#dialog_chat").height() - 84)
	}).trigger("resize"), $("#dialog_chat").dialog("open"), $("#chat_msgs").scroll(chatMsgsScrollHandler), chatLoadObjectList())
}

function chatClose() {
	chatData.imei = !1, chatData.first_msg_id = !1, chatData.last_msg_id = !1, document.getElementById("chat_msg").disabled = !0, chatClear(), $("#dialog_chat").unbind("resize"), $("#chat_msgs").off("scroll", chatMsgsScrollHandler)
}

function chatClear() {
	document.getElementById("chat_msgs_dt").style.display = "none", document.getElementById("chat_msgs_dt").innerHTML = "", document.getElementById("chat_msgs_text").innerHTML = "", document.getElementById("chat_msg_status").innerHTML = "", document.getElementById("chat_msg").value = ""
}

function chatLoadData() {
	clearTimeout(timer_chatLoadData);
	var e = {
		cmd: "load_chat_data",
		imei: chatData.imei,
		last_msg_id: chatData.last_msg_id
	};
	$.ajax({
		type: "POST",
		url: "func/fn_chat.php",
		data: e,
		dataType: "json",
		error: function (e, t) {
			timer_chatLoadData = setTimeout("chatLoadData();", 1e3 * gsValues.chat_refresh)
		},
		success: function (e) {
			chatData.msg_count = e.msg_count, chatData.msg_dt = e.msg_dt, chatUpdateMsgCount(), chatUpdateMsgDt(), 0 != e.last_msg_status && chatUpdateMsgDeliveryStatus(e.last_msg_status);
			var t = chatData.imei;
			null != chatData.msg_count[t] && chatLoadMsgs("new"), timer_chatLoadData = setTimeout("chatLoadData();", 1e3 * gsValues.chat_refresh)
		}
	})
}

function chatReloadData() {
	chatLoadObjectList(), chatLoadData()
}

function chatIsObjectCompatible(e) {
	return null != objectsData[e] && "" != objectsData[e].data && null != objectsData[e].data[0].params && null != objectsData[e].data[0].params.chat
}

function chatLoadObjectList() {
	var e = $("#chat_object_list_grid");
	for (var t in e.clearGridData(!0), settingsObjectData) {
		var a = settingsObjectData[t];
		if ("true" == a.active && chatIsObjectCompatible(t)) {
			var i = '<img src="' + a.icon + '" style="width: 26px;"/>',
				o = '<div class="object-list-item"><div class="left"><div class="name">' + a.name + '</div><div class="status" id="chat_object_msg_status_' + t + '">' + la.NO_MESSAGES + "</div></div>";
			o += '<div class="right" id="chat_object_msg_count_' + t + '"></div></div>', e.jqGrid("addRowData", t, {
				search: a.name.toLowerCase(),
				icon: i,
				name: o
			})
		}
	}
	e.setGridParam({
		sortname: "search",
		sortorder: "asc"
	}).trigger("reloadGrid")
}

function chatUpdateMsgCount() {
	var e = 0;
	if (null != document.getElementById("chat_msg_count")) {
		for (var t in chatData.msg_count) {
			if (chatIsObjectCompatible(t)) e += chatData.msg_count[t]
		}
		if (e > 0 && "0" == document.getElementById("chat_msg_count").innerHTML)
			if ("" != settingsUserData.chat_notify) new Audio("snd/" + settingsUserData.chat_notify).play();
		for (var t in document.getElementById("chat_msg_count").innerHTML = e, document.title = e > 0 ? gsValues.title + " (" + e + ")" : gsValues.title, settingsObjectData) null != document.getElementById("chat_object_msg_count_" + t) && (null != chatData.msg_count[t] ? document.getElementById("chat_object_msg_count_" + t).innerHTML = '<div class="messages">' + chatData.msg_count[t] + "</div>" : document.getElementById("chat_object_msg_count_" + t).innerHTML = "")
	}
}

function chatUpdateMsgDt() {
	for (var e in chatData.msg_dt)
		if (null != document.getElementById("chat_object_msg_count_" + e)) {
			var t = chatData.msg_dt[e];
			document.getElementById("chat_object_msg_status_" + e).innerHTML = "" == t ? la.NO_MESSAGES : t
		}
}

function chatDeleteAllMsgs() {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_SELECTED_OBJECT_MESSAGES, function (e) {
		if (e) {
			var t = {
				cmd: "delete_all_msgs",
				imei: chatData.imei
			};
			$.ajax({
				type: "POST",
				url: "func/fn_chat.php",
				data: t,
				success: function (e) {
					if ("OK" == e) {
						chatClear();
						var t = chatData.imei;
						chatData.msg_dt[t] = "", chatUpdateMsgDt()
					}
				}
			})
		}
	})
}

function chatSend() {
	var e = document.getElementById("chat_msg").value;
	if (0 != chatData.imei && "" != e) {
		e = stripHTML(e), e = strLink(e);
		var t = {
			cmd: "send_msg",
			imei: chatData.imei,
			msg: e
		};
		$.ajax({
			type: "POST",
			url: "func/fn_chat.php",
			data: t,
			cache: !1,
			success: function (e) {
				"OK" == e && (document.getElementById("chat_msg").value = "", chatLoadMsgs("new"))
			},
			error: function (e, t) { }
		})
	}
}

function chatLoadMsgs(e) {
	if ("old" == e) var t = 10;
	else t = 40;
	var a = {
		cmd: "load_msgs",
		type: e,
		imei: chatData.imei,
		msg_limit: t,
		first_msg_id: chatData.first_msg_id,
		last_msg_id: chatData.last_msg_id
	};
	$.ajax({
		type: "POST",
		url: "func/fn_chat.php",
		data: a,
		dataType: "json",
		cache: !1,
		success: function (t) {
			if ("" != t) {
				"old" == e && (document.getElementById("chat_msgs").scrollTop = 1);
				var a = "";
				for (var i in t) {
					var o = t[i = parseInt(i)].dt,
						s = t[i].s,
						n = t[i].m,
						l = t[i].st;
					a += chatFormatMsg(i, o, s, n), (chatData.first_msg_id > i || 0 == chatData.first_msg_id) && (chatData.first_msg_id = i), (chatData.last_msg_id < i || 0 == chatData.last_msg_id) && (chatData.last_msg_id = i)
				}
				if ("old" != e) {
					document.getElementById("chat_msgs_text").innerHTML = document.getElementById("chat_msgs_text").innerHTML + a, scrollToBottom("chat_msgs");
					var d = chatData.imei;
					s = t[i = chatData.last_msg_id].s, l = t[i].st;
					chatUpdateMsgDeliveryStatus("S" == s ? l : 0), delete chatData.msg_count[d], chatUpdateMsgCount();
					o = t[i].dt;
					chatData.msg_dt[d] = o, chatUpdateMsgDt()
				} else document.getElementById("chat_msgs_text").innerHTML = a + document.getElementById("chat_msgs_text").innerHTML
			}
		},
		error: function (e, t) { }
	})
}

function chatFormatMsg(e, t, a, i) {
	if ("S" == a) var o = "chat-msg-server",
		s = "chat-msg-dt-server";
	else o = "chat-msg-client", s = "chat-msg-dt-client";
	return t.substring(0, 10) == moment().format("YYYY-MM-DD") && (t = t.substring(11, 19)), '<div class="chat-msg-container"><div title="' + t + '" class="' + o + '">' + i + '<div class="' + s + '">' + t + "</div></div></div>"
}

function chatUpdateMsgDeliveryStatus(e) {
	var t = !1;
	0 == e ? document.getElementById("chat_msg_status").innerHTML = "" : 1 == e ? ("" == document.getElementById("chat_msg_status").innerHTML && (t = !0), document.getElementById("chat_msg_status").innerHTML = la.DELIVERED) : 2 == e && ("" == document.getElementById("chat_msg_status").innerHTML && (t = !0), document.getElementById("chat_msg_status").innerHTML = la.SEEN), t && scrollToBottom("chat_msgs")
}

function chatSelectObject(e) {
	chatData.imei != e && (chatClear(), document.getElementById("chat_msg").disabled = !1, chatData.imei = e, chatData.first_msg_id = !1, chatData.last_msg_id = !1, chatLoadMsgs("select"))
}

function imgOpen() {
	utilsCheckPrivileges("image_gallery") && ($("#dialog_image_gallery").dialog("open"), imgLoadData())
}

function imgLoadData() {
	clearTimeout(timer_imgLoadData), timer_imgLoadData = setTimeout("imgLoadData();", 1e3 * gsValues.img_refresh), 1 == $("#dialog_image_gallery").dialog("isOpen") ? $("#image_gallery_list_grid").trigger("reloadGrid") : clearTimeout(timer_imgLoadData)
}

function imgFilter() {
	var e = "func/fn_img.php?cmd=load_img_list",
		t = document.getElementById("dialog_image_gallery_object_list").value,
		a = document.getElementById("dialog_image_gallery_date_from").value + " " + document.getElementById("dialog_image_gallery_hour_from").value + ":" + document.getElementById("dialog_image_gallery_minute_from").value + ":00",
		i = document.getElementById("dialog_image_gallery_date_to").value + " " + document.getElementById("dialog_image_gallery_hour_to").value + ":" + document.getElementById("dialog_image_gallery_minute_to").value + ":00";
	"" != t && (e += "&imei=" + t), a != i && (e += "&dtf=" + a + "&dtt=" + i), $("#image_gallery_list_grid").jqGrid("setGridParam", {
		url: e
	}).trigger("reloadGrid")
}

function imgDelete(e) {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_img",
				img_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_img.php",
				data: a,
				success: function (e) {
					"OK" == e && (document.getElementById("image_gallery_img").innerHTML = "", document.getElementById("image_gallery_img_data").innerHTML = "", $("#image_gallery_list_grid").trigger("reloadGrid"))
				}
			})
		}
	})
}

function imgDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#image_gallery_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_imgs",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_img.php",
					data: a,
					success: function (e) {
						"OK" == e && (document.getElementById("image_gallery_img").innerHTML = "", document.getElementById("image_gallery_img_data").innerHTML = "", $("#image_gallery_list_grid").trigger("reloadGrid"))
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function imgDeleteAll() {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_IMAGES, function (e) {
		if (e) {
			$.ajax({
				type: "POST",
				url: "func/fn_img.php",
				data: {
					cmd: "delete_all_imgs"
				},
				success: function (e) {
					"OK" == e && (document.getElementById("image_gallery_img").innerHTML = "", document.getElementById("image_gallery_img_data").innerHTML = "", $("#image_gallery_list_grid").trigger("reloadGrid"))
				}
			})
		}
	})
}
var cmdData = new Array,
	timer_cmdLoadData;

function cmdOpen() {
	utilsCheckPrivileges("object_control") && ($("#dialog_cmd").dialog("open"), cmdStatusLoadData(), cmdGPRSTemplateList(), cmdSMSTemplateList(), cmdScheduleTemplateList())
}

function cmdStatusLoadData() {
	clearTimeout(timer_cmdLoadData), timer_cmdLoadData = setTimeout("cmdStatusLoadData();", 1e3 * gsValues.cmd_status_refresh), 1 == $("#dialog_cmd").dialog("isOpen") ? ($("#cmd_gprs_status_list_grid").trigger("reloadGrid"), $("#cmd_sms_status_list_grid").trigger("reloadGrid")) : clearTimeout(timer_cmdLoadData)
}

function cmdGPRSTemplateList() {
	for (var e = document.getElementById("cmd_gprs_template_list"), t = e.getElementsByTagName("optgroup"), a = t.length - 1; a >= 0; a--) e.removeChild(t[a]);
	e.options.length = 0;
	var i = document.getElementById("cmd_gprs_object_list");
	if (multiselectIsSelected(i)) {
		var o = "",
			s = (i = multiselectGetValues(i)).split(",");
		for (a = 0; a < s.length; a += 1)
			if (null != settingsObjectData[s[0]] && null != settingsObjectData[s[a]] && (o = settingsObjectData[s[0]].protocol) != settingsObjectData[s[a]].protocol) {
				o = "";
				break
			} if ("" != o && 1 == gsValues.object_control_default_templates) {
				for (var n in gsValues.protocol_list)
					if (gsValues.protocol_list[n].name == o && null != gsValues.protocol_list[n].cmd && "" != gsValues.protocol_list[n].cmd) {
						var l = gsValues.protocol_list[n].cmd.split(",");
						if (l.length > 0) (r = $('<optgroup label="' + la.DEFAULT + '" />')).appendTo(e);
						for (l.sort(), a = 0; a < l.length; a += 1) e.options.add(new Option(la[l[a].toUpperCase()], l[a]));
						break
					} var d = new Array,
						r = $('<optgroup label="' + la.CUSTOM + '" />');
				for (var n in r.appendTo(e), e.options.add(new Option(la.CUSTOM, "")), cmdData.cmd_templates) {
					var _ = cmdData.cmd_templates[n];
					"gprs" == _.gateway && (_.protocol.toLowerCase() == o.toLowerCase() ? d.push({
						name: _.name,
						key: n
					}) : "" == _.protocol.toLowerCase() && d.push({
						name: _.name,
						key: n
					}))
				}
				for (d = sortArrayByElement(d, "name"), a = 0; a < d.length; a += 1) e.options.add(new Option(d[a].name, d[a].key))
			} else {
			(r = $('<optgroup label="' + la.CUSTOM + '" />')).appendTo(e), e.options.add(new Option(la.CUSTOM, ""))
		}
		cmdGPRSReset()
	}
}

function cmdGPRSTemplateSwitch() {
	var e = document.getElementById("cmd_gprs_template_list").value,
		t = "",
		a = "";
	for (var i in gsValues.cmd_default) {
		var o = gsValues.cmd_default[i];
		if (e == o.name) {
			t = o.name, null != o.params && (a = o.params);
			break
		}
	}
	"" != t ? (document.getElementById("cmd_gprs_cmd_type").disabled = !0, document.getElementById("cmd_gprs_cmd_type").value = "ascii", "" != a && (t = t + "," + a), document.getElementById("cmd_gprs_cmd").value = t) : "" != e ? (document.getElementById("cmd_gprs_cmd_type").disabled = !1, document.getElementById("cmd_gprs_cmd_type").value = cmdData.cmd_templates[e].type, document.getElementById("cmd_gprs_cmd").value = cmdData.cmd_templates[e].cmd) : (document.getElementById("cmd_gprs_cmd_type").disabled = !1, document.getElementById("cmd_gprs_cmd_type").value = "ascii", document.getElementById("cmd_gprs_cmd").value = ""), $("#cmd_gprs_cmd_type").multipleSelect("refresh")
}

function cmdGPRSSend() {
	var e = document.getElementById("cmd_gprs_object_list"),
		t = $("#cmd_gprs_template_list :selected").text(),
		a = document.getElementById("cmd_gprs_cmd_type").value,
		i = document.getElementById("cmd_gprs_cmd").value;
	multiselectIsSelected(e) ? (e = multiselectGetValues(e), "" != i ? "hex" != a || (i = i.toUpperCase(), isHexValid(i.replace("%IMEI%", ""))) ? e.split(",").length > 1 ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_SEND_COMMAND_SELECTED_OBJECTS, function (o) {
		o && cmdGPRSExec(e, t, a, i)
	}) : cmdGPRSExec(e, t, a, i) : notifyBox("error", la.ERROR, la.COMMAND_HEX_NOT_VALID, !0) : notifyBox("error", la.ERROR, la.COMMAND_CANT_BE_EMPTY, !0)) : notifyBox("error", la.ERROR, la.AT_LEAST_ONE_OBJECT_SELECTED)
}

function cmdGPRSExec(e, t, a, i) {
	if (utilsCheckPrivileges("viewer")) {
		loadingData(!0);
		var o = {
			cmd: "exec_cmd_gprs",
			imei: e,
			name: t,
			type: a,
			cmd_: i
		};
		$.ajax({
			type: "POST",
			url: "func/fn_cmd.php",
			data: o,
			success: function (e) {
				loadingData(!1), "OK" == e ? (cmdGPRSReset(), $("#cmd_gprs_status_list_grid").trigger("reloadGrid"), notifyBox("info", la.INFORMATION, la.COMMAND_SENT_FOR_EXECUTION, !0)) : "ERROR_NOT_SENT" == e && ($("#cmd_gprs_status_list_grid").trigger("reloadGrid"), notifyBox("error", la.ERROR, la.UNABLE_TO_SEND_SMS_MESSAGE, !0))
			},
			error: function (e, t) {
				loadingData(!1)
			}
		})
	}
}

function cmdGPRSReset() {
	document.getElementById("cmd_gprs_cmd_type").disabled = !1, document.getElementById("cmd_gprs_template_list").value = "", $("#cmd_gprs_template_list").multipleSelect("refresh"), document.getElementById("cmd_gprs_cmd_type").value = "ascii", $("#cmd_gprs_cmd_type").multipleSelect("refresh"), document.getElementById("cmd_gprs_cmd").value = ""
}

function cmdGPRSExecDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_cmd_exec",
				cmd_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_cmd.php",
				data: a,
				success: function (e) {
					"OK" == e && $("#cmd_gprs_status_list_grid").trigger("reloadGrid")
				}
			})
		}
	})
}

function cmdGPRSExecDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#cmd_gprs_status_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_cmd_execs",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_cmd.php",
					data: a,
					success: function (e) {
						"OK" == e && $("#cmd_gprs_status_list_grid").trigger("reloadGrid")
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function cmdSMSTemplateList() {
	for (var e = document.getElementById("cmd_sms_template_list"), t = e.getElementsByTagName("optgroup"), a = t.length - 1; a >= 0; a--) e.removeChild(t[a]);
	e.options.length = 0;
	var i = document.getElementById("cmd_sms_object_list");
	if (multiselectIsSelected(i)) {
		var o = "",
			s = (i = multiselectGetValues(i)).split(",");
		for (a = 0; a < s.length; a += 1)
			if (null != settingsObjectData[s[0]] && null != settingsObjectData[s[a]] && (o = settingsObjectData[s[0]].protocol) != settingsObjectData[s[a]].protocol) {
				o = "";
				break
			} if ("" != o) {
				var n = new Array,
					l = $('<optgroup label="' + la.CUSTOM + '" />');
				for (var d in l.appendTo(e), e.options.add(new Option(la.CUSTOM, "")), cmdData.cmd_templates) {
					var r = cmdData.cmd_templates[d];
					"sms" == r.gateway && (r.protocol.toLowerCase() == o.toLowerCase() ? n.push({
						name: r.name,
						key: d
					}) : "" == r.protocol.toLowerCase() && n.push({
						name: r.name,
						key: d
					}))
				}
				for (n = sortArrayByElement(n, "name"), a = 0; a < n.length; a += 1) e.options.add(new Option(n[a].name, n[a].key))
			} else {
			(l = $('<optgroup label="' + la.CUSTOM + '" />')).appendTo(e), e.options.add(new Option(la.CUSTOM, ""))
		}
		cmdSMSReset()
	}
}

function cmdSMSTemplateSwitch() {
	var e = document.getElementById("cmd_sms_template_list").value;
	document.getElementById("cmd_sms_cmd").value = "" != e ? cmdData.cmd_templates[e].cmd : ""
}

function cmdSMSSend() {
	var e = document.getElementById("cmd_sms_object_list"),
		t = $("#cmd_sms_template_list :selected").text(),
		a = document.getElementById("cmd_sms_cmd").value;
	if (multiselectIsSelected(e))
		if (e = multiselectGetValues(e), "" != a) {
			var o = e.split(",");
			for (i = 0; i < o.length; i += 1) {
				if ("" == settingsObjectData[o[i]].sim_number) return void notifyBox("error", la.ERROR, la.OBJECT_SIM_CARD_NUMBER_IS_NOT_SET, !0)
			}
			o.length > 1 ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_SEND_COMMAND_SELECTED_OBJECTS, function (i) {
				i && cmdSMSExec(e, t, a)
			}) : cmdSMSExec(e, t, a)
		} else notifyBox("error", la.ERROR, la.COMMAND_CANT_BE_EMPTY, !0);
	else notifyBox("error", la.ERROR, la.AT_LEAST_ONE_OBJECT_SELECTED)
}

function cmdSMSExec(e, t, a) {
	if (utilsCheckPrivileges("viewer")) {
		loadingData(!0);
		var i = {
			cmd: "exec_cmd_sms",
			imei: e,
			name: t,
			cmd_: a
		};
		$.ajax({
			type: "POST",
			url: "func/fn_cmd.php",
			data: i,
			success: function (e) {
				loadingData(!1), "OK" == e ? (cmdSMSReset(), $("#cmd_sms_status_list_grid").trigger("reloadGrid"), notifyBox("info", la.INFORMATION, la.COMMAND_SENT_FOR_EXECUTION, !0)) : "ERROR_NOT_SENT" == e && ($("#cmd_sms_status_list_grid").trigger("reloadGrid"), notifyBox("error", la.ERROR, la.UNABLE_TO_SEND_SMS_MESSAGE, !0))
			},
			error: function (e, t) {
				loadingData(!1)
			}
		})
	}
}

function cmdSMSReset() {
	document.getElementById("cmd_sms_template_list").value = "", $("#cmd_sms_template_list").multipleSelect("refresh"), document.getElementById("cmd_sms_cmd").value = ""
}

function cmdSMSExecDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_cmd_exec",
				cmd_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_cmd.php",
				data: a,
				success: function (e) {
					"OK" == e && $("#cmd_sms_status_list_grid").trigger("reloadGrid")
				}
			})
		}
	})
}

function cmdSMSExecDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#cmd_sms_status_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_cmd_execs",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_cmd.php",
					data: a,
					success: function (e) {
						"OK" == e && $("#cmd_sms_status_list_grid").trigger("reloadGrid")
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function cmdScheduleProtocolList() {
	var e = document.getElementById("dialog_cmd_schedule_protocol").value,
		t = document.getElementById("dialog_cmd_schedule_protocol");
	t.options.length = 0;
	for (var a = getAllProtocolsArray(), i = 0; i < a.length; i++) "" != a[i] && t.options.add(new Option(a[i], a[i]));
	sortSelectList(t), t.options.add(new Option(la.ALL_PROTOCOLS, ""), 0), document.getElementById("dialog_cmd_schedule_protocol").value = e, $("#dialog_cmd_schedule_protocol").multipleSelect("refresh")
}

function cmdScheduleObjectList() {
	var e = document.getElementById("dialog_cmd_schedule_protocol").value,
		t = document.getElementById("dialog_cmd_schedule_object_list");
	multiselectClear(t);
	var a = getGroupsObjectsArray(e);
	multiselectSetGroups(t, a)
}

function cmdScheduleTemplateList() {
	var e = document.getElementById("dialog_cmd_schedule_protocol").value,
		t = document.getElementById("dialog_cmd_schedule_template_list");
	for (var a in t.options.length = 0, cmdData.cmd_templates) {
		var i = cmdData.cmd_templates[a];
		"" == e ? t.options.add(new Option(i.name, a)) : i.protocol.toLowerCase() == e.toLowerCase() && t.options.add(new Option(i.name, a))
	}
	sortSelectList(t), t.options.add(new Option(la.CUSTOM, ""), 0), document.getElementById("dialog_cmd_schedule_template_list").value = "", $("#dialog_cmd_schedule_template_list").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_gateway").value = "gprs", $("#dialog_cmd_schedule_cmd_gateway").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_type").value = "ascii", $("#dialog_cmd_schedule_cmd_type").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_cmd").value = ""
}

function cmdScheduleExactTimeSwitch() {
	1 == document.getElementById("dialog_cmd_schedule_exact_time").checked ? (document.getElementById("dialog_cmd_schedule_exact_time_date").disabled = !1, document.getElementById("dialog_cmd_schedule_exact_time_time").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_mon").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_mon_time").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_tue").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_tue_time").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_wed").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_wed_time").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_thu").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_thu_time").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_fri").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_fri_time").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_sat").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_sat_time").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_sun").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_sun_time").disabled = !0) : (document.getElementById("dialog_cmd_schedule_exact_time_date").disabled = !0, document.getElementById("dialog_cmd_schedule_exact_time_time").disabled = !0, document.getElementById("dialog_cmd_schedule_daily_mon").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_mon_time").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_tue").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_tue_time").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_wed").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_wed_time").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_thu").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_thu_time").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_fri").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_fri_time").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_sat").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_sat_time").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_sun").disabled = !1, document.getElementById("dialog_cmd_schedule_daily_sun_time").disabled = !1)
}

function cmdScheduleProtocolSwitch() {
	cmdScheduleObjectList(), cmdScheduleTemplateList()
}

function cmdScheduleTemplateSwitch() {
	var e = document.getElementById("dialog_cmd_schedule_template_list").value;
	"" != e ? (document.getElementById("dialog_cmd_schedule_cmd_gateway").value = cmdData.cmd_templates[e].gateway, document.getElementById("dialog_cmd_schedule_cmd_type").value = cmdData.cmd_templates[e].type, document.getElementById("dialog_cmd_schedule_cmd_cmd").value = cmdData.cmd_templates[e].cmd) : (document.getElementById("dialog_cmd_schedule_cmd_gateway").value = "gprs", document.getElementById("dialog_cmd_schedule_cmd_type").value = "ascii", document.getElementById("dialog_cmd_schedule_cmd_cmd").value = ""), $("#dialog_cmd_schedule_cmd_gateway").multipleSelect("refresh"), $("#dialog_cmd_schedule_cmd_type").multipleSelect("refresh")
}

function cmdScheduleResetDailyTime() {
	document.getElementById("dialog_cmd_schedule_daily_mon").checked = !1, document.getElementById("dialog_cmd_schedule_daily_mon_time").value = "00:00", $("#dialog_cmd_schedule_daily_mon_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_tue").checked = !1, document.getElementById("dialog_cmd_schedule_daily_tue_time").value = "00:00", $("#dialog_cmd_schedule_daily_tue_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_wed").checked = !1, document.getElementById("dialog_cmd_schedule_daily_wed_time").value = "00:00", $("#dialog_cmd_schedule_daily_wed_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_thu").checked = !1, document.getElementById("dialog_cmd_schedule_daily_thu_time").value = "00:00", $("#dialog_cmd_schedule_daily_thu_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_fri").checked = !1, document.getElementById("dialog_cmd_schedule_daily_fri_time").value = "00:00", $("#dialog_cmd_schedule_daily_fri_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_sat").checked = !1, document.getElementById("dialog_cmd_schedule_daily_sat_time").value = "00:00", $("#dialog_cmd_schedule_daily_sat_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_sun").checked = !1, document.getElementById("dialog_cmd_schedule_daily_sun_time").value = "00:00", $("#dialog_cmd_schedule_daily_sun_time").multipleSelect("refresh")
}

function cmdScheduleProperties(e) {
	switch (e) {
		default:
			var t = e;
			cmdData.edit_cmd_schedule_id = t;
			var a = {
				cmd: "load_cmd_schedule",
				cmd_id: cmdData.edit_cmd_schedule_id
			};
			$.ajax({
				type: "POST",
				url: "func/fn_cmd.php",
				data: a,
				dataType: "json",
				cache: !1,
				success: function (e) {
					document.getElementById("dialog_cmd_schedule_active").checked = strToBoolean(e.active), document.getElementById("dialog_cmd_schedule_name").value = e.name;
					var t = strToBoolean(e.exact_time);
					document.getElementById("dialog_cmd_schedule_exact_time").checked = t, cmdScheduleExactTimeSwitch(), 1 == t ? (document.getElementById("dialog_cmd_schedule_exact_time_date").value = e.exact_time_dt.substring(0, 10), document.getElementById("dialog_cmd_schedule_exact_time_time").value = e.exact_time_dt.substring(11, 16)) : (document.getElementById("dialog_cmd_schedule_exact_time_date").value = "", document.getElementById("dialog_cmd_schedule_exact_time_time").value = "00:00"), $("#dialog_cmd_schedule_exact_time_time").multipleSelect("refresh");
					var a = e.day_time;
					null != a ? (document.getElementById("dialog_cmd_schedule_daily_mon").checked = a.mon, document.getElementById("dialog_cmd_schedule_daily_mon_time").value = a.mon_time, $("#dialog_cmd_schedule_daily_mon_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_tue").checked = a.tue, document.getElementById("dialog_cmd_schedule_daily_tue_time").value = a.tue_time, $("#dialog_cmd_schedule_daily_tue_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_wed").checked = a.wed, document.getElementById("dialog_cmd_schedule_daily_wed_time").value = a.wed_time, $("#dialog_cmd_schedule_daily_wed_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_thu").checked = a.thu, document.getElementById("dialog_cmd_schedule_daily_thu_time").value = a.thu_time, $("#dialog_cmd_schedule_daily_thu_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_fri").checked = a.fri, document.getElementById("dialog_cmd_schedule_daily_fri_time").value = a.fri_time, $("#dialog_cmd_schedule_daily_fri_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_sat").checked = a.sat, document.getElementById("dialog_cmd_schedule_daily_sat_time").value = a.sat_time, $("#dialog_cmd_schedule_daily_sat_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_sun").checked = a.sun, document.getElementById("dialog_cmd_schedule_daily_sun_time").value = a.sun_time, $("#dialog_cmd_schedule_daily_sun_time").multipleSelect("refresh")) : cmdScheduleResetDailyTime(), cmdScheduleProtocolList(), document.getElementById("dialog_cmd_schedule_protocol").value = e.protocol, $("#dialog_cmd_schedule_protocol").multipleSelect("refresh"), cmdScheduleProtocolSwitch();
					var i = document.getElementById("dialog_cmd_schedule_object_list"),
						o = e.imei.split(",");
					multiselectSetValues(i, o), $("#dialog_cmd_schedule_object_list").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_template_list").value = "", $("#dialog_cmd_schedule_template_list").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_gateway").value = e.gateway, $("#dialog_cmd_schedule_cmd_gateway").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_type").value = e.type, $("#dialog_cmd_schedule_cmd_type").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_cmd").value = e.cmd
				}
			}), $("#dialog_cmd_schedule_properties").dialog("open");
			break;
		case "add":
			cmdData.edit_cmd_schedule_id = !1, document.getElementById("dialog_cmd_schedule_active").checked = !0, document.getElementById("dialog_cmd_schedule_name").value = "", document.getElementById("dialog_cmd_schedule_exact_time").checked = !1, cmdScheduleExactTimeSwitch(), document.getElementById("dialog_cmd_schedule_exact_time_date").value = "", document.getElementById("dialog_cmd_schedule_exact_time_time").value = "00:00", $("#dialog_cmd_schedule_exact_time_time").multipleSelect("refresh"), cmdScheduleResetDailyTime(), cmdScheduleProtocolList(), document.getElementById("dialog_cmd_schedule_protocol").value = "", $("#dialog_cmd_schedule_protocol").multipleSelect("refresh"), cmdScheduleProtocolSwitch(), document.getElementById("dialog_cmd_schedule_template_list").value = "", $("#dialog_cmd_schedule_template_list").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_gateway").value = "gprs", $("#dialog_cmd_schedule_cmd_gateway").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_type").value = "ascii", $("#dialog_cmd_schedule_cmd_type").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_cmd").value = "", $("#dialog_cmd_schedule_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_cmd_schedule_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var i = document.getElementById("dialog_cmd_schedule_name").value;
			if ("" == i) return void notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY, !0);
			var o = document.getElementById("dialog_cmd_schedule_active").checked,
				s = document.getElementById("dialog_cmd_schedule_exact_time").checked,
				n = document.getElementById("dialog_cmd_schedule_exact_time_date").value,
				l = document.getElementById("dialog_cmd_schedule_exact_time_time").value;
			if (1 == s) {
				if ("" == n) return void notifyBox("error", la.ERROR, la.DATE_CANT_BE_EMPTY, !0);
				var d = n + " " + l + ":00"
			} else d = "";
			var r = {
				mon: document.getElementById("dialog_cmd_schedule_daily_mon").checked,
				mon_time: document.getElementById("dialog_cmd_schedule_daily_mon_time").value,
				tue: document.getElementById("dialog_cmd_schedule_daily_tue").checked,
				tue_time: document.getElementById("dialog_cmd_schedule_daily_tue_time").value,
				wed: document.getElementById("dialog_cmd_schedule_daily_wed").checked,
				wed_time: document.getElementById("dialog_cmd_schedule_daily_wed_time").value,
				thu: document.getElementById("dialog_cmd_schedule_daily_thu").checked,
				thu_time: document.getElementById("dialog_cmd_schedule_daily_thu_time").value,
				fri: document.getElementById("dialog_cmd_schedule_daily_fri").checked,
				fri_time: document.getElementById("dialog_cmd_schedule_daily_fri_time").value,
				sat: document.getElementById("dialog_cmd_schedule_daily_sat").checked,
				sat_time: document.getElementById("dialog_cmd_schedule_daily_sat_time").value,
				sun: document.getElementById("dialog_cmd_schedule_daily_sun").checked,
				sun_time: document.getElementById("dialog_cmd_schedule_daily_sun_time").value
			};
			r = JSON.stringify(r);
			var _ = document.getElementById("dialog_cmd_schedule_protocol").value,
				c = document.getElementById("dialog_cmd_schedule_object_list");
			if (!multiselectIsSelected(c)) return void notifyBox("error", la.ERROR, la.AT_LEAST_ONE_OBJECT_SELECTED);
			c = multiselectGetValues(c);
			var g = document.getElementById("dialog_cmd_schedule_cmd_gateway").value,
				m = document.getElementById("dialog_cmd_schedule_cmd_type").value,
				u = document.getElementById("dialog_cmd_schedule_cmd_cmd").value;
			if ("" == u) return void notifyBox("error", la.ERROR, la.COMMAND_CANT_BE_EMPTY, !0);
			if ("hex" == m && (u = u.toUpperCase(), !isHexValid(u.replace("%IMEI%", "")))) return void notifyBox("error", la.ERROR, la.COMMAND_HEX_NOT_VALID, !0);
			a = {
				cmd: "save_cmd_schedule",
				cmd_id: cmdData.edit_cmd_schedule_id,
				name: i,
				active: o,
				exact_time: s,
				exact_time_dt: d,
				day_time: r,
				protocol: _,
				imei: c,
				gateway: g,
				type: m,
				cmd_: u
			};
			$.ajax({
				type: "POST",
				url: "func/fn_cmd.php",
				data: a,
				cache: !1,
				success: function (e) {
					"OK" == e && ($("#cmd_schedule_list_grid").trigger("reloadGrid"), $("#dialog_cmd_schedule_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function cmdScheduleDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_cmd_schedule",
				cmd_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_cmd.php",
				data: a,
				success: function (e) {
					"OK" == e && $("#cmd_schedule_list_grid").trigger("reloadGrid")
				}
			})
		}
	})
}

function cmdScheduleDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#cmd_schedule_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_cmd_schedules",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_cmd.php",
					data: a,
					success: function (e) {
						"OK" == e && $("#cmd_schedule_list_grid").trigger("reloadGrid")
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function cmdTemplateReload() {
	cmdTemplateLoadData(), $("#cmd_template_list_grid").trigger("reloadGrid")
}

function cmdTemplateLoadData() {
	$.ajax({
		type: "POST",
		url: "func/fn_cmd.php",
		data: {
			cmd: "load_cmd_template_data"
		},
		dataType: "json",
		cache: !1,
		success: function (e) {
			cmdData.cmd_templates = e, cmdGPRSTemplateList(), cmdSMSTemplateList(), cmdScheduleTemplateList(), settingsEventCmdTemplateList()
		}
	})
}

function cmdTemplateImport() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", cmdTemplateImportCTEFile, !1), document.getElementById("load_file").click())
}

function cmdTemplateExport() {
	if (utilsCheckPrivileges("viewer")) {
		window.location = "func/fn_export.php?format=cte"
	}
}

function cmdTemplateImportCTEFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onload = function (e) {
		try {
			var t = $.parseJSON(e.target.result);
			if ("0.1v" == t.cte) {
				var a = t.templates.length;
				if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
				confirmDialog(sprintf(la.TEMPLATES_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function (t) {
					if (t) {
						loadingData(!0);
						var a = {
							format: "cte",
							data: e.target.result
						};
						$.ajax({
							type: "POST",
							url: "func/fn_import.php",
							data: a,
							cache: !1,
							success: function (e) {
								loadingData(!1), "OK" == e && cmdTemplateReload()
							},
							error: function (e, t) {
								loadingData(!1)
							}
						})
					}
				})
			} else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		} catch (e) {
			notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		}
		document.getElementById("load_file").value = ""
	}, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", cmdTemplateImportCTEFile, !1)
}

function cmdTemplateProtocolList() {
	var e = document.getElementById("dialog_cmd_template_protocol").value,
		t = document.getElementById("dialog_cmd_template_hide_unsed_protocols").checked,
		a = document.getElementById("dialog_cmd_template_protocol");
	if (a.options.length = 0, 1 == t)
		for (var i = getAllProtocolsArray(), o = 0; o < i.length; o++) "" != i[o] && a.options.add(new Option(i[o], i[o]));
	else
		for (var s in gsValues.protocol_list) {
			var n = gsValues.protocol_list[s];
			a.options.add(new Option(n.name, n.name))
		}
	sortSelectList(a), a.options.add(new Option(la.ALL_PROTOCOLS, ""), 0), document.getElementById("dialog_cmd_template_protocol").value = e, $("#dialog_cmd_template_protocol").multipleSelect("refresh")
}

function cmdTemplateProperties(e) {
	switch (e) {
		default:
			var t = e;
			cmdData.edit_cmd_template_id = t, document.getElementById("dialog_cmd_template_hide_unsed_protocols").checked = !1, cmdTemplateProtocolList(), document.getElementById("dialog_cmd_template_name").value = cmdData.cmd_templates[t].name, document.getElementById("dialog_cmd_template_protocol").value = cmdData.cmd_templates[t].protocol, $("#dialog_cmd_template_protocol").multipleSelect("refresh"), document.getElementById("dialog_cmd_template_gateway").value = cmdData.cmd_templates[t].gateway, $("#dialog_cmd_template_gateway").multipleSelect("refresh"), document.getElementById("dialog_cmd_template_type").value = cmdData.cmd_templates[t].type, $("#dialog_cmd_template_type").multipleSelect("refresh"), document.getElementById("dialog_cmd_template_cmd").value = cmdData.cmd_templates[t].cmd, $("#dialog_cmd_template_properties").dialog("open");
			break;
		case "add":
			cmdData.edit_cmd_template_id = !1, document.getElementById("dialog_cmd_template_hide_unsed_protocols").checked = !1, cmdTemplateProtocolList(), document.getElementById("dialog_cmd_template_name").value = "", document.getElementById("dialog_cmd_template_protocol").value = "", $("#dialog_cmd_template_protocol").multipleSelect("refresh"), document.getElementById("dialog_cmd_template_gateway").value = "gprs", $("#dialog_cmd_template_gateway").multipleSelect("refresh"), document.getElementById("dialog_cmd_template_type").value = "ascii", $("#dialog_cmd_template_type").multipleSelect("refresh"), document.getElementById("dialog_cmd_template_cmd").value = "", $("#dialog_cmd_template_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_cmd_template_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var a = document.getElementById("dialog_cmd_template_name").value,
				i = document.getElementById("dialog_cmd_template_protocol").value,
				o = document.getElementById("dialog_cmd_template_gateway").value,
				s = document.getElementById("dialog_cmd_template_type").value,
				n = document.getElementById("dialog_cmd_template_cmd").value;
			if ("" == a) return void notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY, !0);
			if ("" == n) return void notifyBox("error", la.ERROR, la.COMMAND_CANT_BE_EMPTY, !0);
			if ("hex" == s && (n = n.toUpperCase(), !isHexValid(n.replace("%IMEI%", "")))) return void notifyBox("error", la.ERROR, la.COMMAND_HEX_NOT_VALID, !0);
			var l = {
				cmd: "save_cmd_template",
				cmd_id: cmdData.edit_cmd_template_id,
				name: a,
				protocol: i,
				gateway: o,
				type: s,
				cmd_: n
			};
			$.ajax({
				type: "POST",
				url: "func/fn_cmd.php",
				data: l,
				cache: !1,
				success: function (e) {
					"OK" == e && (cmdTemplateReload(), $("#dialog_cmd_template_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function cmdTemplateDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_cmd_template",
				cmd_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_cmd.php",
				data: a,
				success: function (e) {
					"OK" == e && cmdTemplateReload()
				}
			})
		}
	})
}

function cmdTemplateDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#cmd_template_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_cmd_templates",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_cmd.php",
					data: a,
					success: function (e) {
						"OK" == e && cmdTemplateReload()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}
cmdData.cmd_templates = new Array, cmdData.edit_cmd_schedule_id = !1, cmdData.edit_cmd_template_id = !1;
var eventsData = new Array,
	timer_eventsLoadData;

function eventsReloadData() {
	eventsCheckForNew()
}

function eventsLoadData() {
	clearTimeout(timer_eventsLoadData), timer_eventsLoadData = setTimeout("eventsLoadData();", 1e3 * gsValues.event_refresh), eventsCheckForNew()
}

function eventsCheckForNew() {
	var e = {
		cmd: "load_last_event",
		last_id: eventsData.last_id
	};
	$.ajax({
		type: "POST",
		url: "func/fn_events.php",
		data: e,
		dataType: "json",
		success: function (e) {
			if (0 != e) {
				eventsData.push_notification = !1;
				for (var t = 0; t < e.length; t++) {
					if (eventsData.last_id < e[t].event_id && 1 == eventsData.events_loaded && null != settingsObjectData[e[t].imei] && "true" == settingsObjectData[e[t].imei].active) {
						var a = !1,
							i = !1;
						"true" == e[t].notify_arrow && (a = e[t].notify_arrow_color), "true" == e[t].notify_ohc && (i = e[t].notify_ohc_color), objectSetStatusEvent(e[t].imei, a, i);
						var o = e[t].notify_system.split(",");
						if ("true" == o[0]) {
							"true" == settingsUserData.push_notify_desktop && "true" == e[t].notify_push && (eventsData.push_notification = !0);
							var s = e[t].lat,
								n = e[t].lng,
								l = urlPosition(s, n),
								d = '<div class="row">';
							d += '<div class="row2"><div class="width40"><strong>' + la.OBJECT + ':</strong></div><div class="width60">' + e[t].name + "</div></div>", d += '<div class="row2"><div class="width40"><strong>' + la.EVENT + ':</strong></div><div class="width60">' + e[t].event_desc + "</div></div>", d += '<div class="row2"><div class="width40"><strong>' + la.POSITION + ':</strong></div><div class="width60">' + l + "</div></div>", d += '<div class="row2"><div class="width40"><strong>' + la.TIME + ':</strong></div><div class="width60">' + e[t].dt_tracker + "</div></div>", d += "</div>", d += '<div class="row">', d += '<center><a href="#" onclick="eventsShowEvent(' + e[t].event_id + ');">' + la.SHOW_EVENT + "</a></center>", d += "</div>";
							var r = !1;
							if ("true" == o[1] && (r = !0), notifyBox("error", la.NEW_EVENT, d, r), "true" == o[2]) null == o[3] && (o[3] = "alarm1.mp3"), new Audio("snd/" + o[3]).play()
						}
					}
					t == e.length - 1 && (eventsData.last_id = e[t].event_id, $("#side_panel_events_event_list_grid").trigger("reloadGrid"))
				}
				1 == eventsData.push_notification && Push.create(la.NEW_EVENT, {
					body: la.NEW_EVENT_WAS_RECEIVED,
					timeout: 5e3,
					onClick: function () {
						window.focus(), this.close()
					}
				}), 1 == $("#dialog_dashboard").dialog("isOpen") && dashboardInitEvents()
			}
			eventsData.events_loaded = !0
		}
	})
}

function eventsExport() {
	window.location = "func/fn_export.php?format=events_csv"
}

function eventsDeleteAll() {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_history_clear") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_EVENTS, function (e) {
		if (e) {
			$.ajax({
				type: "POST",
				url: "func/fn_events.php",
				data: {
					cmd: "delete_all_events"
				},
				success: function (e) {
					"OK" == e && (datalistClear("event"), $("#side_panel_events_event_list_grid").trigger("reloadGrid"))
				}
			})
		}
	})
}

function eventsShowEvent(e) {
	var t = {
		cmd: "load_event_data",
		event_id: e
	};
	$.ajax({
		type: "POST",
		url: "func/fn_events.php",
		data: t,
		dataType: "json",
		cache: !1,
		success: function (e) {
			datalistShowData("event", e.imei, e);
			var t = e.lat,
				a = e.lng,
				i = e.angle;
			geocoderGetAddress(t, a, function (o) {
				var s = e.imei,
					n = o,
					l = urlPosition(t, a),
					d = e.params,
					r = "",
					_ = new Array;
				for (var c in settingsObjectData[s].sensors) _.push(settingsObjectData[s].sensors[c]);
				var g = sortArrayByElement(_, "name");
				for (var c in g) {
					var m = g[c];
					if ("true" == m.popup)
						if ("fuelsumup" == m.type) {
							var u = getSensorValueFuelLevelSumUp(s, d, m);
							r += "<tr><td><strong>" + m.name + ":</strong></td><td>" + u.value_full + "</td></tr>"
						} else {
							u = getSensorValue(d, m);
							r += "<tr><td><strong>" + m.name + ":</strong></td><td>" + u.value_full + "</td></tr>"
						}
				}
				var p = "<table>\t\t\t\t\t<tr><td><strong>" + la.OBJECT + ":</strong></td><td>" + e.name + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.EVENT + ":</strong></td><td>" + e.event_desc + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + n + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + l + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.ALTITUDE + ":</strong></td><td>" + e.altitude + " " + la.UNIT_HEIGHT + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.ANGLE + ":</strong></td><td>" + e.angle + " &deg;</td></tr>\t\t\t\t\t<tr><td><strong>" + la.SPEED + ":</strong></td><td>" + e.speed + " " + la.UNIT_SPEED + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.TIME + ":</strong></td><td>" + e.dt_tracker + "</td></tr>",
					y = getObjectOdometer(s, d); - 1 != y && (p += "<tr><td><strong>" + la.ODOMETER + ":</strong></td><td>" + y + " " + la.UNIT_DISTANCE + "</td></tr>");
				var h = getObjectEngineHours(s, d); - 1 != h && (p += "<tr><td><strong>" + la.ENGINE_HOURS + ":</strong></td><td>" + h + "</td></tr>");
				var v = p + r;
				addPopupToMap(t, a, [0, 0], p += "</table>", v += "</table>"), map.panTo({
					lat: t,
					lng: a
				}), 1 == gsValues.map_street_view && (objectUnSelectAll(), utilsStreetView(t, a, i))
			})
		}
	})
}

function initMap() {
	map = L.map("map", {
		minZoom: gsValues.map_min_zoom,
		maxZoom: gsValues.map_max_zoom,
		editable: !0,
		zoomControl: !1
	}), initSelectList("map_layer_list"), defineMapLayers(), mapLayers.utils = L.layerGroup(), mapLayers.utils.addTo(map), mapLayers.realtime = createCluster("objects"), mapLayers.realtime.addTo(map), mapLayers.history = L.layerGroup(), mapLayers.history.addTo(map), mapLayers.places_markers = createCluster("markers"), mapLayers.places_markers.addTo(map), mapLayers.places_zones = L.layerGroup(), mapLayers.places_zones.addTo(map), mapLayers.places_routes = L.layerGroup(), mapLayers.places_routes.addTo(map), mapLayers.kml = L.layerGroup(), mapLayers.kml.addTo(map), map.addControl(L.control.zoom({
		zoomInText: "",
		zoomOutText: "",
		zoomInTitle: la.ZOOM_IN,
		zoomOutTitle: la.ZOOM_OUT
	})), L.MapViewControls = mapViewControls(), map.addControl(new L.MapViewControls), L.MapViewControls = mapToolControls(), map.addControl(new L.MapViewControls), L.Control.BrowserPrint.Utils.registerLayer(L.BingLayer, "L.BingLayer", function (e) {
		return new L.BingLayer(e._key, e.options)
	}), L.Control.BrowserPrint.Utils.registerLayer(L.Google, "L.Google", function (e) {
		return new L.Google(e._type)
	}), L.Control.BrowserPrint.Utils.registerLayer(L.Yandex, "L.Yandex", function (e) {
		return new L.Yandex
	}), L.control.browserPrint({
		title: la.PRINT_MAP,
		printModes: [L.control.browserPrint.mode.portrait(la.PORTRAIT, "A4"), L.control.browserPrint.mode.landscape(la.LANDSCAPE, "A4"), L.control.browserPrint.mode.custom(la.CUSTOM, "A4")]
	}).addTo(map), map.setView([gsValues.map_lat, gsValues.map_lng], gsValues.map_zoom), switchMapLayer(gsValues.map_layer), defineMapKMLLayers(map), gsValues.map_objects || document.getElementById("map_control_objects").click(), gsValues.map_object_labels || (iconObjectLabels.className = "icon-text disabled"), gsValues.map_markers || document.getElementById("map_control_markers").click(), gsValues.map_routes || document.getElementById("map_control_routes").click(), gsValues.map_zones || document.getElementById("map_control_zones").click(), gsValues.map_kml || document.getElementById("map_control_kml").click(), map.on("zoomend", function () {
		historyRouteDataPoints()
	});
	var e = settingsUserData.map_is,
		t = 28 * e,
		a = 28 * e,
		i = 14 * e,
		o = 14 * e;
	t = 28 * e, a = 28 * e, i = 14 * e, o = 14 * e;
	mapMarkerIcons.arrow_black = L.icon({
		iconUrl: "img/markers/arrow-black.svg",
		iconSize: [t, a],
		iconAnchor: [i, o],
		popupAnchor: [0, 0]
	}), mapMarkerIcons.arrow_blue = L.icon({
		iconUrl: "img/markers/arrow-blue.svg",
		iconSize: [t, a],
		iconAnchor: [i, o],
		popupAnchor: [0, 0]
	}), mapMarkerIcons.arrow_green = L.icon({
		iconUrl: "img/markers/arrow-green.svg",
		iconSize: [t, a],
		iconAnchor: [i, o],
		popupAnchor: [0, 0]
	}), mapMarkerIcons.arrow_grey = L.icon({
		iconUrl: "img/markers/arrow-grey.svg",
		iconSize: [t, a],
		iconAnchor: [i, o],
		popupAnchor: [0, 0]
	}), mapMarkerIcons.arrow_orange = L.icon({
		iconUrl: "img/markers/arrow-orange.svg",
		iconSize: [t, a],
		iconAnchor: [i, o],
		popupAnchor: [0, 0]
	}), mapMarkerIcons.arrow_purple = L.icon({
		iconUrl: "img/markers/arrow-purple.svg",
		iconSize: [t, a],
		iconAnchor: [i, o],
		popupAnchor: [0, 0]
	}), mapMarkerIcons.arrow_red = L.icon({
		iconUrl: "img/markers/arrow-red.svg",
		iconSize: [t, a],
		iconAnchor: [i, o],
		popupAnchor: [0, 0]
	}), mapMarkerIcons.arrow_yellow = L.icon({
		iconUrl: "img/markers/arrow-yellow.svg",
		iconSize: [t, a],
		iconAnchor: [i, o],
		popupAnchor: [0, 0]
	}), t = 28 * e, a = 28 * e, i = 14 * e, o = 28 * e, mapMarkerIcons.route_start = L.icon({
		iconUrl: "img/markers/route-start.svg",
		iconSize: [t, a],
		iconAnchor: [i, o],
		popupAnchor: [0, 0]
	}), mapMarkerIcons.route_end = L.icon({
		iconUrl: "img/markers/route-end.svg",
		iconSize: [t, a],
		iconAnchor: [i, o],
		popupAnchor: [0, 0]
	}), mapMarkerIcons.route_stop = L.icon({
		iconUrl: "img/markers/route-stop.svg",
		iconSize: [t, a],
		iconAnchor: [i, o],
		popupAnchor: [0, 0]
	}), mapMarkerIcons.route_event = L.icon({
		iconUrl: "img/markers/route-event.svg",
		iconSize: [t, a],
		iconAnchor: [i, o],
		popupAnchor: [0, 0]
	}), mapMarkerIcons.route_data_point = L.icon({
		iconUrl: "img/markers/route-data-point.svg",
		iconSize: [8, 8],
		iconAnchor: [4, 4],
		popupAnchor: [0, 0]
	})
}

function initGui() {
	$("#map_action_menu").menu({
		role: "listbox",
		select: function (e, t) {
			var a = menuOnItem,
				i = t.item.children().attr("tag");
			"street_view_new" == i && utilsStreetViewPoint(a.lat, a.lng, !0), "show_point" == i && utilsPointOnMap(a.lat, a.lng), "route_to_point" == i && utilsRouteToPoint(a), "route_between_points" == i && utilsRouteBetweenPoints(a), "add_task" == i && tasksNew(a), "add_marker" == i && (document.getElementById("side_panel_places_tab").click(), document.getElementById("side_panel_places_markers_tab").click(), placesMarkerNew(a)), "add_route" == i && (document.getElementById("side_panel_places_tab").click(), document.getElementById("side_panel_places_routes_tab").click(), placesRouteNew(a)), "add_zone" == i && (document.getElementById("side_panel_places_tab").click(), document.getElementById("side_panel_places_zones_tab").click(), placesZoneNew(a))
		}
	}), $("#map_action_menu").hide(), $("#dashboard_objects_action_menu").menu({
		role: "listbox"
	}), $("#dashboard_objects_action_menu").hide(), $("#dashboard_events_action_menu").menu({
		role: "listbox"
	}), $("#dashboard_events_action_menu").hide(), $("#dashboard_tasks_action_menu").menu({
		role: "listbox"
	}), $("#dashboard_tasks_action_menu").hide(), $("#side_panel_objects_action_menu").menu({
		role: "listbox",
		select: function (e, t) {
			var a = menuOnItem,
				i = t.item.children().attr("tag");
			"edit" == i && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_edit") && loadSettings("objects", function () {
				settingsObjectEdit(a)
			}), "cmd" == i && (document.getElementById("cmd_gprs_object_list").value = a, $("#cmd_gprs_object_list").multipleSelect("refresh"), cmdOpen()), "follow" == i && utilsFollowObject(a, !1), "follow_new" == i && utilsFollowObject(a, !0), "street_view" == i && utilsStreetViewObject(a, !1), "street_view_new" == i && utilsStreetViewObject(a, !0), "share_position" == i && (sharePositionOpen(), sharePositionProperties("add"), document.getElementById("dialog_share_position_object_list").value = a, $("#dialog_share_position_object_list").multipleSelect("refresh")), "sh" == i.substring(0, 2) && "share_position" != i && (document.getElementById("side_panel_history_object_list").value = a, $("#side_panel_history_object_list").multipleSelect("refresh"), "shlh" == i && (document.getElementById("side_panel_history_filter").value = 1), "sht" == i && (document.getElementById("side_panel_history_filter").value = 2), "shy" == i && (document.getElementById("side_panel_history_filter").value = 3), "shb2" == i && (document.getElementById("side_panel_history_filter").value = 4), "shb3" == i && (document.getElementById("side_panel_history_filter").value = 5), "shtw" == i && (document.getElementById("side_panel_history_filter").value = 6), "shlw" == i && (document.getElementById("side_panel_history_filter").value = 7), "shtm" == i && (document.getElementById("side_panel_history_filter").value = 8), "shlm" == i && (document.getElementById("side_panel_history_filter").value = 9), $("#side_panel_history_filter").multipleSelect("refresh"), switchDateFilter("history"), historyLoadRoute())
		}
	}), $("#side_panel_objects_action_menu").hide(), $("#side_panel_history_import_export_action_menu").menu({
		role: "listbox"
	}), $("#side_panel_history_import_export_action_menu").hide(), $("#side_panel_history_import_export_action_menu_button").click(function () {
		return $("#side_panel_history_import_export_action_menu").toggle().position({
			my: "left top",
			at: "left bottom+2",
			of: this
		}), $(document).one("click", function () {
			$("#side_panel_history_import_export_action_menu").hide()
		}), !1
	}), $("#report_action_menu").menu({
		role: "listbox",
		select: function (e, t) {
			var a = menuOnItem,
				i = t.item.children().attr("tag");
			if ("grlh" == i) {
				var o = moment().format("YYYY-MM-DD"),
					s = moment().format("YYYY-MM-DD");
				o += " " + moment().subtract("hour", 1).format("HH") + ":" + moment().subtract("hour", 1).format("mm") + ":00", s += " " + moment().format("HH") + ":" + moment().format("mm") + ":00"
			}
			if ("grt" == i) o = moment().format("YYYY-MM-DD") + " 00:00:00", s = moment().add("days", 1).format("YYYY-MM-DD") + " 00:00:00";
			if ("gry" == i) o = moment().subtract("days", 1).format("YYYY-MM-DD") + " 00:00:00", s = moment().format("YYYY-MM-DD") + " 00:00:00";
			if ("grb2" == i) o = moment().subtract("days", 2).format("YYYY-MM-DD") + " 00:00:00", s = moment().subtract("days", 1).format("YYYY-MM-DD") + " 00:00:00";
			if ("grb3" == i) o = moment().subtract("days", 3).format("YYYY-MM-DD") + " 00:00:00", s = moment().subtract("days", 2).format("YYYY-MM-DD") + " 00:00:00";
			if ("grtw" == i) o = moment().isoWeekday(1).format("YYYY-MM-DD") + " 00:00:00", s = moment().add("days", 1).format("YYYY-MM-DD") + " 00:00:00";
			if ("grlw" == i) o = moment().isoWeekday(1).subtract("week", 1).format("YYYY-MM-DD") + " 00:00:00", s = moment().isoWeekday(1).format("YYYY-MM-DD") + " 00:00:00";
			if ("grtm" == i) o = moment().startOf("month").format("YYYY-MM-DD") + " 00:00:00", s = moment().add("days", 1).format("YYYY-MM-DD") + " 00:00:00";
			if ("grlm" == i) o = moment().startOf("month").subtract("month", 1).format("YYYY-MM-DD") + " 00:00:00", s = moment().startOf("month").format("YYYY-MM-DD") + " 00:00:00";
			"gr" == i.substring(0, 2) && reportGenerate({
				cmd: "report",
				name: reportsData.reports[a].name,
				type: reportsData.reports[a].type,
				ignore_empty_reports: reportsData.reports[a].ignore_empty_reports,
				format: reportsData.reports[a].format,
				show_coordinates: reportsData.reports[a].show_coordinates,
				show_addresses: reportsData.reports[a].show_addresses,
				markers_addresses: reportsData.reports[a].markers_addresses,
				zones_addresses: reportsData.reports[a].zones_addresses,
				stop_duration: reportsData.reports[a].stop_duration,
				speed_limit: reportsData.reports[a].speed_limit,
				imei: reportsData.reports[a].imei,
				marker_ids: reportsData.reports[a].marker_ids,
				zone_ids: reportsData.reports[a].zone_ids,
				sensor_names: reportsData.reports[a].sensor_names,
				data_items: reportsData.reports[a].data_items,
				other: JSON.stringify(reportsData.reports[a].other),
				dtf: o,
				dtt: s
			})
		}
	}), $("#report_action_menu").hide(), $.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker, $.datepicker._updateDatepicker = function (e) {
		$.datepicker._updateDatepicker_original(e);
		var t = this._get(e, "afterShow");
		t && t.apply(e.input ? e.input[0] : null)
	}, $(".inputbox-calendar").datepicker({
		afterShow: function () {
			$(".ui-datepicker select").multipleSelect({
				single: !0
			})
		},
		changeMonth: !0,
		changeYear: !0,
		dateFormat: "yy-mm-dd",
		firstDay: 1,
		dayNamesMin: [la.DAY_SUNDAY_S, la.DAY_MONDAY_S, la.DAY_TUESDAY_S, la.DAY_WEDNESDAY_S, la.DAY_THURSDAY_S, la.DAY_FRIDAY_S, la.DAY_SATURDAY_S],
		monthNames: [la.MONTH_JANUARY, la.MONTH_FEBRUARY, la.MONTH_MARCH, la.MONTH_APRIL, la.MONTH_MAY, la.MONTH_JUNE, la.MONTH_JULY, la.MONTH_AUGUST, la.MONTH_SEPTEMBER, la.MONTH_OCTOBER, la.MONTH_NOVEMBER, la.MONTH_DECEMBER],
		monthNamesShort: [la.MONTH_JANUARY_S, la.MONTH_FEBRUARY_S, la.MONTH_MARCH_S, la.MONTH_APRIL_S, la.MONTH_MAY_S, la.MONTH_JUNE_S, la.MONTH_JULY_S, la.MONTH_AUGUST_S, la.MONTH_SEPTEMBER_S, la.MONTH_OCTOBER_S, la.MONTH_NOVEMBER_S, la.MONTH_DECEMBER_S]
	}), $(".inputbox-calendar-mmdd").datepicker({
		afterShow: function () {
			$(".ui-datepicker select").multipleSelect({
				single: !0
			})
		},
		changeMonth: !0,
		changeYear: !0,
		dateFormat: "mm-dd",
		firstDay: 1,
		dayNamesMin: [la.DAY_SUNDAY_S, la.DAY_MONDAY_S, la.DAY_TUESDAY_S, la.DAY_WEDNESDAY_S, la.DAY_THURSDAY_S, la.DAY_FRIDAY_S, la.DAY_SATURDAY_S],
		monthNames: [la.MONTH_JANUARY, la.MONTH_FEBRUARY, la.MONTH_MARCH, la.MONTH_APRIL, la.MONTH_MAY, la.MONTH_JUNE, la.MONTH_JULY, la.MONTH_AUGUST, la.MONTH_SEPTEMBER, la.MONTH_OCTOBER, la.MONTH_NOVEMBER, la.MONTH_DECEMBER],
		monthNamesShort: [la.MONTH_JANUARY_S, la.MONTH_FEBRUARY_S, la.MONTH_MARCH_S, la.MONTH_APRIL_S, la.MONTH_MAY_S, la.MONTH_JUNE_S, la.MONTH_JULY_S, la.MONTH_AUGUST_S, la.MONTH_SEPTEMBER_S, la.MONTH_OCTOBER_S, la.MONTH_NOVEMBER_S, la.MONTH_DECEMBER_S]
	}), $("#side_panel,\t  #side_panel_places,\t  #bottom_panel_tabs,\t  #settings_main,\t  #settings_main_objects_groups_drivers,\t  #settings_object,\t  #settings_object_edit_select_icon_tabs,\t  #settings_event,\t  #reports_tabs,\t  #cmd_tabs,\t  #places_marker_icon_tabs").tabs({}), $("#dialog_notify").dialog({
		autoOpen: !1,
		width: "auto",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1,
		draggable: !1,
		dialogClass: "dialog-notify-titlebar"
	}), $("#dialog_confirm").dialog({
		autoOpen: !1,
		width: "auto",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1,
		draggable: !1,
		dialogClass: "dialog-notify-titlebar"
	}), $("#dialog_about").dialog({
		autoOpen: !1,
		width: "480",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_show_point").dialog({
		autoOpen: !1,
		width: "250",
		height: "auto",
		minHeight: "auto",
		position: {
			my: "left top",
			at: "left+412 top+47"
		},
		resizable: !1
	}), $("#dialog_address_search").dialog({
		autoOpen: !1,
		width: "250",
		height: "auto",
		minHeight: "auto",
		position: {
			my: "left top",
			at: "left+412 top+47"
		},
		resizable: !1
	}), $("#dialog_share_position").dialog({
		autoOpen: !1,
		width: "992",
		height: "auto",
		minHeight: "auto",
		resizable: !1
	}), $("#dialog_share_position_properties").dialog({
		autoOpen: !1,
		width: "750",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_cmd").dialog({
		autoOpen: !1,
		width: "880",
		height: "auto",
		minHeight: "auto",
		resizable: !1
	}), $("#dialog_cmd_schedule_properties").dialog({
		autoOpen: !1,
		width: "750",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_cmd_template_properties").dialog({
		autoOpen: !1,
		width: "450",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_image_gallery").dialog({
		autoOpen: !1,
		width: "992",
		height: "auto",
		minHeight: "auto",
		resizable: !1
	}), $("#dialog_chat").dialog({
		autoOpen: !1,
		width: "992",
		height: "520",
		minWidth: 500,
		minHeight: 300,
		resizable: !0,
		close: function (e, t) {
			chatClose()
		}
	}), $("#dialog_dashboard").dialog({
		autoOpen: !1,
		width: "auto",
		height: "auto",
		modal: !0,
		resizable: !1,
		draggable: !1,
		open: function (e, t) {
			dashboardResize()
		}
	}), $("#dialog_reports").dialog({
		autoOpen: !1,
		width: "992",
		height: "auto",
		minHeight: "auto",
		resizable: !1
	}), $("#dialog_report_properties").dialog({
		autoOpen: !1,
		width: "850",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_tachograph").dialog({
		autoOpen: !1,
		width: "992",
		height: "auto",
		minHeight: "auto",
		resizable: !1
	}), $("#dialog_tasks").dialog({
		autoOpen: !1,
		width: "992",
		height: "520",
		minWidth: 992,
		minHeight: 350,
		resizable: !0,
		close: function (e, t) {
			tasksClose()
		}
	}), $("#dialog_task_properties").dialog({
		autoOpen: !1,
		width: "950",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_rilogbook").dialog({
		autoOpen: !1,
		width: "992",
		height: "520",
		minWidth: 992,
		minHeight: 350,
		resizable: !0,
		close: function (e, t) {
			rilogbookClose()
		}
	}), $("#dialog_dtc").dialog({
		autoOpen: !1,
		width: "992",
		height: "520",
		minWidth: 992,
		minHeight: 350,
		resizable: !0,
		close: function (e, t) {
			dtcClose()
		}
	}), $("#dialog_maintenance").dialog({
		autoOpen: !1,
		width: "992",
		height: "520",
		minWidth: 992,
		minHeight: 350,
		resizable: !0,
		close: function (e, t) {
			maintenanceClose()
		}
	}), $("#dialog_maintenance_service_properties").dialog({
		autoOpen: !1,
		width: "720",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_expenses").dialog({
		autoOpen: !1,
		width: "992",
		height: "520",
		minWidth: 992,
		minHeight: 350,
		resizable: !0,
		close: function (e, t) {
			expensesClose()
		}
	}), $("#dialog_expense_properties").dialog({
		autoOpen: !1,
		width: "720",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings").dialog({
		autoOpen: !1,
		width: "850",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1,
		close: function (e, t) {
			settingsClose()
		}
	}), $("#dialog_settings_object_add").dialog({
		autoOpen: !1,
		width: "300",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_object_edit").dialog({
		autoOpen: !1,
		width: "720",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_object_duplicate").dialog({
		autoOpen: !1,
		width: "300",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_object_edit_select_icon").dialog({
		autoOpen: !1,
		width: "412",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_object_edit_accvirt").dialog({
		autoOpen: !1,
		width: "412",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_object_group_properties").dialog({
		autoOpen: !1,
		width: "350",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_object_driver_properties").dialog({
		autoOpen: !1,
		width: "600",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_object_passenger_properties").dialog({
		autoOpen: !1,
		width: "400",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_object_trailer_properties").dialog({
		autoOpen: !1,
		width: "400",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_object_sensor_properties").dialog({
		autoOpen: !1,
		width: "900",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_object_service_properties").dialog({
		autoOpen: !1,
		width: "720",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_object_custom_field_properties").dialog({
		autoOpen: !1,
		width: "350",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_event_properties").dialog({
		autoOpen: !1,
		width: "750",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1,
		open: function (e, t) {
			$("#settings_event").tabs("option", "active", 0)
		}
	}), $("#dialog_settings_template_properties").dialog({
		autoOpen: !1,
		width: "800",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_kml_properties").dialog({
		autoOpen: !1,
		width: "450",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_settings_subaccount_properties").dialog({
		autoOpen: !1,
		width: "750",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_places_groups").dialog({
		autoOpen: !1,
		width: "750",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1,
		close: function (e, t) {
			placesGroupClose()
		}
	}), $("#dialog_places_group_properties").dialog({
		autoOpen: !1,
		width: "350",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1
	}), $("#dialog_places_marker_properties").dialog({
		autoOpen: !1,
		width: "324",
		height: "auto",
		minHeight: "auto",
		resizable: !1,
		draggable: !1,
		position: {
			my: "left top",
			at: "left+10 top+112"
		},
		closeOnEscape: !1,
		open: function (e, t) {
			$(this).parent().children().children(".ui-dialog-titlebar-close").remove()
		}
	}), $("#dialog_places_zone_properties").dialog({
		autoOpen: !1,
		width: "265",
		height: "auto",
		minHeight: "auto",
		resizable: !1,
		draggable: !1,
		position: {
			my: "left top",
			at: "left+10 top+112"
		},
		closeOnEscape: !1,
		open: function (e, t) {
			$(this).parent().children().children(".ui-dialog-titlebar-close").remove()
		}
	}), $("#dialog_places_route_properties").dialog({
		autoOpen: !1,
		width: "265",
		height: "auto",
		minHeight: "auto",
		resizable: !1,
		draggable: !1,
		position: {
			my: "left top",
			at: "left+10 top+112"
		},
		closeOnEscape: !1,
		open: function (e, t) {
			$(this).parent().children().children(".ui-dialog-titlebar-close").remove()
		}
	}), $("#dialog_billing").dialog({
		autoOpen: !1,
		width: "750",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1,
		dialogClass: "dialog-billing-titlebar",
		close: function (e, t) {
			billingClose()
		}
	}), $("#dialog_billing_plan_use").dialog({
		autoOpen: !1,
		width: "695",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1,
		dialogClass: "dialog-billing-titlebar"
	}), $("#dialog_billing_plan_purchase").dialog({
		autoOpen: !1,
		width: "695",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1,
		dialogClass: "dialog-billing-titlebar"
	}), $("#side_panel_objects_dragbar").mousedown(function (e) {
		e.preventDefault(), $(document).mousemove(guiDragbarObjectsHandler)
	}), $("#side_panel_events_dragbar").mousedown(function (e) {
		e.preventDefault(), $(document).mousemove(guiDragbarEventsHandler)
	}), $("#side_panel_history_dragbar").mousedown(function (e) {
		e.preventDefault(), $(document).mousemove(guiDragbarHistoryHandler)
	}), $("#bottom_panel_dragbar").mousedown(function (e) {
		e.preventDefault(), $(document).mousemove(guiDragbarBottomPanelHandler)
	}), $(document).mouseup(function (e) {
		map.invalidateSize(!0), $("#map").css("pointer-events", ""), $(document).unbind("mousemove", guiDragbarObjectsHandler), $(document).unbind("mousemove", guiDragbarEventsHandler), $(document).unbind("mousemove", guiDragbarHistoryHandler), $(document).unbind("mousemove", guiDragbarBottomPanelHandler)
	}), map.on("contextmenu", function (e) {
		menuOnItem = e.latlng, $("#map_action_menu").toggle().position({
			my: "left top",
			at: "left+" + e.containerPoint.x + " top+" + e.containerPoint.y,
			collision: "fit",
			of: $("#map")
		}), $(document).one("click", function () {
			$("#map_action_menu").hide()
		})
	}), $(".select").multipleSelect({
		single: !0
	}), $(".select-search").multipleSelect({
		width: "100%",
		single: !0,
		filter: !0
	}), $(".select-multiple").multipleSelect({
		width: "100%",
		selectAllText: la.SELECT_ALL,
		allSelected: la.ALL_SELECTED,
		countSelected: "# " + la.SELECTED.toLowerCase(),
		noMatchesFound: la.NO_MATCHES_FOUND,
		noItems: la.NO_ITEMS,
		placeholder: la.NOTHING_SELECTED
	}), $(".select-multiple-search").multipleSelect({
		width: "100%",
		filter: !0,
		selectAllText: la.SELECT_ALL,
		allSelected: la.ALL_SELECTED,
		countSelected: "# " + la.SELECTED.toLowerCase(),
		noMatchesFound: la.NO_MATCHES_FOUND,
		noItems: la.NO_ITEMS,
		placeholder: la.NOTHING_SELECTED
	}), document.getElementById("side_panel_history_filter").value = 2, $("#side_panel_history_filter").multipleSelect("refresh"), document.getElementById("dialog_report_filter").value = 2, $("#dialog_report_filter").multipleSelect("refresh"), switchDateFilter("history"), switchDateFilter("report"), switchDateFilter("tasks"), switchDateFilter("rilogbook"), switchDateFilter("dtc"), switchDateFilter("img")
}
eventsData.last_id = -1, eventsData.push_notification = !1, eventsData.events_loaded = !1;
var guiDragbarObjectsHandler = function (e) {
	$("#map").css("pointer-events", "none"), resizeGridObjects(e.pageY)
},
	guiDragbarEventsHandler = function (e) {
		$("#map").css("pointer-events", "none"), resizeGridEvents(e.pageY)
	},
	guiDragbarHistoryHandler = function (e) {
		$("#map").css("pointer-events", "none"), resizeGridHistory(e.pageY)
	},
	guiDragbarBottomPanelHandler = function (e) {
		"block" == document.getElementById("bottom_panel").style.display && ($("#map").css("pointer-events", "none"), resizeBottomPanel(e.pageY))
	};

function addPopupToMap(e, t, a, i, o) {
	if ("" != o && i != o) {
		if (1 == gsValues.map_popup_detailed) var s = 'style="display:none;"',
			n = "";
		else s = "", n = 'style="display:none;"';
		i = '<div id="popup_short" ' + s + ">" + i, i += '<div style="width:100%; text-align: right;"><a href="#" class="" onClick="switchPopupDetailed(true);">' + la.DETAILED + "</a></div>", i += "</div>", i += '<div id="popup_detailed" ' + n + ">" + o, i += '<div style="width:100%; text-align: right;"><a href="#" class="" onClick="switchPopupDetailed(false);">' + la.SHORT + "</a></div>", i += "</div>"
	}
	mapPopup = L.popup({
		offset: a
	}).setLatLng([e, t]).setContent(i).openOn(map)
}

function switchPopupDetailed(e) {
	switch (e) {
		case !1:
			document.getElementById("popup_short").style.display = "", document.getElementById("popup_detailed").style.display = "none", gsValues.map_popup_detailed = !1;
			break;
		case !0:
			document.getElementById("popup_short").style.display = "none", document.getElementById("popup_detailed").style.display = "", gsValues.map_popup_detailed = !0
	}
}

function destroyMapPopup() {
	map.closePopup()
}

function loadingData(e) {
	document.getElementById("loading_data_panel").style.display = 1 == e ? "" : "none"
}

function notifyBox(e, t, a, i) {
	$.pnotify({
		title: t,
		text: a,
		type: e,
		opacity: .8,
		closer_hover: !1,
		sticker_hover: !1,
		hide: i
	})
}

function notifyDialog(e) {
	document.getElementById("dialog_notify_text").innerHTML = e, $("#dialog_notify").dialog("open")
}
$(window).resize(function () {
	$("#dialog_dashboard").hasClass("ui-dialog-content") && 1 == $("#dialog_dashboard").dialog("isOpen") && dashboardResize()
}), $.pnotify.defaults.history = !1, $.pnotify.defaults.styling = "jqueryui";
var confirmResponseValue = !1;

function confirmDialog(e, t) {
	confirmResponseValue = !1, document.getElementById("dialog_confirm_text").innerHTML = e, $("#dialog_confirm").dialog("destroy"), $("#dialog_confirm").dialog({
		autoOpen: !1,
		width: "auto",
		height: "auto",
		minHeight: "auto",
		modal: !0,
		resizable: !1,
		draggable: !1,
		dialogClass: "dialog-notify-titlebar",
		close: function (e, a) {
			t(confirmResponseValue)
		},
		create: function (e, t) {
			$(this).parent().css("maxWidth", "600px")
		}
	}), $("#dialog_confirm").dialog("open")
}

function confirmResponse(e) {
	confirmResponseValue = e, $("#dialog_confirm").dialog("close")
}

function loadObjectMapMarkerIcons() {
	var e = new Array;
	for (var t in settingsObjectData) {
		var a = settingsObjectData[t];
		e.push(a.icon)
	}
	for (e = uniqueArray(e), i = 0; i < e.length; i++) {
		var o = e[i],
			s = e[i],
			n = settingsUserData.map_is;
		mapMarkerIcons[o] = L.icon({
			iconUrl: s,
			iconSize: [28 * n, 28 * n],
			iconAnchor: [14 * n, 14 * n],
			popupAnchor: [0, 0]
		})
	}
}

function addPointerOverMarker(e) {
	e.events.register("mouseover", e, function (e) {
		document.getElementById("map").style.cursor = "pointer", OpenLayers.Event.stop(e)
	}), e.events.register("mouseout", e, function (e) {
		document.getElementById("map").style.cursor = "auto", OpenLayers.Event.stop(e)
	})
}

function rotateMarker(e, t, a) {
	$("#" + e.markers[t].icon.imageDiv.id).css("-moz-transform", "rotate(" + a + "deg)"), $("#" + e.markers[t].icon.imageDiv.id).css("-webkit-transform", "rotate(" + a + "deg)"), $("#" + e.markers[t].icon.imageDiv.id).css("-o-transform", "rotate(" + a + "deg)")
}

function createCluster(e) {
	var t = settingsUserData.map_is;
	if ("objects" == e) var a = "img/markers/clusters/objects.svg",
		o = "marker-cluster";
	else {
		if ("markers" != e) return !1;
		a = "img/markers/clusters/markers.svg", o = "marker-cluster"
	}
	if (1 == gsValues.map_clusters) var s = gsValues.map_max_zoom + 1;
	else s = gsValues.map_min_zoom;
	var n = new L.MarkerClusterGroup({
		spiderfyDistanceMultiplier: 2 * t,
		spiderfyOnMaxZoom: !0,
		showCoverageOnHover: !1,
		maxClusterRadius: 60,
		disableClusteringAtZoom: s,
		iconCreateFunction: function (e) {
			var i = e.getChildCount(),
				s = " cluster-";
			return s += i < 10 ? "small" : i < 100 ? "medium" : "large", L.divIcon({
				html: '<div><img src="' + a + '"><span>' + i + "</span></div>",
				className: o + s,
				iconSize: L.point(40 * t, 40 * t),
				iconAnchor: [14 * t, 14 * t],
				popupAnchor: [40 * t, 0 * t]
			})
		}
	});
	return "objects" == e && "true" == settingsUserData.map_ocp && n.on("clustermouseover", function (e) {
		var t = settingsUserData.map_is,
			a = e.layer.getAllChildMarkers(),
			o = "",
			s = !1;
		for (i = 0; i < a.length; i++) {
			var n = a[i].imei,
				l = settingsObjectData[n].name;
			if ("" != objectsData[n].data) {
				var d = objectsData[n].data[0].speed,
					r = getSensorFromType(n, "acc");
				if (0 == r || 0 == objectsData[n].connection) var _ = "";
				else if (1 == getSensorValue(objectsData[n].data[0].params, r[0]).value) _ = getEngineIcon(1);
				else _ = getEngineIcon(0)
			} else d = 0, _ = "";
			var c = getConnectionIcon(objectsData[n].connection);
			o += '<tr><td style="white-space: nowrap;"><strong>' + l + '</strong></td><td></td><td style="white-space: nowrap;">' + d + " " + la.UNIT_SPEED + "</td><td>" + _ + "</td><td>" + c + "</td></tr>", i > 9 && (s = !0)
		}
		o = "<table>" + o + "</table>", s && (o = '<div class="object-cluster-popup">' + o + "</div>"), addPopupToMap(e.latlng.lat, e.latlng.lng, [0, -14 * t], o, "")
	}), n
}

function mapViewControls() {
	return L.Control.extend({
		options: {
			position: "topleft"
		},
		onAdd: function (e) {
			var t = L.DomUtil.create("div", "leaflet-control leaflet-bar");
			linkObjects = L.DomUtil.create("a", "", t), linkObjects.id = "map_control_objects", linkObjects.href = "#", linkObjects.title = la.ENABLE_DISABLE_OBJECTS, linkObjects.className = "", iconObjects = L.DomUtil.create("span", "", linkObjects), iconObjects.className = "icon-objects";
			var a = L.DomEvent.stopPropagation;
			L.DomEvent.on(linkObjects, "dblclick", a), L.DomEvent.on(linkObjects, "mousedown", a), L.DomEvent.on(linkObjects, "click", function (t) {
				1 == e.hasLayer(mapLayers.realtime) ? (e.removeLayer(mapLayers.realtime), iconObjects.className = "icon-objects disabled", gsValues.map_objects = !1) : (e.addLayer(mapLayers.realtime), iconObjects.className = "icon-objects", gsValues.map_objects = !0)
			}), linkObjectLabels = L.DomUtil.create("a", "", t), linkObjectLabels.id = "map_control_object_labels", linkObjectLabels.href = "#", linkObjectLabels.title = la.ENABLE_DISABLE_OBJECT_LABELS, linkObjectLabels.className = "", iconObjectLabels = L.DomUtil.create("span", "", linkObjectLabels), iconObjectLabels.className = "icon-text";
			a = L.DomEvent.stopPropagation;
			L.DomEvent.on(linkObjectLabels, "dblclick", a), L.DomEvent.on(linkObjectLabels, "mousedown", a), L.DomEvent.on(linkObjectLabels, "click", function (e) {
				if (1 == gsValues.map_object_labels) {
					for (var t in objectsData) objectsData[t].layers.marker.closeTooltip();
					iconObjectLabels.className = "icon-text disabled", gsValues.map_object_labels = !1
				} else {
					for (var t in objectsData) objectsData[t].layers.marker.openTooltip();
					iconObjectLabels.className = "icon-text", gsValues.map_object_labels = !0
				}
			}), linkMarkers = L.DomUtil.create("a", "", t), linkMarkers.id = "map_control_markers", linkMarkers.href = "#", linkMarkers.title = la.ENABLE_DISABLE_MARKERS, linkMarkers.className = "", iconMarkers = L.DomUtil.create("span", "", linkMarkers), iconMarkers.className = "icon-markers";
			a = L.DomEvent.stopPropagation;
			L.DomEvent.on(linkMarkers, "dblclick", a), L.DomEvent.on(linkMarkers, "mousedown", a), L.DomEvent.on(linkMarkers, "click", function (t) {
				1 == e.hasLayer(mapLayers.places_markers) ? (e.removeLayer(mapLayers.places_markers), iconMarkers.className = "icon-markers disabled", gsValues.map_markers = !1) : (e.addLayer(mapLayers.places_markers), iconMarkers.className = "icon-markers", gsValues.map_markers = !0)
			}), linkRoutes = L.DomUtil.create("a", "", t), linkRoutes.id = "map_control_routes", linkRoutes.href = "#", linkRoutes.title = la.ENABLE_DISABLE_ROUTES, linkRoutes.className = "", iconRoutes = L.DomUtil.create("span", "", linkRoutes), iconRoutes.className = "icon-routes";
			a = L.DomEvent.stopPropagation;
			L.DomEvent.on(linkRoutes, "dblclick", a), L.DomEvent.on(linkRoutes, "mousedown", a), L.DomEvent.on(linkRoutes, "click", function (t) {
				1 == e.hasLayer(mapLayers.places_routes) ? (e.removeLayer(mapLayers.places_routes), iconRoutes.className = "icon-routes disabled", gsValues.map_routes = !1) : (e.addLayer(mapLayers.places_routes), iconRoutes.className = "icon-routes", gsValues.map_routes = !0)
			}), linkZones = L.DomUtil.create("a", "", t), linkZones.id = "map_control_zones", linkZones.href = "#", linkZones.title = la.ENABLE_DISABLE_ZONES, linkZones.className = "", iconZones = L.DomUtil.create("span", "", linkZones), iconZones.className = "icon-zones";
			a = L.DomEvent.stopPropagation;
			L.DomEvent.on(linkZones, "dblclick", a), L.DomEvent.on(linkZones, "mousedown", a), L.DomEvent.on(linkZones, "click", function (t) {
				1 == e.hasLayer(mapLayers.places_zones) ? (e.removeLayer(mapLayers.places_zones), iconZones.className = "icon-zones disabled", gsValues.map_zones = !1) : (e.addLayer(mapLayers.places_zones), iconZones.className = "icon-zones", gsValues.map_zones = !0)
			}), linkKML = L.DomUtil.create("a", "", t), linkKML.id = "map_control_kml", linkKML.href = "#", linkKML.title = la.ENABLE_DISABLE_KML, linkKML.className = "", iconKml = L.DomUtil.create("span", "", linkKML), iconKml.className = "icon-kml";
			a = L.DomEvent.stopPropagation;
			L.DomEvent.on(linkKML, "dblclick", a), L.DomEvent.on(linkKML, "mousedown", a), L.DomEvent.on(linkKML, "click", function (t) {
				1 == e.hasLayer(mapLayers.kml) ? (e.removeLayer(mapLayers.kml), iconKml.className = "icon-kml disabled", gsValues.map_kml = !1) : (e.addLayer(mapLayers.kml), iconKml.className = "icon-kml", gsValues.map_kml = !0)
			}), 0 == settingsUserData.privileges_kml && (linkKML.style.display = "none"), linkClusters = L.DomUtil.create("a", "", t), linkClusters.id = "map_control_clusters", linkClusters.href = "#", linkClusters.title = la.ENABLE_DISABLE_CLUSTERS, linkClusters.className = "", iconClusters = L.DomUtil.create("span", "", linkClusters), 1 == gsValues.map_clusters ? iconClusters.className = "icon-clusters" : iconClusters.className = "icon-clusters disabled";
			a = L.DomEvent.stopPropagation;
			if (L.DomEvent.on(linkClusters, "dblclick", a), L.DomEvent.on(linkClusters, "mousedown", a), L.DomEvent.on(linkClusters, "click", function (e) {
				1 == gsValues.map_clusters ? (mapLayers.realtime.options.disableClusteringAtZoom = gsValues.map_min_zoom, mapLayers.places_markers.options.disableClusteringAtZoom = gsValues.map_min_zoom, iconClusters.className = "icon-clusters disabled", gsValues.map_clusters = !1) : (mapLayers.realtime.options.disableClusteringAtZoom = gsValues.map_max_zoom + 1, mapLayers.places_markers.options.disableClusteringAtZoom = gsValues.map_max_zoom + 1, iconClusters.className = "icon-clusters", gsValues.map_clusters = !0), objectAddAllToMap(), placesMarkerAddAllToMap()
			}), settingsUserData.privileges_image_gallery) {
				linkCamera = L.DomUtil.create("a", "", t), linkCamera.id = "map_control_camera", linkCamera.href = "#", linkCamera.title = la.ENABLE_DISABLE_CAMERA, linkCamera.className = "", iconCamera = L.DomUtil.create("span", "", linkCamera), iconCamera.className = "icon-gallery disabled";
				a = L.DomEvent.stopPropagation;
				L.DomEvent.on(linkCamera, "dblclick", a), L.DomEvent.on(linkCamera, "mousedown", a), L.DomEvent.on(linkCamera, "click", function (e) {
					if (1 == gsValues.map_camera) document.getElementById("camera_control").style.display = "", iconCamera.className = "icon-gallery disabled", gsValues.map_camera = !1;
					else
						for (var t in document.getElementById("camera_control").style.display = "block", iconCamera.className = "icon-gallery", gsValues.map_camera = !0, objectsData) 1 == objectsData[t].selected && utilsCamera(t);
					1 == gsValues.map_street_view ? document.getElementById("camera_control").style.right = "340px" : document.getElementById("camera_control").style.right = "10px"
				})
			}
			if (gsValues.map_google && gsValues.map_google_street_view) {
				linkStreetView = L.DomUtil.create("a", "", t), linkStreetView.id = "map_control_street_view", linkStreetView.href = "#", linkStreetView.title = la.ENABLE_DISABLE_STREET_VIEW, linkStreetView.className = "", iconStreetView = L.DomUtil.create("span", "", linkStreetView), iconStreetView.className = "icon-street disabled";
				a = L.DomEvent.stopPropagation;
				L.DomEvent.on(linkStreetView, "dblclick", a), L.DomEvent.on(linkStreetView, "mousedown", a), L.DomEvent.on(linkStreetView, "click", function (e) {
					if (1 == gsValues.map_street_view) document.getElementById("street_view_control").style.display = "", iconStreetView.className = "icon-street disabled", gsValues.map_street_view = !1;
					else
						for (var t in document.getElementById("street_view_control").style.display = "block", iconStreetView.className = "icon-street", gsValues.map_street_view = !0, objectsData) {
							if (1 == objectsData[t].selected) utilsStreetView(objectsData[t].data[0].lat, objectsData[t].data[0].lng, objectsData[t].data[0].angle)
						}
					1 == gsValues.map_street_view ? document.getElementById("camera_control").style.right = "340px" : document.getElementById("camera_control").style.right = "10px"
				})
			}
			if (gsValues.map_google && gsValues.map_google_traffic) {
				linkTraffic = L.DomUtil.create("a", "", t), linkTraffic.id = "map_control_traffic", linkTraffic.href = "#", linkTraffic.title = la.ENABLE_DISABLE_LIVE_TRAFFIC, linkTraffic.className = "", iconTraffic = L.DomUtil.create("span", "", linkTraffic), iconTraffic.className = "icon-traffic disabled";
				a = L.DomEvent.stopPropagation;
				L.DomEvent.on(linkTraffic, "dblclick", a), L.DomEvent.on(linkTraffic, "mousedown", a), L.DomEvent.on(linkTraffic, "click", function (e) {
					1 == gsValues.map_traffic ? (iconTraffic.className = "icon-traffic disabled", gsValues.map_traffic = !1, strMatches("gmap,ghyb,gter", gsValues.map_layer.toString()) && switchMapLayer(gsValues.map_layer)) : strMatches("gmap,ghyb,gter", gsValues.map_layer.toString()) ? (iconTraffic.className = "icon-traffic", gsValues.map_traffic = !0, switchMapLayer(gsValues.map_layer)) : notifyBox("error", la.LIVE_TRAFFIC, la.LIVE_TRAFFIC_FOR_THIS_MAP_IS_NOT_AVAILABLE)
				})
			}
			return t
		}
	})
}

function mapToolControls() {
	return L.Control.extend({
		options: {
			position: "topleft"
		},
		onAdd: function (e) {
			var t = L.DomUtil.create("div", "leaflet-control leaflet-bar");
			linkFitObjects = L.DomUtil.create("a", "", t), linkFitObjects.id = "map_fit_objects", linkFitObjects.href = "#", linkFitObjects.title = la.FIT_OBJECTS_ON_MAP, linkFitObjects.className = "", iconFitObjects = L.DomUtil.create("span", "", linkFitObjects), iconFitObjects.className = "icon-fit-objects";
			var a = L.DomEvent.stopPropagation;
			L.DomEvent.on(linkFitObjects, "dblclick", a), L.DomEvent.on(linkFitObjects, "mousedown", a), L.DomEvent.on(linkFitObjects, "click", function (e) {
				fitObjectsOnMap()
			}), linkRuler = L.DomUtil.create("a", "", t), linkRuler.id = "map_ruler", linkRuler.href = "#", linkRuler.title = la.RULER, linkRuler.className = "", iconRuler = L.DomUtil.create("span", "", linkRuler), iconRuler.className = "icon-ruler disabled";
			a = L.DomEvent.stopPropagation;
			L.DomEvent.on(linkRuler, "dblclick", a), L.DomEvent.on(linkRuler, "mousedown", a), L.DomEvent.on(linkRuler, "click", function (e) {
				utilsRuler(), 1 == utilsRulerData.enabled ? iconRuler.className = "icon-ruler" : iconRuler.className = "icon-ruler disabled"
			}), linkMeasure = L.DomUtil.create("a", "", t), linkMeasure.id = "map_measure", linkMeasure.href = "#", linkMeasure.title = la.MEASURE_AREA, linkMeasure.className = "", iconMeasure = L.DomUtil.create("span", "", linkMeasure), iconMeasure.className = "icon-measure disabled";
			a = L.DomEvent.stopPropagation;
			return L.DomEvent.on(linkMeasure, "dblclick", a), L.DomEvent.on(linkMeasure, "mousedown", a), L.DomEvent.on(linkMeasure, "click", function (e) {
				utilsArea(), 1 == utilsAreaData.enabled ? iconMeasure.className = "icon-measure" : iconMeasure.className = "icon-measure disabled"
			}), t
		}
	})
}

function initGraph(e) {
	if (e) {
		t = e.data, a = e.units;
		if ("logic" == e.result_type) i = !0, o = !1;
		else i = !1, o = !1
	} else var t = [],
		a = "",
		i = !1,
		o = !1;
	var s = {
		xaxis: {
			mode: "time",
			zoomRange: [3e4, 2592e6]
		},
		yaxis: {
			tickFormatter: function (t) {
				var i = "";
				return e && (i = Math.round(100 * t) / 100 + " " + a), i
			},
			zoomRange: [0, 0],
			panRange: !1
		},
		selection: {
			mode: "x"
		},
		crosshair: {
			mode: "x"
		},
		lines: {
			show: !0,
			lineWidth: 1,
			fill: !0,
			fillColor: "rgba(43,130,212,0.3)",
			steps: i
		},
		series: {
			lines: {
				show: !0
			},
			points: {
				show: o,
				radius: 1
			}
		},
		colors: ["#2b82d4"],
		grid: {
			hoverable: !0,
			autoHighlight: !0,
			clickable: !0
		},
		zoom: {
			animate: !0,
			trigger: "dblclick",
			amount: 3
		},
		pan: {
			interactive: !1,
			animate: !0
		}
	};
	historyGraphPlot = $.plot($("#bottom_panel_graph_plot"), [t], s), $("#bottom_panel_graph_plot").unbind("plothover"), $("#bottom_panel_graph_plot").bind("plothover", function (e, i, o) {
		if (o) {
			var s = o.datapoint[0],
				n = historyRouteData.graph.data_index[s],
				l = historyRouteData.route[n].dt_tracker;
			document.getElementById("bottom_panel_graph_label").innerHTML = t[n][1] + " " + a + " - " + l
		}
	}), $("#bottom_panel_graph_plot").unbind("plotselected"), $("#bottom_panel_graph_plot").bind("plotselected", function (e, a) {
		historyGraphPlot = $.plot($("#bottom_panel_graph_plot"), [t], $.extend(!0, {}, s, {
			xaxis: {
				min: a.xaxis.from,
				max: a.xaxis.to
			}
		}))
	}), $("#bottom_panel_graph_plot").unbind("plotclick"), $("#bottom_panel_graph_plot").bind("plotclick", function (e, i, o) {
		if (o) {
			var s = o.datapoint[0],
				n = historyRouteData.graph.data_index[s],
				l = historyRouteData.route[n].dt_tracker;
			document.getElementById("bottom_panel_graph_label").innerHTML = t[n][1] + " " + a + " - " + l, historyRouteData.play.position = n, historyRoutePanToPoint(n), historyRouteAddPointMarkerToMap(n), 0 == historyRouteData.play.status && historyRouteShowPoint(n, !0)
		}
	})
}

function graphSetCrosshair(e) {
	var t = parseInt(historyGraphPlot.pointOffset({
		x: e,
		y: 0
	}).left, 10) - historyGraphPlot.getPlotOffset().left,
		a = historyGraphPlot.width(),
		i = parseInt(a / 2, 10);
	t > a - i && historyGraphPlot.pan({
		left: t - (a - i),
		top: 0
	}), t < i && historyGraphPlot.pan({
		left: t - i,
		top: 0
	}), historyGraphPlot.setCrosshair({
		x: e,
		y: 0
	})
}

function graphPanLeft() {
	historyGraphPlot.pan({
		left: -100
	})
}

function graphPanRight() {
	historyGraphPlot.pan({
		left: 100
	})
}

function graphZoomIn() {
	historyGraphPlot.zoom()
}

function graphZoomOut() {
	historyGraphPlot.zoomOut()
}

function initSelectList(e) {
	switch (e) {
		case "map_layer_list":
			(o = document.getElementById("map_layer")).options.length = 0, gsValues.map_osm && o.options.add(new Option("OSM Map", "osm")), gsValues.map_bing && (o.options.add(new Option("Bing Road", "broad")), o.options.add(new Option("Bing Aerial", "baer")), o.options.add(new Option("Bing Hybrid", "bhyb"))), gsValues.map_google && (o.options.add(new Option("Google Streets", "gmap")), o.options.add(new Option("Google Satellite", "gsat")), o.options.add(new Option("Google Hybrid", "ghyb")), o.options.add(new Option("Google Terrain", "gter"))), gsValues.map_mapbox && (o.options.add(new Option("Mapbox Streets", "mbmap")), o.options.add(new Option("Mapbox Satellite", "mbsat"))), gsValues.map_arcgis && (o.options.add(new Option("ArcGIS Topographic", "agtop")), o.options.add(new Option("ArcGIS Streets", "agstr")), o.options.add(new Option("ArcGIS Imagery", "agimg"))), gsValues.map_yandex && o.options.add(new Option("Yandex", "yandex"));
			for (var t = 0; t < gsValues.map_custom.length; t++) {
				var a = gsValues.map_custom[t].layer_id,
					i = gsValues.map_custom[t].name;
				o.options.add(new Option(i, a))
			}
			break;
		case "subaccounts_marker_list":
			var o = document.getElementById("dialog_settings_subaccount_available_markers");
			multiselectClear(o);
			var s = getGroupsPlacesArray("markers");
			multiselectSetGroups(o, s);
			break;
		case "events_route_list":
			o = document.getElementById("dialog_settings_event_routes");
			multiselectClear(o);
			s = getGroupsPlacesArray("routes");
			multiselectSetGroups(o, s);
			break;
		case "subaccounts_route_list":
			o = document.getElementById("dialog_settings_subaccount_available_routes");
			multiselectClear(o);
			s = getGroupsPlacesArray("routes");
			multiselectSetGroups(o, s);
			break;
		case "events_zone_list":
			o = document.getElementById("dialog_settings_event_zones");
			multiselectClear(o);
			s = getGroupsPlacesArray("zones");
			multiselectSetGroups(o, s);
			break;
		case "subaccounts_zone_list":
			o = document.getElementById("dialog_settings_subaccount_available_zones");
			multiselectClear(o);
			s = getGroupsPlacesArray("zones");
			multiselectSetGroups(o, s);
			break;
		case "report_marker_list":
			o = document.getElementById("dialog_report_marker_list");
			multiselectClear(o);
			s = getGroupsPlacesArray("markers");
			multiselectSetGroups(o, s);
			break;
		case "report_zone_list":
			o = document.getElementById("dialog_report_zone_list");
			multiselectClear(o);
			s = getGroupsPlacesArray("zones");
			multiselectSetGroups(o, s);
			break;
		case "group_object_list":
			o = document.getElementById("dialog_settings_object_group_objects");
			for (var n in o.options.length = 0, settingsObjectData) {
				"true" == (d = settingsObjectData[n]).active && o.options.add(new Option(d.name, n))
			}
			sortSelectList(o);
			break;
		case "events_object_list":
			o = document.getElementById("dialog_settings_event_object_list");
			multiselectClear(o);
			var l = getGroupsObjectsArray();
			multiselectSetGroups(o, l);
			break;
		case "subaccounts_object_list":
			o = document.getElementById("dialog_settings_subaccount_available_objects");
			multiselectClear(o);
			l = getGroupsObjectsArray();
			multiselectSetGroups(o, l);
			break;
		case "history_object_list":
			o = document.getElementById("side_panel_history_object_list");
			for (var n in o.options.length = 0, settingsObjectData) {
				"true" == (d = settingsObjectData[n]).active && o.options.add(new Option(d.name, n))
			}
			sortSelectList(o);
			break;
		case "report_object_list":
			o = document.getElementById("dialog_report_object_list");
			multiselectClear(o);
			l = getGroupsObjectsArray();
			multiselectSetGroups(o, l);
			break;
		case "tasks_object_list":
			o = document.getElementById("dialog_tasks_object_list");
			for (var n in o.options.length = 0, settingsObjectData) {
				"true" == (d = settingsObjectData[n]).active && o.options.add(new Option(d.name, n))
			}
			sortSelectList(o), o.options.add(new Option(la.ALL_OBJECTS, ""), 0), o.value = "";
			break;
		case "task_object_list":
			o = document.getElementById("dialog_task_object_list");
			for (var n in o.options.length = 0, settingsObjectData) {
				"true" == (d = settingsObjectData[n]).active && o.options.add(new Option(d.name, n))
			}
			sortSelectList(o);
			break;
		case "rilogbook_object_list":
			o = document.getElementById("dialog_rilogbook_object_list");
			for (var n in o.options.length = 0, settingsObjectData) {
				"true" == (d = settingsObjectData[n]).active && o.options.add(new Option(d.name, n))
			}
			sortSelectList(o), o.options.add(new Option(la.ALL_OBJECTS, ""), 0), o.value = "";
			break;
		case "dtc_object_list":
			o = document.getElementById("dialog_dtc_object_list");
			for (var n in o.options.length = 0, settingsObjectData) {
				"true" == (d = settingsObjectData[n]).active && o.options.add(new Option(d.name, n))
			}
			sortSelectList(o), o.options.add(new Option(la.ALL_OBJECTS, ""), 0), o.value = "";
			break;
		case "cmd_gprs_object_list":
			o = document.getElementById("cmd_gprs_object_list");
			multiselectClear(o);
			l = getGroupsObjectsArray();
			multiselectSetGroups(o, l);
			break;
		case "cmd_sms_object_list":
			o = document.getElementById("cmd_sms_object_list");
			multiselectClear(o);
			l = getGroupsObjectsArray();
			multiselectSetGroups(o, l);
			break;
		case "image_gallery_object_list":
			o = document.getElementById("dialog_image_gallery_object_list");
			for (var n in o.options.length = 0, settingsObjectData) {
				"true" == (d = settingsObjectData[n]).active && o.options.add(new Option(d.name, n))
			}
			sortSelectList(o), o.options.add(new Option(la.ALL_OBJECTS, ""), 0), o.value = "";
			break;
		case "maintenance_object_list":
			o = document.getElementById("dialog_maintenance_service_object_list");
			multiselectClear(o);
			l = getGroupsObjectsArray();
			multiselectSetGroups(o, l);
			break;
		case "expense_object_list":
			o = document.getElementById("dialog_expense_object_list");
			for (var n in o.options.length = 0, settingsObjectData) {
				"true" == (d = settingsObjectData[n]).active && o.options.add(new Option(d.name, n))
			}
			sortSelectList(o);
			break;
		case "share_position_object_list":
			o = document.getElementById("dialog_share_position_object_list");
			multiselectClear(o);
			l = getGroupsObjectsArray();
			multiselectSetGroups(o, l);
			break;
		case "forward_loc_data_object_list":
			o = document.getElementById("settings_object_accuracy_forward_loc_data_object_list");
			for (var n in o.options.length = 0, settingsObjectData) {
				var d = settingsObjectData[n];
				n != settingsEditData.object_imei && "true" == d.active && o.options.add(new Option(d.name, n))
			}
			sortSelectList(o), o.options.add(new Option("", ""), 0);
			break;
		case "object_group_list":
			o = document.getElementById("dialog_settings_object_edit_group");
			for (var n in o.options.length = 0, settingsObjectGroupData) {
				(h = settingsObjectGroupData[n]).name != la.UNGROUPED && o.options.add(new Option(h.name, n))
			}
			sortSelectList(o), o.options.add(new Option(la.UNGROUPED, 0), 0);
			break;
		case "object_driver_list":
			o = document.getElementById("dialog_settings_object_edit_driver");
			for (var n in o.options.length = 0, settingsObjectDriverData) {
				var r = settingsObjectDriverData[n];
				o.options.add(new Option(r.name, n))
			}
			sortSelectList(o), o.options.add(new Option(la.AUTO_ASSIGN, 0), 0), o.options.add(new Option(la.NO_DRIVER, -1), 0);
			break;
		case "object_trailer_list":
			o = document.getElementById("dialog_settings_object_edit_trailer");
			for (var n in o.options.length = 0, settingsObjectTrailerData) {
				var _ = settingsObjectTrailerData[n];
				o.options.add(new Option(_.name, n))
			}
			sortSelectList(o), o.options.add(new Option(la.AUTO_ASSIGN, 0), 0), o.options.add(new Option(la.NO_TRAILER, -1), 0);
			break;
		case "email_sms_template_list":
			var c = document.getElementById("dialog_settings_event_notify_email_template");
			c.options.length = 0;
			var g = document.getElementById("dialog_settings_event_notify_sms_template");
			for (var n in g.options.length = 0, settingsTemplateData) {
				var m = settingsTemplateData[n];
				c.options.add(new Option(m.name, n)), g.options.add(new Option(m.name, n))
			}
			sortSelectList(c), sortSelectList(g), c.options.add(new Option(la.DEFAULT, 0), 0), g.options.add(new Option(la.DEFAULT, 0), 0);
			break;
		case "places_group_list":
			var u = document.getElementById("dialog_places_marker_group");
			u.options.length = 0;
			var p = document.getElementById("dialog_places_route_group");
			p.options.length = 0;
			var y = document.getElementById("dialog_places_zone_group");
			for (var n in y.options.length = 0, placesGroupData.groups) {
				var h;
				(h = placesGroupData.groups[n]).name != la.UNGROUPED && (u.options.add(new Option(h.name, n)), p.options.add(new Option(h.name, n)), y.options.add(new Option(h.name, n)))
			}
			sortSelectList(u), sortSelectList(p), sortSelectList(y), u.options.add(new Option(la.UNGROUPED, 0), 0), p.options.add(new Option(la.UNGROUPED, 0), 0), y.options.add(new Option(la.UNGROUPED, 0), 0)
	}
}

function resizeGrids() {
	resizeGridObjects(), resizeGridEvents(), resizeGridHistory()
}

function resizeGridObjects(e) {
	if ("bottom_panel" == settingsUserData.datalist) {
		var t = window.innerHeight - 146;
		$("#side_panel_objects_object_list_grid").setGridHeight(t)
	} else {
		null == e ? e = window.innerHeight - guiDragbars.objects : guiDragbars.objects = window.innerHeight - e, e < 295 && (e = 292), e > window.innerHeight - 173 && (e = window.innerHeight - 173);
		var a = window.innerHeight - e - 16;
		t = window.innerHeight - a - 164;
		$("#side_panel_objects_object_data_list_grid").setGridHeight(a - 20), $("#side_panel_objects_object_list_grid").setGridHeight(t), $("#side_panel_objects_dragbar").css("bottom", a + 1)
	}
}

function resizeGridEvents(e) {
	if ("bottom_panel" == settingsUserData.datalist) {
		var t = window.innerHeight - 173;
		$("#side_panel_events_event_list_grid").setGridHeight(t)
	} else {
		null == e ? e = window.innerHeight - guiDragbars.events : guiDragbars.events = window.innerHeight - e, e < 292 && (e = 292), e > window.innerHeight - 173 && (e = window.innerHeight - 173);
		var a = window.innerHeight - e - 16;
		t = window.innerHeight - a - 195;
		$("#side_panel_events_event_datalist_grid").setGridHeight(a - 20), $("#side_panel_events_event_list_grid").setGridHeight(t), $("#side_panel_events_dragbar").css("bottom", a + 1)
	}
}

function resizeGridHistory(e) {
	if ("bottom_panel" == settingsUserData.datalist) {
		var t = window.innerHeight - 284;
		$("#side_panel_history_route_detail_list_grid").setGridHeight(t)
	} else {
		null == e ? e = window.innerHeight - guiDragbars.history : guiDragbars.history = window.innerHeight - e, e < 430 && (e = 430), e > window.innerHeight - 173 && (e = window.innerHeight - 173);
		var a = window.innerHeight - e - 16;
		t = window.innerHeight - a - 302;
		$("#side_panel_history_route_datalist_grid").setGridHeight(a - 20), $("#side_panel_history_route_detail_list_grid").setGridHeight(t), $("#side_panel_history_dragbar").css("bottom", a + 1)
	}
}

function showHideLeftPanel() {
	"none" == document.getElementById("side_panel").style.display ? (document.getElementById("side_panel").style.display = "block", document.getElementById("bottom_panel").style.left = "365px", document.getElementById("side_panel_dragbar").style.left = "360px", document.getElementById("bottom_panel_dragbar").style.left = "365px", document.getElementById("map").style.left = "365px", document.getElementById("history_view_control").style.left = "413px", $("#bottom_panel_msg_list_grid").setGridWidth($(window).width() - 384), setTimeout(function () {
		map.invalidateSize(!0)
	}, 200)) : (document.getElementById("side_panel").style.display = "none", document.getElementById("bottom_panel").style.left = "5px", document.getElementById("side_panel_dragbar").style.left = "0px", document.getElementById("bottom_panel_dragbar").style.left = "5px", document.getElementById("map").style.left = "5px", document.getElementById("history_view_control").style.left = "53px", $("#bottom_panel_msg_list_grid").setGridWidth($(window).width() - 24), setTimeout(function () {
		map.invalidateSize(!0)
	}, 200)), datalistBottomResize()
}

function showBottomPanel(e) {
	void 0 === e && (e = !0), document.getElementById("bottom_panel").style.display = "block", guiDragbars.bottom_panel < 171 && (guiDragbars.bottom_panel = 171), guiDragbars.bottom_panel > window.innerHeight / 2 && (guiDragbars.bottom_panel = window.innerHeight / 2), $("#bottom_panel").css("height", guiDragbars.bottom_panel), document.getElementById("map").style.bottom = parseInt(guiDragbars.bottom_panel) + 5 + "px", document.getElementById("bottom_panel_dragbar").style.bottom = guiDragbars.bottom_panel + "px", $("#bottom_panel_msg_list_grid").setGridHeight(guiDragbars.bottom_panel - 99), $("#bottom_panel_graph_plot").css("height", guiDragbars.bottom_panel - 75), $("#bottom_panel_dragbar").css("cursor", "row-resize"), document.getElementById("camera_control").style.bottom = parseInt(guiDragbars.bottom_panel) + 16 + "px", document.getElementById("street_view_control").style.bottom = parseInt(guiDragbars.bottom_panel) + 16 + "px", datalistBottomResize(), 1 == e && map.invalidateSize(!0)
}

function hideBottomPanel(e) {
	void 0 === e && (e = !0), document.getElementById("bottom_panel").style.display = "none", document.getElementById("map").style.bottom = "5px", document.getElementById("bottom_panel_dragbar").style.bottom = "0px", $("#bottom_panel_dragbar").css("cursor", ""), document.getElementById("camera_control").style.bottom = "16px", document.getElementById("street_view_control").style.bottom = "16px", 1 == e && map.invalidateSize(!0)
}

function resizeBottomPanel(e) {
	guiDragbars.bottom_panel = window.innerHeight - e, guiDragbars.bottom_panel -= 3, guiDragbars.bottom_panel < 150 ? hideBottomPanel() : showBottomPanel(!1)
}

function initGrids() {
	$("#settings_main_object_list_grid").jqGrid({
		url: "func/fn_settings.objects.php?cmd=load_object_list",
		datatype: "json",
		colNames: [la.NAME, la.IMEI, la.GROUP, la.ACTIVE, la.EXPIRES_ON, ""],
		colModel: [{
			name: "name",
			index: "name",
			width: 200
		}, {
			name: "imei",
			index: "gs_objects.imei",
			width: 137
		}, {
			name: "group",
			index: "gs_user_object_groups.group_name",
			width: 136
		}, {
			name: "active",
			index: "active",
			width: 90,
			align: "center"
		}, {
			name: "object_expire_dt",
			index: "object_expire_dt",
			width: 110,
			align: "center"
		}, {
			name: "modify",
			index: "modify",
			width: 75,
			align: "center",
			sortable: !1
		}],
		rowNum: 50,
		rowList: [25, 50, 75, 100, 200],
		pager: "#settings_main_object_list_grid_pager",
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		height: "313px",
		width: "820",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#settings_main_object_list_grid").setCaption('<div class="row4"><input id="settings_main_object_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#settings_main_object_list_search").bind("keyup", function (e) {
		$("#settings_main_object_list_grid").setGridParam({
			url: "func/fn_settings.objects.php?cmd=load_object_list&s=" + this.value
		}), $("#settings_main_object_list_grid").trigger("reloadGrid")
	}), $("#settings_main_object_list_grid").jqGrid("navGrid", "#settings_main_object_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			settingsObjectAdd("open")
		}
	}), $("#settings_main_object_list_grid").navButtonAdd("#settings_main_object_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "settings_main_object_list_grid_action_menu_button"
	}), $("#settings_main_object_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#settings_main_object_list_grid_action_menu").hide(), $("#settings_main_object_list_grid_action_menu_button").click(function () {
		return $("#settings_main_object_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#settings_main_object_list_grid_action_menu").hide()
		}), !1
	}), $("#settings_object_sensor_list_grid").jqGrid({
		url: "func/fn_settings.sensors.php",
		datatype: "json",
		colNames: [la.NAME, la.TYPE, la.PARAMETER, ""],
		colModel: [{
			name: "name",
			index: "name",
			width: 220,
			sortable: !0
		}, {
			name: "type",
			index: "type",
			width: 205,
			align: "center",
			sortable: !1
		}, {
			name: "param",
			index: "param",
			width: 158,
			align: "center",
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		rowNum: 512,
		pager: "#settings_object_sensor_list_grid_pager",
		pgbuttons: !1,
		pgtext: "",
		recordtext: "",
		emptyrecords: "",
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		width: "690",
		height: "347",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#settings_object_sensor_list_grid").jqGrid("navGrid", "#settings_object_sensor_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			settingsObjectSensorProperties("add")
		}
	}), $("#settings_object_sensor_list_grid").navButtonAdd("#settings_object_sensor_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "settings_object_sensor_list_grid_action_menu_button"
	}), $("#settings_object_sensor_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#settings_object_sensor_list_grid_action_menu").hide(), $("#settings_object_sensor_list_grid_action_menu_button").click(function () {
		return $("#settings_object_sensor_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#settings_object_sensor_list_grid_action_menu").hide()
		}), !1
	}), $("#settings_object_sensor_calibration_list_grid").jqGrid({
		datatype: "local",
		colNames: ["X", "Y", ""],
		colModel: [{
			name: "x",
			index: "x",
			width: 109,
			sortable: !0,
			sorttype: "int"
		}, {
			name: "y",
			index: "y",
			width: 109,
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 30,
			align: "center",
			sortable: !1
		}],
		width: "280",
		height: "333",
		rowNum: 100,
		shrinkToFit: !1
	}), $("#settings_object_sensor_dictionary_list_grid").jqGrid({
		datatype: "local",
		colNames: [la.VALUE, la.TEXT, ""],
		colModel: [{
			name: "value",
			index: "value",
			width: 70,
			sortable: !0,
			sorttype: "int"
		}, {
			name: "text",
			index: "text",
			width: 163,
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 30,
			align: "center",
			sortable: !1
		}],
		width: "295",
		height: "333",
		rowNum: 100,
		shrinkToFit: !1
	}), $("#settings_object_service_list_grid").jqGrid({
		url: "func/fn_settings.service.php",
		datatype: "json",
		colNames: [la.NAME, la.STATUS, ""],
		colModel: [{
			name: "name",
			index: "name",
			width: 220
		}, {
			name: "status",
			index: "status",
			width: 368,
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		rowNum: 512,
		pager: "#settings_object_service_list_grid_pager",
		pgbuttons: !1,
		pgtext: "",
		recordtext: "",
		emptyrecords: "",
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		width: "690",
		height: "347",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#settings_object_service_list_grid").jqGrid("navGrid", "#settings_object_service_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			settingsObjectServiceProperties("add")
		}
	}), $("#settings_object_service_list_grid").navButtonAdd("#settings_object_service_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "settings_object_service_list_grid_action_menu_button"
	}), $("#settings_object_service_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#settings_object_service_list_grid_action_menu").hide(), $("#settings_object_service_list_grid_action_menu_button").click(function () {
		return $("#settings_object_service_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#settings_object_service_list_grid_action_menu").hide()
		}), !1
	}), $("#settings_object_custom_fields_list_grid").jqGrid({
		url: "func/fn_settings.customfields.php",
		datatype: "json",
		colNames: [la.NAME, la.VALUE, la.DATA_LIST, la.POPUP, ""],
		colModel: [{
			name: "name",
			index: "name",
			width: 220,
			sortable: !0
		}, {
			name: "value",
			index: "value",
			width: 178,
			align: "center",
			sortable: !0
		}, {
			name: "data_list",
			index: "data_list",
			width: 90,
			align: "center",
			sortable: !1
		}, {
			name: "popup",
			index: "popup",
			width: 90,
			align: "center",
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		rowNum: 512,
		pager: "#settings_object_custom_fields_list_grid_pager",
		pgbuttons: !1,
		pgtext: "",
		recordtext: "",
		emptyrecords: "",
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		width: "690",
		height: "347",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#settings_object_custom_fields_list_grid").jqGrid("navGrid", "#settings_object_custom_fields_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			settingsObjectCustomFieldProperties("add")
		}
	}), $("#settings_object_custom_fields_list_grid").navButtonAdd("#settings_object_custom_fields_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "settings_object_custom_fields_list_grid_action_menu_button"
	}), $("#settings_object_custom_fields_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#settings_object_custom_fields_list_grid_action_menu").hide(), $("#settings_object_custom_fields_list_grid_action_menu_button").click(function () {
		return $("#settings_object_custom_fields_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#settings_object_custom_fields_list_grid_action_menu").hide()
		}), !1
	}), $("#settings_object_info_list_grid").jqGrid({
		url: "func/fn_settings.objects.php",
		datatype: "json",
		colNames: [la.DATA, la.VALUE],
		colModel: [{
			name: "data",
			index: "data",
			width: 170,
			sortable: !1
		}, {
			name: "value",
			index: "value",
			width: 493,
			sortable: !1
		}],
		rowNum: 512,
		pager: "#settings_object_info_list_grid_pager",
		pgbuttons: !1,
		pgtext: "",
		recordtext: "",
		emptyrecords: "",
		sortname: "data",
		sortorder: "asc",
		viewrecords: !0,
		width: "690",
		height: "347",
		shrinkToFit: !1
	}), $("#settings_object_info_list_grid").jqGrid("navGrid", "#settings_object_info_list_grid_pager", {
		add: !1,
		edit: !1,
		del: !1,
		search: !1
	}), $("#settings_main_object_group_list_grid").jqGrid({
		url: "func/fn_settings.groups.php?cmd=load_object_group_list",
		datatype: "json",
		colNames: [la.NAME, la.OBJECTS, la.DESCRIPTION, ""],
		colModel: [{
			name: "group_name",
			index: "group_name",
			width: 318,
			sortable: !0
		}, {
			name: "objects",
			index: "objects",
			width: 90,
			align: "center",
			sortable: !1
		}, {
			name: "description",
			index: "description",
			width: 305,
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		rowNum: 50,
		rowList: [25, 50, 75, 100, 200],
		pager: "#settings_main_object_group_list_grid_pager",
		sortname: "group_name",
		sortorder: "asc",
		viewrecords: !0,
		height: "313px",
		width: "820",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#settings_main_object_group_list_grid").setCaption('<div class="row4"><input id="settings_main_object_group_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#settings_main_object_group_list_search").bind("keyup", function (e) {
		$("#settings_main_object_group_list_grid").setGridParam({
			url: "func/fn_settings.groups.php?cmd=load_object_group_list&s=" + this.value
		}), $("#settings_main_object_group_list_grid").trigger("reloadGrid")
	}), $("#settings_main_object_group_list_grid").jqGrid("navGrid", "#settings_main_object_group_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			settingsObjectGroupProperties("add")
		}
	}), $("#settings_main_object_group_list_grid").navButtonAdd("#settings_main_object_group_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "settings_main_object_group_list_grid_action_menu_button"
	}), $("#settings_main_object_group_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#settings_main_object_group_list_grid_action_menu").hide(), $("#settings_main_object_group_list_grid_action_menu_button").click(function () {
		return $("#settings_main_object_group_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#settings_main_object_group_list_grid_action_menu").hide()
		}), !1
	}), $("#settings_main_object_driver_list_grid").jqGrid({
		url: "func/fn_settings.drivers.php?cmd=load_object_driver_list",
		datatype: "json",
		colNames: [la.NAME, la.ID_NUMBER, la.DESCRIPTION, ""],
		colModel: [{
			name: "driver_name",
			index: "driver_name",
			width: 318,
			sortable: !0
		}, {
			name: "idn",
			index: "idn",
			width: 135,
			sortable: !1
		}, {
			name: "description",
			index: "description",
			width: 260,
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		rowNum: 50,
		rowList: [25, 50, 75, 100, 200],
		pager: "#settings_main_object_driver_list_grid_pager",
		sortname: "driver_name",
		sortorder: "asc",
		viewrecords: !0,
		height: "313px",
		width: "820",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#settings_main_object_driver_list_grid").setCaption('<div class="row4"><input id="settings_main_object_driver_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#settings_main_object_driver_list_search").bind("keyup", function (e) {
		$("#settings_main_object_driver_list_grid").setGridParam({
			url: "func/fn_settings.drivers.php?cmd=load_object_driver_list&s=" + this.value
		}), $("#settings_main_object_driver_list_grid").trigger("reloadGrid")
	}), $("#settings_main_object_driver_list_grid").jqGrid("navGrid", "#settings_main_object_driver_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			settingsObjectDriverProperties("add")
		}
	}), $("#settings_main_object_driver_list_grid").navButtonAdd("#settings_main_object_driver_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "settings_main_object_driver_list_grid_action_menu_button"
	}), $("#settings_main_object_driver_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#settings_main_object_driver_list_grid_action_menu").hide(), $("#settings_main_object_driver_list_grid_action_menu_button").click(function () {
		return $("#settings_main_object_driver_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#settings_main_object_driver_list_grid_action_menu").hide()
		}), !1
	}), $("#settings_main_object_passenger_list_grid").jqGrid({
		url: "func/fn_settings.passengers.php?cmd=load_object_passenger_list",
		datatype: "json",
		colNames: [la.NAME, la.ID_NUMBER, la.DESCRIPTION, ""],
		colModel: [{
			name: "passenger_name",
			index: "passenger_name",
			width: 318,
			sortable: !0
		}, {
			name: "idn",
			index: "idn",
			width: 135,
			sortable: !1
		}, {
			name: "description",
			index: "description",
			width: 260,
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		rowNum: 50,
		rowList: [25, 50, 75, 100, 200],
		pager: "#settings_main_object_passenger_list_grid_pager",
		sortname: "passenger_name",
		sortorder: "asc",
		viewrecords: !0,
		height: "313px",
		width: "820",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#settings_main_object_passenger_list_grid").setCaption('<div class="row4"><input id="settings_main_object_passenger_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#settings_main_object_passenger_list_search").bind("keyup", function (e) {
		$("#settings_main_object_passenger_list_grid").setGridParam({
			url: "func/fn_settings.passengers.php?cmd=load_object_passenger_list&s=" + this.value
		}), $("#settings_main_object_passenger_list_grid").trigger("reloadGrid")
	}), $("#settings_main_object_passenger_list_grid").jqGrid("navGrid", "#settings_main_object_passenger_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			settingsObjectPassengerProperties("add")
		}
	}), $("#settings_main_object_passenger_list_grid").navButtonAdd("#settings_main_object_passenger_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "settings_main_object_passenger_list_grid_action_menu_button"
	}), $("#settings_main_object_passenger_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#settings_main_object_passenger_list_grid_action_menu").hide(), $("#settings_main_object_passenger_list_grid_action_menu_button").click(function () {
		return $("#settings_main_object_passenger_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#settings_main_object_passenger_list_grid_action_menu").hide()
		}), !1
	}), $("#settings_main_object_trailer_list_grid").jqGrid({
		url: "func/fn_settings.trailers.php?cmd=load_object_trailer_list",
		datatype: "json",
		colNames: [la.NAME, la.DESCRIPTION, ""],
		colModel: [{
			name: "trailer_name",
			index: "trailer_name",
			width: 318,
			sortable: !0
		}, {
			name: "description",
			index: "description",
			width: 400,
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		rowNum: 50,
		rowList: [25, 50, 75, 100, 200],
		pager: "#settings_main_object_trailer_list_grid_pager",
		sortname: "trailer_name",
		sortorder: "asc",
		viewrecords: !0,
		height: "313px",
		width: "820",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#settings_main_object_trailer_list_grid").setCaption('<div class="row4"><input id="settings_main_object_trailer_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#settings_main_object_trailer_list_search").bind("keyup", function (e) {
		$("#settings_main_object_trailer_list_grid").setGridParam({
			url: "func/fn_settings.trailers.php?cmd=load_object_trailer_list&s=" + this.value
		}), $("#settings_main_object_trailer_list_grid").trigger("reloadGrid")
	}), $("#settings_main_object_trailer_list_grid").jqGrid("navGrid", "#settings_main_object_trailer_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			settingsObjectTrailerProperties("add")
		}
	}), $("#settings_main_object_trailer_list_grid").navButtonAdd("#settings_main_object_trailer_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "settings_main_object_trailer_list_grid_action_menu_button"
	}), $("#settings_main_object_trailer_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#settings_main_object_trailer_list_grid_action_menu").hide(), $("#settings_main_object_trailer_list_grid_action_menu_button").click(function () {
		return $("#settings_main_object_trailer_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#settings_main_object_trailer_list_grid_action_menu").hide()
		}), !1
	}), $("#settings_main_events_event_list_grid").jqGrid({
		url: "func/fn_settings.events.php?cmd=load_event_list",
		datatype: "json",
		colNames: [la.NAME, la.ACTIVE, la.SYSTEM, la.PUSH_NOTIFICATION, la.EMAIL, la.SMS, ""],
		colModel: [{
			name: "name",
			index: "name",
			width: 248,
			sortable: !0
		}, {
			name: "active",
			index: "active",
			width: 90,
			align: "center",
			sortable: !0
		}, {
			name: "notify_system",
			index: "notify_system",
			width: 90,
			align: "center",
			sortable: !0
		}, {
			name: "notify_push",
			index: "notify_push",
			width: 90,
			align: "center",
			sortable: !0
		}, {
			name: "notify_email",
			index: "notify_email",
			width: 90,
			align: "center",
			sortable: !0
		}, {
			name: "notify_sms",
			index: "notify_sms",
			width: 90,
			align: "center",
			sortable: !0
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		rowNum: 50,
		rowList: [25, 50, 75, 100, 200],
		pager: "#settings_main_events_event_list_grid_pager",
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		height: "409px",
		width: "820",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#settings_main_events_event_list_grid").setCaption('<div class="row4"><input id="settings_main_events_event_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#settings_main_events_event_list_search").bind("keyup", function (e) {
		$("#settings_main_events_event_list_grid").setGridParam({
			url: "func/fn_settings.events.php?cmd=load_event_list&s=" + this.value
		}), $("#settings_main_events_event_list_grid").trigger("reloadGrid")
	}), $("#settings_main_events_event_list_grid").jqGrid("navGrid", "#settings_main_events_event_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			settingsEventProperties("add")
		}
	}), $("#settings_main_events_event_list_grid").navButtonAdd("#settings_main_events_event_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "settings_main_events_event_list_grid_action_menu_button"
	}), $("#settings_main_events_event_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#settings_main_events_event_list_grid_action_menu").hide(), $("#settings_main_events_event_list_grid_action_menu_button").click(function () {
		return $("#settings_main_events_event_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#settings_main_events_event_list_grid_action_menu").hide()
		}), !1
	}), $("#settings_event_param_sensor_condition_list_grid").jqGrid({
		datatype: "local",
		colNames: [la.SOURCE, "", la.VALUE, ""],
		colModel: [{
			name: "src",
			index: "src",
			width: 115,
			sortable: !0,
			sorttype: "text"
		}, {
			name: "cn",
			index: "cn",
			width: 42,
			align: "center",
			sortable: !1,
			formatter: function (e, t, a) {
				"eq" == e ? e = "=" : "gr" == e ? e = ">" : "lw" == e ? e = "<" : "grp" == e ? e = "> %" : "lwp" == e && (e = "< %");
				return e
			}
		}, {
			name: "val",
			index: "val",
			width: 100,
			align: "center",
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 30,
			align: "center",
			sortable: !1
		}],
		width: "324",
		height: "236",
		rowNum: 15,
		shrinkToFit: !1
	}), $("#settings_main_templates_template_list_grid").jqGrid({
		url: "func/fn_settings.templates.php?cmd=load_template_list",
		datatype: "json",
		colNames: [la.NAME, la.DESCRIPTION, ""],
		colModel: [{
			name: "name",
			index: "name",
			width: 248,
			sortable: !0
		}, {
			name: "description",
			index: "description",
			width: 470,
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		rowNum: 50,
		rowList: [25, 50, 75, 100, 200],
		pager: "#settings_main_templates_template_list_grid_pager",
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		height: "409px",
		width: "820",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#settings_main_templates_template_list_grid").setCaption('<div class="row4"><input id="settings_main_templates_template_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#settings_main_templates_template_list_search").bind("keyup", function (e) {
		$("#settings_main_templates_template_list_grid").setGridParam({
			url: "func/fn_settings.templates.php?cmd=load_template_list&s=" + this.value
		}), $("#settings_main_templates_template_list_grid").trigger("reloadGrid")
	}), $("#settings_main_templates_template_list_grid").jqGrid("navGrid", "#settings_main_templates_template_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			settingsTemplateProperties("add")
		}
	}), $("#settings_main_templates_template_list_grid").navButtonAdd("#settings_main_templates_template_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "settings_main_templates_template_list_grid_action_menu_button"
	}), $("#settings_main_templates_template_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#settings_main_templates_template_list_grid_action_menu").hide(), $("#settings_main_templates_template_list_grid_action_menu_button").click(function () {
		return $("#settings_main_templates_template_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#settings_main_templates_template_list_grid_action_menu").hide()
		}), !1
	}), $("#settings_main_kml_kml_list_grid").jqGrid({
		url: "func/fn_settings.kml.php?cmd=load_kml_list",
		datatype: "json",
		colNames: [la.NAME, la.ACTIVE, la.DESCRIPTION, ""],
		colModel: [{
			name: "name",
			index: "name",
			width: 248,
			sortable: !0
		}, {
			name: "active",
			index: "active",
			width: 90,
			align: "center",
			sortable: !0
		}, {
			name: "description",
			index: "description",
			width: 375,
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		rowNum: 50,
		rowList: [25, 50, 75, 100, 200],
		pager: "#settings_main_kml_kml_list_grid_pager",
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		height: "359px",
		width: "820",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#settings_main_kml_kml_list_grid").setCaption('<div class="row4"><input id="settings_main_kml_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#settings_main_kml_list_search").bind("keyup", function (e) {
		$("#settings_main_kml_kml_list_grid").setGridParam({
			url: "func/fn_settings.kml.php?cmd=load_kml_list&s=" + this.value
		}), $("#settings_main_kml_kml_list_grid").trigger("reloadGrid")
	}), $("#settings_main_kml_kml_list_grid").jqGrid("navGrid", "#settings_main_kml_kml_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			settingsKMLProperties("add")
		}
	}), $("#settings_main_kml_kml_list_grid").navButtonAdd("#settings_main_kml_kml_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "settings_main_kml_kml_list_grid_action_menu_button"
	}), $("#settings_main_kml_kml_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#settings_main_kml_kml_list_grid_action_menu").hide(), $("#settings_main_kml_kml_list_grid_action_menu_button").click(function () {
		return $("#settings_main_kml_kml_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#settings_main_kml_kml_list_grid_action_menu").hide()
		}), !1
	}), $("#settings_main_subaccount_list_grid").jqGrid({
		url: "func/fn_settings.subaccounts.php?cmd=load_subaccount_list",
		datatype: "json",
		colNames: [la.USERNAME, la.EMAIL, la.ACTIVE, la.OBJECTS, la.PLACES, ""],
		colModel: [{
			name: "username",
			index: "username",
			width: 217,
			sortable: !0
		}, {
			name: "email",
			index: "email",
			width: 167,
			sortable: !0
		}, {
			name: "active",
			index: "active",
			width: 90,
			align: "center",
			sortable: !0
		}, {
			name: "objects",
			index: "objects",
			width: 90,
			align: "center",
			sortable: !1
		}, {
			name: "places",
			index: "places",
			width: 140,
			align: "center",
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		rowNum: 50,
		rowList: [25, 50, 75, 100, 200],
		pager: "#settings_main_subaccount_list_grid_pager",
		sortname: "username",
		sortorder: "asc",
		viewrecords: !0,
		height: "359px",
		width: "820",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#settings_main_subaccount_list_grid").setCaption('<div class="row4"><input id="settings_main_subaccount_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#settings_main_subaccount_list_search").bind("keyup", function (e) {
		$("#settings_main_subaccount_list_grid").setGridParam({
			url: "func/fn_settings.subaccounts.php?cmd=load_subaccount_list&s=" + this.value
		}), $("#settings_main_subaccount_list_grid").trigger("reloadGrid")
	}), $("#settings_main_subaccount_list_grid").jqGrid("navGrid", "#settings_main_subaccount_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			settingsSubaccountProperties("add")
		}
	}), $("#settings_main_subaccount_list_grid").navButtonAdd("#settings_main_subaccount_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "settings_main_subaccount_list_grid_action_menu_button"
	}), $("#settings_main_subaccount_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#settings_main_subaccount_list_grid_action_menu").hide(), $("#settings_main_subaccount_list_grid_action_menu_button").click(function () {
		return $("#settings_main_subaccount_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#settings_main_subaccount_list_grid_action_menu").hide()
		}), !1
	});
	var e = '<div style="float: left; margin-top: 2px; width: 25px;">';
	e += '<center><input id="object_group_visible_{0}" type="checkbox" onClick="objectGroupVisibleToggle({0});"></center>', e += "</div>", e += '<div style="float: left; margin-top: 2px; width: 25px;">', e += '<center><input id="object_group_follow_{0}" type="checkbox" onClick="objectGroupFollowToggle({0});"></center>', e += "</div>", e += '<div style="float: right;"><span id="object_group_name_{0}"></span> ({1})</div>', $("#side_panel_objects_object_list_grid").jqGrid({
		datatype: "local",
		colNames: ["", "", "", '<a href="#" onclick="objectVisibleAllToggle();"><img title="' + la.SHOW_HIDE_ALL + '" src="theme/images/eye.svg" width="14px" /></a>', '<a href="#" onclick="objectFollowAllToggle();"><img title="' + la.FOLLOW_UNFOLLOW_ALL + '" src="theme/images/follow.svg" width="14px" /></a>', "", la.OBJECT, ""],
		colModel: [{
			name: "search",
			index: "search",
			hidden: !0
		}, {
			name: "name_sort",
			index: "name_sort",
			hidden: !0
		}, {
			name: "group_id",
			index: "group_id",
			sorttype: function (e) {
				return 0 == e ? String.fromCharCode(0) : null == settingsObjectGroupData[e] ? String.fromCharCode(0) : settingsObjectGroupData[e].name
			}
		}, {
			name: "show",
			index: "show",
			width: 20,
			sortable: !1,
			align: "center"
		}, {
			name: "follow",
			index: "follow",
			width: 20,
			sortable: !1,
			align: "center"
		}, {
			name: "icon",
			index: "icon",
			width: 28,
			sortable: !1
		}, {
			name: "name",
			index: "name_sort",
			width: 215,
			title: !1
		}, {
			name: "menu",
			index: "menu",
			width: 15,
			sortable: !1,
			align: "center"
		}],
		rowNum: 4096,
		viewrecords: !0,
		grouping: !0,
		groupingView: {
			groupField: ["group_id"],
			groupColumnShow: [!1],
			groupText: [e],
			groupCollapse: settingsUserData.groups_collapsed.objects,
			groupOrder: ["asc"],
			groupDataSorted: [!0]
		},
		width: "340",
		shrinkToFit: !1,
		loadComplete: function (e) {
			for (var t in settingsObjectGroupData) null != document.getElementById("object_group_name_" + t) && (document.getElementById("object_group_name_" + t).innerHTML = settingsObjectGroupData[t].name);
			"" != objectsData && (objectAddAllToMap(), objectUpdateList());
			for (var a = $(this).getDataIDs(), i = 0; i < a.length; i++) {
				var o = a[i];
				$("#object_action_menu_" + o).click(function () {
					return $("#side_panel_objects_action_menu").toggle().position({
						my: "left top",
						at: "right bottom",
						of: this
					}), menuOnItem = $(this).attr("tag"), $(document).one("click", function () {
						$("#side_panel_objects_action_menu").hide()
					}), !1
				})
			}
		},
		onCellSelect: function (e, t, a, i) {
			objectSelect(e), 5 == t ? objectPanToZoom(e) : objectPanTo(e)
		}
	}), $("#side_panel_objects_object_list_grid").setCaption('<div class="row4">\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="width71">\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input id="side_panel_objects_object_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25">\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="float-right">\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="objectReloadData();">\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.RELOAD + '">\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/refresh-color.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="sharePositionOpen();">\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.SHARE_POSITION + '">\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/share-orange.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="settingsObjectAdd(\'open\');">\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.ADD_OBJECT + '">\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/object-add.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>'), $("#side_panel_objects_object_list_search").bind("keyup", function (e) {
		var t = $("#side_panel_objects_object_list_grid"),
			a = t.jqGrid("getGridParam", "postData");
		jQuery.extend(a, {
			filters: "",
			searchField: "search",
			searchOper: "cn",
			searchString: this.value.toLowerCase()
		}), t.jqGrid("setGridParam", {
			search: !0,
			postData: a
		}), t.trigger("reloadGrid")
	});
	e = '<div style="float: right;"><span>{0}</span></div>';
	$("#side_panel_objects_object_data_list_grid").jqGrid({
		datatype: "local",
		colNames: ["", la.DATA, la.VALUE],
		colModel: [{
			name: "group_name",
			index: "group_name"
		}, {
			name: "data",
			index: "data",
			width: 110,
			sortable: !1
		}, {
			name: "value",
			index: "value",
			width: 203,
			sortable: !1
		}],
		width: "340",
		height: "155",
		rowNum: 512,
		grouping: !0,
		groupingView: {
			groupField: ["group_name"],
			groupColumnShow: [!1],
			groupText: [e],
			groupCollapse: !1,
			groupOrder: ["asc"],
			groupDataSorted: [!0]
		},
		shrinkToFit: !1
	}), $("#side_panel_events_event_list_grid").jqGrid({
		url: "func/fn_events.php?cmd=load_event_list",
		datatype: "json",
		colNames: [la.TIME, la.OBJECT, la.EVENT],
		colModel: [{
			name: "dt_tracker",
			index: "dt_tracker",
			width: 50,
			sorttype: "datetime",
			formatter: function (e, t, a) {
				e = e.substring(0, 10) == moment().format("YYYY-MM-DD") ? e.substring(11, 19) : e.substring(2, 10);
				return e
			},
			align: "left"
		}, {
			name: "object",
			index: "object",
			width: 105,
			sortable: !1,
			align: "left"
		}, {
			name: "event",
			index: "event",
			width: 153,
			sortable: !1,
			align: "left"
		}],
		recordtext: "",
		emptyrecords: "",
		rowNum: 25,
		rowList: [25, 50, 75, 100, 200],
		pager: "#side_panel_events_event_list_grid_pager",
		sortname: "dt_tracker",
		sortorder: "desc",
		viewrecords: !0,
		width: "340",
		shrinkToFit: !1,
		onSelectRow: function (e) {
			eventsShowEvent(e)
		}
	}), $("#side_panel_events_event_list_grid").setCaption('<div class="row4">\t\t\t\t\t\t\t\t\t<div class="width71">\t\t\t\t\t\t\t\t\t\t<input id="side_panel_events_event_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25">\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<div class="float-right">\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="eventsReloadData();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.RELOAD + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/refresh-color.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="eventsExport();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.EXPORT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/export.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="eventsDeleteAll();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.DELETE_ALL_EVENTS + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/remove2.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</div>'), $("#side_panel_events_event_list_search").bind("keyup", function (e) {
		$("#side_panel_events_event_list_grid").setGridParam({
			url: "func/fn_events.php?cmd=load_event_list&s=" + this.value
		}), $("#side_panel_events_event_list_grid").trigger("reloadGrid")
	});
	e = '<div style="float: right;"><span>{0}</span></div>';
	$("#side_panel_events_event_datalist_grid").jqGrid({
		datatype: "local",
		colNames: ["", la.DATA, la.VALUE],
		colModel: [{
			name: "group_name",
			index: "group_name"
		}, {
			name: "data",
			index: "data",
			width: 110,
			sortable: !1
		}, {
			name: "value",
			index: "value",
			width: 203,
			sortable: !1
		}],
		width: "340",
		height: "155",
		rowNum: 512,
		grouping: !0,
		groupingView: {
			groupField: ["group_name"],
			groupColumnShow: [!1],
			groupText: [e],
			groupCollapse: !1,
			groupOrder: ["asc"],
			groupDataSorted: [!0]
		},
		shrinkToFit: !1
	}), $("#places_group_list_grid").jqGrid({
		url: "func/fn_places.php?cmd=load_places_group_list",
		datatype: "json",
		colNames: [la.NAME, la.PLACES, la.DESCRIPTION, ""],
		colModel: [{
			name: "group_name",
			index: "group_name",
			width: 228,
			sortable: !0
		}, {
			name: "places",
			index: "places",
			width: 90,
			align: "center",
			sortable: !1
		}, {
			name: "description",
			index: "description",
			width: 295,
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		rowNum: 50,
		rowList: [25, 50, 75, 100, 200],
		pager: "#places_group_list_grid_pager",
		sortname: "group_name",
		sortorder: "asc",
		viewrecords: !0,
		height: "311px",
		width: "720",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#places_group_list_grid").setCaption('<div class="row4"><input id="places_group_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#places_group_list_search").bind("keyup", function (e) {
		$("#places_group_list_grid").setGridParam({
			url: "func/fn_places.php?cmd=load_places_group_list&s=" + this.value
		}), $("#places_group_list_grid").trigger("reloadGrid")
	}), $("#places_group_list_grid").jqGrid("navGrid", "#places_group_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			placesGroupProperties("add")
		}
	}), $("#places_group_list_grid").navButtonAdd("#places_group_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "places_group_list_grid_action_menu_button"
	}), $("#places_group_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#places_group_list_grid_action_menu").hide(), $("#places_group_list_grid_action_menu_button").click(function () {
		return $("#places_group_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#places_group_list_grid_action_menu").hide()
		}), !1
	});
	e = '<div style="float: left; margin-top: 2px; width: 25px;">';
	e += '<center><input id="marker_group_visible_{0}" type="checkbox" onClick="markerGroupVisibleToggle({0});"></center>', e += "</div>", e += '<div style="float: right;"><span id="marker_group_name_{0}"></span> ({1})</div>', $("#side_panel_places_marker_list_grid").jqGrid({
		url: "func/fn_places.php?cmd=load_marker_list",
		datatype: "json",
		colNames: ["", "", '<a href="#" onclick="placesMarkerVisibleAllToggle();"><img title="' + la.SHOW_HIDE_ALL + '" src="theme/images/eye.svg" width="14px"/></a>', "", la.NAME, ""],
		colModel: [{
			name: "marker_id",
			index: "marker_id",
			hidden: !0
		}, {
			name: "group_id",
			index: "group_id"
		}, {
			name: "show",
			index: "show",
			width: 20,
			sortable: !1,
			align: "center"
		}, {
			name: "icon",
			index: "icon",
			width: 20,
			sortable: !1,
			align: "center",
			formatter: function (e, t, a) {
				return e = '<img style="height: 14px;" src="' + e + '"/>'
			}
		}, {
			name: "name",
			index: "name",
			width: 218
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		recordtext: "",
		emptyrecords: "",
		rowNum: 50,
		rowList: [25, 50, 100, 200],
		pager: "#side_panel_places_marker_list_grid_pager",
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		width: "340",
		shrinkToFit: !1,
		grouping: !0,
		groupingView: {
			groupField: ["group_id"],
			groupColumnShow: [!1],
			groupText: [e],
			groupCollapse: settingsUserData.groups_collapsed.markers,
			groupOrder: ["asc"],
			groupDataSorted: [!0]
		},
		onSelectRow: function (e) {
			placesMarkerPanTo($(this).jqGrid("getCell", e, "marker_id"))
		},
		loadComplete: function (e) {
			for (var t in placesGroupData.groups) null != document.getElementById("marker_group_name_" + t) && (document.getElementById("marker_group_name_" + t).innerHTML = placesGroupData.groups[t].name);
			placesMarkerSetListCheckbox()
		}
	}), $("#side_panel_places_marker_list_grid").setCaption('<div class="row4">\t\t\t\t\t\t\t\t\t<div class="width44">\t\t\t\t\t\t\t\t\t\t<input id="side_panel_places_marker_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25">\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<div class="float-right">\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesMarkerReload();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.RELOAD + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/refresh-color.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesMarkerNew();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.ADD_MARKER + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/marker-add.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesGroupOpen();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.GROUPS + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/groups.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesImport();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.IMPORT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/import.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesExport();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.EXPORT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/export.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesMarkerDeleteAll();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.DELETE_ALL_MARKERS + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/remove2.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</div>'), $("#side_panel_places_marker_list_search").bind("keyup", function (e) {
		$("#side_panel_places_marker_list_grid").setGridParam({
			url: "func/fn_places.php?cmd=load_marker_list&s=" + this.value
		}), $("#side_panel_places_marker_list_grid").trigger("reloadGrid"), placesMarkerSearchMap(this.value)
	}), $(window).bind("resize", function () {
		$("#side_panel_places_marker_list_grid").setGridHeight($(window).height() - 207)
	}).trigger("resize");
	e = '<div style="float: left; margin-top: 2px; width: 25px;">';
	e += '<center><input id="route_group_visible_{0}" type="checkbox" onClick="routeGroupVisibleToggle({0});"></center>', e += "</div>", e += '<div style="float: right;"><span id="route_group_name_{0}"></span> ({1})</div>', $("#side_panel_places_route_list_grid").jqGrid({
		url: "func/fn_places.php?cmd=load_route_list",
		datatype: "json",
		colNames: ["", "", '<a href="#" onclick="placesRouteVisibleAllToggle();"><img title="' + la.SHOW_HIDE_ALL + '" src="theme/images/eye.svg" width="14px"/></a>', "", la.NAME, ""],
		colModel: [{
			name: "route_id",
			index: "route_id",
			hidden: !0
		}, {
			name: "group_id",
			index: "group_id"
		}, {
			name: "show",
			index: "show",
			width: 20,
			sortable: !1,
			align: "center"
		}, {
			name: "icon",
			index: "icon",
			width: 20,
			sortable: !1,
			align: "center",
			formatter: function (e, t, a) {
				return e = '<div style="margin:auto; width: 12px; height: 12px; background-color:' + e + ';"></div>'
			}
		}, {
			name: "name",
			index: "name",
			width: 218
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		recordtext: "",
		emptyrecords: "",
		rowNum: 50,
		rowList: [25, 50, 100, 200],
		pager: "#side_panel_places_route_list_grid_pager",
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		width: "340",
		shrinkToFit: !1,
		grouping: !0,
		groupingView: {
			groupField: ["group_id"],
			groupColumnShow: [!1],
			groupText: [e],
			groupCollapse: settingsUserData.groups_collapsed.routes,
			groupOrder: ["asc"],
			groupDataSorted: [!0]
		},
		onSelectRow: function (e) {
			placesRoutePanTo($(this).jqGrid("getCell", e, "route_id"))
		},
		loadComplete: function (e) {
			for (var t in placesGroupData.groups) null != document.getElementById("route_group_name_" + t) && (document.getElementById("route_group_name_" + t).innerHTML = placesGroupData.groups[t].name);
			placesRouteSetListCheckbox()
		}
	}), $("#side_panel_places_route_list_grid").setCaption('<div class="row4">\t\t\t\t\t\t\t\t\t<div class="width44">\t\t\t\t\t\t\t\t\t\t<input id="side_panel_places_route_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25">\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<div class="float-right">\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesRouteReload();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.RELOAD + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/refresh-color.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesRouteNew();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.ADD_ROUTE + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/route-add.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesGroupOpen();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.GROUPS + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/groups.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesImport();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.IMPORT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/import.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesExport();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.EXPORT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/export.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesRouteDeleteAll();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.DELETE_ALL_ROUTES + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/remove2.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</div>'), $("#side_panel_places_route_list_search").bind("keyup", function (e) {
		$("#side_panel_places_route_list_grid").setGridParam({
			url: "func/fn_places.php?cmd=load_route_list&s=" + this.value
		}), $("#side_panel_places_route_list_grid").trigger("reloadGrid"), placesRouteSearchMap(this.value)
	}), $(window).bind("resize", function () {
		$("#side_panel_places_route_list_grid").setGridHeight($(window).height() - 207)
	}).trigger("resize");
	e = '<div style="float: left; margin-top: 2px; width: 25px;">';
	e += '<center><input id="zone_group_visible_{0}" type="checkbox" onClick="zoneGroupVisibleToggle({0});"></center>', e += "</div>", e += '<div style="float: right;"><span id="zone_group_name_{0}"></span> ({1})</div>', $("#side_panel_places_zone_list_grid").jqGrid({
		url: "func/fn_places.php?cmd=load_zone_list",
		datatype: "json",
		colNames: ["", "", '<a href="#" onclick="placesZoneVisibleAllToggle();"><img title="' + la.SHOW_HIDE_ALL + '" src="theme/images/eye.svg" width="14px"/></a>', "", la.NAME, ""],
		colModel: [{
			name: "zone_id",
			index: "zone_id",
			hidden: !0
		}, {
			name: "group_id",
			index: "group_id"
		}, {
			name: "show",
			index: "show",
			width: 20,
			sortable: !1,
			align: "center"
		}, {
			name: "icon",
			index: "icon",
			width: 20,
			sortable: !1,
			align: "center",
			formatter: function (e, t, a) {
				return e = '<div style="margin:auto; width: 12px; height: 12px; background-color:' + e + ';"></div>'
			}
		}, {
			name: "name",
			index: "name",
			width: 218
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		recordtext: "",
		emptyrecords: "",
		rowNum: 50,
		rowList: [25, 50, 100, 200],
		pager: "#side_panel_places_zone_list_grid_pager",
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		width: "340",
		shrinkToFit: !1,
		grouping: !0,
		groupingView: {
			groupField: ["group_id"],
			groupColumnShow: [!1],
			groupText: [e],
			groupCollapse: settingsUserData.groups_collapsed.zones,
			groupOrder: ["asc"],
			groupDataSorted: [!0]
		},
		onSelectRow: function (e) {
			placesZonePanTo($(this).jqGrid("getCell", e, "zone_id"))
		},
		loadComplete: function (e) {
			for (var t in placesGroupData.groups) null != document.getElementById("zone_group_name_" + t) && (document.getElementById("zone_group_name_" + t).innerHTML = placesGroupData.groups[t].name);
			placesZoneSetListCheckbox()
		}
	}), $("#side_panel_places_zone_list_grid").setCaption('<div class="row4">\t\t\t\t\t\t\t\t\t<div class="width44">\t\t\t\t\t\t\t\t\t\t<input id="side_panel_places_zone_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25">\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<div class="float-right">\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesZoneReload();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.RELOAD + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/refresh-color.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesZoneNew();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.ADD_ZONE + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/zone-add.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesGroupOpen();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.GROUPS + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/groups.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesImport();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.IMPORT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/import.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesExport();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.EXPORT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/export.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesZoneDeleteAll();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.DELETE_ALL_ZONES + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/remove2.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</div>'), $("#side_panel_places_zone_list_search").bind("keyup", function (e) {
		$("#side_panel_places_zone_list_grid").setGridParam({
			url: "func/fn_places.php?cmd=load_zone_list&s=" + this.value
		}), $("#side_panel_places_zone_list_grid").trigger("reloadGrid"), placesZoneSearchMap(this.value)
	}), $(window).bind("resize", function () {
		$("#side_panel_places_zone_list_grid").setGridHeight($(window).height() - 207)
	}).trigger("resize"), $("#side_panel_history_route_detail_list_grid").jqGrid({
		datatype: "local",
		colNames: ["", "", "", la.TIME, la.INFORMATION],
		colModel: [{
			name: "el_type",
			index: "el_type",
			hidden: !0
		}, {
			name: "el_id",
			index: "el_id",
			hidden: !0
		}, {
			name: "icon",
			index: "icon",
			width: 20,
			sortable: !1,
			align: "center"
		}, {
			name: "datetime",
			index: "datetime",
			width: 110,
			sortable: !1,
			datefmt: "Y-m-d H:i:s",
			align: "center"
		}, {
			name: "info",
			index: "info",
			width: 178,
			sortable: !1
		}],
		width: "340",
		height: "100%",
		rowNum: 4096,
		shrinkToFit: !1,
		loadComplete: function (e) {
			for (var t = $(this).getDataIDs(), a = historyRouteData.imei, i = 0; i < t.length; i++) {
				var o = t[i],
					s = $(this).jqGrid("getCell", o, "el_type"),
					n = $(this).jqGrid("getCell", o, "el_id");
				if ("point" == s) {
					var l = "<table>";
					if (l += "<tr><td>" + la.ROUTE_LENGTH + ":</td><td>" + historyRouteData.route_length + " " + la.UNIT_DISTANCE + "</td></tr>", l += "<tr><td>" + la.MOVE_DURATION + ":</td><td>" + historyRouteData.drives_duration + "</td></tr>", l += "<tr><td>" + la.STOP_DURATION + ":</td><td>" + historyRouteData.stops_duration + "</td></tr>", l += "<tr><td>" + la.TOP_SPEED + ":</td><td>" + historyRouteData.top_speed + " " + la.UNIT_SPEED + "</td></tr>", l += "<tr><td>" + la.AVG_SPEED + ":</td><td>" + historyRouteData.avg_speed + " " + la.UNIT_SPEED + "</td></tr>", 0 != (_ = historyRouteData.fuel_consumption) && (l += "<tr><td>" + la.FUEL_CONSUMPTION + ":</td><td>" + _ + " " + la.UNIT_CAPACITY + "</td></tr>"), "l" == settingsUserData.unit_capacity) 0 != (d = historyRouteData.fuel_consumption_per_100km) && (l += "<tr><td>" + la.AVG_FUEL_CONSUMPTION_100_KM + ":</td><td>" + d + " " + la.UNIT_CAPACITY + "</td></tr>");
					else 0 != (r = historyRouteData.fuel_consumption_mpg) && (l += "<tr><td>" + la.AVG_FUEL_CONSUMPTION_MPG + ":</td><td>" + r + " " + la.UNIT_MI + "</td></tr>");
					0 != (c = historyRouteData.fuel_cost) && (l += "<tr><td>" + la.FUEL_COST + ":</td><td>" + c + " " + settingsUserData.currency + "</td></tr>"), 0 != getSensorFromType(a, "acc") && (l += "<tr><td>" + la.ENGINE_WORK + ":</td><td>" + historyRouteData.engine_work + "</td></tr>", l += "<tr><td>" + la.ENGINE_IDLE + ":</td><td>" + historyRouteData.engine_idle + "</td></tr>"), l += "</table>"
				} else if ("drive" == s) {
					var d, r;
					l = "<table>";
					if (l += "<tr><td>" + la.ROUTE_LENGTH + ":</td><td>" + historyRouteData.drives[n].route_length + " " + la.UNIT_DISTANCE + "</td></tr>", l += "<tr><td>" + la.TOP_SPEED + ":</td><td>" + historyRouteData.drives[n].top_speed + " " + la.UNIT_SPEED + "</td></tr>", l += "<tr><td>" + la.AVG_SPEED + ":</td><td>" + historyRouteData.drives[n].avg_speed + " " + la.UNIT_SPEED + "</td></tr>", 0 != (_ = historyRouteData.drives[n].fuel_consumption) && (l += "<tr><td>" + la.FUEL_CONSUMPTION + ":</td><td>" + _ + " " + la.UNIT_CAPACITY + "</td></tr>"), "l" == settingsUserData.unit_capacity) 0 != (d = historyRouteData.drives[n].fuel_consumption_per_100km) && (l += "<tr><td>" + la.AVG_FUEL_CONSUMPTION_100_KM + ":</td><td>" + d + " " + la.UNIT_CAPACITY + "</td></tr>");
					else 0 != (r = historyRouteData.drives[n].fuel_consumption_mpg) && (l += "<tr><td>" + la.AVG_FUEL_CONSUMPTION_MPG + ":</td><td>" + r + " " + la.UNIT_MI + "</td></tr>");
					0 != (c = historyRouteData.drives[n].fuel_cost) && (l += "<tr><td>" + la.FUEL_COST + ":</td><td>" + c + " " + settingsUserData.currency + "</td></tr>"), l += "</table>"
				} else if ("stop" == s) {
					var _, c;
					l = "<table>";
					l += "<tr><td>" + la.ARRIVED + ":</td><td>" + historyRouteData.stops[n].dt_start + "</td></tr>", l += "<tr><td>" + la.DEPARTED + ":</td><td>" + historyRouteData.stops[n].dt_end + "</td></tr>", 0 != (_ = historyRouteData.stops[n].fuel_consumption) && (l += "<tr><td>" + la.FUEL_CONSUMPTION + ":</td><td>" + _ + " " + la.UNIT_CAPACITY + "</td></tr>"), 0 != (c = historyRouteData.stops[n].fuel_cost) && (l += "<tr><td>" + la.FUEL_COST + ":</td><td>" + c + " " + settingsUserData.currency + "</td></tr>"), 0 != getSensorFromType(a, "acc") && (l += "<tr><td>" + la.ENGINE_IDLE + ":</td><td>" + historyRouteData.stops[n].engine_idle + "</td></tr>"), l += "</table>"
				}
				"point" != s && "drive" != s && "stop" != s || $("#side_panel_history_route_detail_list_grid #" + o).qtip({
					content: l,
					position: {
						my: "left bottom",
						adjust: {
							x: 0,
							y: -9
						}
					}
				})
			}
		},
		onSelectRow: function (e) {
			var t = $(this).jqGrid("getCell", e, "el_type"),
				a = $(this).jqGrid("getCell", e, "el_id");
			"point" == t ? (0 == historyRouteData.play.status && historyRoutePanToPoint(a), historyRouteShowPoint(a, !0)) : "stop" == t ? (0 == historyRouteData.play.status && historyRoutePanToStop(a), historyRouteShowStop(a)) : "event" == t ? (0 == historyRouteData.play.status && historyRoutePanToEvent(a), historyRouteShowEvent(a)) : "drive" == t && (0 == historyRouteData.play.status && historyRouteRemovePointMarker(), destroyMapPopup(), historyRouteShowDrive(a))
		}
	});
	e = '<div style="float: right;"><span>{0}</span></div>';
	$("#side_panel_history_route_datalist_grid").jqGrid({
		datatype: "local",
		colNames: ["", la.DATA, la.VALUE],
		colModel: [{
			name: "group_name",
			index: "group_name"
		}, {
			name: "data",
			index: "data",
			width: 110,
			sortable: !1
		}, {
			name: "value",
			index: "value",
			width: 203,
			sortable: !1
		}],
		width: "340",
		height: "155",
		rowNum: 512,
		grouping: !0,
		groupingView: {
			groupField: ["group_name"],
			groupColumnShow: [!1],
			groupText: [e],
			groupCollapse: !1,
			groupOrder: ["asc"],
			groupDataSorted: [!0]
		},
		shrinkToFit: !1
	}), $("#bottom_panel_msg_list_grid").jqGrid({
		url: "func/fn_history.php?cmd=load_msg_list_empty",
		datatype: "json",
		colNames: [la.TIME_POSITION, la.TIME_SERVER, la.LATITUDE, la.LONGITUDE, la.ALTITUDE, la.ANGLE, la.SPEED, la.PARAMETERS],
		colModel: [{
			name: "dt_tracker",
			index: "dt_tracker",
			width: 120,
			fixed: !0,
			align: "center",
			sortable: !0
		}, {
			name: "dt_server",
			index: "dt_server",
			width: 120,
			fixed: !0,
			align: "center",
			sortable: !0
		}, {
			name: "lat",
			index: "lat",
			width: 100,
			fixed: !0,
			align: "center",
			sortable: !0
		}, {
			name: "lng",
			index: "lng",
			width: 100,
			fixed: !0,
			align: "center",
			sortable: !0
		}, {
			name: "altitude",
			index: "altitude",
			width: 90,
			fixed: !0,
			align: "center",
			sortable: !0
		}, {
			name: "angle",
			index: "angle",
			width: 80,
			fixed: !0,
			align: "center",
			sortable: !0
		}, {
			name: "speed",
			index: "speed",
			width: 80,
			fixed: !0,
			align: "center",
			sortable: !0
		}, {
			name: "params",
			index: "params",
			align: "left",
			sortable: !0
		}],
		sortname: "dt_tracker",
		sortorder: "desc",
		rowNum: 50,
		rowList: [25, 50, 100, 200, 300, 400, 500],
		pager: "#bottom_panel_msg_list_grid_pager",
		height: "111",
		beforeSelectRow: function (e, t) {
			if ("input" === t.target.tagName.toLowerCase()) return !0;
			var a = $(this).jqGrid("getCell", e, "lat"),
				i = $(this).jqGrid("getCell", e, "lng");
			return 0 != a && 0 != i && utilsPointOnMap(a, i), !1
		},
		shrinkToFit: !0,
		multiselect: !0
	}), $("#bottom_panel_msg_list_grid").jqGrid("navGrid", "#bottom_panel_msg_list_grid_pager", {
		add: !1,
		edit: !1,
		del: !1,
		search: !1
	}), $("#bottom_panel_msg_list_grid").navButtonAdd("#bottom_panel_msg_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "bottom_panel_msg_list_grid_action_menu_button"
	}), $("#bottom_panel_msg_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#bottom_panel_msg_list_grid_action_menu").hide(), $("#bottom_panel_msg_list_grid_action_menu_button").click(function () {
		return $("#bottom_panel_msg_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#bottom_panel_msg_list_grid_action_menu").hide()
		}), !1
	}), $(window).bind("resize", function () {
		"none" == document.getElementById("side_panel").style.display ? $("#bottom_panel_msg_list_grid").setGridWidth($(window).width() - 23) : $("#bottom_panel_msg_list_grid").setGridWidth($(window).width() - 384)
	}).trigger("resize"), $("#share_position_list_grid").jqGrid({
		url: "func/fn_share.php?cmd=load_share_position_list",
		datatype: "json",
		colNames: [la.NAME, la.EMAIL, la.PHONE, la.OBJECTS, la.ACTIVE, la.EXPIRES_ON, ""],
		colModel: [{
			name: "name",
			index: "name",
			width: 220,
			align: "left",
			sortable: !0
		}, {
			name: "email",
			index: "email",
			width: 220,
			align: "left",
			sortable: !0
		}, {
			name: "phone",
			index: "phone",
			width: 200,
			align: "left",
			sortable: !0
		}, {
			name: "objects",
			index: "objects",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "active",
			index: "active",
			width: 60,
			align: "center",
			sortable: !0
		}, {
			name: "expire_dt",
			index: "expire_dt",
			width: 80,
			align: "center",
			sortable: !0
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		sortname: "gs_user_share_position.name",
		sortorder: "asc",
		rowNum: 50,
		rowList: [50, 100, 200, 300, 400, 500],
		pager: "#share_position_list_grid_pager",
		viewrecords: !0,
		height: "373px",
		width: "962",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#share_position_list_grid").setCaption('<div class="row4"><input id="share_position_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#share_position_list_search").bind("keyup", function (e) {
		$("#share_position_list_grid").setGridParam({
			url: "func/fn_share.php?cmd=load_share_position_list&s=" + this.value
		}), $("#share_position_list_grid").trigger("reloadGrid")
	}), $("#share_position_list_grid").jqGrid("navGrid", "#share_position_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			sharePositionProperties("add")
		}
	}), $("#share_position_list_grid").navButtonAdd("#share_position_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "share_position_list_grid_action_menu_button"
	}), $("#share_position_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#share_position_list_grid_action_menu").hide(), $("#share_position_list_grid_action_menu_button").click(function () {
		return $("#share_position_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#share_position_list_grid_action_menu").hide()
		}), !1
	}), $("#tasks_list_grid").jqGrid({
		url: "func/fn_tasks.php?cmd=load_task_list",
		datatype: "json",
		colNames: [la.TIME, la.NAME, la.OBJECT, la.START, la.DESTINATION, la.PRIORITY, la.STATUS, "", ""],
		colModel: [{
			name: "dt_task",
			index: "dt_task",
			width: 60,
			align: "center",
			sortable: !0
		}, {
			name: "name",
			index: "name",
			width: 80,
			align: "left",
			sortable: !0
		}, {
			name: "imei",
			index: "imei",
			width: 80,
			align: "left",
			sortable: !1
		}, {
			name: "from",
			index: "from",
			width: 80,
			align: "left",
			sortable: !1
		}, {
			name: "to",
			index: "to",
			width: 80,
			align: "left",
			sortable: !1
		}, {
			name: "priority",
			index: "priority",
			width: 40,
			align: "center",
			sortable: !0
		}, {
			name: "status",
			index: "status",
			width: 40,
			align: "center",
			sortable: !0
		}, {
			name: "modify",
			index: "modify",
			width: 30,
			align: "center",
			sortable: !1
		}, {
			name: "scroll_fix",
			index: "scroll_fix",
			width: 13,
			sortable: !1,
			fixed: !0
		}],
		sortname: "dt_task",
		sortorder: "desc",
		rowNum: 50,
		rowList: [50, 100, 200, 300, 400, 500],
		pager: "#tasks_list_grid_pager",
		viewrecords: !0,
		height: "150px",
		width: "750",
		shrinkToFit: !0,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#tasks_list_grid").jqGrid("navGrid", "#tasks_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			taskProperties("add")
		}
	}), $("#tasks_list_grid").navButtonAdd("#tasks_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "task_list_grid_action_menu_button"
	}), $("#task_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#task_list_grid_action_menu").hide(), $("#task_list_grid_action_menu_button").click(function () {
		return $("#task_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#task_list_grid_action_menu").hide()
		}), !1
	}), $("#reports_report_list_grid").jqGrid({
		url: "func/fn_reports.php?cmd=load_report_list",
		datatype: "json",
		colNames: [la.NAME, la.TYPE, la.FORMAT, la.OBJECTS, la.MARKERS, la.ZONES, la.SENSORS, la.DAILY, la.WEEKLY, ""],
		colModel: [{
			name: "name",
			index: "name",
			width: 200,
			sortable: !0
		}, {
			name: "type",
			index: "type",
			width: 190,
			align: "center",
			sortable: !1
		}, {
			name: "format",
			index: "format",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "objects",
			index: "objects",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "markers",
			index: "markers",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "zones",
			index: "zones",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "sensors",
			index: "sensors",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "daily",
			index: "daily",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "weekly",
			index: "weekly",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 60,
			align: "center",
			sortable: !1
		}],
		sortname: "name",
		sortorder: "asc",
		rowNum: 50,
		rowList: [50, 100, 200, 300, 400, 500],
		pager: "#reports_report_list_grid_pager",
		viewrecords: !0,
		height: "342px",
		width: "962",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		},
		loadComplete: function (e) {
			for (var t = $(this).getDataIDs(), a = 0; a < t.length; a++) {
				var i = t[a];
				$("#report_action_menu_" + i).click(function () {
					return $("#report_action_menu").toggle().position({
						my: "left top",
						at: "right bottom",
						of: this
					}), menuOnItem = $(this).attr("tag"), $(document).one("click", function () {
						$("#report_action_menu").hide()
					}), !1
				})
			}
		}
	}), $("#reports_report_list_grid").setCaption('<div class="row4"><input id="reports_report_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#reports_report_list_search").bind("keyup", function (e) {
		$("#reports_report_list_grid").setGridParam({
			url: "func/fn_reports.php?cmd=load_report_list&s=" + this.value
		}), $("#reports_report_list_grid").trigger("reloadGrid")
	}), $("#reports_report_list_grid").jqGrid("navGrid", "#reports_report_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			reportProperties("add")
		}
	}), $("#reports_report_list_grid").navButtonAdd("#reports_report_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "reports_report_list_grid_action_menu_button"
	}), $("#reports_report_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#reports_report_list_grid_action_menu").hide(), $("#reports_report_list_grid_action_menu_button").click(function () {
		return $("#reports_report_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#reports_report_list_grid_action_menu").hide()
		}), !1
	}), $("#reports_generated_list_grid").jqGrid({
		url: "func/fn_reports.php?cmd=load_reports_generated_list",
		datatype: "json",
		colNames: [la.TIME, la.NAME, la.TYPE, la.FORMAT, la.OBJECTS, la.MARKERS, la.ZONES, la.SENSORS, la.SCHEDULE, ""],
		colModel: [{
			name: "dt_report",
			index: "dt_report",
			width: 110,
			fixed: !0,
			align: "center"
		}, {
			name: "name",
			index: "name",
			width: 180,
			sortable: !0
		}, {
			name: "type",
			index: "type",
			width: 160,
			align: "center",
			sortable: !1
		}, {
			name: "format",
			index: "format",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "objects",
			index: "objects",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "markers",
			index: "markers",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "zones",
			index: "zones",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "sensors",
			index: "sensors",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "schedule",
			index: "schedule",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 60,
			align: "center",
			sortable: !1
		}],
		sortname: "dt_report",
		sortorder: "desc",
		rowNum: 50,
		rowList: [50, 100, 200, 300, 400, 500],
		pager: "#reports_generated_list_grid_pager",
		viewrecords: !0,
		height: "342px",
		width: "962",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#reports_generated_list_grid").setCaption('<div class="row4"><input id="reports_generated_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#reports_generated_list_search").bind("keyup", function (e) {
		$("#reports_generated_list_grid").setGridParam({
			url: "func/fn_reports.php?cmd=load_reports_generated_list&s=" + this.value
		}), $("#reports_generated_list_grid").trigger("reloadGrid")
	}), $("#reports_generated_list_grid").jqGrid("navGrid", "#reports_generated_list_grid_pager", {
		add: !1,
		edit: !1,
		del: !1,
		search: !1
	}), $("#reports_generated_list_grid").navButtonAdd("#reports_generated_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "reports_generated_list_grid_action_menu_button"
	}), $("#reports_generated_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#reports_generated_list_grid_action_menu").hide(), $("#reports_generated_list_grid_action_menu_button").click(function () {
		return $("#reports_generated_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#reports_generated_list_grid_action_menu").hide()
		}), !1
	}), $("#rilogbook_logbook_grid").jqGrid({
		url: "func/fn_rilogbook.php?cmd=load_rilogbook_list&drivers=true&passengers=true&trailers=true",
		datatype: "json",
		colNames: [la.TIME, la.OBJECT, la.GROUP, la.NAME, la.POSITION, "", ""],
		colModel: [{
			name: "dt_tracker",
			index: "dt_tracker",
			width: 60,
			align: "center",
			sortable: !0
		}, {
			name: "imei",
			index: "imei",
			width: 80,
			align: "left",
			sortable: !1
		}, {
			name: "group",
			index: "group",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "name",
			index: "name",
			width: 80,
			align: "left",
			sortable: !1
		}, {
			name: "position",
			index: "position",
			width: 175,
			align: "left",
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 30,
			align: "center",
			sortable: !1
		}, {
			name: "scroll_fix",
			index: "scroll_fix",
			width: 13,
			sortable: !1,
			fixed: !0
		}],
		sortname: "dt_tracker",
		sortorder: "desc",
		rowNum: 50,
		rowList: [50, 100, 200, 300, 400, 500],
		pager: "#rilogbook_logbook_grid_pager",
		viewrecords: !0,
		height: "150px",
		width: "750",
		shrinkToFit: !0,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#rilogbook_logbook_grid").jqGrid("navGrid", "#rilogbook_logbook_grid_pager", {
		add: !1,
		edit: !1,
		del: !1,
		search: !1
	}), $("#rilogbook_logbook_grid").navButtonAdd("#rilogbook_logbook_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "rilogbook_logbook_grid_action_menu_button"
	}), $("#rilogbook_logbook_grid_action_menu").menu({
		role: "listbox"
	}), $("#rilogbook_logbook_grid_action_menu").hide(), $("#rilogbook_logbook_grid_action_menu_button").click(function () {
		return $("#rilogbook_logbook_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#rilogbook_logbook_grid_action_menu").hide()
		}), !1
	}), $("#dtc_list_grid").jqGrid({
		url: "func/fn_dtc.php?cmd=load_dtc_list",
		datatype: "json",
		colNames: [la.TIME, la.OBJECT, la.CODE, la.POSITION, "", ""],
		colModel: [{
			name: "dt_tracker",
			index: "dt_tracker",
			width: 60,
			align: "center",
			sortable: !0
		}, {
			name: "imei",
			index: "imei",
			width: 80,
			align: "left",
			sortable: !1
		}, {
			name: "code",
			index: "code",
			width: 60,
			align: "left",
			sortable: !1
		}, {
			name: "position",
			index: "position",
			width: 215,
			align: "left",
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 30,
			align: "center",
			sortable: !1
		}, {
			name: "scroll_fix",
			index: "scroll_fix",
			width: 13,
			sortable: !1,
			fixed: !0
		}],
		sortname: "dt_tracker",
		sortorder: "desc",
		rowNum: 50,
		rowList: [50, 100, 200, 300, 400, 500],
		pager: "#dtc_list_grid_pager",
		viewrecords: !0,
		height: "150px",
		width: "750",
		shrinkToFit: !0,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#dtc_list_grid").jqGrid("navGrid", "#dtc_list_grid_pager", {
		add: !1,
		edit: !1,
		del: !1,
		search: !1
	}), $("#dtc_list_grid").navButtonAdd("#dtc_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "dtc_list_grid_action_menu_button"
	}), $("#dtc_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#dtc_list_grid_action_menu").hide(), $("#dtc_list_grid_action_menu_button").click(function () {
		return $("#dtc_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#dtc_list_grid_action_menu").hide()
		}), !1
	}), $("#maintenance_list_grid").jqGrid({
		url: "func/fn_maintenance.php?cmd=load_maintenance_list",
		datatype: "json",
		colNames: [la.OBJECT, la.NAME, la.ODOMETER, la.ODOMETER_LEFT, la.ENGINE_HOURS, la.ENGINE_HOURS_LEFT, la.DAYS, la.DAYS_LEFT, la.EVENT, "", ""],
		colModel: [{
			name: "object",
			index: "gs_objects.name",
			width: 100,
			sortable: !0
		}, {
			name: "name",
			index: "gs_object_services.name",
			width: 100,
			sortable: !0
		}, {
			name: "odometer",
			index: "odometer",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "odometer_left",
			index: "odometer_left",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "engine_hours",
			index: "engine_hours",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "engine_hours_left",
			index: "engine_hours_left",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "days",
			index: "days",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "days_left",
			index: "days_left",
			width: 60,
			align: "center",
			sortable: !1
		}, {
			name: "event",
			index: "event",
			width: 30,
			align: "center",
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 30,
			align: "center",
			sortable: !1
		}, {
			name: "scroll_fix",
			index: "scroll_fix",
			width: 13,
			sortable: !1,
			fixed: !0
		}],
		sortname: "gs_objects.name",
		sortorder: "asc",
		rowNum: 50,
		rowList: [50, 100, 200, 300, 400, 500],
		pager: "#maintenance_list_grid_pager",
		viewrecords: !0,
		height: "150px",
		width: "750",
		shrinkToFit: !0,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#maintenance_list_grid").setCaption('<div class="row4"><input id="maintenance_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#maintenance_list_search").bind("keyup", function (e) {
		$("#maintenance_list_grid").setGridParam({
			url: "func/fn_maintenance.php?cmd=load_maintenance_list&s=" + this.value
		}), $("#maintenance_list_grid").trigger("reloadGrid")
	}), $("#maintenance_list_grid").jqGrid("navGrid", "#maintenance_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			maintenanceServiceProperties("add")
		}
	}), $("#maintenance_list_grid").navButtonAdd("#maintenance_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "maintenance_list_grid_action_menu_button"
	}), $("#maintenance_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#maintenance_list_grid_action_menu").hide(), $("#maintenance_list_grid_action_menu_button").click(function () {
		return $("#maintenance_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#maintenance_list_grid_action_menu").hide()
		}), !1
	}), $("#expenses_list_grid").jqGrid({
		url: "func/fn_expenses.php?cmd=load_expenses_list",
		datatype: "json",
		colNames: [la.DATE, la.NAME, la.OBJECT, la.QUANTITY, la.COST, la.SUPPLIER, la.BUYER, "", ""],
		colModel: [{
			name: "dt_expense",
			index: "dt_expense",
			width: 60,
			align: "center",
			sortable: !0
		}, {
			name: "name",
			index: "gs_user_expenses.name",
			width: 100,
			sortable: !0
		}, {
			name: "object",
			index: "gs_objects.name",
			width: 100,
			sortable: !0
		}, {
			name: "quantity",
			index: "quantity",
			width: 30,
			align: "center",
			sortable: !0
		}, {
			name: "cost",
			index: "cost",
			width: 60,
			align: "center",
			sortable: !0
		}, {
			name: "supplier",
			index: "supplier",
			width: 80,
			sortable: !0
		}, {
			name: "buyer",
			index: "buyer",
			width: 80,
			sortable: !0
		}, {
			name: "modify",
			index: "modify",
			width: 30,
			align: "center",
			sortable: !1
		}, {
			name: "scroll_fix",
			index: "scroll_fix",
			width: 13,
			sortable: !1,
			fixed: !0
		}],
		sortname: "dt_expense",
		sortorder: "desc",
		rowNum: 50,
		rowList: [50, 100, 200, 300, 400, 500],
		pager: "#expenses_list_grid_pager",
		viewrecords: !0,
		height: "150px",
		width: "750",
		shrinkToFit: !0,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#expenses_list_grid").setCaption('<div class="row4"><input id="expenses_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#expenses_list_search").bind("keyup", function (e) {
		$("#expenses_list_grid").setGridParam({
			url: "func/fn_expenses.php?cmd=load_expenses_list&s=" + this.value
		}), $("#expenses_list_grid").trigger("reloadGrid")
	}), $("#expenses_list_grid").jqGrid("navGrid", "#expenses_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			expensesProperties("add")
		}
	}), $("#expenses_list_grid").navButtonAdd("#expenses_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "expenses_list_grid_action_menu_button"
	}), $("#expenses_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#expenses_list_grid_action_menu").hide(), $("#expenses_list_grid_action_menu_button").click(function () {
		return $("#expenses_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#expenses_list_grid_action_menu").hide()
		}), !1
	}), $("#cmd_gprs_status_list_grid").jqGrid({
		url: "func/fn_cmd.php?cmd=load_cmd_gprs_exec_list",
		datatype: "json",
		colNames: [la.TIME, la.OBJECT, la.NAME, la.COMMAND, la.STATUS, "", ""],
		colModel: [{
			name: "dt_cmd",
			index: "dt_cmd",
			width: 110,
			sortable: !0
		}, {
			name: "object",
			index: "object",
			width: 120,
			sortable: !1
		}, {
			name: "name",
			index: "name",
			width: 120,
			sortable: !1
		}, {
			name: "cmd",
			index: "cmd",
			width: 323,
			sortable: !1
		}, {
			name: "status",
			index: "status",
			width: 50,
			align: "center",
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 30,
			align: "center",
			sortable: !1
		}, {
			name: "re_hex",
			index: "re_hex",
			hidden: !0
		}],
		rowNum: 2048,
		pager: "#cmd_gprs_status_list_grid_pager",
		pgbuttons: !1,
		pgtext: "",
		recordtext: "",
		emptyrecords: "",
		sortname: "dt_cmd",
		sortorder: "desc",
		viewrecords: !0,
		height: "316px",
		width: "850",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		},
		subGrid: !0,
		subGridRowExpanded: function (e, t) {
			var a = $("#cmd_gprs_status_list_grid").getRowData(t).re_hex,
				i = hexToAscii(a),
				o = "";
			"" == i && "" == a ? o = la.NO_DATA : (o = '<table style="table-layout: fixed; width: 100%">', o += '<tr><td style="width: 40px;">ASCII:</td><td style="word-wrap: break-word;">' + i + "</td></tr>", o += '<tr><td>HEX:</td><td style="word-wrap:break-word;">' + a + "</td></tr>", o += "</table>"), $("#" + e).html(o)
		}
	}), $("#cmd_gprs_status_list_grid").jqGrid("navGrid", "#cmd_gprs_status_list_grid_pager", {
		add: !1,
		edit: !1,
		del: !1,
		search: !1
	}), $("#cmd_gprs_status_list_grid").navButtonAdd("#cmd_gprs_status_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "cmd_gprs_status_list_grid_action_menu_button"
	}), $("#cmd_gprs_status_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#cmd_gprs_status_list_grid_action_menu").hide(), $("#cmd_gprs_status_list_grid_action_menu_button").click(function () {
		return $("#cmd_gprs_status_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#cmd_gprs_status_list_grid_action_menu").hide()
		}), !1
	}), $("#cmd_sms_status_list_grid").jqGrid({
		url: "func/fn_cmd.php?cmd=load_cmd_sms_exec_list",
		datatype: "json",
		colNames: [la.TIME, la.OBJECT, la.NAME, la.COMMAND, la.STATUS, "", ""],
		colModel: [{
			name: "dt_cmd",
			index: "dt_cmd",
			width: 110,
			sortable: !0
		}, {
			name: "object",
			index: "object",
			width: 120,
			sortable: !1
		}, {
			name: "name",
			index: "name",
			width: 120,
			sortable: !1
		}, {
			name: "cmd",
			index: "cmd",
			width: 348,
			sortable: !1
		}, {
			name: "status",
			index: "status",
			width: 50,
			align: "center",
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 30,
			align: "center",
			sortable: !1
		}, {
			name: "re_hex",
			index: "re_hex",
			hidden: !0
		}],
		rowNum: 2048,
		pager: "#cmd_sms_status_list_grid_pager",
		pgbuttons: !1,
		pgtext: "",
		recordtext: "",
		emptyrecords: "",
		sortname: "dt_cmd",
		sortorder: "desc",
		viewrecords: !0,
		height: "316px",
		width: "850",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#cmd_sms_status_list_grid").jqGrid("navGrid", "#cmd_sms_status_list_grid_pager", {
		add: !1,
		edit: !1,
		del: !1,
		search: !1
	}), $("#cmd_sms_status_list_grid").navButtonAdd("#cmd_sms_status_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "cmd_sms_status_list_grid_action_menu_button"
	}), $("#cmd_sms_status_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#cmd_sms_status_list_grid_action_menu").hide(), $("#cmd_sms_status_list_grid_action_menu_button").click(function () {
		return $("#cmd_sms_status_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#cmd_sms_status_list_grid_action_menu").hide()
		}), !1
	}), $("#cmd_schedule_list_grid").jqGrid({
		url: "func/fn_cmd.php?cmd=load_cmd_schedule_list",
		datatype: "json",
		colNames: [la.NAME, la.ACTIVE, la.SCHEDULE, la.GATEWAY, la.TYPE, la.COMMAND, ""],
		colModel: [{
			name: "name",
			index: "name",
			width: 150,
			sortable: !0
		}, {
			name: "active",
			index: "active",
			width: 60,
			align: "center",
			sortable: !0
		}, {
			name: "exact_time",
			index: "exact_time",
			width: 90,
			align: "center",
			sortable: !0
		}, {
			name: "gateway",
			index: "gateway",
			width: 60,
			align: "center",
			sortable: !0
		}, {
			name: "type",
			index: "type",
			width: 60,
			align: "center",
			sortable: !0
		}, {
			name: "cmd",
			index: "cmd",
			width: 308,
			sortable: !0
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		sortname: "name",
		sortorder: "asc",
		rowNum: 50,
		rowList: [25, 50, 100, 200],
		pager: "#cmd_schedule_list_grid_pager",
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		height: "342px",
		width: "850",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#cmd_schedule_list_grid").setCaption('<div class="row4"><input id="cmd_schedule_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#cmd_schedule_list_search").bind("keyup", function (e) {
		$("#cmd_schedule_list_grid").setGridParam({
			url: "func/fn_cmd.php?cmd=load_cmd_schedule_list&s=" + this.value
		}), $("#cmd_schedule_list_grid").trigger("reloadGrid")
	}), $("#cmd_schedule_list_grid").jqGrid("navGrid", "#cmd_schedule_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			cmdScheduleProperties("add")
		}
	}), $("#cmd_schedule_list_grid").navButtonAdd("#cmd_schedule_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "cmd_schedule_list_grid_action_menu_button"
	}), $("#cmd_schedule_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#cmd_schedule_list_grid_action_menu").hide(), $("#cmd_schedule_list_grid_action_menu_button").click(function () {
		return $("#cmd_schedule_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#cmd_schedule_list_grid_action_menu").hide()
		}), !1
	}), $("#cmd_template_list_grid").jqGrid({
		url: "func/fn_cmd.php?cmd=load_cmd_template_list",
		datatype: "json",
		colNames: [la.NAME, la.PROTOCOL, la.GATEWAY, la.TYPE, la.COMMAND, ""],
		colModel: [{
			name: "name",
			index: "name",
			width: 150,
			sortable: !0
		}, {
			name: "protocol",
			index: "protocol",
			width: 150,
			align: "center",
			sortable: !0
		}, {
			name: "gateway",
			index: "gateway",
			width: 60,
			align: "center",
			sortable: !0
		}, {
			name: "type",
			index: "type",
			width: 60,
			align: "center",
			sortable: !0
		}, {
			name: "cmd",
			index: "cmd",
			width: 313,
			sortable: !0
		}, {
			name: "modify",
			index: "modify",
			width: 45,
			align: "center",
			sortable: !1
		}],
		sortname: "name",
		sortorder: "asc",
		rowNum: 50,
		rowList: [25, 50, 100, 200],
		pager: "#cmd_template_list_grid_pager",
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		height: "342px",
		width: "850",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			return "input" === t.target.tagName.toLowerCase()
		}
	}), $("#cmd_template_list_grid").setCaption('<div class="row4"><input id="cmd_template_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25"></div>'), $("#cmd_template_list_search").bind("keyup", function (e) {
		$("#cmd_template_list_grid").setGridParam({
			url: "func/fn_cmd.php?cmd=load_cmd_template_list&s=" + this.value
		}), $("#cmd_template_list_grid").trigger("reloadGrid")
	}), $("#cmd_template_list_grid").jqGrid("navGrid", "#cmd_template_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			cmdTemplateProperties("add")
		}
	}), $("#cmd_template_list_grid").navButtonAdd("#cmd_template_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "cmd_template_list_grid_action_menu_button"
	}), $("#cmd_template_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#cmd_template_list_grid_action_menu").hide(), $("#cmd_template_list_grid_action_menu_button").click(function () {
		return $("#cmd_template_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#cmd_template_list_grid_action_menu").hide()
		}), !1
	}), $("#image_gallery_list_grid").jqGrid({
		url: "func/fn_img.php?cmd=load_img_list",
		datatype: "json",
		colNames: [la.TIME, la.OBJECT, "", "", "", "", ""],
		colModel: [{
			name: "dt_tracker",
			index: "dt_tracker",
			width: 110,
			sortable: !0
		}, {
			name: "object",
			index: "object",
			width: 111,
			sortable: !1
		}, {
			name: "modify",
			index: "modify",
			width: 30,
			align: "center",
			sortable: !1
		}, {
			name: "img_file",
			index: "img_file",
			hidden: !0
		}, {
			name: "lat",
			index: "lat",
			hidden: !0
		}, {
			name: "lng",
			index: "lng",
			hidden: !0
		}, {
			name: "speed",
			index: "speed",
			hidden: !0
		}],
		rowNum: 25,
		recordtext: "",
		emptyrecords: "",
		rowList: [25, 50, 75, 100],
		pager: "#image_gallery_list_grid_pager",
		sortname: "dt_tracker",
		sortorder: "desc",
		viewrecords: !0,
		height: "302px",
		width: "308",
		shrinkToFit: !1,
		multiselect: !0,
		beforeSelectRow: function (e, t) {
			if ("input" === t.target.tagName.toLowerCase()) return !0;
			var a = "data/img/" + $(this).jqGrid("getCell", e, "img_file"),
				i = $(this).jqGrid("getCell", e, "lat"),
				o = $(this).jqGrid("getCell", e, "lng");
			$(this).jqGrid("getCell", e, "speed");
			imageExists(a, function (e) {
				document.getElementById("image_gallery_img").innerHTML = e ? '<img style="image-orientation: from-image; object-fit: contain; height: 480px; width: 640px;" src="' + a + '">' : '<img src="img/no-image.svg">'
			});
			var s = '<table border="0" cellspacing="0" height="100%"><tr><td style="white-space:nowrap;">' + urlPosition(i, o) + '<span id="image_gallery_img_data_address"></span></td></tr></table>';
			return document.getElementById("image_gallery_img_data").innerHTML = s, geocoderGetAddress(i, o, function (e) {
				"" != e && (document.getElementById("image_gallery_img_data_address").innerHTML = " - " + e)
			}), !1
		}
	}), $("#image_gallery_list_grid").jqGrid("navGrid", "#image_gallery_list_grid_pager", {
		add: !1,
		edit: !1,
		del: !1,
		search: !1
	}), $("#image_gallery_list_grid").navButtonAdd("#image_gallery_list_grid_pager", {
		caption: "",
		title: la.ACTION,
		buttonicon: "ui-icon-action",
		onClickButton: function () { },
		position: "last",
		id: "image_gallery_list_grid_action_menu_button"
	}), $("#image_gallery_list_grid_action_menu").menu({
		role: "listbox"
	}), $("#image_gallery_list_grid_action_menu").hide(), $("#image_gallery_list_grid_action_menu_button").click(function () {
		return $("#image_gallery_list_grid_action_menu").toggle().position({
			my: "left bottom",
			at: "right-5 top-5",
			of: this
		}), $(document).one("click", function () {
			$("#image_gallery_list_grid_action_menu").hide()
		}), !1
	}), $("#chat_object_list_grid").jqGrid({
		datatype: "local",
		colNames: ["", "", la.OBJECT],
		colModel: [{
			name: "search",
			index: "search",
			hidden: !0
		}, {
			name: "icon",
			index: "icon",
			width: 28,
			sortable: !1
		}, {
			name: "name",
			index: "search",
			width: 170
		}],
		rowNum: 2048,
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		width: "225",
		shrinkToFit: !1,
		loadComplete: function (e) {
			chatUpdateMsgCount(), chatUpdateMsgDt()
		},
		onSelectRow: function (e) {
			chatSelectObject(e)
		}
	}), $("#chat_object_list_search").bind("keyup", function (e) {
		var t = $("#chat_object_list_grid"),
			a = t.jqGrid("getGridParam", "postData");
		jQuery.extend(a, {
			filters: "",
			searchField: "search",
			searchOper: "cn",
			searchString: this.value.toLowerCase()
		}), t.jqGrid("setGridParam", {
			search: !0,
			postData: a
		}), t.trigger("reloadGrid")
	}), $("#billing_plan_list_grid").jqGrid({
		url: "func/fn_billing.php?cmd=load_billing_plan_list",
		datatype: "json",
		colNames: [la.TIME, la.NAME, la.OBJECTS, la.PERIOD, la.PRICE, ""],
		colModel: [{
			name: "dt_purchase",
			index: "dt_purchase",
			width: 110,
			fixed: !0,
			align: "center"
		}, {
			name: "name",
			index: "name",
			width: 248
		}, {
			name: "objects",
			index: "objects",
			width: 95,
			fixed: !0,
			align: "center"
		}, {
			name: "period",
			index: "period",
			width: 95,
			fixed: !0,
			align: "center"
		}, {
			name: "price",
			index: "price",
			width: 95,
			fixed: !0,
			align: "center"
		}, {
			name: "modify",
			index: "modify",
			width: 30,
			align: "center",
			sortable: !1
		}],
		rowNum: 50,
		rowList: [25, 50, 75, 100, 200],
		pager: "#billing_plan_list_grid_pager",
		sortname: "dt_purchase",
		sortorder: "desc",
		viewrecords: !0,
		height: "388px",
		width: "720",
		shrinkToFit: !1
	}), $("#billing_plan_list_grid").jqGrid("navGrid", "#billing_plan_list_grid_pager", {
		add: !0,
		edit: !1,
		del: !1,
		search: !1,
		addfunc: function (e) {
			billingPlanPurchase()
		},
		addtitle: la.PURCHASE_PLAN
	}), $("#billing_plan_object_list_grid").jqGrid({
		datatype: "local",
		colNames: ["", la.NAME, la.IMEI, la.ACTIVE, la.EXPIRES_ON],
		colModel: [{
			name: "name_sort",
			index: "name_sort",
			hidden: !0
		}, {
			name: "name",
			index: "name_sort",
			width: 244
		}, {
			name: "imei",
			index: "imei",
			width: 160
		}, {
			name: "active",
			index: "active",
			width: 90,
			align: "center"
		}, {
			name: "object_expire_dt",
			index: "object_expire_dt",
			width: 110,
			align: "center"
		}],
		rowNum: 2048,
		pager: "#billing_plan_object_list_grid_pager",
		pgbuttons: !1,
		pgtext: "",
		recordtext: "",
		emptyrecords: "",
		sortname: "name",
		sortorder: "asc",
		viewrecords: !0,
		height: "270",
		width: "665",
		shrinkToFit: !1,
		multiselect: !0,
		onSelectRow: function (e) {
			billingPlanUseUpdateSelection()
		},
		onSelectAll: function (e) {
			billingPlanUseUpdateSelection()
		}
	}), $("#billing_plan_object_list_grid").jqGrid("navGrid", "#billing_plan_object_list_grid_pager", {
		add: !1,
		edit: !1,
		del: !1,
		search: !1,
		refresh: !1
	}), $(".ui-jqgrid-titlebar-close").hide(), $(".ui-pg-selbox").multipleSelect({
		single: !0,
		width: "50px"
	}), $(window).bind("resize", function () {
		resizeGrids()
	}).trigger("resize")
}

function gridElementTypeToggle(e, t, a) {
	var o = (e = $(e)).getRowData().length;
	for (i = 0; i < o; i++) e.jqGrid("getCell", i, "el_type") == t && $("#" + i, e).css({
		display: a
	})
}

function switchDateFilter(e) {
	if ("history" == e) var t = "side_panel_history_";
	else if ("report" == e) t = "dialog_report_";
	else if ("tasks" == e) t = "dialog_tasks_";
	else if ("rilogbook" == e) t = "dialog_rilogbook_";
	else if ("dtc" == e) t = "dialog_dtc_";
	else if ("img" == e) t = "dialog_image_gallery_";
	switch (document.getElementById(t + "hour_from").value = "00", document.getElementById(t + "hour_to").value = "00", document.getElementById(t + "minute_from").value = "00", document.getElementById(t + "minute_to").value = "00", document.getElementById(t + "filter").value) {
		case "0":
			document.getElementById(t + "date_from").value = moment().format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().format("YYYY-MM-DD");
			break;
		case "1":
			document.getElementById(t + "date_from").value = moment().format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().format("YYYY-MM-DD"), document.getElementById(t + "hour_from").value = moment().subtract("hour", 1).format("HH"), document.getElementById(t + "hour_to").value = moment().format("HH"), document.getElementById(t + "minute_from").value = moment().subtract("hour", 1).format("mm"), document.getElementById(t + "minute_to").value = moment().format("mm");
			break;
		case "2":
			document.getElementById(t + "date_from").value = moment().format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().add("days", 1).format("YYYY-MM-DD");
			break;
		case "3":
			document.getElementById(t + "date_from").value = moment().subtract("days", 1).format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().format("YYYY-MM-DD");
			break;
		case "4":
			document.getElementById(t + "date_from").value = moment().subtract("days", 2).format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().subtract("days", 1).format("YYYY-MM-DD");
			break;
		case "5":
			document.getElementById(t + "date_from").value = moment().subtract("days", 3).format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().subtract("days", 2).format("YYYY-MM-DD");
			break;
		case "6":
			document.getElementById(t + "date_from").value = moment().isoWeekday(1).format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().add("days", 1).format("YYYY-MM-DD");
			break;
		case "7":
			document.getElementById(t + "date_from").value = moment().isoWeekday(1).subtract("week", 1).format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().isoWeekday(1).format("YYYY-MM-DD");
			break;
		case "8":
			document.getElementById(t + "date_from").value = moment().startOf("month").format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().add("days", 1).format("YYYY-MM-DD");
			break;
		case "9":
			document.getElementById(t + "date_from").value = moment().startOf("month").subtract("month", 1).format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().startOf("month").format("YYYY-MM-DD")
	}
	$("#" + t + "hour_from").multipleSelect("refresh"), $("#" + t + "hour_to").multipleSelect("refresh"), $("#" + t + "minute_from").multipleSelect("refresh"), $("#" + t + "minute_to").multipleSelect("refresh")
}

function historyLoadGSR() {
	utilsCheckPrivileges("history") && (document.getElementById("load_file").addEventListener("change", historyLoadGSRFile, !1), document.getElementById("load_file").click())
}

function historyLoadGSRFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onload = function (e) {
		loadingData(!0);
		try {
			var t = $.parseJSON(e.target.result);
			"0.2v" == t.gsr ? null != settingsObjectData[t.imei] ? historyShowRoute(transformToHistoryRoute(t.route), t.imei, t.name) : notifyBox("error", la.ERROR, la.THERE_IS_NO_SUCH_OBJECT_IN_YOUR_ACCOUNT) : notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		} catch (e) {
			notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		}
		loadingData(!1), document.getElementById("load_file").value = ""
	}, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", historyLoadGSRFile, !1)
}

function historyExportGSR() {
	if (utilsCheckPrivileges("history")) {
		var e = document.getElementById("side_panel_history_object_list").value,
			t = document.getElementById("side_panel_history_object_list").options[document.getElementById("side_panel_history_object_list").selectedIndex].text,
			a = document.getElementById("side_panel_history_date_from").value + " " + document.getElementById("side_panel_history_hour_from").value + ":" + document.getElementById("side_panel_history_minute_from").value + ":00",
			i = document.getElementById("side_panel_history_date_to").value + " " + document.getElementById("side_panel_history_hour_to").value + ":" + document.getElementById("side_panel_history_minute_to").value + ":00",
			o = document.getElementById("side_panel_history_stop_duration").value;
		if ("" != e) {
			var s = "func/fn_export.php?format=gsr&imei=" + e + "&name=" + t + "&dtf=" + a + "&dtt=" + i + "&min_stop_duration=" + o;
			window.location = s
		} else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
	}
}

function historyExportKML() {
	if (utilsCheckPrivileges("history")) {
		var e = document.getElementById("side_panel_history_object_list").value,
			t = document.getElementById("side_panel_history_object_list").options[document.getElementById("side_panel_history_object_list").selectedIndex].text,
			a = document.getElementById("side_panel_history_date_from").value + " " + document.getElementById("side_panel_history_hour_from").value + ":" + document.getElementById("side_panel_history_minute_from").value + ":00",
			i = document.getElementById("side_panel_history_date_to").value + " " + document.getElementById("side_panel_history_hour_to").value + ":" + document.getElementById("side_panel_history_minute_to").value + ":00";
		if ("" != e) {
			var o = "func/fn_export.php?format=kml&imei=" + e + "&name=" + t + "&dtf=" + a + "&dtt=" + i;
			window.location = o
		} else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
	}
}

function historyExportGPX() {
	if (utilsCheckPrivileges("history")) {
		var e = document.getElementById("side_panel_history_object_list").value,
			t = document.getElementById("side_panel_history_object_list").options[document.getElementById("side_panel_history_object_list").selectedIndex].text,
			a = document.getElementById("side_panel_history_date_from").value + " " + document.getElementById("side_panel_history_hour_from").value + ":" + document.getElementById("side_panel_history_minute_from").value + ":00",
			i = document.getElementById("side_panel_history_date_to").value + " " + document.getElementById("side_panel_history_hour_to").value + ":" + document.getElementById("side_panel_history_minute_to").value + ":00";
		if ("" != e) {
			var o = "func/fn_export.php?format=gpx&imei=" + e + "&name=" + t + "&dtf=" + a + "&dtt=" + i;
			window.location = o
		} else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
	}
}

function historyExportCSV() {
	if (utilsCheckPrivileges("history")) {
		var e = document.getElementById("side_panel_history_object_list").value,
			t = document.getElementById("side_panel_history_object_list").options[document.getElementById("side_panel_history_object_list").selectedIndex].text,
			a = document.getElementById("side_panel_history_date_from").value + " " + document.getElementById("side_panel_history_hour_from").value + ":" + document.getElementById("side_panel_history_minute_from").value + ":00",
			i = document.getElementById("side_panel_history_date_to").value + " " + document.getElementById("side_panel_history_hour_to").value + ":" + document.getElementById("side_panel_history_minute_to").value + ":00";
		if ("" != e) {
			var o = "func/fn_export.php?format=history_csv&imei=" + e + "&name=" + t + "&dtf=" + a + "&dtt=" + i;
			window.location = o
		} else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
	}
}

function historySaveAsRoute() {
	if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("history") && 1 != gsValues.map_bussy) {
		var e = document.getElementById("side_panel_history_object_list").value,
			t = (document.getElementById("side_panel_history_object_list").options[document.getElementById("side_panel_history_object_list").selectedIndex].text, document.getElementById("side_panel_history_date_from").value + " " + document.getElementById("side_panel_history_hour_from").value + ":" + document.getElementById("side_panel_history_minute_from").value + ":00"),
			a = document.getElementById("side_panel_history_date_to").value + " " + document.getElementById("side_panel_history_hour_to").value + ":" + document.getElementById("side_panel_history_minute_to").value + ":00",
			o = document.getElementById("side_panel_history_stop_duration").value;
		if ("" != e) {
			loadingData(!0);
			var s = {
				cmd: "load_route_data",
				imei: e,
				dtf: t,
				dtt: a,
				min_stop_duration: o
			};
			$.ajax({
				type: "POST",
				url: "func/fn_history.php",
				data: s,
				dataType: "json",
				cache: !1,
				success: function (e) {
					var t = transformToHistoryRoute(e);
					if ("" == t.route || t.route.length < 2) return notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST), void loadingData(!1);
					var a = Math.ceil(t.route.length / 200),
						o = new Array;
					for (i = 0; i < t.route.length; i += a) {
						var s = t.route[i].lat,
							n = t.route[i].lng;
						o.push(L.latLng(s, n))
					}
					loadingData(!1), placesRouteSave(o)
				},
				error: function (e, t) {
					notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST), loadingData(!1)
				}
			})
		} else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
	}
}
var historyRouteData = new Array,
	historyGraphPlot, historyRouteToggle = new Array,
	timer_historyRoutePlay;

function historyLoadRoute() {
	if (utilsCheckPrivileges("history")) {
		var e = document.getElementById("side_panel_history_object_list").value,
			t = document.getElementById("side_panel_history_object_list").options[document.getElementById("side_panel_history_object_list").selectedIndex].text,
			a = document.getElementById("side_panel_history_date_from").value + " " + document.getElementById("side_panel_history_hour_from").value + ":" + document.getElementById("side_panel_history_minute_from").value + ":00",
			i = document.getElementById("side_panel_history_date_to").value + " " + document.getElementById("side_panel_history_hour_to").value + ":" + document.getElementById("side_panel_history_minute_to").value + ":00",
			o = document.getElementById("side_panel_history_stop_duration").value;
		if ("" != e) {
			loadingData(!0);
			var s = {
				cmd: "load_route_data",
				imei: e,
				dtf: a,
				dtt: i,
				min_stop_duration: o
			};
			$.ajax({
				type: "POST",
				url: "func/fn_history.php",
				data: s,
				dataType: "json",
				cache: !1,
				success: function (o) {
					historyShowRoute(transformToHistoryRoute(o), e, t), $("#bottom_panel_msg_list_grid").setGridParam({
						url: "func/fn_history.php?cmd=load_msg_list&imei=" + e + "&dtf=" + a + "&dtt=" + i
					}), $("#bottom_panel_msg_list_grid").trigger("reloadGrid")
				},
				error: function (e, t) {
					notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST), loadingData(!1)
				}
			})
		} else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
	}
}

function historyShowRoute(e, t, a) {
	if (historyHideRoute(), objectFollowAll(!1), "" == (historyRouteData = e).route || historyRouteData.route.length < 2) return notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST), loadingData(!1), void (historyRouteData = []);
	historyRouteData.name = a, historyRouteData.imei = t, historyRouteData.layers = new Array, historyRouteData.layers.route = !1, historyRouteData.layers.route_snap = !1, historyRouteData.layers.arrows = !1, historyRouteData.layers.arrows_snap = !1, historyRouteData.layers.stops = new Array, historyRouteData.layers.events = new Array, historyRouteData.layers.data_points = new Array, historyRouteData.play = new Array, historyRouteData.play.status = !1, historyRouteData.play.position = 0;
	var i = new Array;
	for (n = 0; n < historyRouteData.route.length; n++) {
		var o = historyRouteData.route[n].lat,
			s = historyRouteData.route[n].lng;
		i.push(L.latLng(o, s)), historyRouteAddDataPointMarkerToMap(n)
	}
	for (historyRouteData.layers.route = L.polyline(i, {
		color: settingsUserData.map_rc,
		opacity: .8,
		weight: 3
	}), mapLayers.history.addLayer(historyRouteData.layers.route), historyRouteData.layers.arrows = L.polylineDecorator(historyRouteData.layers.route, {
		patterns: [{
			offset: 25,
			repeat: 250,
			symbol: L.Symbol.arrowHead({
				pixelSize: 14,
				headAngle: 40,
				pathOptions: {
					fillOpacity: 1,
					weight: 0
				}
			})
		}]
	}), mapLayers.history.addLayer(historyRouteData.layers.arrows), historyRouteAddStartMarkerToMap(), historyRouteAddEndMarkerToMap(), n = 0; n < historyRouteData.stops.length; n++) historyRouteAddStopMarkerToMap(n);
	for (n = 0; n < historyRouteData.events.length; n++) historyRouteAddEventMarkerToMap(n);
	for ((e = []).push({
		el_type: "point",
		el_id: 0,
		icon: '<img src="img/markers/route-start.svg"/>',
		datetime: historyRouteData.route[0].dt_tracker,
		info: ""
	}), e.push({
		el_type: "point",
		el_id: historyRouteData.route.length - 1,
		icon: '<img src="img/markers/route-end.svg"/>',
		datetime: historyRouteData.route[historyRouteData.route.length - 1].dt_tracker,
		info: ""
	}), n = 0; n < historyRouteData.stops.length; n++) e.push({
		el_type: "stop",
		el_id: n,
		icon: '<img src="img/markers/route-stop.svg"/>',
		datetime: historyRouteData.stops[n].dt_start,
		info: historyRouteData.stops[n].duration
	});
	for (n = 0; n < historyRouteData.events.length; n++) e.push({
		el_type: "event",
		el_id: n,
		icon: '<img src="img/markers/route-event.svg"/>',
		datetime: historyRouteData.events[n].dt_tracker,
		info: historyRouteData.events[n].event_desc
	});
	for (n = 0; n < historyRouteData.drives.length; n++) e.push({
		el_type: "drive",
		el_id: n,
		icon: '<img src="img/markers/route-drive.svg"/>',
		datetime: historyRouteData.drives[n].dt_start,
		info: historyRouteData.drives[n].duration
	});
	for (var n = 0; n <= e.length; n++) $("#side_panel_history_route_detail_list_grid").jqGrid("addRowData", n, e[n]);
	$("#side_panel_history_route_detail_list_grid").setGridParam({
		sortname: "datetime",
		sortorder: "asc"
	}).trigger("reloadGrid"), historyRouteRoute(), historyRouteSnap(), historyRouteDataPoints(), historyRouteStops(), historyRouteEvents();
	var l = historyRouteData.layers.route.getBounds();
	map.fitBounds(l), $("#side_panel").tabs("option", "active", 3), showBottomPanel(), $("#bottom_panel_tabs").tabs("option", "active", 1), "bottom_panel" == settingsUserData.datalist && datalistBottomSwitch("route"), historyRouteShowPoint(0, !1), historyRouteCreateGraphSourceList(), historyRouteCreateGraph("speed"), document.getElementById("history_view_control").style.display = "block", loadingData(!1)
}

function historyHideRoute() {
	null != historyRouteData.route && (document.getElementById("history_view_control").style.display = "none", document.getElementById("bottom_panel_graph_label").innerHTML = "", datalistClear("route"), initGraph(), $("#bottom_panel_msg_list_grid").clearGridData(!0), $("#side_panel_history_route_detail_list_grid").clearGridData(!0), mapLayers.history.clearLayers(), historyRouteStop(), $(".qtip").each(function () {
		$(this).data("qtip").destroy()
	}), historyRouteData = [])
}

function historyRouteRouteToggle() {
	historyRouteToggle.route ? (historyRouteToggle.route = !1, document.getElementById("history_view_control_route").className = "icon-route-route disabled") : (historyRouteToggle.route = !0, document.getElementById("history_view_control_route").className = "icon-route-route"), historyRouteRoute()
}

function historyRouteRoute() {
	null != historyRouteData.layers && (mapLayers.history.removeLayer(historyRouteData.layers.route), 0 != historyRouteData.layers.route_snap && mapLayers.history.removeLayer(historyRouteData.layers.route_snap), historyRouteToggle.route && (0 != historyRouteData.layers.route_snap && historyRouteToggle.snap ? mapLayers.history.addLayer(historyRouteData.layers.route_snap) : mapLayers.history.addLayer(historyRouteData.layers.route)))
}

function historyRouteSnapToggle() {
	historyRouteToggle.snap ? (historyRouteToggle.snap = !1, document.getElementById("history_view_control_snap").className = "icon-route-snap disabled") : (historyRouteToggle.snap = !0, document.getElementById("history_view_control_snap").className = "icon-route-snap"), historyRouteSnap()
}

function historyRouteSnap() {
	if (null != historyRouteData.route)
		if (historyRouteToggle.snap)
			if (0 == historyRouteData.layers.route_snap && 0 == historyRouteData.layers.arrows_snap) {
				var e = new Array,
					t = Math.floor(historyRouteData.route.length / 99);
				for (t < 1 && (t = 1), i = 0; i < historyRouteData.route.length; i += t) lat = historyRouteData.route[i].lat, lng = historyRouteData.route[i].lng, e.push(L.latLng(lat, lng));
				if (lat = historyRouteData.route[historyRouteData.route.length - 1].lat, lng = historyRouteData.route[historyRouteData.route.length - 1].lng, e.push(L.latLng(lat, lng)), "" == gsValues.routing_osmr_service_url) var a = L.Routing.control({
					waypoints: e,
					show: !1,
					showAlternatives: !1,
					waypointMode: "snap",
					createMarker: function () { }
				}).addTo(map);
				else a = L.Routing.control({
					waypoints: e,
					show: !1,
					showAlternatives: !1,
					waypointMode: "snap",
					createMarker: function () { },
					router: new L.Routing.OSRMv1({
						serviceUrl: gsValues.routing_osmr_service_url
					})
				}).addTo(map);
				a.on("routeselected", function (t) {
					e = t.route.coordinates, mapLayers.history.removeLayer(historyRouteData.layers.route), mapLayers.history.removeLayer(historyRouteData.layers.arrows), historyRouteData.layers.route_snap = L.polyline(e, {
						color: settingsUserData.map_rc,
						opacity: .8,
						weight: 3
					}), mapLayers.history.addLayer(historyRouteData.layers.route_snap), historyRouteData.layers.arrows_snap = L.polylineDecorator(historyRouteData.layers.route_snap, {
						patterns: [{
							offset: 25,
							repeat: 250,
							symbol: L.Symbol.arrowHead({
								pixelSize: 14,
								headAngle: 40,
								pathOptions: {
									fillOpacity: 1,
									weight: 0
								}
							})
						}]
					}), mapLayers.history.addLayer(historyRouteData.layers.arrows_snap), map.removeControl(a), historyRouteArrows()
				})
			} else historyRouteRoute(), historyRouteArrows();
		else historyRouteRoute(), historyRouteArrows()
}

function historyRouteArrowsToggle() {
	historyRouteToggle.arrows ? (historyRouteToggle.arrows = !1, document.getElementById("history_view_control_arrows").className = "icon-route-arrow disabled") : (historyRouteToggle.arrows = !0, document.getElementById("history_view_control_arrows").className = "icon-route-arrow"), historyRouteArrows()
}

function historyRouteArrows() {
	null != historyRouteData.layers && (mapLayers.history.removeLayer(historyRouteData.layers.arrows), 0 != historyRouteData.layers.arrows_snap && mapLayers.history.removeLayer(historyRouteData.layers.arrows_snap), historyRouteToggle.arrows && (0 != historyRouteData.layers.arrows_snap && historyRouteToggle.snap ? mapLayers.history.addLayer(historyRouteData.layers.arrows_snap) : mapLayers.history.addLayer(historyRouteData.layers.arrows)))
}

function historyRouteDataPointsToggle() {
	historyRouteToggle.data_points ? (historyRouteToggle.data_points = !1, document.getElementById("history_view_control_data_points").className = "icon-route-data-point disabled") : (historyRouteToggle.data_points = !0, document.getElementById("history_view_control_data_points").className = "icon-route-data-point"), historyRouteDataPoints()
}

function historyRouteDataPoints() {
	if (null != historyRouteData.layers)
		if (map.getZoom() >= 14)
			for (i = 0; i < historyRouteData.layers.data_points.length; i++) {
				var e = historyRouteData.layers.data_points[i];
				historyRouteToggle.data_points ? 0 == mapLayers.history.hasLayer(e) && mapLayers.history.addLayer(e) : mapLayers.history.removeLayer(e)
			} else
			for (i = 0; i < historyRouteData.layers.data_points.length; i++) {
				e = historyRouteData.layers.data_points[i];
				mapLayers.history.removeLayer(e)
			}
}

function historyRouteStopsToggle() {
	historyRouteToggle.stops ? (historyRouteToggle.stops = !1, document.getElementById("history_view_control_stops").className = "icon-route-stop disabled") : (historyRouteToggle.stops = !0, document.getElementById("history_view_control_stops").className = "icon-route-stop"), historyRouteStops()
}

function historyRouteStops() {
	if (null != historyRouteData.layers) {
		for (i = 0; i < historyRouteData.layers.stops.length; i++) {
			var e = historyRouteData.layers.stops[i];
			historyRouteToggle.stops ? mapLayers.history.addLayer(e) : mapLayers.history.removeLayer(e)
		}
		historyRouteToggle.stops ? gridElementTypeToggle("#side_panel_history_route_detail_list_grid", "stop", "") : gridElementTypeToggle("#side_panel_history_route_detail_list_grid", "stop", "none")
	}
}

function historyRouteEventsToggle() {
	historyRouteToggle.events ? (historyRouteToggle.events = !1, document.getElementById("history_view_control_events").className = "icon-route-event disabled") : (historyRouteToggle.events = !0, document.getElementById("history_view_control_events").className = "icon-route-event"), historyRouteEvents()
}

function historyRouteEvents() {
	if (null != historyRouteData.layers) {
		for (i = 0; i < historyRouteData.layers.events.length; i++) {
			var e = historyRouteData.layers.events[i];
			historyRouteToggle.events ? mapLayers.history.addLayer(e) : mapLayers.history.removeLayer(e)
		}
		historyRouteToggle.events ? gridElementTypeToggle("#side_panel_history_route_detail_list_grid", "event", "") : gridElementTypeToggle("#side_panel_history_route_detail_list_grid", "event", "none")
	}
}

function historyRouteCreateGraphSourceList() {
	var e = historyRouteData.imei,
		t = document.getElementById("bottom_panel_graph_data_source");
	t.options.length = 0, t.options.add(new Option(la.SPEED, "speed")), t.options.add(new Option(la.ALTITUDE, "altitude"));
	var a = new Array;
	for (var i in settingsObjectData[e].sensors) {
		(s = settingsObjectData[e].sensors[i]).id = i, a.push(s)
	}
	var o = sortArrayByElement(a, "name");
	for (var i in o) {
		var s;
		"string" != (s = o[i]).result_type && "rel" != s.result_type && t.options.add(new Option(s.name, s.id))
	}
}

function historyRouteChangeGraphSource() {
	historyRouteCreateGraph(document.getElementById("bottom_panel_graph_data_source").value)
}

function historyRouteCreateGraph(e) {
	document.getElementById("bottom_panel_graph_label").innerHTML = "";
	var t = historyRouteData.imei;
	if (historyRouteData.graph = [], historyRouteData.graph.data = [], historyRouteData.graph.data_index = [], "speed" != e && "altitude" != e) var a = settingsObjectData[t].sensors[e];
	for (var i = 0; i < historyRouteData.route.length; i++) {
		var o = historyRouteData.route[i].dt_tracker,
			s = getTimestampFromDate(o.replace(/-/g, "/") + " UTC");
		if ("speed" == e) var n = historyRouteData.route[i].speed;
		else if ("altitude" == e) n = historyRouteData.route[i].altitude;
		else {
			if ("fuelsumup" == a.type) n = getSensorValueFuelLevelSumUp(t, historyRouteData.route[i].params, a).value;
			else n = getSensorValue(historyRouteData.route[i].params, a).value;
			"engh" == a.type && (n = n / 60 / 60, n = Math.round(100 * n) / 100)
		}
		historyRouteData.graph.data.push([s, n]), historyRouteData.graph.data_index[s] = i
	}
	"speed" == e ? (historyRouteData.graph.units = la.UNIT_SPEED, historyRouteData.graph.result_type = "") : "altitude" == e ? (historyRouteData.graph.units = la.UNIT_HEIGHT, historyRouteData.graph.result_type = "") : "odo" == a.type ? (historyRouteData.graph.units = la.UNIT_DISTANCE, historyRouteData.graph.result_type = a.result_type) : "engh" == a.type ? (historyRouteData.graph.units = la.UNIT_H, historyRouteData.graph.result_type = a.result_type) : (historyRouteData.graph.units = a.units, historyRouteData.graph.result_type = a.result_type), initGraph(historyRouteData.graph)
}

function historyRoutePlay() {
	if (clearTimeout(timer_historyRoutePlay), 0 == historyRouteData.play.status && destroyMapPopup(), historyRouteData.route.length > 0 && historyRouteData.play.position < historyRouteData.route.length) {
		var e = historyRouteData.route[historyRouteData.play.position].dt_tracker;
		graphSetCrosshair(getTimestampFromDate(e.replace(/-/g, "/") + " UTC"));
		var t = historyRouteData.graph.data,
			a = historyRouteData.graph.units;
		document.getElementById("bottom_panel_graph_label").innerHTML = t[historyRouteData.play.position][1] + " " + a + " - " + e;
		var i = historyRouteData.route[historyRouteData.play.position];
		if (datalistShowData("route", historyRouteData.imei, i), historyRoutePanToPoint(historyRouteData.play.position), historyRouteAddPointMarkerToMap(historyRouteData.play.position), historyRouteData.play.status = !0, historyRouteData.play.position == historyRouteData.route.length - 1) return clearTimeout(timer_historyRoutePlay), historyRouteData.play.status = !1, void (historyRouteData.play.position = 0);
		1 == document.getElementById("bottom_panel_graph_play_speed").value ? timer_historyRoutePlay = setTimeout("historyRoutePlay()", 2e3) : 2 == document.getElementById("bottom_panel_graph_play_speed").value ? timer_historyRoutePlay = setTimeout("historyRoutePlay()", 1e3) : 3 == document.getElementById("bottom_panel_graph_play_speed").value ? timer_historyRoutePlay = setTimeout("historyRoutePlay()", 500) : 4 == document.getElementById("bottom_panel_graph_play_speed").value ? timer_historyRoutePlay = setTimeout("historyRoutePlay()", 250) : 5 == document.getElementById("bottom_panel_graph_play_speed").value ? timer_historyRoutePlay = setTimeout("historyRoutePlay()", 125) : 6 == document.getElementById("bottom_panel_graph_play_speed").value && (timer_historyRoutePlay = setTimeout("historyRoutePlay()", 65)), historyRouteData.play.position++
	}
}

function historyRoutePause() {
	clearTimeout(timer_historyRoutePlay)
}

function historyRouteStop() {
	clearTimeout(timer_historyRoutePlay), historyRouteData.play.status = !1, historyRouteData.play.position = 0
}

function historyRouteAddStartMarkerToMap() {
	var e = historyRouteData.route[0].lng,
		t = historyRouteData.route[0].lat,
		a = L.marker([t, e], {
			icon: mapMarkerIcons.route_start
		});
	a.on("click", function (e) {
		historyRouteShowPoint(0, !0)
	}), mapLayers.history.addLayer(a)
}

function historyRouteAddEndMarkerToMap() {
	var e = historyRouteData.route[historyRouteData.route.length - 1].lng,
		t = historyRouteData.route[historyRouteData.route.length - 1].lat,
		a = L.marker([t, e], {
			icon: mapMarkerIcons.route_end
		});
	a.on("click", function (e) {
		historyRouteShowPoint(historyRouteData.route.length - 1, !0)
	}), mapLayers.history.addLayer(a)
}

function historyRouteAddStopMarkerToMap(e) {
	var t = historyRouteData.stops[e].lng,
		a = historyRouteData.stops[e].lat,
		i = L.marker([a, t], {
			icon: mapMarkerIcons.route_stop
		});
	i.on("click", function (t) {
		historyRouteShowStop(e)
	}), mapLayers.history.addLayer(i), historyRouteData.layers.stops.push(i)
}

function historyRouteAddEventMarkerToMap(e) {
	var t = historyRouteData.events[e].lng,
		a = historyRouteData.events[e].lat,
		i = L.marker([a, t], {
			icon: mapMarkerIcons.route_event
		});
	i.on("click", function (t) {
		historyRouteShowEvent(e)
	}), mapLayers.history.addLayer(i), historyRouteData.layers.events.push(i)
}

function historyRouteAddDataPointMarkerToMap(e) {
	historyRouteData.imei;
	var t = historyRouteData.route[e].lng,
		a = historyRouteData.route[e].lat,
		i = L.marker([a, t], {
			icon: mapMarkerIcons.route_data_point,
			iconAngle: 0
		}),
		o = e;
	i.on("click", function (e) {
		historyRouteShowPoint(o, !0)
	}), historyRouteData.layers.data_points.push(i)
}

function historyRouteAddPointMarkerToMap(e) {
	historyRouteRemovePointMarker();
	var t = historyRouteData.imei,
		a = historyRouteData.route[e].lng,
		i = historyRouteData.route[e].lat,
		o = historyRouteData.route[e].angle,
		s = historyRouteData.route[e].speed,
		n = historyRouteData.route[e].dt_tracker,
		l = (historyRouteData.route[e].params, settingsUserData.map_is),
		d = o;
	"arrow" != settingsObjectData[t].map_icon && (d = 0);
	var r = getMarkerIcon(t, s, !1, !1),
		_ = L.marker([i, a], {
			icon: r,
			iconAngle: d
		}),
		c = s + " " + la.UNIT_SPEED + " - " + n;
	_.bindTooltip(c, {
		permanent: !0,
		offset: [20 * l, 0],
		direction: "right"
	}).openTooltip(), _.on("click", function (t) {
		historyRouteShowPoint(e.true)
	}), mapLayers.history.addLayer(_), historyRouteData.layers.point_marker = _
}

function historyRouteRemovePointMarker() {
	historyRouteData.layers.point_marker && mapLayers.history.removeLayer(historyRouteData.layers.point_marker)
}

function historyRoutePanToPoint(e) {
	var t = historyRouteData.route[e].lng,
		a = historyRouteData.route[e].lat;
	map.panTo({
		lat: a,
		lng: t
	})
}

function historyRouteShowPoint(e, t) {
	historyRouteRemoveDrive();
	var a = historyRouteData.name,
		i = historyRouteData.imei,
		o = historyRouteData.route[e].lng,
		s = historyRouteData.route[e].lat,
		n = historyRouteData.route[e].altitude,
		l = historyRouteData.route[e].angle,
		d = historyRouteData.route[e].speed,
		r = historyRouteData.route[e].dt_tracker,
		_ = historyRouteData.route[e].params,
		c = historyRouteData.route[e];
	if (datalistShowData("route", i, c), t) {
		var g = settingsUserData.map_is;
		geocoderGetAddress(s, o, function (t) {
			var c = t,
				m = urlPosition(s, o),
				u = "",
				p = new Array;
			for (var y in settingsObjectData[i].sensors) p.push(settingsObjectData[i].sensors[y]);
			var h = sortArrayByElement(p, "name");
			for (var y in h) {
				var v = h[y];
				if ("true" == v.popup)
					if ("fuelsumup" == v.type) {
						var b = getSensorValueFuelLevelSumUp(i, _, v);
						u += "<tr><td><strong>" + v.name + ":</strong></td><td>" + b.value_full + "</td></tr>"
					} else {
						b = getSensorValue(_, v);
						u += "<tr><td><strong>" + v.name + ":</strong></td><td>" + b.value_full + "</td></tr>"
					}
			}
			var E = "<table>\t\t\t<tr><td><strong>" + la.OBJECT + ":</strong></td><td>" + a + "</td></tr>\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + c + "</td></tr>\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + m + "</td></tr>\t\t\t<tr><td><strong>" + la.ALTITUDE + ":</strong></td><td>" + n + " " + la.UNIT_HEIGHT + "</td></tr>\t\t\t<tr><td><strong>" + la.ANGLE + ":</strong></td><td>" + l + " &deg;</td></tr>\t\t\t<tr><td><strong>" + la.SPEED + ":</strong></td><td>" + d + " " + la.UNIT_SPEED + "</td></tr>\t\t\t<tr><td><strong>" + la.TIME + ":</strong></td><td>" + r + "</td></tr>",
				f = getObjectOdometer(i, _); - 1 != f && (E += "<tr><td><strong>" + la.ODOMETER + ":</strong></td><td>" + f + " " + la.UNIT_DISTANCE + "</td></tr>");
			var I = getObjectEngineHours(i, _); - 1 != I && (E += "<tr><td><strong>" + la.ENGINE_HOURS + ":</strong></td><td>" + I + "</td></tr>");
			var B = E + u;
			E += "</table>", B += "</table>", 0 == e || historyRouteData.route.length - 1 == e ? addPopupToMap(s, o, [0, -28 * g], E, B) : addPopupToMap(s, o, [0, -14 * g], E, B), 1 == gsValues.map_street_view && (objectUnSelectAll(), utilsStreetView(s, o, l))
		})
	}
}

function historyRoutePanToStop(e) {
	var t = historyRouteData.stops[e].lng,
		a = historyRouteData.stops[e].lat;
	map.panTo({
		lat: a,
		lng: t
	})
}

function historyRouteShowStop(e) {
	historyRouteRemoveDrive();
	var t = historyRouteData.name,
		a = historyRouteData.imei,
		i = historyRouteData.stops[e].lng,
		o = historyRouteData.stops[e].lat,
		s = historyRouteData.stops[e].altitude,
		n = historyRouteData.stops[e].angle,
		l = historyRouteData.stops[e].dt_start,
		d = historyRouteData.stops[e].dt_end,
		r = historyRouteData.stops[e].duration,
		_ = historyRouteData.stops[e].params,
		c = historyRouteData.stops[e];
	datalistShowData("route", a, c);
	var g = settingsUserData.map_is;
	geocoderGetAddress(o, i, function (e) {
		var c = e,
			m = urlPosition(o, i),
			u = "",
			p = new Array;
		for (var y in settingsObjectData[a].sensors) p.push(settingsObjectData[a].sensors[y]);
		var h = sortArrayByElement(p, "name");
		for (var y in h) {
			var v = h[y];
			if ("true" == v.popup)
				if ("fuelsumup" == v.type) {
					var b = getSensorValueFuelLevelSumUp(a, _, v);
					u += "<tr><td><strong>" + v.name + ":</strong></td><td>" + b.value_full + "</td></tr>"
				} else {
					b = getSensorValue(_, v);
					u += "<tr><td><strong>" + v.name + ":</strong></td><td>" + b.value_full + "</td></tr>"
				}
		}
		var E = "<table>\t\t\t<tr><td><strong>" + la.OBJECT + ":</strong></td><td>" + t + "</td></tr>\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + c + "</td></tr>\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + m + "</td></tr>\t\t\t<tr><td><strong>" + la.ALTITUDE + ":</strong></td><td>" + s + " " + la.UNIT_HEIGHT + "</td></tr>\t\t\t<tr><td><strong>" + la.ANGLE + ":</strong></td><td>" + n + " &deg;</td></tr>\t\t\t<tr><td><strong>" + la.ARRIVED + ":</strong></td><td>" + l + "</td></tr>\t\t\t<tr><td><strong>" + la.DEPARTED + ":</strong></td><td>" + d + "</td></tr>\t\t\t<tr><td><strong>" + la.DURATION + ":</strong></td><td>" + r + "</td></tr>",
			f = getObjectOdometer(a, _); - 1 != f && (E += "<tr><td><strong>" + la.ODOMETER + ":</strong></td><td>" + f + " " + la.UNIT_DISTANCE + "</td></tr>");
		var I = getObjectEngineHours(a, _); - 1 != I && (E += "<tr><td><strong>" + la.ENGINE_HOURS + ":</strong></td><td>" + I + "</td></tr>");
		var B = E + u;
		addPopupToMap(o, i, [0, -28 * g], E += "</table>", B += "</table>"), 1 == gsValues.map_street_view && (objectUnSelectAll(), utilsStreetView(o, i, n))
	})
}

function historyRoutePanToEvent(e) {
	var t = historyRouteData.events[e].lng,
		a = historyRouteData.events[e].lat;
	map.panTo({
		lat: a,
		lng: t
	})
}

function historyRouteShowEvent(e) {
	historyRouteRemoveDrive();
	var t = historyRouteData.name,
		a = historyRouteData.imei,
		i = historyRouteData.events[e].event_desc,
		o = historyRouteData.events[e].dt_tracker,
		s = historyRouteData.events[e].lng,
		n = historyRouteData.events[e].lat,
		l = historyRouteData.events[e].altitude,
		d = historyRouteData.events[e].angle,
		r = historyRouteData.events[e].speed,
		_ = historyRouteData.events[e].params,
		c = historyRouteData.events[e];
	datalistShowData("route", a, c);
	var g = settingsUserData.map_is;
	geocoderGetAddress(n, s, function (e) {
		var c = e,
			m = urlPosition(n, s),
			u = "",
			p = new Array;
		for (var y in settingsObjectData[a].sensors) p.push(settingsObjectData[a].sensors[y]);
		var h = sortArrayByElement(p, "name");
		for (var y in h) {
			var v = h[y];
			if ("true" == v.popup)
				if ("fuelsumup" == v.type) {
					var b = getSensorValueFuelLevelSumUp(a, _, v);
					u += "<tr><td><strong>" + v.name + ":</strong></td><td>" + b.value_full + "</td></tr>"
				} else {
					b = getSensorValue(_, v);
					u += "<tr><td><strong>" + v.name + ":</strong></td><td>" + b.value_full + "</td></tr>"
				}
		}
		var E = "<table>\t\t\t<tr><td><strong>" + la.OBJECT + ":</strong></td><td>" + t + "</td></tr>\t\t\t<tr><td><strong>" + la.EVENT + ":</strong></td><td>" + i + "</td></tr>\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + c + "</td></tr>\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + m + "</td></tr>\t\t\t<tr><td><strong>" + la.ALTITUDE + ":</strong></td><td>" + l + " " + la.UNIT_HEIGHT + "</td></tr>\t\t\t<tr><td><strong>" + la.ANGLE + ":</strong></td><td>" + d + " &deg;</td></tr>\t\t\t<tr><td><strong>" + la.SPEED + ":</strong></td><td>" + r + " " + la.UNIT_SPEED + "</td></tr>\t\t\t<tr><td><strong>" + la.TIME + ":</strong></td><td>" + o + "</td></tr>",
			f = getObjectOdometer(a, _); - 1 != f && (E += "<tr><td><strong>" + la.ODOMETER + ":</strong></td><td>" + f + " " + la.UNIT_DISTANCE + "</td></tr>");
		var I = getObjectEngineHours(a, _); - 1 != I && (E += "<tr><td><strong>" + la.ENGINE_HOURS + ":</strong></td><td>" + I + "</td></tr>");
		var B = E + u;
		addPopupToMap(n, s, [0, -28 * g], E += "</table>", B += "</table>"), 1 == gsValues.map_street_view && (objectUnSelectAll(), utilsStreetView(n, s, d))
	})
}

function historyRouteRemoveDrive() {
	historyRouteData.layers.route_drive && mapLayers.history.removeLayer(historyRouteData.layers.route_drive)
}

function historyRouteShowDrive(e) {
	historyRouteRemoveDrive();
	var t = historyRouteData.drives[e].id_start_s,
		a = historyRouteData.drives[e].id_end,
		o = new Array;
	for (i = 0; i <= a - t; i++) {
		var s = historyRouteData.route[t + i].lat,
			n = historyRouteData.route[t + i].lng;
		o.push(L.latLng(s, n))
	}
	var l = L.polyline(o, {
		color: settingsUserData.map_rhc,
		opacity: .8,
		weight: 3
	});
	if (mapLayers.history.addLayer(l), 0 == historyRouteData.play.status) {
		var d = l.getBounds();
		map.fitBounds(d)
	}
	historyRouteData.layers.route_drive = l
}

function historyRouteMsgDeleteSelected() {
	if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_history_clear")) {
		var e = $("#bottom_panel_msg_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_msgs",
					imei: historyRouteData.imei,
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_history.php",
					data: a,
					success: function (e) {
						"OK" == e && $("#bottom_panel_msg_list_grid").trigger("reloadGrid")
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}
historyRouteToggle.route = !0, historyRouteToggle.snap = !1, historyRouteToggle.arrows = !1, historyRouteToggle.data_points = !1, historyRouteToggle.stops = !0, historyRouteToggle.events = !0;
var reportsData = new Array;

function reportsOpen() {
	utilsCheckPrivileges("reports") && $("#dialog_reports").dialog("open")
}

function reportsReload() {
	reportsLoadData(), $("#reports_report_list_grid").trigger("reloadGrid")
}

function reportsLoadData() {
	$.ajax({
		type: "POST",
		url: "func/fn_reports.php",
		data: {
			cmd: "load_report_data"
		},
		dataType: "json",
		cache: !1,
		success: function (e) {
			reportsData.reports = e
		}
	})
}

function reportProperties(e) {
	switch (e) {
		default:
			var t = e;
			reportsData.edit_report_id = t, document.getElementById("dialog_report_name").value = reportsData.reports[t].name, document.getElementById("dialog_report_type").value = reportsData.reports[t].type, $("#dialog_report_type").multipleSelect("refresh"), reportsSwitchType(), document.getElementById("dialog_report_ignore_empty_reports").checked = strToBoolean(reportsData.reports[t].ignore_empty_reports), document.getElementById("dialog_report_format").value = reportsData.reports[t].format, $("#dialog_report_format").multipleSelect("refresh"), document.getElementById("dialog_report_show_coordinates").checked = strToBoolean(reportsData.reports[t].show_coordinates), document.getElementById("dialog_report_show_addresses").checked = strToBoolean(reportsData.reports[t].show_addresses), document.getElementById("dialog_report_markers_addresses").checked = strToBoolean(reportsData.reports[t].markers_addresses), document.getElementById("dialog_report_zones_addresses").checked = strToBoolean(reportsData.reports[t].zones_addresses), document.getElementById("dialog_report_stop_duration").value = reportsData.reports[t].stop_duration, $("#dialog_report_stop_duration").multipleSelect("refresh"), document.getElementById("dialog_report_speed_limit").value = reportsData.reports[t].speed_limit;
			var a = document.getElementById("dialog_report_object_list"),
				i = reportsData.reports[t].imei.split(",");
			multiselectSetValues(a, i), $("#dialog_report_object_list").multipleSelect("refresh");
			var o = document.getElementById("dialog_report_marker_list"),
				s = reportsData.reports[t].marker_ids.split(",");
			multiselectSetValues(o, s), $("#dialog_report_marker_list").multipleSelect("refresh");
			var n = document.getElementById("dialog_report_zone_list"),
				l = reportsData.reports[t].zone_ids.split(",");
			multiselectSetValues(n, l), $("#dialog_report_zone_list").multipleSelect("refresh"), reportsListSensors();
			var d = document.getElementById("dialog_report_sensor_list"),
				r = reportsData.reports[t].sensor_names.split(",");
			multiselectSetValues(d, r), $("#dialog_report_sensor_list").multipleSelect("refresh"), reportsListDataItems();
			var _ = document.getElementById("dialog_report_data_item_list"),
				c = reportsData.reports[t].data_items.split(",");
			multiselectSetValues(_, c), $("#dialog_report_data_item_list").multipleSelect("refresh"), "travel_sheet_dn" == reportsData.reports[t].type ? (document.getElementById("dialog_report_other_dn_starts_hour").value = reportsData.reports[t].other.dn_starts_hour, $("#dialog_report_other_dn_starts_hour").multipleSelect("refresh"), document.getElementById("dialog_report_other_dn_starts_minute").value = reportsData.reports[t].other.dn_starts_minute, $("#dialog_report_other_dn_starts_minute").multipleSelect("refresh"), document.getElementById("dialog_report_other_dn_ends_hour").value = reportsData.reports[t].other.dn_ends_hour, $("#dialog_report_other_dn_ends_hour").multipleSelect("refresh"), document.getElementById("dialog_report_other_dn_ends_minute").value = reportsData.reports[t].other.dn_ends_minute, $("#dialog_report_other_dn_ends_minute").multipleSelect("refresh")) : "rag" == reportsData.reports[t].type || "rag_driver" == reportsData.reports[t].type ? (document.getElementById("dialog_report_other_rag_low_score").value = reportsData.reports[t].other.low_score, document.getElementById("dialog_report_other_rag_high_score").value = reportsData.reports[t].other.high_score) : (document.getElementById("dialog_report_other_dn_starts_hour").value = "", document.getElementById("dialog_report_other_dn_starts_minute").value = "", document.getElementById("dialog_report_other_dn_ends_hour").value = "", document.getElementById("dialog_report_other_dn_ends_minute").value = "", document.getElementById("dialog_report_other_rag_low_score").value = "", document.getElementById("dialog_report_other_rag_high_score").value = ""), "d" == (S = reportsData.reports[t].schedule_period) ? (document.getElementById("dialog_report_schedule_period_daily").checked = !0, document.getElementById("dialog_report_schedule_period_weekly").checked = !1) : "w" == S ? (document.getElementById("dialog_report_schedule_period_daily").checked = !1, document.getElementById("dialog_report_schedule_period_weekly").checked = !0) : "dw" == S ? (document.getElementById("dialog_report_schedule_period_daily").checked = !0, document.getElementById("dialog_report_schedule_period_weekly").checked = !0) : (document.getElementById("dialog_report_schedule_period_daily").checked = !1, document.getElementById("dialog_report_schedule_period_weekly").checked = !1), document.getElementById("dialog_report_schedule_email_address").value = reportsData.reports[t].schedule_email_address, document.getElementById("dialog_report_filter").value = 2, $("#dialog_report_filter").multipleSelect("refresh"), switchDateFilter("report"), $("#dialog_report_properties").dialog("open");
			break;
		case "add":
			reportsData.edit_report_id = !1, document.getElementById("dialog_report_name").value = "", document.getElementById("dialog_report_type").value = "general", $("#dialog_report_type").multipleSelect("refresh"), reportsSwitchType(), document.getElementById("dialog_report_ignore_empty_reports").checked = !1, document.getElementById("dialog_report_format").value = "html", $("#dialog_report_format").multipleSelect("refresh"), document.getElementById("dialog_report_show_coordinates").checked = !0, document.getElementById("dialog_report_show_addresses").checked = !1, document.getElementById("dialog_report_markers_addresses").checked = !1, document.getElementById("dialog_report_zones_addresses").checked = !1, document.getElementById("dialog_report_stop_duration").value = 1, $("#dialog_report_stop_duration").multipleSelect("refresh"), document.getElementById("dialog_report_speed_limit").value = "", $("#dialog_report_object_list option:selected").removeAttr("selected"), $("#dialog_report_object_list").multipleSelect("refresh"), $("#dialog_report_zone_list option:selected").removeAttr("selected"), $("#dialog_report_zone_list").multipleSelect("refresh"), reportsListSensors(), $("#dialog_report_sensor_list option:selected").removeAttr("selected"), $("#dialog_report_sensor_list").multipleSelect("refresh"), reportsListDataItems(), $("#dialog_report_data_items_list option:selected").removeAttr("selected"), $("#dialog_report_data_items_list").multipleSelect("refresh"), document.getElementById("dialog_report_schedule_period_daily").checked = !1, document.getElementById("dialog_report_schedule_period_weekly").checked = !1, document.getElementById("dialog_report_schedule_email_address").value = "", document.getElementById("dialog_report_filter").value = 2, $("#dialog_report_filter").multipleSelect("refresh"), switchDateFilter("report"), $("#dialog_report_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_report_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var g = document.getElementById("dialog_report_name").value,
				m = document.getElementById("dialog_report_type").value,
				u = document.getElementById("dialog_report_ignore_empty_reports").checked,
				p = document.getElementById("dialog_report_format").value,
				y = document.getElementById("dialog_report_show_coordinates").checked,
				h = document.getElementById("dialog_report_show_addresses").checked,
				v = document.getElementById("dialog_report_markers_addresses").checked,
				b = document.getElementById("dialog_report_zones_addresses").checked,
				E = document.getElementById("dialog_report_stop_duration").value,
				f = document.getElementById("dialog_report_speed_limit").value,
				I = multiselectGetValues(document.getElementById("dialog_report_object_list")),
				B = multiselectGetValues(document.getElementById("dialog_report_marker_list")),
				D = multiselectGetValues(document.getElementById("dialog_report_zone_list")),
				O = multiselectGetValues(document.getElementById("dialog_report_sensor_list"));
			_ = multiselectGetValues(document.getElementById("dialog_report_data_item_list"));
			if ("" == g) return void notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
			if (("overspeed" == m || "overspeed_count" == m || "underspeed" == m || "underspeed_count" == m) && "" == f) return void notifyBox("error", la.ERROR, la.SPEED_LIMIT_CANT_BE_EMPTY);
			if ("" == I) return void notifyBox("error", la.ERROR, la.AT_LEAST_ONE_OBJECT_SELECTED);
			if (("marker_in_out" == m || "marker_in_out_gen" == m) && "" == B) return void notifyBox("error", la.ERROR, la.AT_LEAST_ONE_MARKER_SELECTED);
			if (("zone_in_out" == m || "zone_in_out_general" == m) && "" == D) return void notifyBox("error", la.ERROR, la.AT_LEAST_ONE_ZONE_SELECTED);
			if (("drives_stops_sensors" == m || "drives_stops_logic" == m || "logic_sensors" == m || "sensor_graph" == m) && "" == O) return void notifyBox("error", la.ERROR, la.AT_LEAST_ONE_SENSOR_SELECTED);
			if ("travel_sheet_dn" == m) {
				var k = {
					dn_starts_hour: document.getElementById("dialog_report_other_dn_starts_hour").value,
					dn_starts_minute: document.getElementById("dialog_report_other_dn_starts_minute").value,
					dn_ends_hour: document.getElementById("dialog_report_other_dn_ends_hour").value,
					dn_ends_minute: document.getElementById("dialog_report_other_dn_ends_minute").value
				};
				k = JSON.stringify(k)
			} else if ("rag" == m || "rag_driver" == m) {
				k = {
					low_score: document.getElementById("dialog_report_other_rag_low_score").value,
					high_score: document.getElementById("dialog_report_other_rag_high_score").value
				};
				k = JSON.stringify(k)
			} else k = "";
			var j = document.getElementById("dialog_report_schedule_period_daily").checked,
				T = document.getElementById("dialog_report_schedule_period_weekly").checked,
				R = document.getElementById("dialog_report_schedule_email_address").value,
				S = "";
			if (1 == j && (S = "d"), 1 == T && (S += "w"), "" != S)
				for (var w = R.split(","), L = 0; L < w.length; L++)
					if (w[L] = w[L].trim(), !isEmailValid(w[L])) return void notifyBox("error", la.ERROR, la.THIS_EMAIL_IS_NOT_VALID);
			var A = {
				cmd: "save_report",
				report_id: reportsData.edit_report_id,
				name: g,
				type: m,
				ignore_empty_reports: u,
				format: p,
				show_coordinates: y,
				show_addresses: h,
				markers_addresses: v,
				zones_addresses: b,
				stop_duration: E,
				speed_limit: f,
				imei: I,
				marker_ids: B,
				zone_ids: D,
				sensor_names: O,
				data_items: _,
				other: k,
				schedule_period: S,
				schedule_email_address: R
			};
			$.ajax({
				type: "POST",
				url: "func/fn_reports.php",
				data: A,
				cache: !1,
				success: function (e) {
					"OK" == e && (reportsReload(), $("#dialog_report_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			});
			break;
		case "generate":
			g = document.getElementById("dialog_report_name").value, m = document.getElementById("dialog_report_type").value, u = document.getElementById("dialog_report_ignore_empty_reports").checked, p = document.getElementById("dialog_report_format").value, y = document.getElementById("dialog_report_show_coordinates").checked, h = document.getElementById("dialog_report_show_addresses").checked, v = document.getElementById("dialog_report_markers_addresses").checked, b = document.getElementById("dialog_report_zones_addresses").checked, E = document.getElementById("dialog_report_stop_duration").value, f = document.getElementById("dialog_report_speed_limit").value, I = multiselectGetValues(document.getElementById("dialog_report_object_list")), B = multiselectGetValues(document.getElementById("dialog_report_marker_list")), D = multiselectGetValues(document.getElementById("dialog_report_zone_list")), O = multiselectGetValues(document.getElementById("dialog_report_sensor_list")), _ = multiselectGetValues(document.getElementById("dialog_report_data_item_list"));
			if ("travel_sheet_dn" == m) {
				k = {
					dn_starts_hour: document.getElementById("dialog_report_other_dn_starts_hour").value,
					dn_starts_minute: document.getElementById("dialog_report_other_dn_starts_minute").value,
					dn_ends_hour: document.getElementById("dialog_report_other_dn_ends_hour").value,
					dn_ends_minute: document.getElementById("dialog_report_other_dn_ends_minute").value
				};
				k = JSON.stringify(k)
			} else if ("rag" == m || "rag_driver" == m) {
				k = {
					low_score: document.getElementById("dialog_report_other_rag_low_score").value,
					high_score: document.getElementById("dialog_report_other_rag_high_score").value
				};
				k = JSON.stringify(k)
			} else k = "";
			var x = $("#dialog_report_date_from").val() + " " + $("#dialog_report_hour_from").val() + ":" + $("#dialog_report_minute_from").val() + ":00",
				N = $("#dialog_report_date_to").val() + " " + $("#dialog_report_hour_to").val() + ":" + $("#dialog_report_minute_to").val() + ":00";
			"" == g && (g = document.getElementById("dialog_report_type").options[document.getElementById("dialog_report_type").selectedIndex].text), reportGenerate(A = {
				cmd: "report",
				name: g,
				type: m,
				ignore_empty_reports: u,
				format: p,
				show_coordinates: y,
				show_addresses: h,
				markers_addresses: v,
				zones_addresses: b,
				stop_duration: E,
				speed_limit: f,
				imei: I,
				marker_ids: B,
				zone_ids: D,
				sensor_names: O,
				data_items: _,
				other: k,
				dtf: x,
				dtt: N
			})
	}
}

function reportsDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_report",
				report_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_reports.php",
				data: a,
				success: function (e) {
					"OK" == e && reportsReload()
				}
			})
		}
	})
}

function reportsDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#reports_report_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_reports",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_reports.php",
					data: a,
					success: function (e) {
						"OK" == e && reportsReload()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function reportGenerate(e) {
	"overspeed" != e.type && "overspeed_count" != e.type && "underspeed" != e.type && "underspeed_count" != e.type && "rag" != e.type && "rag_driver" != e.type || "" != e.speed_limit ? "" != e.imei ? "marker_in_out" != e.type && "marker_in_out_gen" != e.type || "" != e.marker_ids ? "zone_in_out" != e.type && "zone_in_out_general" != e.type || "" != e.zone_ids ? "drives_stops_sensors" != e.type && "drives_stops_logic" != e.type && "logic_sensors" != e.type && "sensor_graph" != e.type || "" != e.sensor_names ? (loadingData(!0), $.ajax({
		type: "POST",
		url: "func/fn_reports.gen.php",
		data: e,
		cache: !1,
		success: function (t) {
			loadingData(!1), $.generateFile({
				filename: e.name.toLowerCase() + "_" + e.dtf + "_" + e.dtt,
				content: t,
				script: "func/fn_saveas.php?format=" + e.format
			}), reportsGeneratedReload()
		},
		error: function (e, t) {
			loadingData(!1)
		}
	})) : notifyBox("error", la.ERROR, la.AT_LEAST_ONE_SENSOR_SELECTED) : notifyBox("error", la.ERROR, la.AT_LEAST_ONE_ZONE_SELECTED) : notifyBox("error", la.ERROR, la.AT_LEAST_ONE_MARKER_SELECTED) : notifyBox("error", la.ERROR, la.AT_LEAST_ONE_OBJECT_SELECTED) : notifyBox("error", la.ERROR, la.SPEED_LIMIT_CANT_BE_EMPTY)
}

function reportsSelectObject() {
	reportsListSensors()
}

function reportsListDataItems() {
	var e = document.getElementById("dialog_report_type").value;
	if (null != reportsData.data_items[e]) {
		var t = reportsData.data_items[e],
			a = document.getElementById("dialog_report_data_item_list");
		a.options.length = 0;
		for (var i = 0; i < t.length; i++) {
			var o = t[i].toUpperCase();
			o = la[o];
			var s = t[i];
			a.options.add(new Option(o, s))
		}
	}
	$("#dialog_report_data_item_list option").prop("selected", !0), $("#dialog_report_data_item_list").multipleSelect("refresh")
}

function reportsListSensors() {
	var e = document.getElementById("dialog_report_sensor_list");
	e.options.length = 0;
	var t = document.getElementById("dialog_report_type").value;
	if ("route_data_sensors" == t || "drives_stops_sensors" == t || "drives_stops_logic" == t || "logic_sensors" == t || "sensor_graph" == t) {
		for (var a = document.getElementById("dialog_report_object_list"), i = new Array, o = 0; o < a.options.length; o++)
			if (a.options[o].selected) {
				var s = a.options[o].value,
					n = settingsObjectData[s].sensors;
				for (var l in n) {
					var d = n[l];
					"string" != d.result_type && ("drives_stops_logic" == t || "logic_sensors" == t ? "logic" == d.result_type && i.push(d.name) : "route_data_sensors" != t && "drives_stops_sensors" != t && "sensor_graph" != t || i.push(d.name))
				}
			} i = uniqueArray(i);
		for (o = 0; o < i.length; o++) e.options.add(new Option(i[o], i[o]));
		sortSelectList(e)
	}
	$("#dialog_report_sensor_list").multipleSelect("refresh")
}

function reportsSwitchType() {
	var e = document.getElementById("dialog_report_type").value,
		t = document.getElementById("dialog_report_format");
	switch (t.options.length = 0, "speed_graph" != e && "altitude_graph" != e && "acc_graph" != e && "fuellevel_graph" != e && "temperature_graph" != e && "sensor_graph" != e && "routes" != e && "routes_stops" != e && "image_gallery" != e ? (t.options.add(new Option("HTML", "html")), t.options.add(new Option("PDF", "pdf")), t.options.add(new Option("XLS", "xls"))) : t.options.add(new Option("HTML", "html")), $("#dialog_report_format").multipleSelect("refresh"), e) {
		case "general":
		case "general_merged":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !1, document.getElementById("dialog_report_stop_duration").disabled = !1, document.getElementById("dialog_report_show_coordinates").disabled = !0, document.getElementById("dialog_report_show_addresses").disabled = !0, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "object_info":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !0, document.getElementById("dialog_report_show_addresses").disabled = !0, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "current_position":
		case "current_position_off":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !1;
			break;
		case "route_data_sensors":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !1, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !1;
			break;
		case "drives_stops":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").disabled = !1, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !1;
			break;
		case "drives_stops_sensors":
		case "drives_stops_logic":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !1, document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").disabled = !1, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !1;
			break;
		case "travel_sheet":
		case "travel_sheet_dn":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").disabled = !1, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !1;
			break;
		case "mileage_daily":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !1, document.getElementById("dialog_report_stop_duration").disabled = !1, document.getElementById("dialog_report_show_coordinates").disabled = !0, document.getElementById("dialog_report_show_addresses").disabled = !0, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "overspeed":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !1, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !1;
			break;
		case "overspeed_count":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !1, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !0, document.getElementById("dialog_report_show_addresses").disabled = !0, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "underspeed":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !1, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !1;
			break;
		case "underspeed_count":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !1, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !0, document.getElementById("dialog_report_show_addresses").disabled = !0, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "marker_in_out":
			document.getElementById("dialog_report_marker_list").disabled = !1, document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !1;
			break;
		case "marker_in_out_gen":
			document.getElementById("dialog_report_marker_list").disabled = !1, document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !1, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !1;
			break;
		case "zone_in_out":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !1, document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "zone_in_out_general":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !1, document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !1, document.getElementById("dialog_report_stop_duration").disabled = !1, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "events":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !1;
			break;
		case "service":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !0, document.getElementById("dialog_report_show_addresses").disabled = !0, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "rag":
		case "rag_driver":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !1, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !0, document.getElementById("dialog_report_show_addresses").disabled = !0, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "tasks":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !0, document.getElementById("dialog_report_show_addresses").disabled = !0, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "rilogbook":
		case "dtc":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !1;
			break;
		case "expenses":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !0, document.getElementById("dialog_report_show_addresses").disabled = !0, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "fuelfillings":
		case "fuelthefts":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !1;
			break;
		case "logic_sensors":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !1, document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !1;
			break;
		case "speed_graph":
		case "altitude_graph":
		case "acc_graph":
		case "fuellevel_graph":
		case "temperature_graph":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !0, document.getElementById("dialog_report_show_addresses").disabled = !0, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "sensor_graph":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !1, document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !0, document.getElementById("dialog_report_show_addresses").disabled = !0, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "routes":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !1, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !0, document.getElementById("dialog_report_show_addresses").disabled = !0, document.getElementById("dialog_report_markers_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "routes_stops":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !1, document.getElementById("dialog_report_stop_duration").disabled = !1, document.getElementById("dialog_report_show_coordinates").disabled = !0, document.getElementById("dialog_report_show_addresses").disabled = !0, document.getElementById("dialog_report_zones_addresses").disabled = !0;
			break;
		case "image_gallery":
			document.getElementById("dialog_report_marker_list").disabled = !0, $("#dialog_report_marker_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_zone_list").disabled = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").disabled = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").disabled = !0, document.getElementById("dialog_report_stop_duration").disabled = !0, document.getElementById("dialog_report_show_coordinates").disabled = !1, document.getElementById("dialog_report_show_addresses").disabled = !1, document.getElementById("dialog_report_markers_addresses").disabled = !1, document.getElementById("dialog_report_zones_addresses").disabled = !1
	}
	$("#dialog_report_zone_list").multipleSelect("refresh"), $("#dialog_report_sensor_list").multipleSelect("refresh"), "travel_sheet_dn" == e ? (document.getElementById("dialog_report_other_dn_starts_hour").value = "22", $("#dialog_report_other_dn_starts_hour").multipleSelect("refresh"), document.getElementById("dialog_report_other_dn_starts_minute").value = "00", $("#dialog_report_other_dn_starts_minute").multipleSelect("refresh"), document.getElementById("dialog_report_other_dn_ends_hour").value = "06", $("#dialog_report_other_dn_ends_hour").multipleSelect("refresh"), document.getElementById("dialog_report_other_dn_ends_minute").value = "00", $("#dialog_report_other_dn_ends_minute").multipleSelect("refresh"), document.getElementById("dialog_report_other_dn").style.display = "", document.getElementById("dialog_report_other_rag").style.display = "none") : "rag" == e || "rag_driver" == e ? (document.getElementById("dialog_report_other_rag_low_score").value = 0, document.getElementById("dialog_report_other_rag_high_score").value = 5, document.getElementById("dialog_report_other_dn").style.display = "none", document.getElementById("dialog_report_other_rag").style.display = "") : (document.getElementById("dialog_report_other_dn_starts_hour").value = "", document.getElementById("dialog_report_other_dn_starts_minute").value = "", document.getElementById("dialog_report_other_dn_ends_hour").value = "", document.getElementById("dialog_report_other_dn_ends_minute").value = "", document.getElementById("dialog_report_other_rag_low_score").value = "", document.getElementById("dialog_report_other_rag_high_score").value = "", document.getElementById("dialog_report_other_dn").style.display = "none", document.getElementById("dialog_report_other_rag").style.display = "none")
}

function reportsGeneratedReload() {
	$("#reports_generated_list_grid").trigger("reloadGrid")
}

function reportsGeneratedOpen(e) {
	loadingData(!0);
	var t = {
		cmd: "open_generated",
		report_id: e
	};
	$.ajax({
		type: "POST",
		url: "func/fn_reports.php",
		data: t,
		dataType: "json",
		cache: !1,
		success: function (e) {
			loadingData(!1), $.generateFile({
				filename: e.filename,
				content: e.content,
				script: "func/fn_saveas.php?format=" + e.format
			})
		},
		error: function (e, t) {
			loadingData(!1)
		}
	})
}

function reportsGeneratedDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_report_generated",
				report_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_reports.php",
				data: a,
				success: function (e) {
					"OK" == e && reportsGeneratedReload()
				}
			})
		}
	})
}

function reportsGeneratedDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#reports_generated_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_reports_generated",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_reports.php",
					data: a,
					success: function (e) {
						"OK" == e && reportsGeneratedReload()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}
reportsData.reports = new Array, reportsData.edit_report_id = !1, reportsData.data_items = new Array, reportsData.data_items.general = ["route_start", "route_end", "route_length", "move_duration", "stop_duration", "stop_count", "top_speed", "avg_speed", "overspeed_count", "fuel_consumption", "avg_fuel_consumption", "fuel_cost", "engine_work", "engine_idle", "odometer", "engine_hours", "driver", "trailer", "custom_fields"], reportsData.data_items.general_merged = ["route_start", "route_end", "route_length", "move_duration", "stop_duration", "stop_count", "top_speed", "avg_speed", "overspeed_count", "fuel_consumption", "avg_fuel_consumption", "fuel_cost", "engine_work", "engine_idle", "odometer", "engine_hours", "driver", "trailer", "total"], reportsData.data_items.object_info = ["imei", "group", "transport_model", "vin", "plate_number", "odometer", "engine_hours", "driver", "trailer", "gps_device", "sim_card_number"], reportsData.data_items.current_position = ["time", "position", "speed", "altitude", "angle", "status", "odometer", "engine_hours", "driver", "trailer"], reportsData.data_items.current_position_off = ["time", "position", "speed", "altitude", "angle", "status", "odometer", "engine_hours", "driver", "trailer"], reportsData.data_items.route_data_sensors = ["time", "position", "speed", "altitude", "angle"], reportsData.data_items.drives_stops = ["status", "start", "end", "duration", "move_duration", "stop_duration", "route_length", "top_speed", "avg_speed", "fuel_consumption", "avg_fuel_consumption", "fuel_cost", "engine_work", "engine_idle", "driver", "trailer"], reportsData.data_items.drives_stops_sensors = ["status", "start", "end", "duration", "move_duration", "stop_duration", "route_length", "top_speed", "avg_speed", "fuel_consumption", "avg_fuel_consumption", "fuel_cost", "engine_work", "engine_idle", "driver", "trailer"], reportsData.data_items.drives_stops_logic = ["status", "start", "end", "duration", "move_duration", "stop_duration", "route_length", "top_speed", "avg_speed", "fuel_consumption", "avg_fuel_consumption", "fuel_cost", "engine_work", "engine_idle", "driver", "trailer"], reportsData.data_items.travel_sheet = ["time_a", "position_a", "odometer_a", "time_b", "position_b", "odometer_b", "duration", "route_length", "fuel_consumption", "avg_fuel_consumption", "fuel_cost", "driver", "trailer", "total"], reportsData.data_items.travel_sheet_dn = ["time_a", "position_a", "odometer_a", "time_b", "position_b", "odometer_b", "duration", "route_length", "fuel_consumption", "avg_fuel_consumption", "fuel_cost", "driver", "trailer", "total"], reportsData.data_items.mileage_daily = ["time", "start", "end", "move_duration", "route_length", "fuel_consumption", "avg_fuel_consumption", "fuel_cost", "engine_hours", "driver", "trailer", "total"], reportsData.data_items.overspeed = ["start", "end", "duration", "top_speed", "avg_speed", "overspeed_position", "driver", "trailer"], reportsData.data_items.overspeed_count = ["route_start", "route_end", "route_length", "move_duration", "top_speed", "avg_speed", "overspeed_count"], reportsData.data_items.underspeed = ["start", "end", "duration", "top_speed", "avg_speed", "underspeed_position", "driver", "trailer"], reportsData.data_items.underspeed_count = ["route_start", "route_end", "route_length", "move_duration", "top_speed", "avg_speed", "underspeed_count"], reportsData.data_items.marker_in_out = ["marker_in", "marker_out", "duration", "route_length", "engine_hours", "marker_name", "marker_position", "total"], reportsData.data_items.marker_in_out_gen = ["marker_in", "marker_out", "duration", "route_length", "engine_hours", "marker_name", "marker_position", "total"], reportsData.data_items.zone_in_out = ["zone_in", "zone_out", "duration", "route_length", "engine_hours", "zone_name", "zone_position", "total"], reportsData.data_items.zone_in_out_general = ["zone_in", "zone_out", "duration", "route_length", "engine_hours", "zone_name", "zone_position", "total"], reportsData.data_items.events = ["time", "event", "event_position", "driver", "trailer", "total"], reportsData.data_items.service = ["service", "last_service", "status"], reportsData.data_items.rag = ["overspeed_score", "harsh_acceleration_score", "harsh_braking_score", "harsh_cornering_score"], reportsData.data_items.rag_driver = ["overspeed_score", "harsh_acceleration_score", "harsh_braking_score", "harsh_cornering_score"], reportsData.data_items.tasks = ["name", "description", "from", "start_time", "to", "end_time", "priority", "status"], reportsData.data_items.rilogbook = ["group", "name", "position"], reportsData.data_items.dtc = ["code", "position"], reportsData.data_items.expenses = ["date", "name", "object", "quantity", "cost", "supplier", "buyer", "odometer", "engine_hours", "description", "total"], reportsData.data_items.logic_sensors = ["sensor", "activation_time", "deactivation_time", "duration", "activation_position", "deactivation_position"], reportsData.data_items.acc_graph = [], reportsData.data_items.apeed_graph = [], reportsData.data_items.altitude_graph = [], reportsData.data_items.fuellevel_graph = [], reportsData.data_items.fuelfillings = ["time", "position", "before", "after", "filled", "sensor", "driver", "trailer", "total"], reportsData.data_items.fuelthefts = ["time", "position", "before", "after", "stolen", "sensor", "driver", "trailer", "total"], reportsData.data_items.temperature_graph = [], reportsData.data_items.sensor_graph = [], reportsData.data_items.routes = ["route_start", "route_end", "route_length", "move_duration", "stop_duration", "stop_count", "top_speed", "avg_speed", "overspeed_count", "fuel_consumption", "avg_fuel_consumption", "fuel_cost", "engine_work", "engine_idle", "odometer", "engine_hours", "driver", "trailer"], reportsData.data_items.routes_stops = ["route_start", "route_end", "route_length", "move_duration", "stop_duration", "stop_count", "top_speed", "avg_speed", "overspeed_count", "fuel_consumption", "avg_fuel_consumption", "fuel_cost", "engine_work", "engine_idle", "odometer", "engine_hours", "driver", "trailer"], reportsData.data_items.image_gallery = ["time", "position"];
var tasksData = new Array,
	timer_sessionCheck;

function tasksOpen() {
	utilsCheckPrivileges("tasks") && ($("#dialog_tasks").bind("resize", function () {
		$("#tasks_list_grid").setGridHeight($("#dialog_tasks").height() - 133)
	}).trigger("resize"), $("#dialog_tasks").bind("resize", function () {
		$("#tasks_list_grid").setGridWidth($("#dialog_tasks").width())
	}).trigger("resize"), $("#dialog_tasks").dialog("open"))
}

function tasksClose() {
	$("#dialog_tasks").unbind("resize")
}

function tasksShow() {
	var e = "func/fn_tasks.php?cmd=load_task_list",
		t = document.getElementById("dialog_tasks_object_list").value,
		a = document.getElementById("dialog_tasks_date_from").value + " " + document.getElementById("dialog_tasks_hour_from").value + ":" + document.getElementById("dialog_tasks_minute_from").value + ":00",
		i = document.getElementById("dialog_tasks_date_to").value + " " + document.getElementById("dialog_tasks_hour_to").value + ":" + document.getElementById("dialog_tasks_minute_to").value + ":00";
	"" != t && (e += "&imei=" + t), a != i && (e += "&dtf=" + a + "&dtt=" + i), $("#tasks_list_grid").jqGrid("setGridParam", {
		url: e
	}).trigger("reloadGrid")
}

function tasksDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_task",
				task_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_tasks.php",
				data: a,
				success: function (e) {
					"OK" == e && tasksShow()
				}
			})
		}
	})
}

function tasksDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#tasks_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_tasks",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_tasks.php",
					data: a,
					success: function (e) {
						"OK" == e && tasksShow()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function tasksDeleteAll() {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_TASKS, function (e) {
		if (e) {
			$.ajax({
				type: "POST",
				url: "func/fn_tasks.php",
				data: {
					cmd: "delete_all_tasks"
				},
				success: function (e) {
					"OK" == e && tasksShow()
				}
			})
		}
	})
}

function tasksExportCSV() {
	var e = "func/fn_export.php?format=tasks_csv",
		t = document.getElementById("dialog_tasks_object_list").value,
		a = document.getElementById("dialog_tasks_date_from").value + " " + document.getElementById("dialog_tasks_hour_from").value + ":" + document.getElementById("dialog_tasks_minute_from").value + ":00",
		i = document.getElementById("dialog_tasks_date_to").value + " " + document.getElementById("dialog_tasks_hour_to").value + ":" + document.getElementById("dialog_tasks_minute_to").value + ":00";
	"" != t && (e += "&imei=" + t), a != i && (e += "&dtf=" + a + "&dtt=" + i), window.location = e
}

function tasksNew(e) {
	if (1 != gsValues.map_bussy) {
		gsValues.map_bussy = !0;
		var t = map.editTools.startPolyline(e);
		map.doubleClickZoom.disable(), map.on("editable:drawing:clicked", function (e) {
			var a = t.getLatLngs();
			map.editTools.stopDrawing(), 1 == map.hasLayer(t) && map.removeLayer(t), map.doubleClickZoom.enable(), map.off("editable:drawing:clicked"), taskProperties("add"), geocoderGetAddress(a[0].lat, a[0].lng, function (e) {
				document.getElementById("dialog_task_start_address").value = e, document.getElementById("dialog_task_start_lat").value = a[0].lat, document.getElementById("dialog_task_start_lng").value = a[0].lng
			}), geocoderGetAddress(a[1].lat, a[1].lng, function (e) {
				document.getElementById("dialog_task_end_address").value = e, document.getElementById("dialog_task_end_lat").value = a[1].lat, document.getElementById("dialog_task_end_lng").value = a[1].lng
			}), gsValues.map_bussy = !1
		})
	}
}

function tasksPickAddress(e) {
	1 != gsValues.map_bussy && (map.doubleClickZoom.disable(), gsValues.map_bussy = !0, document.getElementById("map").style.cursor = "crosshair", $("#dialog_tasks").dialog("close"), $("#dialog_task_properties").dialog("close"), map.on("click", function (t) {
		"start" == e ? geocoderGetAddress(t.latlng.lat, t.latlng.lng, function (e) {
			document.getElementById("dialog_task_start_address").value = e, document.getElementById("dialog_task_start_lat").value = t.latlng.lat, document.getElementById("dialog_task_start_lng").value = t.latlng.lng
		}) : geocoderGetAddress(t.latlng.lat, t.latlng.lng, function (e) {
			document.getElementById("dialog_task_end_address").value = e, document.getElementById("dialog_task_end_lat").value = t.latlng.lat, document.getElementById("dialog_task_end_lng").value = t.latlng.lng
		}), map.off("click"), map.doubleClickZoom.enable(), gsValues.map_bussy = !1, document.getElementById("map").style.cursor = "", tasksOpen(), $("#dialog_task_properties").dialog("open")
	}))
}

function taskProperties(e) {
	switch (e) {
		default:
			var t = e;
			tasksData.edit_task_id = t;
			var a = {
				cmd: "load_task",
				task_id: tasksData.edit_task_id
			};
			$.ajax({
				type: "POST",
				url: "func/fn_tasks.php",
				data: a,
				dataType: "json",
				cache: !1,
				success: function (e) {
					document.getElementById("dialog_task_name").value = e.name, document.getElementById("dialog_task_object_list").value = e.imei, $("#dialog_task_object_list").multipleSelect("refresh"), document.getElementById("dialog_task_priority").value = e.priority, $("#dialog_task_priority").multipleSelect("refresh"), document.getElementById("dialog_task_status").value = e.status, $("#dialog_task_status").multipleSelect("refresh"), document.getElementById("dialog_task_desc").value = e.desc;
					var t = e.start_from_dt.split(" "),
						a = e.start_to_dt.split(" "),
						i = e.end_from_dt.split(" "),
						o = e.end_to_dt.split(" ");
					document.getElementById("dialog_task_start_address").value = e.start_address, document.getElementById("dialog_task_start_lat").value = e.start_lat, document.getElementById("dialog_task_start_lng").value = e.start_lng, document.getElementById("dialog_task_start_from_date").value = t[0], document.getElementById("dialog_task_start_from_time").value = t[1].substring(0, 5), $("#dialog_task_start_from_time").multipleSelect("refresh"), document.getElementById("dialog_task_start_to_date").value = a[0], document.getElementById("dialog_task_start_to_time").value = a[1].substring(0, 5), $("#dialog_task_start_to_time").multipleSelect("refresh"), document.getElementById("dialog_task_end_address").value = e.end_address, document.getElementById("dialog_task_end_lat").value = e.end_lat, document.getElementById("dialog_task_end_lng").value = e.end_lng, document.getElementById("dialog_task_end_from_date").value = i[0], document.getElementById("dialog_task_end_from_time").value = i[1].substring(0, 5), $("#dialog_task_end_from_time").multipleSelect("refresh"), document.getElementById("dialog_task_end_to_date").value = o[0], document.getElementById("dialog_task_end_to_time").value = o[1].substring(0, 5), $("#dialog_task_end_to_time").multipleSelect("refresh")
				}
			}), $("#dialog_task_properties").dialog("open");
			break;
		case "add":
			tasksData.edit_task_id = !1, document.getElementById("dialog_task_name").value = "", document.getElementById("dialog_task_priority").value = "low", $("#dialog_task_priority").multipleSelect("refresh"), document.getElementById("dialog_task_status").value = 0, $("#dialog_task_status").multipleSelect("refresh"), document.getElementById("dialog_task_desc").value = "", document.getElementById("dialog_task_start_address").value = "", document.getElementById("dialog_task_start_lat").value = 0, document.getElementById("dialog_task_start_lng").value = 0, document.getElementById("dialog_task_start_from_date").value = moment().format("YYYY-MM-DD"), document.getElementById("dialog_task_start_from_time").value = "00:00", $("#dialog_task_start_from_time").multipleSelect("refresh"), document.getElementById("dialog_task_start_to_date").value = moment().format("YYYY-MM-DD"), document.getElementById("dialog_task_start_to_time").value = "00:00", $("#dialog_task_start_to_time").multipleSelect("refresh"), document.getElementById("dialog_task_end_address").value = "", document.getElementById("dialog_task_end_lat").value = 0, document.getElementById("dialog_task_end_lng").value = 0, document.getElementById("dialog_task_end_from_date").value = moment().format("YYYY-MM-DD"), document.getElementById("dialog_task_end_from_time").value = "00:00", $("#dialog_task_end_from_time").multipleSelect("refresh"), document.getElementById("dialog_task_end_to_date").value = moment().format("YYYY-MM-DD"), document.getElementById("dialog_task_end_to_time").value = "00:00", $("#dialog_task_end_to_time").multipleSelect("refresh"), $("#dialog_task_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_task_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var i = document.getElementById("dialog_task_name").value,
				o = document.getElementById("dialog_task_object_list").value,
				s = document.getElementById("dialog_task_priority").value,
				n = document.getElementById("dialog_task_status").value,
				l = document.getElementById("dialog_task_desc").value,
				d = document.getElementById("dialog_task_start_address").value,
				r = document.getElementById("dialog_task_start_lat").value,
				_ = document.getElementById("dialog_task_start_lng").value,
				c = document.getElementById("dialog_task_start_from_date").value + " " + document.getElementById("dialog_task_start_from_time").value + ":00",
				g = document.getElementById("dialog_task_start_to_date").value + " " + document.getElementById("dialog_task_start_to_time").value + ":00",
				m = document.getElementById("dialog_task_end_address").value,
				u = document.getElementById("dialog_task_end_lat").value,
				p = document.getElementById("dialog_task_end_lng").value,
				y = document.getElementById("dialog_task_end_from_date").value + " " + document.getElementById("dialog_task_end_from_time").value + ":00",
				h = document.getElementById("dialog_task_end_to_date").value + " " + document.getElementById("dialog_task_end_to_time").value + ":00";
			if ("" == i) return void notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
			if ("" == o) {
				notifyBox("error", la.ERROR, la.NO_OBJECT_SELECTED);
				break
			}
			if ("" == d || "" == m) return void notifyBox("error", la.ERROR, la.ADDRESS_CANT_BE_EMPTY);
			a = {
				cmd: "save_task",
				task_id: tasksData.edit_task_id,
				name: i,
				imei: o,
				priority: s,
				status: n,
				desc: l,
				start_address: d,
				start_lat: r,
				start_lng: _,
				start_from_dt: c,
				start_to_dt: g,
				end_address: m,
				end_lat: u,
				end_lng: p,
				end_from_dt: y,
				end_to_dt: h
			};
			$.ajax({
				type: "POST",
				url: "func/fn_tasks.php",
				data: a,
				cache: !1,
				success: function (e) {
					"OK" == e && (tasksShow(), $("#dialog_task_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function rilogbookOpen() {
	utilsCheckPrivileges("rilogbook") && ($("#dialog_rilogbook").bind("resize", function () {
		$("#rilogbook_logbook_grid").setGridHeight($("#dialog_rilogbook").height() - 133)
	}).trigger("resize"), $("#dialog_rilogbook").bind("resize", function () {
		$("#rilogbook_logbook_grid").setGridWidth($("#dialog_rilogbook").width())
	}).trigger("resize"), $("#dialog_rilogbook").dialog("open"))
}

function rilogbookClose() {
	$("#dialog_rilogbook").unbind("resize")
}

function rilogbookShow() {
	var e = "func/fn_rilogbook.php?cmd=load_rilogbook_list",
		t = document.getElementById("dialog_rilogbook_object_list").value,
		a = document.getElementById("dialog_rilogbook_drivers").checked,
		i = document.getElementById("dialog_rilogbook_passengers").checked,
		o = document.getElementById("dialog_rilogbook_trailers").checked,
		s = document.getElementById("dialog_rilogbook_date_from").value + " " + document.getElementById("dialog_rilogbook_hour_from").value + ":" + document.getElementById("dialog_rilogbook_minute_from").value + ":00",
		n = document.getElementById("dialog_rilogbook_date_to").value + " " + document.getElementById("dialog_rilogbook_hour_to").value + ":" + document.getElementById("dialog_rilogbook_minute_to").value + ":00";
	"" != t && (e += "&imei=" + t), e += "&drivers=" + a, e += "&passengers=" + i, e += "&trailers=" + o, s != n && (e += "&dtf=" + s + "&dtt=" + n), $("#rilogbook_logbook_grid").jqGrid("setGridParam", {
		url: e
	}).trigger("reloadGrid")
}

function rilogbookDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_record",
				rilogbook_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_rilogbook.php",
				data: a,
				success: function (e) {
					"OK" == e && rilogbookShow()
				}
			})
		}
	})
}

function rilogbookDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#rilogbook_logbook_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_records",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_rilogbook.php",
					data: a,
					success: function (e) {
						"OK" == e && rilogbookShow()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function rilogbookDeleteAll() {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_LOGBOOK_RECORDS, function (e) {
		if (e) {
			$.ajax({
				type: "POST",
				url: "func/fn_rilogbook.php",
				data: {
					cmd: "delete_all_records"
				},
				success: function (e) {
					"OK" == e && rilogbookShow()
				}
			})
		}
	})
}

function rilogbookExportCSV() {
	var e = "func/fn_export.php?format=rilogbook_csv",
		t = document.getElementById("dialog_rilogbook_object_list").value,
		a = document.getElementById("dialog_rilogbook_drivers").checked,
		i = document.getElementById("dialog_rilogbook_passengers").checked,
		o = document.getElementById("dialog_rilogbook_trailers").checked,
		s = document.getElementById("dialog_rilogbook_date_from").value + " " + document.getElementById("dialog_rilogbook_hour_from").value + ":" + document.getElementById("dialog_rilogbook_minute_from").value + ":00",
		n = document.getElementById("dialog_rilogbook_date_to").value + " " + document.getElementById("dialog_rilogbook_hour_to").value + ":" + document.getElementById("dialog_rilogbook_minute_to").value + ":00";
	"" != t && (e += "&imei=" + t), e += "&drivers=" + a, e += "&passengers=" + i, e += "&trailers=" + o, s != n && (e += "&dtf=" + s + "&dtt=" + n), window.location = e
}

function notifyCheck(e) {
	switch (e) {
		case "expiring_objects":
			if (1 == gsValues.notify_obj_expire)
				for (var t in settingsObjectData) {
					if ("true" == (a = settingsObjectData[t]).active && "true" == a.object_expire && getDateDifference(new Date(a.object_expire_dt), new Date) <= gsValues.notify_obj_expire_period) {
						notifyBox("error", la.EXPIRING_OBJECTS, la.SOME_OF_YOUR_OBJECTS_ACTIVATION_WILL_EXPIRE_SOON);
						break
					}
				}
			break;
		case "inactive_objects":
			if (1 == gsValues.notify_obj_expire)
				for (var t in settingsObjectData) {
					var a;
					if ("false" == (a = settingsObjectData[t]).active) {
						notifyBox("error", la.INACTIVE_OBJECTS, la.THERE_ARE_INACTIVE_OBJECTS_IN_YOUR_ACCOUNT);
						break
					}
				}
			break;
		case "session_check":
			if (0 == gsValues.session_check) break;
			clearTimeout(timer_sessionCheck);
			$.ajax({
				type: "POST",
				url: "func/fn_connect.php",
				data: {
					cmd: "session_check"
				},
				cache: !1,
				error: function (e, t) {
					timer_sessionCheck = setTimeout("notifyCheck('session_check');", 1e3 * gsValues.session_check)
				},
				success: function (e) {
					"false" == e ? $("#blocking_panel").show() : timer_sessionCheck = setTimeout("notifyCheck('session_check');", 1e3 * gsValues.session_check)
				}
			})
	}
}
tasksData.edit_task_id = !1;
var placesGroupData = new Array;

function placesSetListCheckbox(e, t) {
	null != document.getElementById(e) && (document.getElementById(e).checked = t)
}

function placesGroupOpen() {
	utilsCheckPrivileges("subuser") && ($("#places_group_list_grid").trigger("reloadGrid"), $("#dialog_places_groups").dialog("open"))
}

function placesGroupClose() {
	placesMarkerReload(), placesRouteReload(), placesZoneReload()
}

function placesGroupReload() {
	placesGroupLoadData(), $("#places_group_list_grid").trigger("reloadGrid")
}

function placesGroupLoadData(e) {
	$.ajax({
		type: "POST",
		url: "func/fn_places.php",
		data: {
			cmd: "load_place_group_data"
		},
		dataType: "json",
		cache: !1,
		success: function (t) {
			for (var a in placesGroupData.groups = t, placesGroupData.edit_group_id = !1, initSelectList("places_group_list"), placesGroupData.groups) null != document.getElementById("marker_group_name_" + a) && (document.getElementById("marker_group_name_" + a).innerHTML = placesGroupData.groups[a].name), null != document.getElementById("route_group_name_" + a) && (document.getElementById("route_group_name_" + a).innerHTML = placesGroupData.groups[a].name), null != document.getElementById("zone_group_name_" + a) && (document.getElementById("zone_group_name_" + a).innerHTML = placesGroupData.groups[a].name);
			void 0 !== e && e(!0)
		}
	})
}

function placesGroupDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_place_group",
				group_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_places.php",
				data: a,
				success: function (e) {
					"OK" == e && placesGroupReload()
				}
			})
		}
	})
}

function placesGroupDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#places_group_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_place_groups",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_places.php",
					data: a,
					success: function (e) {
						"OK" == e && placesGroupReload()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function placesGroupProperties(e) {
	switch (e) {
		default:
			var t = e;
			placesGroupData.edit_group_id = t, document.getElementById("dialog_places_group_name").value = placesGroupData.groups[t].name, document.getElementById("dialog_places_group_desc").value = placesGroupData.groups[t].desc, $("#dialog_places_group_properties").dialog("open");
			break;
		case "add":
			placesGroupData.edit_group_id = !1, document.getElementById("dialog_places_group_name").value = "", document.getElementById("dialog_places_group_desc").value = "", $("#dialog_places_group_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_places_group_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var a = document.getElementById("dialog_places_group_name").value,
				i = document.getElementById("dialog_places_group_desc").value;
			if ("" == a) {
				notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
				break
			}
			var o = {
				cmd: "save_place_group",
				group_id: placesGroupData.edit_group_id,
				group_name: a,
				group_desc: i
			};
			$.ajax({
				type: "POST",
				url: "func/fn_places.php",
				data: o,
				cache: !1,
				success: function (e) {
					"OK" == e && (placesGroupReload(), $("#dialog_places_group_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function placesGroupImport() {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (document.getElementById("load_file").addEventListener("change", placesGroupImportPGRFile, !1), document.getElementById("load_file").click())
}

function placesGroupImportPGRFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onload = function (e) {
		try {
			var t = $.parseJSON(e.target.result);
			if ("0.1v" == t.pgr) {
				var a = t.groups.length;
				if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
				confirmDialog(sprintf(la.GROUPS_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function (t) {
					if (t) {
						loadingData(!0);
						var a = {
							format: "pgr",
							data: e.target.result
						};
						$.ajax({
							type: "POST",
							url: "func/fn_import.php",
							data: a,
							cache: !1,
							success: function (e) {
								loadingData(!1), "OK" == e && placesGroupReload()
							},
							error: function (e, t) {
								loadingData(!1)
							}
						})
					}
				})
			} else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		} catch (e) {
			notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		}
		document.getElementById("load_file").value = ""
	}, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectGroupImportOGRFile, !1)
}

function placesGroupExport() {
	if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy) {
		window.location = "func/fn_export.php?format=pgr"
	}
}

function placesImport() {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (document.getElementById("load_file").addEventListener("change", placesImportPLCFile, !1), document.getElementById("load_file").click())
}

function placesImportPLCFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onload = function (e) {
		try {
			if ("kml" == t[0].name.split(".").pop().toLowerCase()) var a = placesKMLToPLC((new X2JS).xml_str2json(e.target.result)),
				i = JSON.stringify(a);
			else if ("csv" == t[0].name.split(".").pop().toLowerCase()) a = placesCSVToPLC(csv2json(e.target.result)), i = JSON.stringify(a);
			else a = $.parseJSON(e.target.result), i = e.target.result;
			if ("0.1v" == a.plc) {
				var o = a.markers.length,
					s = a.routes.length,
					n = a.zones.length;
				if (0 == o && 0 == s && 0 == n) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
				confirmDialog(sprintf(la.MARKERS_ROUTES_ZONES_FOUND, o, s, n) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function (e) {
					if (e) {
						loadingData(!0);
						var t = {
							format: "plc",
							data: i,
							markers: !0,
							routes: !0,
							zones: !0
						};
						$.ajax({
							type: "POST",
							url: "func/fn_import.php",
							data: t,
							cache: !1,
							success: function (e) {
								loadingData(!1), "OK" == e ? (placesMarkerLoadData(), placesRouteLoadData(), placesZoneLoadData(), $("#side_panel_places_marker_list_grid").trigger("reloadGrid"), $("#side_panel_places_route_list_grid").trigger("reloadGrid"), $("#side_panel_places_zone_list_grid").trigger("reloadGrid")) : "ERROR_MARKER_LIMIT" == e ? notifyBox("error", la.ERROR, la.MARKER_LIMIT_IS_REACHED) : "ERROR_ROUTE_LIMIT" == e ? notifyBox("error", la.ERROR, la.ROUTE_LIMIT_IS_REACHED) : "ERROR_ZONE_LIMIT" == e && notifyBox("error", la.ERROR, la.ZONE_LIMIT_IS_REACHED)
							},
							error: function (e, t) {
								loadingData(!1)
							}
						})
					}
				})
			} else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		} catch (e) {
			notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		}
		document.getElementById("load_file").value = ""
	}, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", placesImportPLCFile, !1)
}

function placesExport() {
	if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy) {
		window.location = "func/fn_export.php?format=plc"
	}
}

function placesCSVToPLC(e) {
	for (var t = !1, a = {
		plc: "0.1v",
		markers: new Array,
		routes: new Array,
		zones: new Array
	}, i = 0; i < e.length; i++) {
		var o = e[i];
		if (0 == t && (null != o.name && null != o.desc && null != o.icon && null != o.visible && null != o.lat && null != o.lng ? t = "marker" : null != o.name && null != o.color && null != o.visible && null != o.name_visible && null != o.deviation && null != o.points ? t = "route" : null != o.name && null != o.color && null != o.visible && null != o.name_visible && null != o.area && null != o.vertices && (t = "zone")), "marker" == t) a.markers.push({
			name: o.name,
			desc: o.desc,
			icon: "img/markers/places/" + o.icon,
			visible: o.visible,
			lat: o.lat,
			lng: o.lng
		});
		else if ("route" == t) a.routes.push({
			name: o.name,
			color: o.color,
			visible: o.visible,
			name_visible: o.name_visible,
			deviation: o.deviation,
			points: o.points
		});
		else {
			if ("zone" != t) return a;
			a.zones.push({
				name: o.name,
				color: o.color,
				visible: o.visible,
				name_visible: o.name_visible,
				area: o.area,
				vertices: o.vertices
			})
		}
	}
	return a
}

function placesKMLToPLC(e) {
	for (var t = 1, a = 1, i = {
		plc: "0.1v",
		markers: new Array,
		routes: new Array,
		zones: new Array
	}, o = e.kml.Document.Placemark, s = 0; s < o.length - 1; s++) {
		var n = o[s];
		if (null != n.Point) {
			if (null != n.name) var l = n.name;
			else {
				l = "Marker " + t;
				t += 1
			}
			if (null != n.description.__text) var d = n.description.toString();
			else d = "";
			var r = (p = n.Point.coordinates.split(","))[0],
				_ = p[1];
			i.markers.push({
				name: l,
				desc: d,
				icon: "img/markers/places/pin-1.svg",
				visible: "true",
				lat: _,
				lng: r
			})
		}
		if (null != n.Polygon) {
			if (null != n.name) l = n.name;
			else {
				l = "Zone " + a;
				a += 1
			}
			if (null != n.Style.PolyStyle.color) var c = "#" + n.Style.PolyStyle.color.slice(0, -2);
			else c = "#FF0000";
			var g = n.Polygon.outerBoundaryIs.LinearRing.coordinates.split(" ");
			if (g.length <= 80) {
				for (var m = [], u = 0; u < g.length; u++) {
					var p;
					r = (p = g[u].split(","))[0], _ = p[1];
					m.push(parseFloat(_).toFixed(6) + "," + parseFloat(r).toFixed(6))
				}
				m = m.toString(), i.zones.push({
					name: l,
					color: c,
					visible: "true",
					name_visible: "true",
					area: "0",
					vertices: m
				})
			}
		}
	}
	return i
}
placesGroupData.groups = new Array, placesGroupData.edit_group_id = !1;
var placesMarkerData = new Array;

function placesMarkerReload() {
	placesGroupLoadData(), placesMarkerLoadData(), $("#side_panel_places_marker_list_grid").trigger("reloadGrid")
}

function placesMarkerLoadData() {
	$.ajax({
		type: "POST",
		url: "func/fn_places.php",
		data: {
			cmd: "load_marker_data"
		},
		dataType: "json",
		cache: !1,
		success: function (e) {
			placesMarkerData.markers = e, placesMarkerInitLists(), placesMarkerSetListCheckbox(), placesMarkerSetListNumber(), "" != placesMarkerData.markers ? placesMarkerAddAllToMap() : placesMarkerRemoveAllFromMap()
		}
	})
}

function placesMarkerInitLists() {
	initSelectList("report_marker_list"), initSelectList("subaccounts_marker_list")
}

function placesMarkerSetListNumber() {
	document.getElementById("side_panel_places_markers_num").innerHTML = "(" + Object.keys(placesMarkerData.markers).length + ")"
}

function placesMarkerSetListCheckbox() {
	for (var e in placesGroupData.groups) placesSetListCheckbox("marker_group_visible_" + e, placesGroupData.groups[e].marker_visible);
	for (var e in placesMarkerData.markers) placesSetListCheckbox("marker_visible_" + e, placesMarkerData.markers[e].visible)
}

function placesMarkerAddAllToMap() {
	var e = document.getElementById("side_panel_places_marker_list_search").value;
	for (var t in placesMarkerRemoveAllFromMap(), placesMarkerData.markers) {
		var a = placesMarkerData.markers[t];
		if (strMatches(a.data.name, e)) {
			var i = a.data.name,
				o = a.data.desc,
				s = a.data.icon,
				n = a.data.visible,
				l = a.data.lat,
				d = a.data.lng;
			try {
				placesMarkerAddMarkerToMap(t, i, o, s, n, l, d)
			} catch (e) { }
		}
	}
}

function placesMarkerAddMarkerToMap(e, t, a, i, o, s, n) {
	var l = settingsUserData.map_is,
		d = L.icon({
			iconUrl: i,
			iconSize: [28 * l, 28 * l],
			iconAnchor: [14 * l, 28 * l],
			popupAnchor: [0, 0]
		}),
		r = L.marker([s, n], {
			icon: d
		}),
		_ = "<table><tr><td><strong>" + t + "</strong></td></tr>";
	"" != a && (_ += "<tr><td>" + textToLinks(a) + "</td></tr>"), _ += "</table>", r.on("click", function (e) {
		addPopupToMap(s, n, [0, -28 * l], _, "")
	}), "false" != o && mapLayers.places_markers.addLayer(r), placesMarkerData.markers[e].marker_layer = r
}

function placesMarkerRemoveAllFromMap() {
	mapLayers.places_markers.clearLayers()
}

function placesMarkerSearchMap(e) {
	for (var t in placesMarkerData.markers) {
		var a = placesMarkerData.markers[t];
		strMatches(a.data.name, e) ? 1 == a.visible && placesMarkerVisible(t, !0) : placesMarkerVisible(t, !1)
	}
}

function placesMarkerDeleteAll() {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_MARKERS, function (e) {
		if (e) {
			$.ajax({
				type: "POST",
				url: "func/fn_places.php",
				data: {
					cmd: "delete_all_markers"
				},
				success: function (e) {
					"OK" == e && (placesMarkerLoadData(), $("#side_panel_places_marker_list_grid").trigger("reloadGrid"))
				}
			})
		}
	})
}

function placesMarkerDelete(e) {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (placesMarkerPanTo(e), confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_marker",
				marker_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_places.php",
				data: a,
				success: function (t) {
					"OK" == t && (placesMarkerVisible(e, !1), delete placesMarkerData.markers[e], placesMarkerSetListNumber(), placesMarkerInitLists(), $("#side_panel_places_marker_list_grid").trigger("reloadGrid"))
				}
			})
		}
	}))
}

function placesMarkerNew(e) {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (map.doubleClickZoom.disable(), gsValues.map_bussy = !0, document.getElementById("map").style.cursor = "crosshair", document.getElementById("dialog_places_marker_name").value = la.NEW_MARKER + " " + placesMarkerData.new_marker_id, document.getElementById("dialog_places_marker_desc").value = "", document.getElementById("dialog_places_marker_group").value = 0, document.getElementById("dialog_places_marker_radius").value = .1, $("#dialog_places_marker_group").multipleSelect("refresh"), document.getElementById("dialog_places_marker_visible").checked = !0, $("#dialog_places_marker_properties").dialog("open"), placesMarkerLoadDefaultIconList(), placesMarkerLoadCustomIconList(), null != e && (map.hasLayer(placesMarkerData.edit_marker_layer) && map.removeLayer(placesMarkerData.edit_marker_layer), placesMarkerAddToMap(e.lat, e.lng, placesMarkerData.marker_icon)), map.on("click", placesMarkerAddToMapByClick))
}

function placesMarkerAddToMapByClick(e) {
	map.hasLayer(placesMarkerData.edit_marker_layer) && map.removeLayer(placesMarkerData.edit_marker_layer), placesMarkerAddToMap(e.latlng.lat, e.latlng.lng, placesMarkerData.marker_icon)
}

function placesMarkerAddToMap(e, t, a) {
	var i = settingsUserData.map_is,
		o = L.icon({
			iconUrl: a,
			iconSize: [28 * i, 28 * i],
			iconAnchor: [14 * i, 28 * i],
			popupAnchor: [0, 0]
		});
	placesMarkerData.edit_marker_layer = L.marker([e, t], {
		icon: o
	}), placesMarkerData.edit_marker_layer.addTo(map)
}

function placesMarkerProperties(e) {
	if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser")) switch (e) {
		default:
			if (1 == gsValues.map_bussy) return;
			map.doubleClickZoom.disable(), gsValues.map_bussy = !0;
			var t = e;
			placesMarkerData.edit_marker_id = t, document.getElementById("dialog_places_marker_name").value = placesMarkerData.markers[t].data.name, document.getElementById("dialog_places_marker_desc").value = placesMarkerData.markers[t].data.desc, document.getElementById("dialog_places_marker_group").value = placesMarkerData.markers[t].data.group_id, document.getElementById("dialog_places_marker_radius").value = placesMarkerData.markers[t].data.radius, $("#dialog_places_marker_group").multipleSelect("refresh"), "true" == placesMarkerData.markers[t].data.visible ? document.getElementById("dialog_places_marker_visible").checked = !0 : document.getElementById("dialog_places_marker_visible").checked = !1, placesMarkerData.marker_icon = placesMarkerData.markers[t].data.icon, $("#dialog_places_marker_properties").dialog("open"), placesMarkerLoadDefaultIconList(), placesMarkerLoadCustomIconList(), mapLayers.places_markers.removeLayer(placesMarkerData.markers[t].marker_layer), placesMarkerAddToMap((d = placesMarkerData.markers[t].marker_layer.getLatLng()).lat, d.lng, placesMarkerData.marker_icon), map.on("click", placesMarkerAddToMapByClick);
			break;
		case "cancel":
			if (map.hasLayer(placesMarkerData.edit_marker_layer) && map.removeLayer(placesMarkerData.edit_marker_layer), map.off("click"), 0 != placesMarkerData.edit_marker_id) {
				t = placesMarkerData.edit_marker_id;
				"false" == placesMarkerData.markers[t].data.visible ? mapLayers.places_markers.removeLayer(placesMarkerData.markers[t].marker_layer) : mapLayers.places_markers.addLayer(placesMarkerData.markers[t].marker_layer)
			}
			placesMarkerData.edit_marker_id = !1, placesMarkerData.edit_marker_layer = !1, map.doubleClickZoom.enable(), gsValues.map_bussy = !1, document.getElementById("map").style.cursor = "", $("#dialog_places_marker_properties").dialog("close");
			break;
		case "save":
			var a = document.getElementById("dialog_places_marker_name").value,
				i = document.getElementById("dialog_places_marker_desc").value,
				o = document.getElementById("dialog_places_marker_group").value,
				s = document.getElementById("dialog_places_marker_visible").checked,
				n = placesMarkerData.marker_icon,
				l = document.getElementById("dialog_places_marker_radius").value;
			if ("" == a) {
				notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
				break
			}
			if (0 == placesMarkerData.edit_marker_layer) {
				notifyBox("error", la.ERROR, la.PLACE_MARKER_ON_MAP_BEFORE_SAVING);
				break
			}
			var d = placesMarkerData.edit_marker_layer.getLatLng();
			map.off("click"), map.hasLayer(placesMarkerData.edit_marker_layer) && map.removeLayer(placesMarkerData.edit_marker_layer), 0 == placesMarkerData.edit_marker_id && (placesMarkerData.new_marker_id += 1);
			var r = {
				cmd: "save_marker",
				marker_id: placesMarkerData.edit_marker_id,
				group_id: o,
				marker_name: a,
				marker_desc: i,
				marker_icon: n,
				marker_visible: s,
				marker_lat: d.lat.toFixed(6),
				marker_lng: d.lng.toFixed(6),
				marker_radius: l
			};
			$.ajax({
				type: "POST",
				url: "func/fn_places.php",
				data: r,
				success: function (e) {
					placesMarkerData.edit_marker_layer = !1, placesMarkerData.edit_marker_id = !1, map.doubleClickZoom.enable(), gsValues.map_bussy = !1, document.getElementById("map").style.cursor = "", $("#dialog_places_marker_properties").dialog("close"), "OK" == e ? (placesMarkerLoadData(), $("#side_panel_places_marker_list_grid").trigger("reloadGrid")) : "ERROR_MARKER_LIMIT" == e && notifyBox("error", la.ERROR, la.MARKER_LIMIT_IS_REACHED)
				}
			})
	}
}

function placesMarkerLoadDefaultIconList() {
	0 == placesMarkerData.default_icons_loaded && $.ajax({
		type: "POST",
		url: "func/fn_files.php",
		data: {
			path: "img/markers/places"
		},
		dataType: "json",
		success: function (e) {
			var t = '<div class="row2">';
			for (document.getElementById("places_marker_icon_default_list").innerHTML = "", i = 0; i < e.length; i++) {
				var a = "img/markers/places/" + e[i];
				t += '<div class="icon-places-marker">', t += '<a href="#" onclick="placesMarkerSelectIcon(\'' + a + "');\">", t += '<img src="' + a + '" style="padding:5px; width: 32px; height: 32px;"/>', t += "</a>", t += "</div>"
			}
			t += "</div>", document.getElementById("places_marker_icon_default_list").innerHTML = t, placesMarkerData.default_icons_loaded = !0
		}
	})
}

function placesMarkerLoadCustomIconList() {
	0 == placesMarkerData.custom_icons_loaded && $.ajax({
		type: "POST",
		url: "func/fn_files.php",
		data: {
			path: "data/user/places"
		},
		dataType: "json",
		success: function (e) {
			var t = '<div class="row2">';
			for (document.getElementById("places_marker_icon_custom_list").innerHTML = "", i = 0; i < e.length; i++) {
				var a = "data/user/places/" + e[i];
				t += '<div class="icon-places-marker">', t += '<a href="#" onclick="placesMarkerSelectIcon(\'' + a + "');\">", t += '<img src="' + a + '" style="padding:5px; width: 32px; height: 32px;"/>', t += "</a>", t += '<div class="icon-custom-delete">', t += '<a href="#" onclick="placesMarkerDeleteCustomIcon(\'' + a + "');\">", t += '<img border="0" src="theme/images/remove.svg" width="8px">', t += "</a>", t += "</div>", t += "</div>"
			}
			t += "</div>", document.getElementById("places_marker_icon_custom_list").innerHTML = t, placesMarkerData.custom_icons_loaded = !0
		}
	})
}

function placesMarkerUploadCustomIcon() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", placesMarkerUploadCustomIconFile, !1), document.getElementById("load_file").click())
}

function placesMarkerUploadCustomIconFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onloadend = function (e) {
		var a = e.target.result;
		if ("image/png" == t[0].type || "image/svg+xml" == t[0].type) {
			var i = new Image;
			i.src = a, i.onload = function () {
				if (i.src.includes("image/png")) {
					if (32 != i.width || 32 != i.height) return void notifyBox("error", la.ERROR, la.ICON_SIZE_SHOULD_BE_32_32);
					var e = "func/fn_upload.php?file=places_icon_png"
				} else e = "func/fn_upload.php?file=places_icon_svg";
				$.ajax({
					url: e,
					type: "POST",
					data: a,
					processData: !1,
					contentType: !1,
					success: function (e) {
						placesMarkerData.custom_icons_loaded = !1, placesMarkerLoadCustomIconList()
					}
				})
			}, document.getElementById("load_file").value = ""
		} else notifyBox("error", la.ERROR, la.FILE_TYPE_MUST_BE_PNG_OR_SVG)
	}, a.readAsDataURL(t[0]), this.removeEventListener("change", placesMarkerUploadCustomIconFile, !1)
}

function placesMarkerDeleteCustomIcon(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_ICON, function (t) {
		if (t) {
			var a = {
				cmd: "delete_custom_icon",
				file: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_places.php",
				data: a,
				success: function (e) {
					"OK" == e && (placesMarkerData.custom_icons_loaded = !1, placesMarkerLoadCustomIconList())
				}
			})
		}
	})
}

function placesMarkerDeleteAllCustomIcon() {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_CUSTOM_ICONS, function (e) {
		if (e) {
			$.ajax({
				type: "POST",
				url: "func/fn_places.php",
				data: {
					cmd: "delete_all_custom_icons"
				},
				success: function (e) {
					"OK" == e && (placesMarkerData.custom_icons_loaded = !1, placesMarkerLoadCustomIconList())
				}
			})
		}
	})
}

function placesMarkerSelectIcon(e) {
	if (placesMarkerData.marker_icon = e, 0 != placesMarkerData.edit_marker_layer) {
		map.hasLayer(placesMarkerData.edit_marker_layer) && map.removeLayer(placesMarkerData.edit_marker_layer);
		var t = placesMarkerData.edit_marker_layer.getLatLng();
		placesMarkerAddToMap(t.lat, t.lng, placesMarkerData.marker_icon)
	}
}

function placesMarkerPanTo(e) {
	try {
		var t = placesMarkerData.markers[e].data.lng,
			a = placesMarkerData.markers[e].data.lat;
		map.panTo({
			lat: a,
			lng: t
		})
	} catch (e) { }
}

function placesMarkerVisibleToggle(e) {
	var t = document.getElementById("marker_visible_" + e).checked;
	placesMarkerData.markers[e].visible = t, placesMarkerVisible(e, t)
}

function placesMarkerVisible(e, t) {
	var a = placesMarkerData.markers[e].marker_layer;
	1 == t ? "true" == placesMarkerData.markers[e].data.visible && mapLayers.places_markers.addLayer(a) : mapLayers.places_markers.removeLayer(a)
}

function markerGroupVisibleToggle(e) {
	var t = document.getElementById("marker_group_visible_" + e).checked;
	for (var a in placesMarkerData.markers) placesMarkerData.markers[a].data.group_id == e && (placesGroupData.groups[e].marker_visible = t, placesMarkerData.markers[a].visible = t, placesSetListCheckbox("marker_visible_" + a, t), placesMarkerVisible(a, t))
}

function placesMarkerVisibleAllToggle() {
	1 == gsValues.map_markers ? placesMarkerVisibleAll(!1) : placesMarkerVisibleAll(!0)
}

function placesMarkerVisibleAll(e) {
	if (gsValues.map_markers = e, 1 == e) {
		for (var t in placesGroupData.groups) placesGroupData.groups[t].marker_visible = !0, placesSetListCheckbox("marker_group_visible_" + t, !0);
		for (var t in placesMarkerData.markers) placesMarkerData.markers[t].visible = !0, placesSetListCheckbox("marker_visible_" + t, !0), placesMarkerVisible(t, !0)
	} else {
		for (var t in placesGroupData.groups) placesGroupData.groups[t].marker_visible = !1, placesSetListCheckbox("marker_group_visible_" + t, !1);
		for (var t in placesMarkerData.markers) placesMarkerData.markers[t].visible = !1, placesSetListCheckbox("marker_visible_" + t, !1);
		placesMarkerRemoveAllFromMap()
	}
}
placesMarkerData.markers = new Array, placesMarkerData.default_icons_loaded = !1, placesMarkerData.custom_icons_loaded = !1, placesMarkerData.marker_icon = "img/markers/places/pin-1.svg", placesMarkerData.new_marker_id = 1, placesMarkerData.edit_marker_id = !1, placesMarkerData.edit_marker_layer = !1;
var placesZoneData = new Array;

function placesZoneReload() {
	placesGroupLoadData(), placesZoneLoadData(), $("#side_panel_places_zone_list_grid").trigger("reloadGrid")
}

function placesZoneLoadData() {
	$.ajax({
		type: "POST",
		url: "func/fn_places.php",
		data: {
			cmd: "load_zone_data"
		},
		dataType: "json",
		cache: !1,
		success: function (e) {
			placesZoneData.zones = e, placesZoneInitLists(), placesZoneSetListCheckbox(), placesZoneSetListNumber(), "" != placesZoneData.zones ? placesZoneAddAllToMap() : placesZoneRemoveAllFromMap()
		}
	})
}

function placesZoneInitLists() {
	initSelectList("report_zone_list"), initSelectList("events_zone_list"), initSelectList("subaccounts_zone_list")
}

function placesZoneSetListNumber() {
	document.getElementById("side_panel_places_zones_num").innerHTML = "(" + Object.keys(placesZoneData.zones).length + ")"
}

function placesZoneSetListCheckbox() {
	for (var e in placesGroupData.groups) placesSetListCheckbox("zone_group_visible_" + e, placesGroupData.groups[e].zone_visible);
	for (var e in placesZoneData.zones) placesSetListCheckbox("zone_visible_" + e, placesZoneData.zones[e].visible)
}

function placesZoneAddAllToMap() {
	var e = document.getElementById("side_panel_places_zone_list_search").value;
	for (var t in placesZoneRemoveAllFromMap(), placesZoneData.zones) {
		var a = placesZoneData.zones[t];
		if (strMatches(a.data.name, e)) {
			var i = a.data.name,
				o = a.data.color,
				s = a.data.visible,
				n = a.data.name_visible,
				l = a.data.area,
				d = a.data.vertices;
			try {
				placesZoneAddZoneToMap(t, i, o, s, n, l, d)
			} catch (e) { }
		}
	}
}

function placesZoneAddZoneToMap(e, t, a, i, o, s, n) {
	var l = placesZoneVerticesStringToLatLngs(n),
		d = L.polygon(l, {
			color: a,
			fill: !0,
			fillColor: a,
			fillOpacity: .4,
			opacity: .8,
			weight: 3
		});
	"false" == o && (t = ""), "0" != s && (measure_area = getAreaFromLatLngs(d.getLatLngs()[0]), "1" == s && (measure_area *= 247105e-9, measure_area = Math.round(100 * measure_area) / 100, measure_area = measure_area + " " + la.UNIT_ACRE), "2" == s && (measure_area *= 1e-4, measure_area = Math.round(100 * measure_area) / 100, measure_area = measure_area + " " + la.UNIT_HECTARES), "3" == s && (measure_area = Math.round(100 * measure_area) / 100, measure_area = measure_area + " " + la.UNIT_SQ_M), "4" == s && (measure_area *= 1e-6, measure_area = Math.round(100 * measure_area) / 100, measure_area = measure_area + " " + la.UNIT_SQ_KM), "5" == s && (measure_area *= 10.7639, measure_area = Math.round(100 * measure_area) / 100, measure_area = measure_area + " " + la.UNIT_SQ_FT), "6" == s && (measure_area = 1e-6 * measure_area * .386102, measure_area = Math.round(100 * measure_area) / 100, measure_area = measure_area + " " + la.UNIT_SQ_MI), t = t + " (" + measure_area + ")");
	var r = d.getBounds().getCenter(),
		_ = L.tooltip({
			permanent: !0,
			direction: "center"
		});
	_.setLatLng(r), _.setContent(t), "false" != i && mapLayers.places_zones.addLayer(d), "false" == o && "0" == s || mapLayers.places_zones.addLayer(_), placesZoneData.zones[e].zone_layer = d, placesZoneData.zones[e].label_layer = _
}

function placesZoneRemoveAllFromMap() {
	mapLayers.places_zones.clearLayers()
}

function placesZoneSearchMap(e) {
	for (var t in placesZoneData.zones) {
		var a = placesZoneData.zones[t];
		strMatches(a.data.name, e) ? 1 == a.visible && placesZoneVisible(t, !0) : placesZoneVisible(t, !1)
	}
}

function placesZoneDeleteAll() {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (e) {
		if (e) {
			$.ajax({
				type: "POST",
				url: "func/fn_places.php",
				data: {
					cmd: "delete_all_zones"
				},
				success: function (e) {
					"OK" == e && (placesZoneLoadData(), $("#side_panel_places_zone_list_grid").trigger("reloadGrid"))
				}
			})
		}
	})
}

function placesZoneDelete(e) {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (placesZonePanTo(e), confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_zone",
				zone_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_places.php",
				data: a,
				success: function (t) {
					"OK" == t && (placesZoneVisible(e, !1), delete placesZoneData.zones[e], placesZoneSetListNumber(), placesZoneInitLists(), $("#side_panel_places_zone_list_grid").trigger("reloadGrid"))
				}
			})
		}
	}))
}

function placesZoneNew(e) {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (map.doubleClickZoom.disable(), gsValues.map_bussy = !0, document.getElementById("dialog_places_zone_name").value = la.NEW_ZONE + " " + placesZoneData.new_zone_id, document.getElementById("dialog_places_zone_group").value = 0, $("#dialog_places_zone_group").multipleSelect("refresh"), document.getElementById("dialog_places_zone_color").value = "FF0000", document.getElementById("dialog_places_zone_color").style.backgroundColor = "#FF0000", document.getElementById("dialog_places_zone_visible").checked = !0, document.getElementById("dialog_places_zone_name_visible").checked = !0, document.getElementById("dialog_places_zone_area").value = 0, $("#dialog_places_zone_area").multipleSelect("refresh"), $("#dialog_places_zone_properties").dialog("open"), null != e ? map.editTools.startPolygon(e) : map.editTools.startPolygon(), map.on("editable:drawing:end", function (e) {
		placesZoneData.edit_zone_layer = e.layer, placesZoneData.edit_zone_layer.getLatLngs()[0].length < 3 ? placesZoneProperties("cancel") : placesZoneData.edit_zone_layer.getLatLngs()[0].length > 80 ? notifyBox("error", la.ERROR, la.ZONE_CANT_HAVE_MORE_THAN_NUM_VERTICES) : map.off("editable:drawing:end")
	}))
}

function placesZoneLatLngsToVerticesString(e) {
	for (var t = [], a = 0; a < e.length; a++) {
		var i = e[a],
			o = i.lat,
			s = i.lng;
		t.push(parseFloat(o).toFixed(6) + "," + parseFloat(s).toFixed(6))
	}
	return t.push(t[0]), t.toString()
}

function placesZoneVerticesStringToLatLngs(e) {
	var t = e.split(","),
		a = [];
	for (j = 0; j < t.length; j += 2) lat = t[j], lng = t[j + 1], a.push(L.latLng(lat, lng));
	return a
}

function placesZoneProperties(e) {
	if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser")) switch (e) {
		default:
			if (1 == gsValues.map_bussy) return;
			map.doubleClickZoom.disable(), gsValues.map_bussy = !0;
			var t = e;
			placesZoneData.edit_zone_id = t, document.getElementById("dialog_places_zone_name").value = placesZoneData.zones[t].data.name, document.getElementById("dialog_places_zone_group").value = placesZoneData.zones[t].data.group_id, $("#dialog_places_zone_group").multipleSelect("refresh"), document.getElementById("dialog_places_zone_color").value = placesZoneData.zones[t].data.color.substr(1), document.getElementById("dialog_places_zone_color").style.backgroundColor = placesZoneData.zones[t].data.color, document.getElementById("dialog_places_zone_visible").checked = strToBoolean(placesZoneData.zones[t].data.visible), document.getElementById("dialog_places_zone_name_visible").checked = strToBoolean(placesZoneData.zones[t].data.name_visible), document.getElementById("dialog_places_zone_area").value = placesZoneData.zones[t].data.area, $("#dialog_places_zone_area").multipleSelect("refresh"), $("#dialog_places_zone_properties").dialog("open"), placesZoneVisible(placesZoneData.edit_zone_id, !1);
			var a = (o = placesZoneData.zones[placesZoneData.edit_zone_id]).data.color,
				i = placesZoneVerticesStringToLatLngs(o.data.vertices);
			placesZoneData.edit_zone_layer = L.polygon(i, {
				color: a,
				fill: !0,
				fillColor: a,
				fillOpacity: .4,
				opacity: .8,
				weight: 3
			}), map.addLayer(placesZoneData.edit_zone_layer), placesZoneFitBounds(t), setTimeout(function () {
				placesZoneData.edit_zone_layer.enableEdit()
			}, 200);
			break;
		case "cancel":
			map.editTools.stopDrawing(), map.off("editable:drawing:end"), map.hasLayer(placesZoneData.edit_zone_layer) && map.removeLayer(placesZoneData.edit_zone_layer);
			var o = placesZoneData.zones[placesZoneData.edit_zone_id];
			0 != placesZoneData.edit_zone_id && 1 == o.visible && placesZoneVisible(placesZoneData.edit_zone_id, !0), placesZoneData.edit_zone_layer = !1, placesZoneData.edit_zone_id = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable(), $("#dialog_places_zone_properties").dialog("close");
			break;
		case "save":
			var s = document.getElementById("dialog_places_zone_name").value,
				n = document.getElementById("dialog_places_zone_group").value,
				l = "#" + document.getElementById("dialog_places_zone_color").value,
				d = document.getElementById("dialog_places_zone_visible").checked,
				r = document.getElementById("dialog_places_zone_name_visible").checked,
				_ = document.getElementById("dialog_places_zone_area").value;
			if ("" == s) {
				notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
				break
			}
			if (!placesZoneData.edit_zone_layer) {
				notifyBox("error", la.ERROR, la.DRAW_ZONE_ON_MAP_BEFORE_SAVING);
				break
			}
			if (placesZoneData.edit_zone_layer.getLatLngs()[0].length < 3) {
				notifyBox("error", la.ERROR, la.DRAW_ZONE_ON_MAP_BEFORE_SAVING);
				break
			}
			if (placesZoneData.edit_zone_layer.getLatLngs()[0].length > 80) return void notifyBox("error", la.ERROR, la.ZONE_CANT_HAVE_MORE_THAN_NUM_VERTICES);
			var c = placesZoneLatLngsToVerticesString(placesZoneData.edit_zone_layer.getLatLngs()[0]);
			map.off("editable:drawing:end"), map.editTools.stopDrawing(), map.hasLayer(placesZoneData.edit_zone_layer) && map.removeLayer(placesZoneData.edit_zone_layer), 0 == placesZoneData.edit_zone_id && (placesZoneData.new_zone_id += 1);
			var g = {
				cmd: "save_zone",
				zone_id: placesZoneData.edit_zone_id,
				group_id: n,
				zone_name: s,
				zone_color: l,
				zone_visible: d,
				zone_name_visible: r,
				zone_area: _,
				zone_vertices: c
			};
			$.ajax({
				type: "POST",
				url: "func/fn_places.php",
				data: g,
				success: function (e) {
					placesZoneData.edit_zone_layer = !1, placesZoneData.edit_zone_id = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable(), $("#dialog_places_zone_properties").dialog("close"), "OK" == e ? (placesZoneLoadData(), $("#side_panel_places_zone_list_grid").trigger("reloadGrid")) : "ERROR_ZONE_LIMIT" == e && notifyBox("error", la.ERROR, la.ZONE_LIMIT_IS_REACHED)
				}
			})
	}
}

function placesZonePanTo(e) {
	try {
		var t = placesZoneData.zones[e].zone_layer.getBounds().getCenter();
		map.panTo(t)
	} catch (e) { }
}

function placesZoneFitBounds(e) {
	var t = placesZoneData.zones[e].zone_layer.getBounds();
	map.fitBounds(t)
}

function placesZoneVisibleToggle(e) {
	var t = document.getElementById("zone_visible_" + e).checked;
	placesZoneData.zones[e].visible = t, placesZoneVisible(e, t)
}

function placesZoneVisible(e, t) {
	var a = placesZoneData.zones[e].zone_layer,
		i = placesZoneData.zones[e].label_layer;
	1 == t ? ("true" == placesZoneData.zones[e].data.visible ? mapLayers.places_zones.addLayer(a) : mapLayers.places_zones.removeLayer(a), "true" == placesZoneData.zones[e].data.name_visible || "0" != placesZoneData.zones[e].data.area ? mapLayers.places_zones.addLayer(i) : mapLayers.places_zones.removeLayer(i)) : (mapLayers.places_zones.removeLayer(a), mapLayers.places_zones.removeLayer(i))
}

function zoneGroupVisibleToggle(e) {
	var t = document.getElementById("zone_group_visible_" + e).checked;
	for (var a in placesZoneData.zones) placesZoneData.zones[a].data.group_id == e && (placesGroupData.groups[e].zone_visible = t, placesZoneData.zones[a].visible = t, placesSetListCheckbox("zone_visible_" + a, t), placesZoneVisible(a, t))
}

function placesZoneVisibleAllToggle() {
	1 == gsValues.map_zones ? placesZoneVisibleAll(!1) : placesZoneVisibleAll(!0)
}

function placesZoneVisibleAll(e) {
	if (gsValues.map_zones = e, 1 == e) {
		for (var t in placesGroupData.groups) placesGroupData.groups[t].zone_visible = !0, placesSetListCheckbox("zone_group_visible_" + t, !0);
		for (var t in placesZoneData.zones) placesZoneData.zones[t].visible = !0, placesSetListCheckbox("zone_visible_" + t, !0), placesZoneVisible(t, !0)
	} else {
		for (var t in placesGroupData.groups) placesGroupData.groups[t].zone_visible = !1, placesSetListCheckbox("zone_group_visible_" + t, !1);
		for (var t in placesZoneData.zones) placesZoneData.zones[t].visible = !1, placesSetListCheckbox("zone_visible_" + t, !1);
		placesZoneRemoveAllFromMap()
	}
}
placesZoneData.zones = new Array, placesZoneData.new_zone_id = 1, placesZoneData.edit_zone_id = !1, placesZoneData.edit_zone_layer = !1;
var placesRouteData = new Array;

function placesRouteReload() {
	placesGroupLoadData(), placesRouteLoadData(), $("#side_panel_places_route_list_grid").trigger("reloadGrid")
}

function placesRouteLoadData() {
	$.ajax({
		type: "POST",
		url: "func/fn_places.php",
		data: {
			cmd: "load_route_data"
		},
		dataType: "json",
		cache: !1,
		success: function (e) {
			placesRouteData.routes = e, placesRouteInitLists(), placesRouteSetListCheckbox(), placesRouteSetListNumber(), "" != placesRouteData.routes ? placesRouteAddAllToMap() : placesRouteRemoveAllFromMap()
		}
	})
}

function placesRouteInitLists() {
	initSelectList("events_route_list"), initSelectList("subaccounts_route_list")
}

function placesRouteSetListNumber() {
	document.getElementById("side_panel_places_routes_num").innerHTML = "(" + Object.keys(placesRouteData.routes).length + ")"
}

function placesRouteSetListCheckbox() {
	for (var e in placesGroupData.groups) placesSetListCheckbox("route_group_visible_" + e, placesGroupData.groups[e].route_visible);
	for (var e in placesRouteData.routes) placesSetListCheckbox("route_visible_" + e, placesRouteData.routes[e].visible)
}

function placesRouteAddAllToMap() {
	var e = document.getElementById("side_panel_places_route_list_search").value;
	for (var t in placesRouteRemoveAllFromMap(), placesRouteData.routes) {
		var a = placesRouteData.routes[t];
		if (strMatches(a.data.name, e)) {
			var i = a.data.name,
				o = a.data.color,
				s = a.data.visible,
				n = a.data.name_visible,
				l = a.data.points;
			try {
				placesRouteAddRouteToMap(t, i, o, s, n, l)
			} catch (e) { }
		}
	}
}

function placesRouteAddRouteToMap(e, t, a, i, o, s) {
	var n = placesRoutePointsStringToLatLngs(s),
		l = L.polyline(n, {
			color: a,
			fill: !1,
			opacity: .8,
			weight: 3
		}),
		d = n[0],
		r = L.tooltip({
			permanent: !0,
			direction: "top"
		});
	r.setLatLng(d), r.setContent(t), "false" != i && mapLayers.places_routes.addLayer(l), "false" != o && mapLayers.places_routes.addLayer(r), placesRouteData.routes[e].route_layer = l, placesRouteData.routes[e].label_layer = r
}

function placesRouteRemoveAllFromMap() {
	mapLayers.places_routes.clearLayers()
}

function placesRouteSearchMap(e) {
	for (var t in placesRouteData.routes) {
		var a = placesRouteData.routes[t];
		strMatches(a.data.name, e) ? 1 == a.visible && placesRouteVisible(t, !0) : placesRouteVisible(t, !1)
	}
}

function placesRouteDeleteAll() {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_ROUTES, function (e) {
		if (e) {
			$.ajax({
				type: "POST",
				url: "func/fn_places.php",
				data: {
					cmd: "delete_all_routes"
				},
				success: function (e) {
					"OK" == e && (placesRouteLoadData(), $("#side_panel_places_route_list_grid").trigger("reloadGrid"))
				}
			})
		}
	})
}

function placesRouteDelete(e) {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (placesRoutePanTo(e), confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_route",
				route_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_places.php",
				data: a,
				success: function (t) {
					"OK" == t && (placesRouteVisible(e, !1), delete placesRouteData.routes[e], placesRouteSetListNumber(), placesRouteInitLists(), $("#side_panel_places_route_list_grid").trigger("reloadGrid"))
				}
			})
		}
	}))
}

function placesRouteSave(e) {
	if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy) {
		gsValues.map_bussy = !0, document.getElementById("side_panel_places_tab").click(), document.getElementById("side_panel_places_routes_tab").click(), document.getElementById("dialog_places_route_name").value = la.NEW_ROUTE + " " + placesRouteData.new_route_id, document.getElementById("dialog_places_route_group").value = 0, $("#dialog_places_route_group").multipleSelect("refresh"), document.getElementById("dialog_places_route_color").value = "FF0000", document.getElementById("dialog_places_route_color").style.backgroundColor = "#FF0000", document.getElementById("dialog_places_route_visible").checked = !0, document.getElementById("dialog_places_route_name_visible").checked = !0, document.getElementById("dialog_places_route_deviation").value = "0.5", $("#dialog_places_route_properties").dialog("open");
		placesRouteData.edit_route_layer = L.polyline(e, {
			color: "#FF0000",
			fill: !1,
			opacity: .8,
			weight: 3
		}), map.addLayer(placesRouteData.edit_route_layer), placesRouteData.edit_route_layer.enableEdit();
		var t = placesRouteData.edit_route_layer.getBounds();
		map.fitBounds(t)
	}
}

function placesRouteNew(e) {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (map.doubleClickZoom.disable(), gsValues.map_bussy = !0, document.getElementById("dialog_places_route_name").value = la.NEW_ROUTE + " " + placesRouteData.new_route_id, document.getElementById("dialog_places_route_group").value = 0, $("#dialog_places_route_group").multipleSelect("refresh"), document.getElementById("dialog_places_route_color").value = "FF0000", document.getElementById("dialog_places_route_color").style.backgroundColor = "#FF0000", document.getElementById("dialog_places_route_visible").checked = !0, document.getElementById("dialog_places_route_name_visible").checked = !0, document.getElementById("dialog_places_route_deviation").value = "0.5", $("#dialog_places_route_properties").dialog("open"), null != e ? (map.editTools.startPolyline(e), placesRouteData.edit_start_label_layer = L.tooltip({
		permanent: !0,
		offset: [10, 0],
		direction: "right"
	}), placesRouteData.edit_start_label_layer.setLatLng(e), placesRouteData.edit_start_label_layer.setContent(la.ROUTE_START), map.addLayer(placesRouteData.edit_start_label_layer)) : map.editTools.startPolyline(), map.on("editable:editing editable:drag", function (e) {
		placesRouteData.edit_route_layer = e.layer;
		var t = placesRouteData.edit_route_layer.getLatLngs(),
			a = t[0],
			i = t[t.length - 1];
		map.hasLayer(placesRouteData.edit_start_label_layer) ? placesRouteData.edit_start_label_layer.setLatLng(a) : (placesRouteData.edit_start_label_layer = L.tooltip({
			permanent: !0,
			offset: [10, 0],
			direction: "right"
		}), placesRouteData.edit_start_label_layer.setLatLng(i), placesRouteData.edit_start_label_layer.setContent(la.ROUTE_START), map.addLayer(placesRouteData.edit_start_label_layer)), t.length > 1 && (map.hasLayer(placesRouteData.edit_end_label_layer) ? placesRouteData.edit_end_label_layer.setLatLng(i) : (placesRouteData.edit_end_label_layer = L.tooltip({
			permanent: !0,
			offset: [10, 0],
			direction: "right"
		}), placesRouteData.edit_end_label_layer.setLatLng(i), placesRouteData.edit_end_label_layer.setContent(la.ROUTE_END), map.addLayer(placesRouteData.edit_end_label_layer)))
	}))
}

function placesRouteLatLngsToPointsString(e) {
	for (var t = [], a = 0; a < e.length; a++) {
		var i = e[a],
			o = i.lat,
			s = i.lng;
		t.push(parseFloat(o).toFixed(6) + "," + parseFloat(s).toFixed(6))
	}
	return t.toString()
}

function placesRoutePointsStringToLatLngs(e) {
	var t = e.split(","),
		a = [];
	for (j = 0; j < t.length; j += 2) lat = t[j], lng = t[j + 1], a.push(L.latLng(lat, lng));
	return a
}

function placesRouteProperties(e) {
	if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser")) switch (e) {
		default:
			if (1 == gsValues.map_bussy) return;
			map.doubleClickZoom.disable(), gsValues.map_bussy = !0;
			var t = e;
			placesRouteData.edit_route_id = t, document.getElementById("dialog_places_route_name").value = placesRouteData.routes[t].data.name, document.getElementById("dialog_places_route_group").value = placesRouteData.routes[t].data.group_id, $("#dialog_places_route_group").multipleSelect("refresh"), document.getElementById("dialog_places_route_color").value = placesRouteData.routes[t].data.color.substr(1), document.getElementById("dialog_places_route_color").style.backgroundColor = placesRouteData.routes[t].data.color, document.getElementById("dialog_places_route_visible").checked = strToBoolean(placesRouteData.routes[t].data.visible), document.getElementById("dialog_places_route_name_visible").checked = strToBoolean(placesRouteData.routes[t].data.name_visible), document.getElementById("dialog_places_route_deviation").value = placesRouteData.routes[t].data.deviation, $("#dialog_places_route_properties").dialog("open"), placesRouteVisible(placesRouteData.edit_route_id, !1);
			var a = (o = placesRouteData.routes[placesRouteData.edit_route_id]).data.color,
				i = placesRoutePointsStringToLatLngs(o.data.points);
			placesRouteData.edit_route_layer = L.polyline(i, {
				color: a,
				fill: !1,
				opacity: .8,
				weight: 3
			}), map.addLayer(placesRouteData.edit_route_layer), placesRouteFitBounds(t), setTimeout(function () {
				placesRouteData.edit_route_layer.enableEdit()
			}, 200);
			break;
		case "cancel":
			map.off("editable:editing editable:drag"), map.editTools.stopDrawing(), map.hasLayer(placesRouteData.edit_route_layer) && map.removeLayer(placesRouteData.edit_route_layer), map.hasLayer(placesRouteData.edit_start_label_layer) && map.removeLayer(placesRouteData.edit_start_label_layer), map.hasLayer(placesRouteData.edit_end_label_layer) && map.removeLayer(placesRouteData.edit_end_label_layer);
			var o = placesRouteData.routes[placesRouteData.edit_route_id];
			0 != placesRouteData.edit_route_id && 1 == o.visible && placesRouteVisible(placesRouteData.edit_route_id, !0), placesRouteData.edit_route_layer = !1, placesRouteData.edit_start_label_layer = !1, placesRouteData.edit_end_label_layer = !1, placesRouteData.edit_route_id = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable(), $("#dialog_places_route_properties").dialog("close");
			break;
		case "save":
			var s = document.getElementById("dialog_places_route_name").value,
				n = document.getElementById("dialog_places_route_group").value,
				l = "#" + document.getElementById("dialog_places_route_color").value,
				d = document.getElementById("dialog_places_route_visible").checked,
				r = document.getElementById("dialog_places_route_name_visible").checked,
				_ = document.getElementById("dialog_places_route_deviation").value;
			if ("" == s) {
				notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
				break
			}
			if (_ < 0 || "" == _) {
				notifyBox("error", la.ERROR, la.DEVIATION_CANT_BE_LESS_THAN_0);
				break
			}
			if (!placesRouteData.edit_route_layer) {
				notifyBox("error", la.ERROR, la.DRAW_ROUTE_ON_MAP_BEFORE_SAVING);
				break
			}
			if (placesRouteData.edit_route_layer.getLatLngs().length < 2) {
				notifyBox("error", la.ERROR, la.DRAW_ROUTE_ON_MAP_BEFORE_SAVING);
				break
			}
			if (placesRouteData.edit_route_layer.getLatLngs().length > 200) return void notifyBox("error", la.ERROR, la.ROUTE_CANT_HAVE_MORE_THAN_NUM_POINTS);
			i = placesRouteLatLngsToPointsString(placesRouteData.edit_route_layer.getLatLngs());
			map.off("editable:editing editable:drag"), map.editTools.stopDrawing(), map.hasLayer(placesRouteData.edit_route_layer) && map.removeLayer(placesRouteData.edit_route_layer), map.hasLayer(placesRouteData.edit_start_label_layer) && map.removeLayer(placesRouteData.edit_start_label_layer), map.hasLayer(placesRouteData.edit_end_label_layer) && map.removeLayer(placesRouteData.edit_end_label_layer), 0 == placesRouteData.edit_route_id && (placesRouteData.new_route_id += 1);
			var c = {
				cmd: "save_route",
				route_id: placesRouteData.edit_route_id,
				group_id: n,
				route_name: s,
				route_color: l,
				route_visible: d,
				route_name_visible: r,
				route_deviation: _,
				route_points: i
			};
			$.ajax({
				type: "POST",
				url: "func/fn_places.php",
				data: c,
				success: function (e) {
					placesRouteData.edit_route_layer = !1, placesRouteData.edit_start_label_layer = !1, placesRouteData.edit_end_label_layer = !1, placesRouteData.edit_route_id = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable(), $("#dialog_places_route_properties").dialog("close"), "OK" == e ? (placesRouteLoadData(), $("#side_panel_places_route_list_grid").trigger("reloadGrid")) : "ERROR_ROUTE_LIMIT" == e && notifyBox("error", la.ERROR, la.ROUTE_LIMIT_IS_REACHED)
				}
			})
	}
}

function placesRoutePanTo(e) {
	try {
		var t = placesRouteData.routes[e].route_layer.getBounds().getCenter();
		map.panTo(t)
	} catch (e) { }
}

function placesRouteFitBounds(e) {
	var t = placesRouteData.routes[e].route_layer.getBounds();
	map.fitBounds(t)
}

function placesRouteVisibleToggle(e) {
	var t = document.getElementById("route_visible_" + e).checked;
	placesRouteData.routes[e].visible = t, placesRouteVisible(e, t)
}

function placesRouteVisible(e, t) {
	var a = placesRouteData.routes[e].route_layer,
		i = placesRouteData.routes[e].label_layer;
	1 == t ? ("true" == placesRouteData.routes[e].data.visible ? mapLayers.places_routes.addLayer(a) : mapLayers.places_routes.removeLayer(a), "true" == placesRouteData.routes[e].data.name_visible ? mapLayers.places_routes.addLayer(i) : mapLayers.places_routes.removeLayer(i)) : (mapLayers.places_routes.removeLayer(a), mapLayers.places_routes.removeLayer(i))
}

function routeGroupVisibleToggle(e) {
	var t = document.getElementById("route_group_visible_" + e).checked;
	for (var a in placesRouteData.routes) placesRouteData.routes[a].data.group_id == e && (placesGroupData.groups[e].route_visible = t, placesRouteData.routes[a].visible = t, placesSetListCheckbox("route_visible_" + a, t), placesRouteVisible(a, t))
}

function placesRouteVisibleAllToggle() {
	1 == gsValues.map_routes ? placesRouteVisibleAll(!1) : placesRouteVisibleAll(!0)
}

function placesRouteVisibleAll(e) {
	if (gsValues.map_routes = e, 1 == e) {
		for (var t in placesGroupData.groups) placesGroupData.groups[t].route_visible = !0, placesSetListCheckbox("route_group_visible_" + t, !0);
		for (var t in placesRouteData.routes) placesRouteData.routes[t].visible = !0, placesSetListCheckbox("route_visible_" + t, !0), placesRouteVisible(t, !0)
	} else {
		for (var t in placesGroupData.groups) placesGroupData.groups[t].route_visible = !1, placesSetListCheckbox("route_group_visible_" + t, !1);
		for (var t in placesRouteData.routes) placesRouteData.routes[t].visible = !1, placesSetListCheckbox("route_visible_" + t, !1);
		placesRouteRemoveAllFromMap()
	}
}

function settingsEventPlaySound() {
	var e = document.getElementById("dialog_settings_event_notify_system_sound_file").value;
	new Audio("snd/" + e).play()
}

function settingsEventImport() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsEventImportEVTFile, !1), document.getElementById("load_file").click())
}

function settingsEventExport() {
	if (utilsCheckPrivileges("viewer")) {
		window.location = "func/fn_export.php?format=evt"
	}
}

function settingsEventImportEVTFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onload = function (e) {
		try {
			var t = $.parseJSON(e.target.result);
			if ("0.1v" == t.evt) {
				var a = t.events.length;
				if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
				confirmDialog(sprintf(la.EVENTS_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function (t) {
					if (t) {
						loadingData(!0);
						var a = {
							format: "evt",
							data: e.target.result
						};
						$.ajax({
							type: "POST",
							url: "func/fn_import.php",
							data: a,
							cache: !1,
							success: function (e) {
								loadingData(!1), "OK" == e && settingsReloadEvents()
							},
							error: function (e, t) {
								loadingData(!1)
							}
						})
					}
				})
			} else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		} catch (e) {
			notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		}
		document.getElementById("load_file").value = ""
	}, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsEventImportEVTFile, !1)
}

function settingsEventProperties(e) {
	switch (e) {
		default:
			var t = e;
			settingsEditData.event_id = t, document.getElementById("dialog_settings_event_name").value = settingsEventData[t].name, document.getElementById("dialog_settings_event_type").value = settingsEventData[t].type, $("#dialog_settings_event_type").multipleSelect("refresh"), document.getElementById("dialog_settings_event_active").checked = strToBoolean(settingsEventData[t].active), document.getElementById("dialog_settings_event_duration_from_last_event").checked = strToBoolean(settingsEventData[t].duration_from_last_event), document.getElementById("dialog_settings_event_duration_from_last_event_minutes").value = settingsEventData[t].duration_from_last_event_minutes;
			var a = settingsEventData[t].week_days.split(",");
			document.getElementById("dialog_settings_event_wd_sun").checked = strToBoolean(a[0]), document.getElementById("dialog_settings_event_wd_mon").checked = strToBoolean(a[1]), document.getElementById("dialog_settings_event_wd_tue").checked = strToBoolean(a[2]), document.getElementById("dialog_settings_event_wd_wed").checked = strToBoolean(a[3]), document.getElementById("dialog_settings_event_wd_thu").checked = strToBoolean(a[4]), document.getElementById("dialog_settings_event_wd_fri").checked = strToBoolean(a[5]), document.getElementById("dialog_settings_event_wd_sat").checked = strToBoolean(a[6]), null != (p = settingsEventData[t].day_time) ? (document.getElementById("dialog_settings_event_dt").checked = p.dt, document.getElementById("dialog_settings_event_dt_mon").checked = p.mon, document.getElementById("dialog_settings_event_dt_mon_from").value = p.mon_from, $("#dialog_settings_event_dt_mon_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_mon_to").value = p.mon_to, $("#dialog_settings_event_dt_mon_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_tue").checked = p.tue, document.getElementById("dialog_settings_event_dt_tue_from").value = p.tue_from, $("#dialog_settings_event_dt_tue_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_tue_to").value = p.tue_to, $("#dialog_settings_event_dt_tue_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_wed").checked = p.wed, document.getElementById("dialog_settings_event_dt_wed_from").value = p.wed_from, $("#dialog_settings_event_dt_wed_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_wed_to").value = p.wed_to, $("#dialog_settings_event_dt_wed_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_thu").checked = p.thu, document.getElementById("dialog_settings_event_dt_thu_from").value = p.thu_from, $("#dialog_settings_event_dt_thu_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_thu_to").value = p.thu_to, $("#dialog_settings_event_dt_thu_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_fri").checked = p.fri, document.getElementById("dialog_settings_event_dt_fri_from").value = p.fri_from, $("#dialog_settings_event_dt_fri_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_fri_to").value = p.fri_to, $("#dialog_settings_event_dt_fri_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sat").checked = p.sat, document.getElementById("dialog_settings_event_dt_sat_from").value = p.sat_from, $("#dialog_settings_event_dt_sat_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sat_to").value = p.sat_to, $("#dialog_settings_event_dt_sat_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sun").checked = p.sun, document.getElementById("dialog_settings_event_dt_sun_from").value = p.sun_from, $("#dialog_settings_event_dt_sun_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sun_to").value = p.sun_to, $("#dialog_settings_event_dt_sun_to").multipleSelect("refresh")) : settingsEventResetDayTime(), settingsEventSwitchDayTime();
			var i = document.getElementById("dialog_settings_event_object_list"),
				o = settingsEventData[t].imei.split(",");
			if (multiselectSetValues(i, o), $("#dialog_settings_event_object_list").multipleSelect("refresh"), "connno" == settingsEventData[t].type || "gpsno" == settingsEventData[t].type || "stopped" == settingsEventData[t].type || "moving" == settingsEventData[t].type || "engidle" == settingsEventData[t].type ? (document.getElementById("dialog_settings_event_time_period").disabled = !1, document.getElementById("dialog_settings_event_time_period").value = settingsEventData[t].checked_value) : (document.getElementById("dialog_settings_event_time_period").disabled = !0, document.getElementById("dialog_settings_event_time_period").value = ""), "overspeed" == settingsEventData[t].type || "underspeed" == settingsEventData[t].type ? (document.getElementById("dialog_settings_event_speed_limit").disabled = !1, document.getElementById("dialog_settings_event_speed_limit").value = settingsEventData[t].checked_value) : (document.getElementById("dialog_settings_event_speed_limit").disabled = !0, document.getElementById("dialog_settings_event_speed_limit").value = ""), "param" == settingsEventData[t].type || "sensor" == settingsEventData[t].type ? ($("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").unblock(), document.getElementById("dialog_settings_event_param_sensor_condition_src").disabled = !1, document.getElementById("dialog_settings_event_param_sensor_condition_cn").disabled = !1, document.getElementById("dialog_settings_event_param_sensor_condition_val").disabled = !1, document.getElementById("dialog_settings_event_param_sensor_condition_add").disabled = !1, "param" == settingsEventData[t].type ? settingsEventParamList() : "sensor" == settingsEventData[t].type && settingsEventSensorList(), settingsEditData.event_condition = settingsEventData[t].checked_value.slice(0), settingsEventConditionList()) : ($("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("dialog_settings_event_param_sensor_condition_src").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").disabled = !0, settingsEditData.event_condition = [], $("#settings_event_param_sensor_condition_list_grid").clearGridData(!0)), "proximity" == settingsEventData[t].type ? (document.getElementById("dialog_settings_event_distance").disabled = !1, document.getElementById("dialog_settings_event_distance").value = settingsEventData[t].checked_value) : (document.getElementById("dialog_settings_event_distance").disabled = !0, document.getElementById("dialog_settings_event_distance").value = ""), "zone_in" != settingsEventData[t].type && "zone_out" != settingsEventData[t].type) {
				"route_in" == settingsEventData[t].type || "route_out" == settingsEventData[t].type ? (document.getElementById("dialog_settings_event_route_trigger").value = "off", $("#dialog_settings_event_route_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_route_trigger").disabled = !0) : (document.getElementById("dialog_settings_event_route_trigger").value = settingsEventData[t].route_trigger, $("#dialog_settings_event_route_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_route_trigger").disabled = !1), document.getElementById("dialog_settings_event_routes").disabled = !1;
				var s = document.getElementById("dialog_settings_event_routes"),
					n = settingsEventData[t].routes.split(",");
				multiselectSetValues(s, n), $("#dialog_settings_event_routes").multipleSelect("refresh")
			} else document.getElementById("dialog_settings_event_route_trigger").value = "off", $("#dialog_settings_event_route_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_route_trigger").disabled = !0, document.getElementById("dialog_settings_event_routes").disabled = !0, $("#dialog_settings_event_routes option:selected").removeAttr("selected"), $("#dialog_settings_event_routes").multipleSelect("refresh");
			if ("route_in" != settingsEventData[t].type && "route_out" != settingsEventData[t].type) {
				"zone_in" == settingsEventData[t].type || "zone_out" == settingsEventData[t].type ? (document.getElementById("dialog_settings_event_zone_trigger").value = "off", $("#dialog_settings_event_zone_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_zone_trigger").disabled = !0) : (document.getElementById("dialog_settings_event_zone_trigger").value = settingsEventData[t].zone_trigger, $("#dialog_settings_event_zone_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_zone_trigger").disabled = !1), document.getElementById("dialog_settings_event_zones").disabled = !1;
				var l = document.getElementById("dialog_settings_event_zones"),
					d = settingsEventData[t].zones.split(",");
				multiselectSetValues(l, d), $("#dialog_settings_event_zones").multipleSelect("refresh")
			} else document.getElementById("dialog_settings_event_zone_trigger").value = "off", $("#dialog_settings_event_zone_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_zone_trigger").disabled = !0, document.getElementById("dialog_settings_event_zones").disabled = !0, $("#dialog_settings_event_zones").multipleSelect("refresh"), $("#dialog_settings_event_zones option:selected").removeAttr("selected");
			var r = settingsEventData[t].notify_system.split(",");
			document.getElementById("dialog_settings_event_notify_system").checked = strToBoolean(r[0]), document.getElementById("dialog_settings_event_notify_system_hide").checked = strToBoolean(r[1]), document.getElementById("dialog_settings_event_notify_system_sound").checked = strToBoolean(r[2]), null != r[3] && (document.getElementById("dialog_settings_event_notify_system_sound_file").value = r[3], $("#dialog_settings_event_notify_system_sound_file").multipleSelect("refresh")), document.getElementById("dialog_settings_event_notify_push").checked = strToBoolean(settingsEventData[t].notify_push), document.getElementById("dialog_settings_event_notify_email").checked = strToBoolean(settingsEventData[t].notify_email), document.getElementById("dialog_settings_event_notify_email_address").value = settingsEventData[t].notify_email_address, document.getElementById("dialog_settings_event_notify_sms").checked = strToBoolean(settingsEventData[t].notify_sms), document.getElementById("dialog_settings_event_notify_sms_number").value = settingsEventData[t].notify_sms_number, document.getElementById("dialog_settings_event_notify_email_template").value = settingsEventData[t].email_template_id, $("#dialog_settings_event_notify_email_template").multipleSelect("refresh"), document.getElementById("dialog_settings_event_notify_sms_template").value = settingsEventData[t].sms_template_id, $("#dialog_settings_event_notify_sms_template").multipleSelect("refresh"), document.getElementById("dialog_settings_event_notify_arrow").checked = strToBoolean(settingsEventData[t].notify_arrow), document.getElementById("dialog_settings_event_notify_arrow_color").value = settingsEventData[t].notify_arrow_color, $("#dialog_settings_event_notify_arrow_color").multipleSelect("refresh"), document.getElementById("dialog_settings_event_notify_ohc").checked = strToBoolean(settingsEventData[t].notify_ohc), document.getElementById("dialog_settings_event_notify_ohc_color").value = settingsEventData[t].notify_ohc_color, document.getElementById("dialog_settings_event_notify_ohc_color").value = settingsEventData[t].notify_ohc_color.substr(1), document.getElementById("dialog_settings_event_notify_ohc_color").style.backgroundColor = settingsEventData[t].notify_ohc_color, document.getElementById("dialog_settings_event_webhook_send").checked = strToBoolean(settingsEventData[t].webhook_send), document.getElementById("dialog_settings_event_webhook_url").value = settingsEventData[t].webhook_url, document.getElementById("dialog_settings_event_cmd_gateway").disabled = !1, document.getElementById("dialog_settings_event_cmd_type").disabled = !1, document.getElementById("dialog_settings_event_cmd_send").checked = strToBoolean(settingsEventData[t].cmd_send), document.getElementById("dialog_settings_event_cmd_template_list").value = "", $("#dialog_settings_event_cmd_template_list").multipleSelect("refresh"), document.getElementById("dialog_settings_event_cmd_gateway").value = settingsEventData[t].cmd_gateway, $("#dialog_settings_event_cmd_gateway").multipleSelect("refresh"), document.getElementById("dialog_settings_event_cmd_type").value = settingsEventData[t].cmd_type, $("#dialog_settings_event_cmd_type").multipleSelect("refresh"), document.getElementById("dialog_settings_event_cmd_string").value = settingsEventData[t].cmd_string, $("#dialog_settings_event_properties").dialog("open");
			break;
		case "add":
			settingsEditData.event_id = !1, document.getElementById("dialog_settings_event_name").value = "", document.getElementById("dialog_settings_event_type").value = "sos", $("#dialog_settings_event_type").multipleSelect("refresh"), document.getElementById("dialog_settings_event_active").checked = !0, document.getElementById("dialog_settings_event_duration_from_last_event").checked = !1, document.getElementById("dialog_settings_event_duration_from_last_event_minutes").value = 0, document.getElementById("dialog_settings_event_wd_mon").checked = !0, document.getElementById("dialog_settings_event_wd_tue").checked = !0, document.getElementById("dialog_settings_event_wd_wed").checked = !0, document.getElementById("dialog_settings_event_wd_thu").checked = !0, document.getElementById("dialog_settings_event_wd_fri").checked = !0, document.getElementById("dialog_settings_event_wd_sat").checked = !0, document.getElementById("dialog_settings_event_wd_sun").checked = !0, $("#dialog_settings_event_object_list option:selected").removeAttr("selected"), $("#dialog_settings_event_object_list").multipleSelect("refresh"), document.getElementById("dialog_settings_event_time_period").value = "", document.getElementById("dialog_settings_event_speed_limit").value = "", document.getElementById("dialog_settings_event_distance").value = "", document.getElementById("dialog_settings_event_param_sensor_condition_src").value = "", $("#dialog_settings_event_param_sensor_condition_src").multipleSelect("refresh"), document.getElementById("dialog_settings_event_param_sensor_condition_cn").value = "", $("#dialog_settings_event_param_sensor_condition_cn").multipleSelect("refresh"), document.getElementById("dialog_settings_event_param_sensor_condition_val").value = "", document.getElementById("dialog_settings_event_notify_system").checked = !1, document.getElementById("dialog_settings_event_notify_system_hide").checked = !1, document.getElementById("dialog_settings_event_notify_system_sound").checked = !1, document.getElementById("dialog_settings_event_notify_push").checked = !1, document.getElementById("dialog_settings_event_notify_email").checked = !1, document.getElementById("dialog_settings_event_notify_email_address").value = "", document.getElementById("dialog_settings_event_notify_sms").checked = !1, document.getElementById("dialog_settings_event_notify_sms_number").value = "", document.getElementById("dialog_settings_event_notify_email_template").value = 0, $("#dialog_settings_event_notify_email_template").multipleSelect("refresh"), document.getElementById("dialog_settings_event_notify_sms_template").value = 0, $("#dialog_settings_event_notify_sms_template").multipleSelect("refresh"), document.getElementById("dialog_settings_event_notify_arrow").checked = !1, document.getElementById("dialog_settings_event_notify_arrow_color").value = "arrow_yellow", $("#dialog_settings_event_notify_arrow_color").multipleSelect("refresh"), document.getElementById("dialog_settings_event_notify_ohc").checked = !1, document.getElementById("dialog_settings_event_notify_ohc_color").value = "FFFF00", document.getElementById("dialog_settings_event_notify_ohc_color").style.backgroundColor = "#FFFF00", document.getElementById("dialog_settings_event_webhook_send").checked = !1, document.getElementById("dialog_settings_event_webhook_url").value = "", document.getElementById("dialog_settings_event_cmd_gateway").disabled = !1, document.getElementById("dialog_settings_event_cmd_type").disabled = !1, document.getElementById("dialog_settings_event_cmd_send").checked = !1, document.getElementById("dialog_settings_event_cmd_template_list").value = "", $("#dialog_settings_event_cmd_template_list").multipleSelect("refresh"), document.getElementById("dialog_settings_event_cmd_gateway").value = "gprs", $("#dialog_settings_event_cmd_gateway").multipleSelect("refresh"), document.getElementById("dialog_settings_event_cmd_type").value = "ascii", $("#dialog_settings_event_cmd_type").multipleSelect("refresh"), document.getElementById("dialog_settings_event_cmd_string").value = "", settingsEventSwitchType(), settingsEventResetDayTime(), settingsEventSwitchDayTime(), $("#dialog_settings_event_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_settings_event_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var _ = document.getElementById("dialog_settings_event_type").value,
				c = document.getElementById("dialog_settings_event_name").value,
				g = document.getElementById("dialog_settings_event_active").checked,
				m = document.getElementById("dialog_settings_event_duration_from_last_event").checked,
				u = document.getElementById("dialog_settings_event_duration_from_last_event_minutes").value;
			a = String(document.getElementById("dialog_settings_event_wd_sun").checked) + ",";
			a += String(document.getElementById("dialog_settings_event_wd_mon").checked) + ",", a += String(document.getElementById("dialog_settings_event_wd_tue").checked) + ",", a += String(document.getElementById("dialog_settings_event_wd_wed").checked) + ",", a += String(document.getElementById("dialog_settings_event_wd_thu").checked) + ",", a += String(document.getElementById("dialog_settings_event_wd_fri").checked) + ",", a += String(document.getElementById("dialog_settings_event_wd_sat").checked);
			var p = {
				dt: document.getElementById("dialog_settings_event_dt").checked,
				mon: document.getElementById("dialog_settings_event_dt_mon").checked,
				mon_from: document.getElementById("dialog_settings_event_dt_mon_from").value,
				mon_to: document.getElementById("dialog_settings_event_dt_mon_to").value,
				tue: document.getElementById("dialog_settings_event_dt_tue").checked,
				tue_from: document.getElementById("dialog_settings_event_dt_tue_from").value,
				tue_to: document.getElementById("dialog_settings_event_dt_tue_to").value,
				wed: document.getElementById("dialog_settings_event_dt_wed").checked,
				wed_from: document.getElementById("dialog_settings_event_dt_wed_from").value,
				wed_to: document.getElementById("dialog_settings_event_dt_wed_to").value,
				thu: document.getElementById("dialog_settings_event_dt_thu").checked,
				thu_from: document.getElementById("dialog_settings_event_dt_thu_from").value,
				thu_to: document.getElementById("dialog_settings_event_dt_thu_to").value,
				fri: document.getElementById("dialog_settings_event_dt_fri").checked,
				fri_from: document.getElementById("dialog_settings_event_dt_fri_from").value,
				fri_to: document.getElementById("dialog_settings_event_dt_fri_to").value,
				sat: document.getElementById("dialog_settings_event_dt_sat").checked,
				sat_from: document.getElementById("dialog_settings_event_dt_sat_from").value,
				sat_to: document.getElementById("dialog_settings_event_dt_sat_to").value,
				sun: document.getElementById("dialog_settings_event_dt_sun").checked,
				sun_from: document.getElementById("dialog_settings_event_dt_sun_from").value,
				sun_to: document.getElementById("dialog_settings_event_dt_sun_to").value
			};
			if (p = JSON.stringify(p), "" == c) {
				notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
				break
			}
			i = document.getElementById("dialog_settings_event_object_list");
			if ("proximity" == _) {
				for (var y = 0, h = 0; h < i.options.length; h++) i.options[h].selected && y++;
				if (2 !== y) {
					notifyBox("error", la.ERROR, la.TWO_OBJECTS_SELECTED);
					break
				}
			} else if (!multiselectIsSelected(i)) {
				notifyBox("error", la.ERROR, la.AT_LEAST_ONE_OBJECT_SELECTED);
				break
			}
			if (imei = multiselectGetValues(i), "sos" == _ || "bracon" == _ || "bracoff" == _ || "dismount" == _ || "disassem" == _ || "door" == _ || "mandown" == _ || "shock" == _ || "tow" == _ || "pwrcut" == _ || "gpsantcut" == _ || "jamming" == _ || "lowdc" == _ || "lowbat" == _ || "connyes" == _ || "gpsyes" == _ || "haccel" == _ || "hbrake" == _ || "hcorn" == _ || "driverch" == _ || "trailerch" == _ || "service" == _ || "dtc" == _ || "route_in" == _ || "route_out" == _ || "zone_in" == _ || "zone_out" == _) var v = "";
			if ("connno" == _) {
				if ("" == (v = document.getElementById("dialog_settings_event_time_period").value)) {
					notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
					break
				}
				v < 5 && (v = 5)
			}
			if ("gpsno" == _) {
				if ("" == (v = document.getElementById("dialog_settings_event_time_period").value)) {
					notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
					break
				}
				v < 5 && (v = 5)
			}
			if ("stopped" == _ || "moving" == _ || "engidle" == _) {
				if ("" == (v = document.getElementById("dialog_settings_event_time_period").value)) {
					notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
					break
				}
				v < 1 && (v = 1)
			}
			if ("overspeed" == _ || "underspeed" == _)
				if ("" == (v = document.getElementById("dialog_settings_event_speed_limit").value)) {
					notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
					break
				} if ("param" == _ || "sensor" == _) {
					var b = settingsEditData.event_condition;
					if (0 == b.length) {
						notifyBox("error", la.ERROR, la.AT_LEAST_ONE_CONDITION);
						break
					}
					var v = JSON.stringify(b)
				}
			if ("proximity" == _)
				if ("" == (v = document.getElementById("dialog_settings_event_distance").value)) {
					notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
					break
				} var E = "";
			s = "";
			if ("route_in" != _ || "route_out" != _) {
				var f = document.getElementById("dialog_settings_event_routes");
				if ("route_in" == _ || "route_out" == _) {
					if (E = "off", !multiselectIsSelected(f)) {
						notifyBox("error", la.ERROR, la.AT_LEAST_ONE_ROUTE_SELECTED);
						break
					}
				} else E = document.getElementById("dialog_settings_event_route_trigger").value;
				s = multiselectGetValues(f)
			}
			var I = "";
			l = "";
			if ("route_in" != _ && "route_out" != _) {
				var B = document.getElementById("dialog_settings_event_zones");
				if ("zone_in" == _ || "zone_out" == _) {
					if (I = "off", !multiselectIsSelected(B)) {
						notifyBox("error", la.ERROR, la.AT_LEAST_ONE_ZONE_SELECTED);
						break
					}
				} else I = document.getElementById("dialog_settings_event_zone_trigger").value;
				l = multiselectGetValues(B)
			}
			r = (r = document.getElementById("dialog_settings_event_notify_system").checked) + "," + document.getElementById("dialog_settings_event_notify_system_hide").checked + "," + document.getElementById("dialog_settings_event_notify_system_sound").checked + "," + document.getElementById("dialog_settings_event_notify_system_sound_file").value;
			var D = document.getElementById("dialog_settings_event_notify_push").checked,
				O = document.getElementById("dialog_settings_event_notify_email").checked,
				k = document.getElementById("dialog_settings_event_notify_email_address").value;
			if (O) {
				var j = k.split(",");
				for (h = 0; h < j.length; h++)
					if (j[h] = j[h].trim(), !isEmailValid(j[h])) return notifyBox("error", la.ERROR, la.THIS_EMAIL_IS_NOT_VALID), !1
			}
			var T = document.getElementById("dialog_settings_event_notify_sms").checked,
				R = document.getElementById("dialog_settings_event_notify_sms_number").value;
			if (T && "" == R) {
				notifyBox("error", la.ERROR, la.PHONE_CANT_BE_EMPTY);
				break
			}
			var S = document.getElementById("dialog_settings_event_notify_email_template").value,
				w = document.getElementById("dialog_settings_event_notify_sms_template").value,
				L = document.getElementById("dialog_settings_event_notify_arrow").checked,
				A = document.getElementById("dialog_settings_event_notify_arrow_color").value,
				x = document.getElementById("dialog_settings_event_notify_ohc").checked,
				N = "#" + document.getElementById("dialog_settings_event_notify_ohc_color").value,
				C = document.getElementById("dialog_settings_event_webhook_send").checked,
				M = document.getElementById("dialog_settings_event_webhook_url").value,
				P = document.getElementById("dialog_settings_event_cmd_send").checked,
				U = document.getElementById("dialog_settings_event_cmd_gateway").value,
				G = document.getElementById("dialog_settings_event_cmd_type").value,
				V = document.getElementById("dialog_settings_event_cmd_string").value;
			if (1 == P) {
				if ("" == V) return notifyBox("error", la.ERROR, la.COMMAND_CANT_BE_EMPTY, !0), !1;
				if ("hex" == G && (V = V.toUpperCase(), !isHexValid(V.replace("%IMEI%", "")))) return notifyBox("error", la.ERROR, la.COMMAND_HEX_NOT_VALID, !0), !1
			}
			var H = {
				cmd: "save_event",
				event_id: settingsEditData.event_id,
				type: _,
				name: c,
				active: g,
				duration_from_last_event: m,
				duration_from_last_event_minutes: u,
				week_days: a,
				day_time: p,
				imei: imei,
				checked_value: v,
				route_trigger: E,
				zone_trigger: I,
				routes: s,
				zones: l,
				notify_system: r,
				notify_push: D,
				notify_email: O,
				notify_email_address: k,
				notify_sms: T,
				notify_sms_number: R,
				email_template_id: S,
				sms_template_id: w,
				notify_arrow: L,
				notify_arrow_color: A,
				notify_ohc: x,
				notify_ohc_color: N,
				webhook_send: C,
				webhook_url: M,
				cmd_send: P,
				cmd_gateway: U,
				cmd_type: G,
				cmd_string: V
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.events.php",
				data: H,
				cache: !1,
				success: function (e) {
					"OK" == e && (settingsReloadEvents(), $("#dialog_settings_event_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function settingsEventDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_event",
				event_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.events.php",
				data: a,
				success: function (e) {
					"OK" == e && settingsReloadEvents()
				}
			})
		}
	})
}

function settingsEventDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#settings_main_events_event_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_events",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.events.php",
					data: a,
					success: function (e) {
						"OK" == e && settingsReloadEvents()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function settingsEventConditionList() {
	var e = settingsEditData.event_condition,
		t = [],
		a = $("#settings_event_param_sensor_condition_list_grid");
	if (a.clearGridData(!0), 0 != e.length) {
		for (var i = 0; i < e.length; i++) {
			var o = '<a href="#" onclick="settingsEventConditionDel(' + i + ');" title="' + la.DELETE + '"><img src="theme/images/remove3.svg" /></a>';
			t.push({
				src: e[i].src,
				cn: e[i].cn,
				val: e[i].val,
				modify: o
			})
		}
		for (i = 0; i < t.length; i++) a.jqGrid("addRowData", i, t[i]);
		a.setGridParam({
			sortname: "src",
			sortorder: "asc"
		}).trigger("reloadGrid")
	}
}

function settingsEventConditionAdd() {
	var e = document.getElementById("dialog_settings_event_param_sensor_condition_src").value,
		t = document.getElementById("dialog_settings_event_param_sensor_condition_cn").value,
		a = document.getElementById("dialog_settings_event_param_sensor_condition_val").value;
	if ("" != e && "" != t && "" != a) {
		for (var i = 0; i < settingsEditData.event_condition.length; i++)
			if (settingsEditData.event_condition[i].src == e) return void notifyBox("error", la.ERROR, la.SAME_SOURCE_ITEM_AVAILABLE);
		settingsEditData.event_condition.push({
			src: e,
			cn: t,
			val: a
		}), document.getElementById("dialog_settings_event_param_sensor_condition_src").value = "", $("#dialog_settings_event_param_sensor_condition_src").multipleSelect("refresh"), document.getElementById("dialog_settings_event_param_sensor_condition_cn").value = "", $("#dialog_settings_event_param_sensor_condition_cn").multipleSelect("refresh"), document.getElementById("dialog_settings_event_param_sensor_condition_val").value = "", settingsEventConditionList()
	} else notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT)
}

function settingsEventConditionDel(e) {
	settingsEditData.event_condition.splice(e, 1), settingsEventConditionList()
}

function settingsEventParamList() {
	var e = document.getElementById("dialog_settings_event_param_sensor_condition_src");
	e.options.length = 0, e.options.add(new Option("", "")), e.options.add(new Option(la.SPEED.toLowerCase(), "speed"));
	for (var t = getAllParamsArray(), a = 0; a < t.length; a++) e.options.add(new Option(t[a], t[a]));
	sortSelectList(e)
}

function settingsEventSensorList() {
	var e = document.getElementById("dialog_settings_event_param_sensor_condition_src");
	e.options.length = 0;
	var t = getAllSensorsArray();
	e.options.add(new Option("", "")), e.options.add(new Option(la.SPEED, "speed"));
	for (var a = 0; a < t.length; a++) e.options.add(new Option(t[a], t[a]));
	sortSelectList(e)
}

function settingsEventSwitchType() {
	switch (document.getElementById("dialog_settings_event_time_period").value = "", document.getElementById("dialog_settings_event_speed_limit").value = "", document.getElementById("dialog_settings_event_distance").value = "", $("#dialog_settings_event_routes option:selected").removeAttr("selected"), $("#dialog_settings_event_routes").multipleSelect("refresh"), $("#dialog_settings_event_zones option:selected").removeAttr("selected"), $("#dialog_settings_event_zones").multipleSelect("refresh"), document.getElementById("dialog_settings_event_route_trigger").value = "off", $("#dialog_settings_event_route_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_zone_trigger").value = "off", $("#dialog_settings_event_zone_trigger").multipleSelect("refresh"), settingsEditData.event_condition = [], $("#settings_event_param_sensor_condition_list_grid").clearGridData(!0), document.getElementById("dialog_settings_event_type").value) {
		case "sos":
		case "bracon":
		case "bracoff":
		case "dismount":
		case "disassem":
		case "door":
		case "mandown":
		case "shock":
		case "tow":
		case "pwrcut":
		case "gpsantcut":
		case "jamming":
		case "lowdc":
		case "lowbat":
		case "connyes":
		case "gpsyes":
		case "haccel":
		case "hbrake":
		case "hcorn":
		case "driverch":
		case "trailerch":
		case "service":
		case "dtc":
			document.getElementById("dialog_settings_event_time_period").disabled = !0, document.getElementById("dialog_settings_event_speed_limit").disabled = !0, document.getElementById("dialog_settings_event_distance").disabled = !0, $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("dialog_settings_event_param_sensor_condition_src").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").disabled = !0, document.getElementById("dialog_settings_event_route_trigger").disabled = !1, document.getElementById("dialog_settings_event_zone_trigger").disabled = !1, document.getElementById("dialog_settings_event_routes").disabled = !1, document.getElementById("dialog_settings_event_zones").disabled = !1;
			break;
		case "connno":
		case "gpsno":
			document.getElementById("dialog_settings_event_time_period").disabled = !1, document.getElementById("dialog_settings_event_speed_limit").disabled = !0, document.getElementById("dialog_settings_event_distance").disabled = !0, "" == document.getElementById("dialog_settings_event_time_period").value && (document.getElementById("dialog_settings_event_time_period").value = 60), $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("dialog_settings_event_param_sensor_condition_src").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").disabled = !0, document.getElementById("dialog_settings_event_route_trigger").disabled = !1, document.getElementById("dialog_settings_event_zone_trigger").disabled = !1, document.getElementById("dialog_settings_event_routes").disabled = !1, document.getElementById("dialog_settings_event_zones").disabled = !1;
			break;
		case "stopped":
		case "moving":
		case "engidle":
			document.getElementById("dialog_settings_event_time_period").disabled = !1, document.getElementById("dialog_settings_event_speed_limit").disabled = !0, document.getElementById("dialog_settings_event_distance").disabled = !0, "" == document.getElementById("dialog_settings_event_time_period").value && (document.getElementById("dialog_settings_event_time_period").value = 5), $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("dialog_settings_event_param_sensor_condition_src").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").disabled = !0, document.getElementById("dialog_settings_event_route_trigger").disabled = !1, document.getElementById("dialog_settings_event_zone_trigger").disabled = !1, document.getElementById("dialog_settings_event_routes").disabled = !1, document.getElementById("dialog_settings_event_zones").disabled = !1;
			break;
		case "overspeed":
		case "underspeed":
			document.getElementById("dialog_settings_event_time_period").disabled = !0, document.getElementById("dialog_settings_event_speed_limit").disabled = !1, document.getElementById("dialog_settings_event_distance").disabled = !0, "" == document.getElementById("dialog_settings_event_speed_limit").value && (document.getElementById("dialog_settings_event_speed_limit").value = 60), $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("dialog_settings_event_param_sensor_condition_src").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").disabled = !0, document.getElementById("dialog_settings_event_route_trigger").disabled = !1, document.getElementById("dialog_settings_event_zone_trigger").disabled = !1, document.getElementById("dialog_settings_event_routes").disabled = !1, document.getElementById("dialog_settings_event_zones").disabled = !1;
			break;
		case "param":
			document.getElementById("dialog_settings_event_time_period").disabled = !0, document.getElementById("dialog_settings_event_speed_limit").disabled = !0, document.getElementById("dialog_settings_event_distance").disabled = !0, $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").unblock(), document.getElementById("dialog_settings_event_param_sensor_condition_src").disabled = !1, document.getElementById("dialog_settings_event_param_sensor_condition_cn").disabled = !1, document.getElementById("dialog_settings_event_param_sensor_condition_val").disabled = !1, document.getElementById("dialog_settings_event_param_sensor_condition_add").disabled = !1, settingsEventParamList(), document.getElementById("dialog_settings_event_route_trigger").disabled = !1, document.getElementById("dialog_settings_event_zone_trigger").disabled = !1, document.getElementById("dialog_settings_event_routes").disabled = !1, document.getElementById("dialog_settings_event_zones").disabled = !1;
			break;
		case "sensor":
			document.getElementById("dialog_settings_event_time_period").disabled = !0, document.getElementById("dialog_settings_event_speed_limit").disabled = !0, document.getElementById("dialog_settings_event_distance").disabled = !0, $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").unblock(), document.getElementById("dialog_settings_event_param_sensor_condition_src").disabled = !1, document.getElementById("dialog_settings_event_param_sensor_condition_cn").disabled = !1, document.getElementById("dialog_settings_event_param_sensor_condition_val").disabled = !1, document.getElementById("dialog_settings_event_param_sensor_condition_add").disabled = !1, settingsEventSensorList(), document.getElementById("dialog_settings_event_route_trigger").disabled = !1, document.getElementById("dialog_settings_event_zone_trigger").disabled = !1, document.getElementById("dialog_settings_event_routes").disabled = !1, document.getElementById("dialog_settings_event_zones").disabled = !1;
			break;
		case "proximity":
			document.getElementById("dialog_settings_event_time_period").disabled = !0, document.getElementById("dialog_settings_event_speed_limit").disabled = !0, document.getElementById("dialog_settings_event_distance").disabled = !1, "" == document.getElementById("dialog_settings_event_distance").value && (document.getElementById("dialog_settings_event_distance").value = .1), $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("dialog_settings_event_param_sensor_condition_src").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").disabled = !0, document.getElementById("dialog_settings_event_route_trigger").disabled = !1, document.getElementById("dialog_settings_event_zone_trigger").disabled = !1, document.getElementById("dialog_settings_event_routes").disabled = !1, document.getElementById("dialog_settings_event_zones").disabled = !1;
			break;
		case "route_in":
		case "route_out":
			document.getElementById("dialog_settings_event_time_period").disabled = !0, document.getElementById("dialog_settings_event_speed_limit").disabled = !0, document.getElementById("dialog_settings_event_distance").disabled = !0, $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("dialog_settings_event_param_sensor_condition_src").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").disabled = !0, document.getElementById("dialog_settings_event_route_trigger").disabled = !0, document.getElementById("dialog_settings_event_zone_trigger").disabled = !0, document.getElementById("dialog_settings_event_routes").disabled = !1, document.getElementById("dialog_settings_event_zones").disabled = !0;
			break;
		case "zone_in":
		case "zone_out":
			document.getElementById("dialog_settings_event_time_period").disabled = !0, document.getElementById("dialog_settings_event_speed_limit").disabled = !0, document.getElementById("dialog_settings_event_distance").disabled = !0, $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("dialog_settings_event_param_sensor_condition_src").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").disabled = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").disabled = !0, document.getElementById("dialog_settings_event_route_trigger").disabled = !0, document.getElementById("dialog_settings_event_zone_trigger").disabled = !0, document.getElementById("dialog_settings_event_routes").disabled = !0, document.getElementById("dialog_settings_event_zones").disabled = !1
	}
}

function settingsEventResetDayTime() {
	document.getElementById("dialog_settings_event_dt").checked = !1, document.getElementById("dialog_settings_event_dt_mon").checked = !1, document.getElementById("dialog_settings_event_dt_mon_from").value = "00:00", $("#dialog_settings_event_dt_mon_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_mon_to").value = "24:00", $("#dialog_settings_event_dt_mon_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_tue").checked = !1, document.getElementById("dialog_settings_event_dt_tue_from").value = "00:00", $("#dialog_settings_event_dt_tue_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_tue_to").value = "24:00", $("#dialog_settings_event_dt_tue_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_wed").checked = !1, document.getElementById("dialog_settings_event_dt_wed_from").value = "00:00", $("#dialog_settings_event_dt_wed_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_wed_to").value = "24:00", $("#dialog_settings_event_dt_wed_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_thu").checked = !1, document.getElementById("dialog_settings_event_dt_thu_from").value = "00:00", $("#dialog_settings_event_dt_thu_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_thu_to").value = "24:00", $("#dialog_settings_event_dt_thu_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_fri").checked = !1, document.getElementById("dialog_settings_event_dt_fri_from").value = "00:00", $("#dialog_settings_event_dt_fri_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_fri_to").value = "24:00", $("#dialog_settings_event_dt_fri_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sat").checked = !1, document.getElementById("dialog_settings_event_dt_sat_from").value = "00:00", $("#dialog_settings_event_dt_sat_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sat_to").value = "24:00", $("#dialog_settings_event_dt_sat_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sun").checked = !1, document.getElementById("dialog_settings_event_dt_sun_from").value = "00:00", $("#dialog_settings_event_dt_sun_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sun_to").value = "24:00", $("#dialog_settings_event_dt_sun_to").multipleSelect("refresh")
}

function settingsEventSwitchDayTime() {
	0 == document.getElementById("dialog_settings_event_dt").checked ? (document.getElementById("dialog_settings_event_dt_mon").disabled = !0, document.getElementById("dialog_settings_event_dt_mon_from").disabled = !0, document.getElementById("dialog_settings_event_dt_mon_to").disabled = !0, document.getElementById("dialog_settings_event_dt_tue").disabled = !0, document.getElementById("dialog_settings_event_dt_tue_from").disabled = !0, document.getElementById("dialog_settings_event_dt_tue_to").disabled = !0, document.getElementById("dialog_settings_event_dt_wed").disabled = !0, document.getElementById("dialog_settings_event_dt_wed_from").disabled = !0, document.getElementById("dialog_settings_event_dt_wed_to").disabled = !0, document.getElementById("dialog_settings_event_dt_thu").disabled = !0, document.getElementById("dialog_settings_event_dt_thu_from").disabled = !0, document.getElementById("dialog_settings_event_dt_thu_to").disabled = !0, document.getElementById("dialog_settings_event_dt_fri").disabled = !0, document.getElementById("dialog_settings_event_dt_fri_from").disabled = !0, document.getElementById("dialog_settings_event_dt_fri_to").disabled = !0, document.getElementById("dialog_settings_event_dt_sat").disabled = !0, document.getElementById("dialog_settings_event_dt_sat_from").disabled = !0, document.getElementById("dialog_settings_event_dt_sat_to").disabled = !0, document.getElementById("dialog_settings_event_dt_sun").disabled = !0, document.getElementById("dialog_settings_event_dt_sun_from").disabled = !0, document.getElementById("dialog_settings_event_dt_sun_to").disabled = !0) : (document.getElementById("dialog_settings_event_dt_mon").disabled = !1, document.getElementById("dialog_settings_event_dt_mon_from").disabled = !1, document.getElementById("dialog_settings_event_dt_mon_to").disabled = !1, document.getElementById("dialog_settings_event_dt_tue").disabled = !1, document.getElementById("dialog_settings_event_dt_tue_from").disabled = !1, document.getElementById("dialog_settings_event_dt_tue_to").disabled = !1, document.getElementById("dialog_settings_event_dt_wed").disabled = !1, document.getElementById("dialog_settings_event_dt_wed_from").disabled = !1, document.getElementById("dialog_settings_event_dt_wed_to").disabled = !1, document.getElementById("dialog_settings_event_dt_thu").disabled = !1, document.getElementById("dialog_settings_event_dt_thu_from").disabled = !1, document.getElementById("dialog_settings_event_dt_thu_to").disabled = !1, document.getElementById("dialog_settings_event_dt_fri").disabled = !1, document.getElementById("dialog_settings_event_dt_fri_from").disabled = !1, document.getElementById("dialog_settings_event_dt_fri_to").disabled = !1, document.getElementById("dialog_settings_event_dt_sat").disabled = !1, document.getElementById("dialog_settings_event_dt_sat_from").disabled = !1, document.getElementById("dialog_settings_event_dt_sat_to").disabled = !1, document.getElementById("dialog_settings_event_dt_sun").disabled = !1, document.getElementById("dialog_settings_event_dt_sun_from").disabled = !1, document.getElementById("dialog_settings_event_dt_sun_to").disabled = !1)
}

function settingsEventCmdTemplateList() {
	for (var e = document.getElementById("dialog_settings_event_cmd_template_list"), t = e.getElementsByTagName("optgroup"), a = t.length - 1; a >= 0; a--) e.removeChild(t[a]);
	e.options.length = 0;
	var i = new Array;
	for (var o in gsValues.cmd_default) i.push(gsValues.cmd_default[o].name);
	i.length > 0 && (n = $('<optgroup label="' + la.DEFAULT + '" />')).appendTo(e);
	for (i.sort(), a = 0; a < i.length; a += 1) e.options.add(new Option(la[i[a].toUpperCase()], i[a]));
	var s = new Array,
		n = $('<optgroup label="' + la.CUSTOM + '" />');
	for (var o in n.appendTo(e), e.options.add(new Option(la.CUSTOM, "")), cmdData.cmd_templates) {
		var l = cmdData.cmd_templates[o];
		s.push({
			name: l.name,
			key: o
		})
	}
	for (s = sortArrayByElement(s, "name"), a = 0; a < s.length; a += 1) e.options.add(new Option(s[a].name, s[a].key))
}

function settingsEventCmdTemplateSwitch() {
	var e = document.getElementById("dialog_settings_event_cmd_template_list").value,
		t = "",
		a = "";
	for (var i in gsValues.cmd_default) {
		var o = gsValues.cmd_default[i];
		if (e == o.name) {
			t = o.name, null != o.params && (a = o.params);
			break
		}
	}
	"" != t ? (document.getElementById("dialog_settings_event_cmd_gateway").disabled = !0, document.getElementById("dialog_settings_event_cmd_type").disabled = !0, document.getElementById("dialog_settings_event_cmd_gateway").value = "gprs", document.getElementById("dialog_settings_event_cmd_type").value = "ascii", "" != a && (t = t + "," + a), document.getElementById("dialog_settings_event_cmd_string").value = t) : "" != e ? (document.getElementById("dialog_settings_event_cmd_gateway").disabled = !1, document.getElementById("dialog_settings_event_cmd_type").disabled = !1, document.getElementById("dialog_settings_event_cmd_gateway").value = cmdData.cmd_templates[e].gateway, document.getElementById("dialog_settings_event_cmd_type").value = cmdData.cmd_templates[e].type, document.getElementById("dialog_settings_event_cmd_string").value = cmdData.cmd_templates[e].cmd) : (document.getElementById("dialog_settings_event_cmd_gateway").disabled = !1, document.getElementById("dialog_settings_event_cmd_type").disabled = !1, document.getElementById("dialog_settings_event_cmd_gateway").value = "gprs", document.getElementById("dialog_settings_event_cmd_type").value = "ascii", document.getElementById("dialog_settings_event_cmd_string").value = ""), $("#dialog_settings_event_cmd_gateway").multipleSelect("refresh"), $("#dialog_settings_event_cmd_type").multipleSelect("refresh")
}

function settingsObjectGroupImport() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectGroupImportOGRFile, !1), document.getElementById("load_file").click())
}

function settingsObjectGroupExport() {
	if (utilsCheckPrivileges("viewer")) {
		window.location = "func/fn_export.php?format=ogr"
	}
}

function settingsObjectGroupImportOGRFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onload = function (e) {
		try {
			var t = $.parseJSON(e.target.result);
			if ("0.1v" == t.ogr) {
				var a = t.groups.length;
				if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
				confirmDialog(sprintf(la.GROUPS_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function (t) {
					if (t) {
						loadingData(!0);
						var a = {
							format: "ogr",
							data: e.target.result
						};
						$.ajax({
							type: "POST",
							url: "func/fn_import.php",
							data: a,
							cache: !1,
							success: function (e) {
								loadingData(!1), "OK" == e && settingsReloadObjectGroups()
							},
							error: function (e, t) {
								loadingData(!1)
							}
						})
					}
				})
			} else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		} catch (e) {
			notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		}
		document.getElementById("load_file").value = ""
	}, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectGroupImportOGRFile, !1)
}

function settingsObjectGroupDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_object_group",
				group_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.groups.php",
				data: a,
				success: function (e) {
					"OK" == e && settingsReloadObjectGroups()
				}
			})
		}
	})
}

function settingsObjectGroupDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#settings_main_object_group_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_object_groups",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.groups.php",
					data: a,
					success: function (e) {
						"OK" == e && settingsReloadObjectGroups()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function settingsObjectGroupProperties(e) {
	switch (e) {
		default:
			var t = e;
			settingsEditData.group_id = t, document.getElementById("dialog_settings_object_group_name").value = settingsObjectGroupData[t].name, document.getElementById("dialog_settings_object_group_desc").value = settingsObjectGroupData[t].desc;
			var a = document.getElementById("dialog_settings_object_group_objects"),
				i = new Array;
			for (var o in settingsObjectData) settingsObjectData[o].group_id == t && i.push(o);
			multiselectSetValues(a, i), $("#dialog_settings_object_group_objects").multipleSelect("refresh"), $("#dialog_settings_object_group_properties").dialog("open");
			break;
		case "add":
			settingsEditData.group_id = !1, document.getElementById("dialog_settings_object_group_name").value = "", document.getElementById("dialog_settings_object_group_desc").value = "", $("#dialog_settings_object_group_objects option:selected").removeAttr("selected"), $("#dialog_settings_object_group_objects").multipleSelect("refresh"), $("#dialog_settings_object_group_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_settings_object_group_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var s = document.getElementById("dialog_settings_object_group_name").value,
				n = document.getElementById("dialog_settings_object_group_desc").value,
				l = multiselectGetValues(document.getElementById("dialog_settings_object_group_objects"));
			if ("" == s) {
				notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
				break
			}
			for (var o in settingsObjectData) settingsObjectData[o].group_id == settingsEditData.group_id && (settingsObjectData[o].group_id = 0);
			var d = l.split(",");
			for (var o in settingsObjectData)
				for (var r = 0; r < d.length; r++) o == d[r] && (settingsObjectData[o].group_id = settingsEditData.group_id);
			var _ = {
				cmd: "save_object_group",
				group_id: settingsEditData.group_id,
				group_name: s,
				group_desc: n,
				group_imei: l
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.groups.php",
				data: _,
				cache: !1,
				success: function (e) {
					"OK" == e && (settingsReloadObjects(), settingsReloadObjectGroups(), $("#dialog_settings_object_group_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function settingsObjectDriverImport() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectDriverImportODRFile, !1), document.getElementById("load_file").click())
}

function settingsObjectDriverExport() {
	if (utilsCheckPrivileges("viewer")) {
		window.location = "func/fn_export.php?format=odr"
	}
}

function settingsObjectDriverImportODRFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onload = function (e) {
		try {
			var t = $.parseJSON(e.target.result);
			if ("0.1v" == t.odr) {
				var a = t.drivers.length;
				if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
				confirmDialog(sprintf(la.DRIVERS_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function (t) {
					if (t) {
						loadingData(!0);
						var a = {
							format: "odr",
							data: e.target.result
						};
						$.ajax({
							type: "POST",
							url: "func/fn_import.php",
							data: a,
							cache: !1,
							success: function (e) {
								loadingData(!1), "OK" == e && settingsReloadObjectDrivers()
							},
							error: function (e, t) {
								loadingData(!1)
							}
						})
					}
				})
			} else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		} catch (e) {
			notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		}
		document.getElementById("load_file").value = ""
	}, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectDriverImportODRFile, !1)
}

function settingsObjectDriverDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_object_driver",
				driver_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.drivers.php",
				data: a,
				success: function (e) {
					"OK" == e && settingsReloadObjectDrivers()
				}
			})
		}
	})
}

function settingsObjectDriverDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#settings_main_object_driver_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_object_drivers",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.drivers.php",
					data: a,
					success: function (e) {
						"OK" == e && settingsReloadObjectDrivers()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function settingsObjectDriverProperties(e) {
	switch (e) {
		default:
			var t = e;
			settingsEditData.driver_id = t, settingsEditData.driver_img_file = !1;
			var a = document.getElementById("dialog_settings_object_driver_photo");
			"" == settingsObjectDriverData[t].img ? a.src = "img/user-blank.svg" : a.src = "data/user/drivers/" + settingsObjectDriverData[t].img, document.getElementById("dialog_settings_object_driver_name").value = settingsObjectDriverData[t].name, document.getElementById("dialog_settings_object_driver_assign_id").value = settingsObjectDriverData[t].assign_id, document.getElementById("dialog_settings_object_driver_idn").value = settingsObjectDriverData[t].idn, document.getElementById("dialog_settings_object_driver_address").value = settingsObjectDriverData[t].address, document.getElementById("dialog_settings_object_driver_phone").value = settingsObjectDriverData[t].phone, document.getElementById("dialog_settings_object_driver_email").value = settingsObjectDriverData[t].email, document.getElementById("dialog_settings_object_driver_desc").value = settingsObjectDriverData[t].desc, $("#dialog_settings_object_driver_properties").dialog("open");
			break;
		case "add":
			settingsEditData.driver_id = !1, settingsEditData.driver_img_file = !1, (a = document.getElementById("dialog_settings_object_driver_photo")).src = "img/user-blank.svg", document.getElementById("dialog_settings_object_driver_name").value = "", document.getElementById("dialog_settings_object_driver_assign_id").value = "", document.getElementById("dialog_settings_object_driver_idn").value = "", document.getElementById("dialog_settings_object_driver_address").value = "", document.getElementById("dialog_settings_object_driver_phone").value = "", document.getElementById("dialog_settings_object_driver_email").value = "", document.getElementById("dialog_settings_object_driver_desc").value = "", $("#dialog_settings_object_driver_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_settings_object_driver_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var i = document.getElementById("dialog_settings_object_driver_name").value,
				o = document.getElementById("dialog_settings_object_driver_assign_id").value,
				s = document.getElementById("dialog_settings_object_driver_idn").value,
				n = document.getElementById("dialog_settings_object_driver_address").value,
				l = document.getElementById("dialog_settings_object_driver_phone").value,
				d = document.getElementById("dialog_settings_object_driver_email").value,
				r = document.getElementById("dialog_settings_object_driver_desc").value;
			if ("" == i) {
				notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
				break
			}
			var _ = {
				cmd: "save_object_driver",
				driver_id: settingsEditData.driver_id,
				driver_name: i,
				driver_assign_id: o,
				driver_idn: s,
				driver_address: n,
				driver_phone: l,
				driver_email: d,
				driver_desc: r,
				driver_img_file: settingsEditData.driver_img_file
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.drivers.php",
				data: _,
				cache: !1,
				success: function (e) {
					"OK" == e && (settingsReloadObjectDrivers(), $("#dialog_settings_object_driver_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function settingsObjectDriverPhotoDelete() {
	utilsCheckPrivileges("viewer") && (settingsEditData.driver_img_file = "delete", document.getElementById("dialog_settings_object_driver_photo").src = "img/user-blank.svg")
}

function settingsObjectDriverPhotoUpload() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectDriverPhotoUploadFile, !1), document.getElementById("load_file").click())
}

function settingsObjectDriverPhotoUploadFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onloadend = function (e) {
		var a = e.target.result;
		if (t[0].type.match("image/png") || t[0].type.match("image/jpeg")) {
			var i = new Image;
			i.src = a, i.onload = function () {
				i.width > 640 || i.height > 480 ? notifyBox("error", la.ERROR, la.IMAGE_SIZE_SHOULD_NOT_BE_BIGGER_THAN_640_480) : $.ajax({
					url: "func/fn_upload.php?file=driver_photo",
					type: "POST",
					data: a,
					processData: !1,
					contentType: !1,
					success: function (e) {
						document.getElementById("dialog_settings_object_driver_photo").src = e + "?t=" + (new Date).getTime(), settingsEditData.driver_img_file = !0
					}
				})
			}, document.getElementById("load_file").value = ""
		} else notifyBox("error", la.ERROR, la.FILE_TYPE_MUST_BE_PNG_OR_JPG)
	}, a.readAsDataURL(t[0]), this.removeEventListener("change", settingsObjectDriverPhotoUploadFile, !1)
}

function settingsObjectPassengerImport() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectPassengerImportOPAFile, !1), document.getElementById("load_file").click())
}

function settingsObjectPassengerExport() {
	if (utilsCheckPrivileges("viewer")) {
		window.location = "func/fn_export.php?format=opa"
	}
}

function settingsObjectPassengerImportOPAFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onload = function (e) {
		try {
			var t = $.parseJSON(e.target.result);
			if ("0.1v" == t.opa) {
				var a = t.passengers.length;
				if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
				confirmDialog(sprintf(la.PASSENGERS_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function (t) {
					if (t) {
						loadingData(!0);
						var a = {
							format: "opa",
							data: e.target.result
						};
						$.ajax({
							type: "POST",
							url: "func/fn_import.php",
							data: a,
							cache: !1,
							success: function (e) {
								loadingData(!1), "OK" == e && settingsReloadObjectPassengers()
							},
							error: function (e, t) {
								loadingData(!1)
							}
						})
					}
				})
			} else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		} catch (e) {
			notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		}
		document.getElementById("load_file").value = ""
	}, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectPassengerImportOPAFile, !1)
}

function settingsObjectPassengerDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_object_passenger",
				passenger_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.passengers.php",
				data: a,
				success: function (e) {
					"OK" == e && settingsReloadObjectPassengers()
				}
			})
		}
	})
}

function settingsObjectPassengerDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#settings_main_object_passenger_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_object_passengers",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.passengers.php",
					data: a,
					success: function (e) {
						"OK" == e && settingsReloadObjectPassengers()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function settingsObjectPassengerProperties(e) {
	switch (e) {
		default:
			var t = e,
				a = {
					cmd: "load_object_passenger_data",
					passenger_id: t
				};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.passengers.php",
				data: a,
				dataType: "json",
				cache: !1,
				success: function (e) {
					settingsEditData.passenger_id = t, document.getElementById("dialog_settings_object_passenger_name").value = e.name, document.getElementById("dialog_settings_object_passenger_assign_id").value = e.assign_id, document.getElementById("dialog_settings_object_passenger_idn").value = e.idn, document.getElementById("dialog_settings_object_passenger_address").value = e.address, document.getElementById("dialog_settings_object_passenger_phone").value = e.phone, document.getElementById("dialog_settings_object_passenger_email").value = e.email, document.getElementById("dialog_settings_object_passenger_desc").value = e.desc, $("#dialog_settings_object_passenger_properties").dialog("open")
				}
			});
			break;
		case "add":
			settingsEditData.passenger_id = !1, document.getElementById("dialog_settings_object_passenger_name").value = "", document.getElementById("dialog_settings_object_passenger_assign_id").value = "", document.getElementById("dialog_settings_object_passenger_idn").value = "", document.getElementById("dialog_settings_object_passenger_address").value = "", document.getElementById("dialog_settings_object_passenger_phone").value = "", document.getElementById("dialog_settings_object_passenger_email").value = "", document.getElementById("dialog_settings_object_passenger_desc").value = "", $("#dialog_settings_object_passenger_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_settings_object_passenger_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var i = document.getElementById("dialog_settings_object_passenger_name").value,
				o = document.getElementById("dialog_settings_object_passenger_assign_id").value,
				s = document.getElementById("dialog_settings_object_passenger_idn").value,
				n = document.getElementById("dialog_settings_object_passenger_address").value,
				l = document.getElementById("dialog_settings_object_passenger_phone").value,
				d = document.getElementById("dialog_settings_object_passenger_email").value,
				r = document.getElementById("dialog_settings_object_passenger_desc").value;
			if ("" == i) {
				notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
				break
			}
			a = {
				cmd: "save_object_passenger",
				passenger_id: settingsEditData.passenger_id,
				passenger_name: i,
				passenger_assign_id: o,
				passenger_idn: s,
				passenger_address: n,
				passenger_phone: l,
				passenger_email: d,
				passenger_desc: r
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.passengers.php",
				data: a,
				cache: !1,
				success: function (e) {
					"OK" == e && (settingsReloadObjectPassengers(), $("#dialog_settings_object_passenger_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function settingsObjectTrailerImport() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectTrailerImportOTRFile, !1), document.getElementById("load_file").click())
}

function settingsObjectTrailerExport() {
	if (utilsCheckPrivileges("viewer")) {
		window.location = "func/fn_export.php?format=otr"
	}
}

function settingsObjectTrailerImportOTRFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onload = function (e) {
		try {
			var t = $.parseJSON(e.target.result);
			if ("0.1v" == t.otr) {
				var a = t.trailers.length;
				if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
				confirmDialog(sprintf(la.TRAILERS_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function (t) {
					if (t) {
						loadingData(!0);
						var a = {
							format: "otr",
							data: e.target.result
						};
						$.ajax({
							type: "POST",
							url: "func/fn_import.php",
							data: a,
							cache: !1,
							success: function (e) {
								loadingData(!1), "OK" == e && settingsReloadObjectTrailers()
							},
							error: function (e, t) {
								loadingData(!1)
							}
						})
					}
				})
			} else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		} catch (e) {
			notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		}
		document.getElementById("load_file").value = ""
	}, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectTrailerImportOTRFile, !1)
}

function settingsObjectTrailerDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_object_trailer",
				trailer_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.trailers.php",
				data: a,
				success: function (e) {
					"OK" == e && settingsReloadObjectTrailers()
				}
			})
		}
	})
}

function settingsObjectTrailerDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#settings_main_object_trailer_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_object_trailers",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.trailers.php",
					data: a,
					success: function (e) {
						"OK" == e && settingsReloadObjectTrailers()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function settingsObjectTrailerProperties(e) {
	switch (e) {
		default:
			var t = e;
			settingsEditData.trailer_id = t, document.getElementById("dialog_settings_object_trailer_name").value = settingsObjectTrailerData[t].name, document.getElementById("dialog_settings_object_trailer_assign_id").value = settingsObjectTrailerData[t].assign_id, document.getElementById("dialog_settings_object_trailer_model").value = settingsObjectTrailerData[t].model, document.getElementById("dialog_settings_object_trailer_vin").value = settingsObjectTrailerData[t].vin, document.getElementById("dialog_settings_object_trailer_plate_number").value = settingsObjectTrailerData[t].plate_number, document.getElementById("dialog_settings_object_trailer_desc").value = settingsObjectTrailerData[t].desc, $("#dialog_settings_object_trailer_properties").dialog("open");
			break;
		case "add":
			settingsEditData.trailer_id = !1, document.getElementById("dialog_settings_object_trailer_name").value = "", document.getElementById("dialog_settings_object_trailer_assign_id").value = "", document.getElementById("dialog_settings_object_trailer_model").value = "", document.getElementById("dialog_settings_object_trailer_vin").value = "", document.getElementById("dialog_settings_object_trailer_plate_number").value = "", document.getElementById("dialog_settings_object_trailer_desc").value = "", $("#dialog_settings_object_trailer_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_settings_object_trailer_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var a = document.getElementById("dialog_settings_object_trailer_name").value,
				i = document.getElementById("dialog_settings_object_trailer_assign_id").value,
				o = document.getElementById("dialog_settings_object_trailer_model").value,
				s = document.getElementById("dialog_settings_object_trailer_vin").value,
				n = document.getElementById("dialog_settings_object_trailer_plate_number").value,
				l = document.getElementById("dialog_settings_object_trailer_desc").value;
			if ("" == a) {
				notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
				break
			}
			var d = {
				cmd: "save_object_trailer",
				trailer_id: settingsEditData.trailer_id,
				trailer_name: a,
				trailer_assign_id: i,
				trailer_model: o,
				trailer_vin: s,
				trailer_plate_number: n,
				trailer_desc: l
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.trailers.php",
				data: d,
				cache: !1,
				success: function (e) {
					"OK" == e && (settingsReloadObjectTrailers(), $("#dialog_settings_object_trailer_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}
placesRouteData.routes = new Array, placesRouteData.new_route_id = 1, placesRouteData.edit_route_id = !1, placesRouteData.edit_route_layer = !1, placesRouteData.edit_start_label_layer = !1, placesRouteData.edit_end_label_layer = !1;
var settingsEditData = new Array,
	settingsUserData = new Array,
	settingsObjectData = new Array,
	settingsObjectGroupData = new Array,
	settingsObjectDriverData = new Array,
	settingsObjectTrailerData = new Array,
	settingsEventData = new Array,
	settingsTemplateData = new Array,
	settingsKMLData = new Array,
	settingsSubaccountData = new Array;

function settingsOpen() {
	loadSettings("user", function () {
		loadSettings("objects", function () {
			$("#settings_main_object_list_grid").trigger("reloadGrid"), $("#dialog_settings").dialog("open")
		})
	})
}

function settingsClose() {
	loadSettings("objects", function () {
		objectReloadData()
	})
}

function settingsOpenUser() {
	settingsOpen(), document.getElementById("settings_main_my_account_tab").click()
}

function settingsReloadUser() {
	setTimeout(function () {
		window.location.reload()
	}, 2e3)
}

function settingsReloadObjects() {
	loadSettings("objects", function () {
		1 != $("#dialog_settings").dialog("isOpen") && objectReloadData()
	}), $("#settings_main_object_list_grid").trigger("reloadGrid")
}

function settingsReloadObjectGroups() {
	loadSettings("object_groups", function () { }), $("#settings_main_object_group_list_grid").trigger("reloadGrid")
}

function settingsReloadObjectDrivers() {
	loadSettings("object_drivers", function () { }), $("#settings_main_object_driver_list_grid").trigger("reloadGrid")
}

function settingsReloadObjectPassengers() {
	$("#settings_main_object_passenger_list_grid").trigger("reloadGrid")
}

function settingsReloadObjectTrailers() {
	loadSettings("object_trailers", function () { }), $("#settings_main_object_trailer_list_grid").trigger("reloadGrid")
}

function settingsReloadEvents() {
	loadSettings("events", function () { }), $("#settings_main_events_event_list_grid").trigger("reloadGrid")
}

function settingsReloadTemplates() {
	loadSettings("templates", function () { }), $("#settings_main_templates_template_list_grid").trigger("reloadGrid")
}

function settingsReloadKML() {
	loadSettings("kml", function () {
		defineMapKMLLayers(map)
	}), $("#settings_main_kml_kml_list_grid").trigger("reloadGrid")
}

function settingsReloadSubaccounts() {
	loadSettings("subaccounts", function () { }), $("#settings_main_subaccount_list_grid").trigger("reloadGrid")
}

function settingsCheck() {
	document.getElementById("settings_main_dst").checked ? (document.getElementById("settings_main_dst_start_mmdd").disabled = !1, document.getElementById("settings_main_dst_start_hhmm").disabled = !1, document.getElementById("settings_main_dst_end_mmdd").disabled = !1, document.getElementById("settings_main_dst_end_hhmm").disabled = !1) : (document.getElementById("settings_main_dst_start_mmdd").disabled = !0, document.getElementById("settings_main_dst_start_hhmm").disabled = !0, document.getElementById("settings_main_dst_end_mmdd").disabled = !0, document.getElementById("settings_main_dst_end_hhmm").disabled = !0)
}

function loadSettings(e, t) {
	switch (e) {
		case "cookies":
			var a = getCookie("gs_dragbars");
			null == a && (a = guiDragbars.objects + ";" + guiDragbars.events + ";" + guiDragbars.history + ";" + guiDragbars.bottom_panel), null != (a = a.split(";"))[0] && "" != a[0] && (guiDragbars.objects = a[0]), null != a[1] && "" != a[1] && (guiDragbars.events = a[1]), null != a[2] && "" != a[2] && (guiDragbars.history = a[2]), null != a[3] && "" != a[3] && (guiDragbars.bottom_panel = a[3]);
			var i = getCookie("gs_map");
			null == i && (i = gsValues.map_lat + ";" + gsValues.map_lng + ";" + gsValues.map_zoom + ";" + gsValues.map_layer + ";", i += gsValues.map_objects + ";" + gsValues.map_object_labels + ";" + gsValues.map_markers + ";" + gsValues.map_routes + ";" + gsValues.map_zones + ";" + gsValues.map_clusters + ";" + gsValues.map_kml), i = i.split(";"), "last" == settingsUserData.map_sp && (null != i[0] && "" != i[0] && (gsValues.map_lat = i[0]), null != i[1] && "" != i[1] && (gsValues.map_lng = i[1]), null != i[2] && "" != i[2] && (gsValues.map_zoom = i[2])), null != i[3] && "" != i[3] && (gsValues.map_layer = i[3]), null != i[4] && "" != i[4] && (gsValues.map_objects = strToBoolean(i[4])), null != i[5] && "" != i[5] && (gsValues.map_object_labels = strToBoolean(i[5])), null != i[6] && "" != i[6] && (gsValues.map_markers = strToBoolean(i[6])), null != i[7] && "" != i[7] && (gsValues.map_routes = strToBoolean(i[7])), null != i[8] && "" != i[8] && (gsValues.map_zones = strToBoolean(i[8])), null != i[9] && "" != i[9] && (gsValues.map_clusters = strToBoolean(i[9])), null != i[10] && "" != i[10] && (gsValues.map_kml = strToBoolean(i[10])), t(!0);
			break;
		case "server":
			var o = {
				cmd: "load_server_data"
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.php",
				data: o,
				dataType: "json",
				cache: !1,
				success: function (e) {
					gsValues.url_root = e.url_root, gsValues.map_custom = e.map_custom, gsValues.map_osm = strToBoolean(e.map_osm), gsValues.map_bing = strToBoolean(e.map_bing), gsValues.map_google = strToBoolean(e.map_google), gsValues.map_google_street_view = strToBoolean(e.map_google_street_view), gsValues.map_google_traffic = strToBoolean(e.map_google_traffic), gsValues.map_mapbox = strToBoolean(e.map_mapbox), gsValues.map_arcgis = strToBoolean(e.map_arcgis), gsValues.map_yandex = strToBoolean(e.map_yandex), gsValues.map_bing_key = e.map_bing_key, gsValues.map_mapbox_key = e.map_mapbox_key, gsValues.map_arcgis_key = e.map_arcgis_key, gsValues.routing_osmr_service_url = e.routing_osmr_service_url, gsValues.map_layer = e.map_layer, gsValues.map_zoom = e.map_zoom, gsValues.map_lat = e.map_lat, gsValues.map_lng = e.map_lng, gsValues.address_display_object_data_list = strToBoolean(e.address_display_object_data_list), gsValues.address_display_event_data_list = strToBoolean(e.address_display_event_data_list), gsValues.address_display_history_route_data_list = strToBoolean(e.address_display_history_route_data_list), gsValues.notify_obj_expire = strToBoolean(e.notify_obj_expire), gsValues.notify_obj_expire_period = e.notify_obj_expire_period, gsValues.notify_account_expire = strToBoolean(e.notify_account_expire), gsValues.notify_account_expire_period = e.notify_account_expire_period, gsValues.sim_number = strToBoolean(e.sim_number), gsValues.object_control_default_templates = strToBoolean(e.object_control_default_templates), t(!0)
				}
			});
			break;
		case "user":
			o = {
				cmd: "load_user_data"
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.php",
				data: o,
				dataType: "json",
				cache: !1,
				success: function (e) {
					"subuser" != (settingsUserData = e).privileges && (document.getElementById("settings_main_sms_gateway").checked = strToBoolean(settingsUserData.sms_gateway), "" == settingsUserData.sms_gateway_type && (settingsUserData.sms_gateway_type = "app"), document.getElementById("settings_main_sms_gateway_type").value = settingsUserData.sms_gateway_type, document.getElementById("settings_main_sms_gateway_url").value = settingsUserData.sms_gateway_url, document.getElementById("settings_main_sms_gateway_identifier").value = settingsUserData.sms_gateway_identifier, document.getElementById("settings_main_sms_gateway_total_in_queue").innerHTML = settingsUserData.sms_gateway_total_in_queue, settingsSMSGatewaySwitchType()), document.getElementById("settings_main_push_notify_desktop").checked = strToBoolean(settingsUserData.push_notify_desktop), "" == settingsUserData.chat_notify && (settingsUserData.chat_notify = "alarm1.mp3"), document.getElementById("settings_main_chat_notify_sound_file").value = settingsUserData.chat_notify, document.getElementById("settings_main_dashboard_open_after_login").checked = settingsUserData.dashboard.open_after_login, document.getElementById("settings_main_map_startup_possition").value = settingsUserData.map_sp, document.getElementById("settings_main_map_icon_size").value = settingsUserData.map_is, document.getElementById("settings_main_history_route_color").value = settingsUserData.map_rc.substr(1), document.getElementById("settings_main_history_route_color").style.backgroundColor = settingsUserData.map_rc, document.getElementById("settings_main_history_route_highlight_color").value = settingsUserData.map_rhc.substr(1), document.getElementById("settings_main_history_route_highlight_color").style.backgroundColor = settingsUserData.map_rhc, document.getElementById("settings_main_map_object_cluster_popup").checked = strToBoolean(settingsUserData.map_ocp), document.getElementById("settings_main_groups_collapsed_objects").checked = settingsUserData.groups_collapsed.objects, document.getElementById("settings_main_groups_collapsed_markers").checked = settingsUserData.groups_collapsed.markers, document.getElementById("settings_main_groups_collapsed_routes").checked = settingsUserData.groups_collapsed.routes, document.getElementById("settings_main_groups_collapsed_zones").checked = settingsUserData.groups_collapsed.zones, document.getElementById("settings_main_od").value = settingsUserData.od;
					settingsUserData.ohc;
					document.getElementById("settings_main_ohc_no_connection").checked = settingsUserData.ohc.no_connection, document.getElementById("settings_main_ohc_no_connection_color").value = settingsUserData.ohc.no_connection_color.substr(1), document.getElementById("settings_main_ohc_no_connection_color").style.backgroundColor = settingsUserData.ohc.no_connection_color, document.getElementById("settings_main_datalist_position").value = settingsUserData.datalist;
					var a = document.getElementById("settings_main_datalist_items");
					if (0 != a) {
						var i = settingsUserData.datalist_items.split(",");
						multiselectSetValues(a, i)
					}
					if (document.getElementById("settings_main_ohc_stopped").checked = settingsUserData.ohc.stopped, document.getElementById("settings_main_ohc_stopped_color").value = settingsUserData.ohc.stopped_color.substr(1), document.getElementById("settings_main_ohc_stopped_color").style.backgroundColor = settingsUserData.ohc.stopped_color, document.getElementById("settings_main_ohc_moving").checked = settingsUserData.ohc.moving, document.getElementById("settings_main_ohc_moving_color").value = settingsUserData.ohc.moving_color.substr(1), document.getElementById("settings_main_ohc_moving_color").style.backgroundColor = settingsUserData.ohc.moving_color, document.getElementById("settings_main_ohc_engine_idle").checked = settingsUserData.ohc.engine_idle, document.getElementById("settings_main_ohc_engine_idle_color").value = settingsUserData.ohc.engine_idle_color.substr(1), document.getElementById("settings_main_ohc_engine_idle_color").style.backgroundColor = settingsUserData.ohc.engine_idle_color, document.getElementById("settings_main_language").value = settingsUserData.language, document.getElementById("system_language").value = settingsUserData.language, document.getElementById("settings_main_distance_unit").value = settingsUserData.unit_distance, document.getElementById("settings_main_capacity_unit").value = settingsUserData.unit_capacity, document.getElementById("settings_main_temperature_unit").value = settingsUserData.unit_temperature, document.getElementById("settings_main_currency").value = settingsUserData.currency, document.getElementById("settings_main_timezone").value = settingsUserData.timezone, 11 == settingsUserData.dst_start.length && 11 == settingsUserData.dst_end.length) {
						document.getElementById("settings_main_dst").checked = strToBoolean(settingsUserData.dst);
						var o = settingsUserData.dst_start.split(" ");
						document.getElementById("settings_main_dst_start_mmdd").value = o[0], document.getElementById("settings_main_dst_start_hhmm").value = o[1];
						var s = settingsUserData.dst_end.split(" ");
						document.getElementById("settings_main_dst_end_mmdd").value = s[0], document.getElementById("settings_main_dst_end_hhmm").value = s[1]
					} else document.getElementById("settings_main_dst").checked = !1, document.getElementById("settings_main_dst_start_mmdd").value = "", document.getElementById("settings_main_dst_start_hhmm").value = "00:00", document.getElementById("settings_main_dst_end_mmdd").value = "", document.getElementById("settings_main_dst_end_hhmm").value = "00:00";
					var n = settingsUserData.info;
					document.getElementById("settings_main_name_surname").value = n.name, document.getElementById("settings_main_company").value = n.company, document.getElementById("settings_main_address").value = n.address, document.getElementById("settings_main_post_code").value = n.post_code, document.getElementById("settings_main_city").value = n.city, document.getElementById("settings_main_country").value = n.country, document.getElementById("settings_main_phone1").value = n.phone1, document.getElementById("settings_main_phone2").value = n.phone2, document.getElementById("settings_main_email").value = n.email, document.getElementById("settings_main_old_password").value = "", document.getElementById("settings_main_new_password").value = "", document.getElementById("settings_main_new_password_rep").value = "", document.getElementById("settings_main_usage_email_daily").innerHTML = settingsUserData.usage_email_daily_cnt + "/" + settingsUserData.usage_email_daily, document.getElementById("settings_main_usage_sms_daily").innerHTML = settingsUserData.usage_sms_daily_cnt + "/" + settingsUserData.usage_sms_daily, document.getElementById("settings_main_usage_webhook_daily").innerHTML = settingsUserData.usage_webhook_daily_cnt + "/" + settingsUserData.usage_webhook_daily, document.getElementById("settings_main_usage_api_daily").innerHTML = settingsUserData.usage_api_daily_cnt + "/" + settingsUserData.usage_api_daily, settingsCheck(), t(!0)
				}
			});
			break;
		case "objects":
			o = {
				cmd: "load_object_data"
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.objects.php",
				data: o,
				dataType: "json",
				cache: !1,
				success: function (e) {
					for (var a in e = transformsToSettingsObjectData(e), settingsObjectData = e, settingsEditData.sensor_id = !1, settingsObjectData) {
						var i = settingsObjectData[a];
						null == settingsObjectGroupData[i.group_id] && (settingsObjectData[a].group_id = "0")
					}
					initSelectList("group_object_list"), initSelectList("events_object_list"), initSelectList("subaccounts_object_list"), initSelectList("history_object_list"), initSelectList("report_object_list"), initSelectList("tasks_object_list"), initSelectList("task_object_list"), initSelectList("rilogbook_object_list"), initSelectList("dtc_object_list"), initSelectList("cmd_gprs_object_list"), initSelectList("cmd_sms_object_list"), initSelectList("image_gallery_object_list"), initSelectList("maintenance_object_list"), initSelectList("expense_object_list"), initSelectList("share_position_object_list"), loadObjectMapMarkerIcons(), t(!0)
				}
			});
			break;
		case "object_groups":
			o = {
				cmd: "load_object_group_data"
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.groups.php",
				data: o,
				dataType: "json",
				cache: !1,
				success: function (e) {
					settingsObjectGroupData = e, settingsEditData.group_id = !1, initSelectList("object_group_list"), t(!0)
				}
			});
			break;
		case "object_drivers":
			o = {
				cmd: "load_object_driver_data"
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.drivers.php",
				data: o,
				dataType: "json",
				cache: !1,
				success: function (e) {
					settingsObjectDriverData = e, settingsEditData.driver_id = !1, initSelectList("object_driver_list"), t(!0)
				}
			});
			break;
		case "object_trailers":
			o = {
				cmd: "load_object_trailer_data"
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.trailers.php",
				data: o,
				dataType: "json",
				cache: !1,
				success: function (e) {
					settingsObjectTrailerData = e, settingsEditData.trailer_id = !1, initSelectList("object_trailer_list"), t(!0)
				}
			});
			break;
		case "events":
			o = {
				cmd: "load_event_data"
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.events.php",
				data: o,
				dataType: "json",
				cache: !1,
				success: function (e) {
					settingsEventData = e, settingsEditData.event_id = !1, t(!0)
				}
			});
			break;
		case "templates":
			o = {
				cmd: "load_template_data"
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.templates.php",
				data: o,
				dataType: "json",
				cache: !1,
				success: function (e) {
					settingsTemplateData = e, settingsEditData.template_id = !1, initSelectList("email_sms_template_list"), t(!0)
				}
			});
			break;
		case "kml":
			o = {
				cmd: "load_kml_data"
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.kml.php",
				data: o,
				dataType: "json",
				cache: !1,
				success: function (e) {
					settingsKMLData = e, settingsEditData.kml_id = !1, t(!0)
				}
			});
			break;
		case "subaccounts":
			o = {
				cmd: "load_subaccount_data"
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.subaccounts.php",
				data: o,
				dataType: "json",
				cache: !1,
				success: function (e) {
					settingsSubaccountData = e, settingsEditData.subaccount_id = !1, t(!0)
				}
			})
	}
}

function settingsSave() {
	if (utilsCheckPrivileges("viewer")) {
		if ("subuser" != settingsUserData.privileges) var e = document.getElementById("settings_main_sms_gateway").checked,
			t = document.getElementById("settings_main_sms_gateway_type").value,
			a = document.getElementById("settings_main_sms_gateway_url").value,
			i = document.getElementById("settings_main_sms_gateway_identifier").value;
		else e = "", t = "", a = "", i = "";
		var o = document.getElementById("settings_main_push_notify_desktop").checked,
			s = document.getElementById("settings_main_chat_notify_sound_file").value,
			n = {
				open_after_login: document.getElementById("settings_main_dashboard_open_after_login").checked
			};
		n = JSON.stringify(n);
		var l = document.getElementById("settings_main_map_startup_possition").value,
			d = document.getElementById("settings_main_map_icon_size").value,
			r = "#" + document.getElementById("settings_main_history_route_color").value,
			_ = "#" + document.getElementById("settings_main_history_route_highlight_color").value,
			c = document.getElementById("settings_main_map_object_cluster_popup").checked,
			g = {
				objects: document.getElementById("settings_main_groups_collapsed_objects").checked,
				markers: document.getElementById("settings_main_groups_collapsed_markers").checked,
				routes: document.getElementById("settings_main_groups_collapsed_routes").checked,
				zones: document.getElementById("settings_main_groups_collapsed_zones").checked
			};
		g = JSON.stringify(g);
		var m = document.getElementById("settings_main_od").value,
			u = {
				no_connection: document.getElementById("settings_main_ohc_no_connection").checked,
				no_connection_color: "#" + document.getElementById("settings_main_ohc_no_connection_color").value,
				stopped: document.getElementById("settings_main_ohc_stopped").checked,
				stopped_color: "#" + document.getElementById("settings_main_ohc_stopped_color").value,
				moving: document.getElementById("settings_main_ohc_moving").checked,
				moving_color: "#" + document.getElementById("settings_main_ohc_moving_color").value,
				engine_idle: document.getElementById("settings_main_ohc_engine_idle").checked,
				engine_idle_color: "#" + document.getElementById("settings_main_ohc_engine_idle_color").value
			};
		u = JSON.stringify(u);
		var p = document.getElementById("settings_main_datalist_position").value,
			y = multiselectGetValues(document.getElementById("settings_main_datalist_items"));
		"" == y && (y = !1);
		var h = document.getElementById("settings_main_language").value,
			v = document.getElementById("settings_main_distance_unit").value;
		v += "," + document.getElementById("settings_main_capacity_unit").value, v += "," + document.getElementById("settings_main_temperature_unit").value;
		var b = document.getElementById("settings_main_currency").value,
			E = document.getElementById("settings_main_timezone").value,
			f = document.getElementById("settings_main_dst").checked,
			I = document.getElementById("settings_main_dst_start_mmdd").value + " " + document.getElementById("settings_main_dst_start_hhmm").value,
			B = document.getElementById("settings_main_dst_end_mmdd").value + " " + document.getElementById("settings_main_dst_end_hhmm").value;
		0 != f && 11 == I.length && 11 == B.length || (f = !1, I = "", B = "");
		var D = {
			name: document.getElementById("settings_main_name_surname").value,
			company: document.getElementById("settings_main_company").value,
			address: document.getElementById("settings_main_address").value,
			post_code: document.getElementById("settings_main_post_code").value,
			city: document.getElementById("settings_main_city").value,
			country: document.getElementById("settings_main_country").value,
			phone1: document.getElementById("settings_main_phone1").value,
			phone2: document.getElementById("settings_main_phone2").value,
			email: document.getElementById("settings_main_email").value
		};
		D = JSON.stringify(D);
		var O = document.getElementById("settings_main_old_password").value,
			k = document.getElementById("settings_main_new_password").value,
			j = document.getElementById("settings_main_new_password_rep").value;
		if (O.length > 0) {
			if (k.length < 6) return void notifyBox("error", la.ERROR, la.PASSWORD_LENGHT_AT_LEAST);
			if (-1 != k.indexOf(" ")) return void notifyBox("error", la.ERROR, la.PASSWORD_SPACE_CHARACTERS);
			if (k != j) return void notifyBox("error", la.ERROR, la.REPEATED_PASSWORD_IS_INCORRECT)
		}
		var T = {
			cmd: "save_user_settings",
			sms_gateway: e,
			sms_gateway_type: t,
			sms_gateway_url: a,
			sms_gateway_identifier: i,
			chat_notify: s,
			dashboard: n,
			map_sp: l,
			map_is: d,
			map_rc: r,
			map_rhc: _,
			map_ocp: c,
			groups_collapsed: g,
			od: m,
			ohc: u,
			datalist: p,
			datalist_items: y,
			push_notify_desktop: o,
			push_notify_mobile: "na",
			push_notify_mobile_interval: "na",
			startup_tab: "na",
			language: h,
			units: v,
			currency: b,
			timezone: E,
			dst: f,
			dst_start: I,
			dst_end: B,
			info: D,
			old_password: O,
			new_password: k
		};
		$.ajax({
			type: "POST",
			url: "func/fn_settings.php",
			data: T,
			cache: !1,
			success: function (e) {
				"OK" == e ? (settingsReloadUser(), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY)) : "ERROR_INCORRECT_PASSWORD" == e && notifyBox("error", la.ERROR, la.INCORRECT_PASSWORD)
			}
		})
	}
}

function settingsSaveCookies() {
	var e = guiDragbars.objects + ";" + guiDragbars.events + ";" + guiDragbars.history + ";" + guiDragbars.bottom_panel;
	if (setCookie("gs_dragbars", e, 30), null != map && map.getZoom() && map.getCenter() && map.getCenter()) {
		var t = map.getCenter().lat + ";" + map.getCenter().lng + ";" + map.getZoom() + ";" + gsValues.map_layer + ";";
		t += gsValues.map_objects + ";" + gsValues.map_object_labels + ";" + gsValues.map_markers + ";" + gsValues.map_routes + ";" + gsValues.map_zones + ";" + gsValues.map_clusters + ";" + gsValues.map_kml, setCookie("gs_map", t, 30)
	}
}

function settingsChatPlaySound() {
	var e = document.getElementById("settings_main_chat_notify_sound_file").value;
	"" != e && new Audio("snd/" + e).play()
}

function settingsSMSGatewayClearQueue() {
	confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_CLEAR_SMS_QUEUE, function (e) {
		if (e) {
			$.ajax({
				type: "POST",
				url: "func/fn_settings.php",
				data: {
					cmd: "clear_sms_queue"
				},
				success: function (e) {
					"OK" == e && (document.getElementById("settings_main_sms_gateway_total_in_queue").innerHTML = "0")
				}
			})
		}
	})
}

function settingsSMSGatewaySwitchType() {
	"app" == document.getElementById("settings_main_sms_gateway_type").value ? (document.getElementById("settings_main_sms_app").style.display = "", document.getElementById("settings_main_sms_http").style.display = "none") : (document.getElementById("settings_main_sms_app").style.display = "none", document.getElementById("settings_main_sms_http").style.display = "")
}

function settingsObjectAdd(e) {
	if (utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_add")) switch (e) {
		case "open":
			document.getElementById("dialog_settings_object_add_name").value = "", document.getElementById("dialog_settings_object_add_imei").value = "", $("#dialog_settings_object_add").dialog("open");
			break;
		case "cancel":
			$("#dialog_settings_object_add").dialog("close");
			break;
		case "add":
			if (!utilsCheckPrivileges("viewer")) return;
			var t = document.getElementById("dialog_settings_object_add_name").value,
				a = document.getElementById("dialog_settings_object_add_imei").value;
			if ("" == t) return void notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
			if (!isIMEIValid(a)) return void notifyBox("error", la.ERROR, la.IMEI_IS_NOT_VALID);
			var i = {
				cmd: "add_object",
				name: t,
				imei: a
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.objects.php",
				data: i,
				cache: !1,
				success: function (e) {
					"OK" == e ? (settingsReloadObjects(), $("#dialog_settings_object_add").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY)) : "ERROR_IMEI_EXISTS" == e ? notifyBox("error", la.ERROR, la.THIS_IMEI_ALREADY_EXISTS) : "ERROR_OBJECT_LIMIT" == e && notifyBox("error", la.ERROR, la.OBJECT_LIMIT_IS_REACHED)
				}
			})
	}
}

function settingsObjectClearHistory(e) {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_history_clear") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_CLEAR_HISTORY_EVENTS, function (t) {
		if (t) {
			var a = {
				cmd: "clear_history_object",
				imei: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.objects.php",
				data: a,
				success: function (e) {
					"OK" == e && settingsReloadObjects()
				}
			})
		}
	})
}

function settingsObjectDelete(e) {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_delete") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_object",
				imei: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.objects.php",
				data: a,
				success: function (e) {
					"OK" == e && settingsReloadObjects()
				}
			})
		}
	})
}

function settingsObjectClearHistorySelected() {
	if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_history_clear")) {
		var e = $("#settings_main_object_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_CLEAR_SELECTED_ITEMS_HISTORY_EVENTS, function (t) {
			if (t) {
				var a = {
					cmd: "clear_history_selected_objects",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.objects.php",
					data: a,
					success: function (e) {
						"OK" == e && settingsReloadObjects()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function settingsObjectDeleteSelected() {
	if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_delete")) {
		var e = $("#settings_main_object_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_objects",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.objects.php",
					data: a,
					success: function (e) {
						"OK" == e && settingsReloadObjects()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function settingsObjectDuplicate(e) {
	if (utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_add")) switch (e) {
		default:
			var t = e;
			settingsEditData.object_duplicate_imei = t, document.getElementById("dialog_settings_object_duplicate_name").value = "", document.getElementById("dialog_settings_object_duplicate_imei").value = "", $("#dialog_settings_object_duplicate").dialog("open");
			break;
		case "duplicate":
			if (!utilsCheckPrivileges("viewer")) return;
			var a = settingsEditData.object_duplicate_imei,
				i = document.getElementById("dialog_settings_object_duplicate_name").value;
			t = document.getElementById("dialog_settings_object_duplicate_imei").value;
			if ("" == i) return void notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
			if (!isIMEIValid(t)) return void notifyBox("error", la.ERROR, la.IMEI_IS_NOT_VALID);
			var o = {
				cmd: "duplicate_object",
				duplicate_imei: a,
				name: i,
				imei: t
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.objects.php",
				data: o,
				cache: !1,
				success: function (e) {
					"OK" == e ? (settingsReloadObjects(), $("#dialog_settings_object_duplicate").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY)) : "ERROR_IMEI_EXISTS" == e ? notifyBox("error", la.ERROR, la.THIS_IMEI_ALREADY_EXISTS) : "ERROR_OBJECT_LIMIT" == e && notifyBox("error", la.ERROR, la.OBJECT_LIMIT_IS_REACHED)
				}
			});
			break;
		case "cancel":
			$("#dialog_settings_object_duplicate").dialog("close")
	}
}

function settingsObjectEdit(e) {
	if (utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_edit")) switch (e) {
		default:
			var t = e;
			settingsEditData.object_imei = t;
			var a = settingsObjectData[t].group_id;
			null == settingsObjectGroupData[a] ? document.getElementById("dialog_settings_object_edit_group").value = 0 : document.getElementById("dialog_settings_object_edit_group").value = settingsObjectData[t].group_id, $("#dialog_settings_object_edit_group").multipleSelect("refresh");
			var i = settingsObjectData[t].driver_id;
			null == settingsObjectDriverData[i] ? document.getElementById("dialog_settings_object_edit_driver").value = 0 : document.getElementById("dialog_settings_object_edit_driver").value = settingsObjectData[t].driver_id, $("#dialog_settings_object_edit_driver").multipleSelect("refresh");
			var o = settingsObjectData[t].trailer_id;
			null == settingsObjectTrailerData[o] ? document.getElementById("dialog_settings_object_edit_trailer").value = 0 : document.getElementById("dialog_settings_object_edit_trailer").value = settingsObjectData[t].trailer_id, $("#dialog_settings_object_edit_trailer").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_name").value = settingsObjectData[t].name, document.getElementById("dialog_settings_object_edit_imei").value = t, document.getElementById("dialog_settings_object_edit_device").value = settingsObjectData[t].device, document.getElementById("dialog_settings_object_edit_sim_number").value = settingsObjectData[t].sim_number, document.getElementById("dialog_settings_object_edit_model").value = settingsObjectData[t].model, document.getElementById("dialog_settings_object_edit_vin").value = settingsObjectData[t].vin, document.getElementById("dialog_settings_object_edit_plate_number").value = settingsObjectData[t].plate_number, document.getElementById("dialog_settings_object_edit_icon").innerHTML = '<img src="' + settingsObjectData[t].icon + '" />', settingsEditData.object_icon = settingsObjectData[t].icon;
			var s = settingsObjectData[t].map_arrows;
			document.getElementById("dialog_settings_object_edit_arrow_no_connection").value = s.arrow_no_connection, $("#dialog_settings_object_edit_arrow_no_connection").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_arrow_stopped").value = s.arrow_stopped, $("#dialog_settings_object_edit_arrow_stopped").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_arrow_moving").value = s.arrow_moving, $("#dialog_settings_object_edit_arrow_moving").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_arrow_engine_idle").value = s.arrow_engine_idle, $("#dialog_settings_object_edit_arrow_engine_idle").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_map_icon").value = settingsObjectData[t].map_icon, $("#dialog_settings_object_edit_map_icon").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_tail_color").value = settingsObjectData[t].tail_color.substr(1), document.getElementById("dialog_settings_object_edit_tail_color").style.backgroundColor = settingsObjectData[t].tail_color, document.getElementById("dialog_settings_object_edit_tail_points").value = settingsObjectData[t].tail_points, document.getElementById("dialog_settings_object_edit_fcr_source").value = settingsObjectData[t].fcr.source, $("#dialog_settings_object_edit_fcr_source").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_fcr_measurement").value = settingsObjectData[t].fcr.measurement, $("#dialog_settings_object_edit_fcr_measurement").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_fcr_cost").value = settingsObjectData[t].fcr.cost, document.getElementById("dialog_settings_object_edit_fcr_summer").value = settingsObjectData[t].fcr.summer, document.getElementById("dialog_settings_object_edit_fcr_winter").value = settingsObjectData[t].fcr.winter, document.getElementById("dialog_settings_object_edit_fcr_winter_start").value = settingsObjectData[t].fcr.winter_start, document.getElementById("dialog_settings_object_edit_fcr_winter_end").value = settingsObjectData[t].fcr.winter_end, settingsObjectEditSwitchFCRMeasurement(), document.getElementById("settings_object_accuracy_time_adj").value = settingsObjectData[t].time_adj, $("#settings_object_accuracy_time_adj").multipleSelect("refresh"), document.getElementById("settings_object_accuracy_detect_stops").value = settingsObjectData[t].accuracy.stops, $("#settings_object_accuracy_detect_stops").multipleSelect("refresh"), document.getElementById("settings_object_accuracy_route_length").value = settingsObjectData[t].accuracy.route_length, $("#settings_object_accuracy_route_length").multipleSelect("refresh"), document.getElementById("settings_object_accuracy_moving_speed").value = settingsObjectData[t].accuracy.min_moving_speed, document.getElementById("settings_object_accuracy_idle_speed").value = settingsObjectData[t].accuracy.min_idle_speed, document.getElementById("settings_object_accuracy_diff_points").value = settingsObjectData[t].accuracy.min_diff_points, document.getElementById("settings_object_accuracy_use_gpslev").checked = settingsObjectData[t].accuracy.use_gpslev, document.getElementById("settings_object_accuracy_gpslev").value = settingsObjectData[t].accuracy.min_gpslev, document.getElementById("settings_object_accuracy_use_hdop").checked = settingsObjectData[t].accuracy.use_hdop, document.getElementById("settings_object_accuracy_hdop").value = settingsObjectData[t].accuracy.max_hdop, document.getElementById("settings_object_accuracy_ign_fuel_cons_stops").checked = settingsObjectData[t].accuracy.ign_fuel_cons_stops, document.getElementById("settings_object_accuracy_fuel_speed").value = settingsObjectData[t].accuracy.min_fuel_speed, document.getElementById("settings_object_accuracy_ff").value = settingsObjectData[t].accuracy.min_ff, document.getElementById("settings_object_accuracy_ft").value = settingsObjectData[t].accuracy.min_ft, document.getElementById("settings_object_accuracy_unassign_driver").checked = strToBoolean(settingsObjectData[t].unassign_driver), document.getElementById("settings_object_accuracy_accvirt").checked = strToBoolean(settingsObjectData[t].accvirt), initSelectList("forward_loc_data_object_list"), document.getElementById("settings_object_accuracy_forward_loc_data").checked = strToBoolean(settingsObjectData[t].forward_loc_data), document.getElementById("settings_object_accuracy_forward_loc_data_object_list").value = settingsObjectData[t].forward_loc_data_imei, document.getElementById("dialog_settings_object_edit_odometer_type").value = settingsObjectData[t].odometer_type, $("#dialog_settings_object_edit_odometer_type").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_engine_hours_type").value = settingsObjectData[t].engine_hours_type, $("#dialog_settings_object_edit_engine_hours_type").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_odometer").value = settingsObjectData[t].odometer, document.getElementById("dialog_settings_object_edit_engine_hours").value = settingsObjectData[t].engine_hours, settingsEditData.odometer = settingsObjectData[t].odometer, settingsEditData.engine_hours = settingsObjectData[t].engine_hours, $("#settings_object_sensor_list_grid").jqGrid("setGridParam", {
				url: "func/fn_settings.sensors.php?cmd=load_object_sensor_list&imei=" + t
			}).trigger("reloadGrid"), $("#settings_object_service_list_grid").jqGrid("setGridParam", {
				url: "func/fn_settings.service.php?cmd=load_object_service_list&imei=" + t
			}).trigger("reloadGrid"), $("#settings_object_custom_fields_list_grid").jqGrid("setGridParam", {
				url: "func/fn_settings.customfields.php?cmd=load_object_custom_field_list&imei=" + t
			}).trigger("reloadGrid"), $("#settings_object_info_list_grid").jqGrid("setGridParam", {
				url: "func/fn_settings.objects.php?cmd=load_object_info_list&imei=" + t
			}).trigger("reloadGrid"), $("#dialog_settings_object_edit").dialog("open");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			a = document.getElementById("dialog_settings_object_edit_group").value, i = document.getElementById("dialog_settings_object_edit_driver").value, o = document.getElementById("dialog_settings_object_edit_trailer").value;
			var n = document.getElementById("dialog_settings_object_edit_name").value,
				l = settingsEditData.object_icon;
			s = {
				arrow_no_connection: document.getElementById("dialog_settings_object_edit_arrow_no_connection").value,
				arrow_stopped: document.getElementById("dialog_settings_object_edit_arrow_stopped").value,
				arrow_moving: document.getElementById("dialog_settings_object_edit_arrow_moving").value,
				arrow_engine_idle: document.getElementById("dialog_settings_object_edit_arrow_engine_idle").value
			};
			s = JSON.stringify(s);
			var d = document.getElementById("dialog_settings_object_edit_map_icon").value,
				r = (t = settingsEditData.object_imei, document.getElementById("dialog_settings_object_edit_device").value),
				_ = document.getElementById("dialog_settings_object_edit_model").value,
				c = document.getElementById("dialog_settings_object_edit_vin").value,
				g = document.getElementById("dialog_settings_object_edit_plate_number").value,
				m = document.getElementById("dialog_settings_object_edit_sim_number").value,
				u = "#" + document.getElementById("dialog_settings_object_edit_tail_color").value,
				p = document.getElementById("dialog_settings_object_edit_tail_points").value,
				y = {
					source: document.getElementById("dialog_settings_object_edit_fcr_source").value,
					measurement: document.getElementById("dialog_settings_object_edit_fcr_measurement").value,
					cost: document.getElementById("dialog_settings_object_edit_fcr_cost").value,
					summer: document.getElementById("dialog_settings_object_edit_fcr_summer").value,
					winter: document.getElementById("dialog_settings_object_edit_fcr_winter").value,
					winter_start: document.getElementById("dialog_settings_object_edit_fcr_winter_start").value,
					winter_end: document.getElementById("dialog_settings_object_edit_fcr_winter_end").value
				};
			y = JSON.stringify(y), "" == document.getElementById("settings_object_accuracy_moving_speed").value && (document.getElementById("settings_object_accuracy_moving_speed").value = 6), "" == document.getElementById("settings_object_accuracy_idle_speed").value && (document.getElementById("settings_object_accuracy_idle_speed").value = 3), "" == document.getElementById("settings_object_accuracy_diff_points").value && (document.getElementById("settings_object_accuracy_diff_points").value = 5e-4), document.getElementById("settings_object_accuracy_gpslev").value < 1 && (document.getElementById("settings_object_accuracy_gpslev").value = 5), document.getElementById("settings_object_accuracy_hdop").value < 1 && (document.getElementById("settings_object_accuracy_hdop").value = 3), document.getElementById("settings_object_accuracy_fuel_speed").value < 1 && (document.getElementById("settings_object_accuracy_fuel_speed").value = 10), document.getElementById("settings_object_accuracy_ff").value < 1 && (document.getElementById("settings_object_accuracy_ff").value = 10), document.getElementById("settings_object_accuracy_ft").value < 1 && (document.getElementById("settings_object_accuracy_ft").value = 10);
			var h = document.getElementById("settings_object_accuracy_time_adj").value,
				v = {
					stops: document.getElementById("settings_object_accuracy_detect_stops").value,
					route_length: document.getElementById("settings_object_accuracy_route_length").value,
					min_moving_speed: document.getElementById("settings_object_accuracy_moving_speed").value,
					min_idle_speed: document.getElementById("settings_object_accuracy_idle_speed").value,
					min_diff_points: document.getElementById("settings_object_accuracy_diff_points").value,
					use_gpslev: document.getElementById("settings_object_accuracy_use_gpslev").checked,
					min_gpslev: document.getElementById("settings_object_accuracy_gpslev").value,
					use_hdop: document.getElementById("settings_object_accuracy_use_hdop").checked,
					max_hdop: document.getElementById("settings_object_accuracy_hdop").value,
					ign_fuel_cons_stops: document.getElementById("settings_object_accuracy_ign_fuel_cons_stops").checked,
					min_fuel_speed: document.getElementById("settings_object_accuracy_fuel_speed").value,
					min_ff: document.getElementById("settings_object_accuracy_ff").value,
					min_ft: document.getElementById("settings_object_accuracy_ft").value
				};
			v = JSON.stringify(v);
			var b = document.getElementById("settings_object_accuracy_unassign_driver").checked,
				E = document.getElementById("settings_object_accuracy_accvirt").checked,
				f = settingsEditData.object_accvirt_cn,
				I = document.getElementById("settings_object_accuracy_forward_loc_data").checked,
				B = document.getElementById("settings_object_accuracy_forward_loc_data_object_list").value,
				D = document.getElementById("dialog_settings_object_edit_odometer_type").value,
				O = document.getElementById("dialog_settings_object_edit_engine_hours_type").value,
				k = document.getElementById("dialog_settings_object_edit_odometer").value,
				j = document.getElementById("dialog_settings_object_edit_engine_hours").value;
			if (k == settingsEditData.odometer && (k = !1), j == settingsEditData.engine_hours && (j = !1), "" == n) {
				notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
				break
			}
			var T = {
				cmd: "edit_object",
				group_id: a,
				driver_id: i,
				trailer_id: o,
				name: n,
				imei: t,
				device: r,
				sim_number: m,
				model: _,
				vin: c,
				plate_number: g,
				icon: l,
				map_arrows: s,
				map_icon: d,
				tail_color: u,
				tail_points: p,
				fcr: y,
				time_adj: h,
				accuracy: v,
				unassign_driver: b,
				accvirt: E,
				accvirt_cn: f,
				forward_loc_data: I,
				forward_loc_data_imei: B,
				odometer_type: D,
				engine_hours_type: O,
				odometer: k,
				engine_hours: j
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.objects.php",
				data: T,
				cache: !1,
				success: function (e) {
					"OK" == e && (settingsReloadObjects(), $("#dialog_settings_object_edit").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			});
			break;
		case "cancel":
			$("#dialog_settings_object_edit").dialog("close")
	}
}

function settingsObjectEditSwitchTimeAdj() {
	confirmDialog(la.TIME_ADJ_WARNING, function (e) {
		if (!e) {
			var t = settingsEditData.object_imei;
			document.getElementById("settings_object_accuracy_time_adj").value = settingsObjectData[t].time_adj, $("#settings_object_accuracy_time_adj").multipleSelect("refresh")
		}
	})
}

function settingsObjectEditIcon() {
	$("#dialog_settings_object_edit_select_icon").dialog("open"), settingsObjectEditLoadDefaultIconList(), settingsObjectEditLoadCustomIconList()
}

function settingsObjectEditSelectDefaultIcon(e) {
	settingsEditData.object_icon = e, document.getElementById("dialog_settings_object_edit_icon").innerHTML = '<img src="' + e + '" />', $("#dialog_settings_object_edit_select_icon").dialog("close")
}

function settingsObjectEditSelectCustomIcon(e) {
	settingsEditData.object_icon = e, document.getElementById("dialog_settings_object_edit_icon").innerHTML = '<img src="' + e + '" />', $("#dialog_settings_object_edit_select_icon").dialog("close")
}

function settingsObjectEditLoadDefaultIconList() {
	0 == settingsEditData.default_icons_loaded && $.ajax({
		type: "POST",
		url: "func/fn_files.php",
		data: {
			path: "img/markers/objects"
		},
		dataType: "json",
		success: function (e) {
			var t = '<div class="row2">';
			for (document.getElementById("settings_object_edit_select_icon_default_list").innerHTML = "", i = 0; i < e.length; i++) {
				var a = "img/markers/objects/" + e[i];
				t += '<div class="icon-object-edit">', t += '<a href="#" onclick="settingsObjectEditSelectDefaultIcon(\'' + a + "');\">", t += '<img src="' + a + '" style="padding:5px; width: 32px; height: 32px;"/>', t += "</a>", t += "</div>"
			}
			t += "</div>", document.getElementById("settings_object_edit_select_icon_default_list").innerHTML = t, settingsEditData.default_icons_loaded = !0
		}
	})
}

function settingsObjectEditLoadCustomIconList() {
	0 == settingsEditData.custom_icons_loaded && $.ajax({
		type: "POST",
		url: "func/fn_files.php",
		data: {
			path: "data/user/objects"
		},
		dataType: "json",
		success: function (e) {
			var t = '<div class="row2">';
			for (document.getElementById("settings_object_edit_select_icon_custom_list").innerHTML = "", i = 0; i < e.length; i++) {
				var a = "data/user/objects/" + e[i];
				t += '<div class="icon-object-edit">', t += '<a href="#" onclick="settingsObjectEditSelectCustomIcon(\'' + a + "');\">", t += '<img src="' + a + '" style="padding:5px; width: 32px; height: 32px;"/>', t += "</a>", t += '<div class="icon-custom-delete">', t += '<a href="#" onclick="settingsObjectEditDeleteCustomIcon(\'' + a + "');\">", t += '<img border="0" src="theme/images/remove.svg" width="8px">', t += "</a>", t += "</div>", t += "</div>"
			}
			t += "</div>", document.getElementById("settings_object_edit_select_icon_custom_list").innerHTML = t, settingsEditData.custom_icons_loaded = !0
		}
	})
}

function settingsObjectEditUploadCustomIcon() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectEditUploadCustomIconFile, !1), document.getElementById("load_file").click())
}

function settingsObjectEditUploadCustomIconFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onloadend = function (e) {
		var a = e.target.result;
		if ("image/png" == t[0].type || "image/svg+xml" == t[0].type) {
			var i = new Image;
			i.src = a, i.onload = function () {
				if (i.src.includes("image/png")) {
					if (32 != i.width || 32 != i.height) return void notifyBox("error", la.ERROR, la.ICON_SIZE_SHOULD_BE_32_32);
					var e = "func/fn_upload.php?file=object_icon_png"
				} else e = "func/fn_upload.php?file=object_icon_svg";
				$.ajax({
					url: e,
					type: "POST",
					data: a,
					processData: !1,
					contentType: !1,
					success: function (e) {
						settingsEditData.custom_icons_loaded = !1, settingsObjectEditLoadCustomIconList()
					}
				})
			}, document.getElementById("load_file").value = ""
		} else notifyBox("error", la.ERROR, la.FILE_TYPE_MUST_BE_PNG_OR_SVG)
	}, a.readAsDataURL(t[0]), this.removeEventListener("change", settingsObjectEditUploadCustomIconFile, !1)
}

function settingsObjectEditDeleteCustomIcon(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_ICON, function (t) {
		if (t) {
			var a = {
				cmd: "delete_custom_icon",
				file: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.objects.php",
				data: a,
				success: function (e) {
					"OK" == e && (settingsEditData.custom_icons_loaded = !1, settingsObjectEditLoadCustomIconList())
				}
			})
		}
	})
}

function settingsObjectEditDeleteAllCustomIcon() {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_CUSTOM_ICONS, function (e) {
		if (e) {
			$.ajax({
				type: "POST",
				url: "func/fn_settings.objects.php",
				data: {
					cmd: "delete_all_custom_icons"
				},
				success: function (e) {
					"OK" == e && (settingsEditData.custom_icons_loaded = !1, settingsObjectEditLoadCustomIconList())
				}
			})
		}
	})
}

function settingsObjectEditSwitchFCRMeasurement() {
	"l100km" == document.getElementById("dialog_settings_object_edit_fcr_measurement").value ? (document.getElementById("dialog_settings_object_edit_fcr_cost_label").innerHTML = la.COST_PER_LITER, document.getElementById("dialog_settings_object_edit_fcr_summer_label").innerHTML = la.SUMMER_RATE_L100KM, document.getElementById("dialog_settings_object_edit_fcr_winter_label").innerHTML = la.WINTER_RATE_L100KM) : (document.getElementById("dialog_settings_object_edit_fcr_cost_label").innerHTML = la.COST_PER_GALLON, document.getElementById("dialog_settings_object_edit_fcr_summer_label").innerHTML = la.SUMMER_RATE_MPG, document.getElementById("dialog_settings_object_edit_fcr_winter_label").innerHTML = la.WINTER_RATE_MPG)
}

function settingsObjectEditAccvirt(e) {
	if (utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_edit")) {
		var t = settingsEditData.object_imei;
		switch (e) {
			case "open":
				var a = document.getElementById("dialog_settings_object_edit_accvirt_param");
				a.options.length = 0;
				for (var i = getObjectParamsArray(t), o = 0; o < i.length; o++) "accvirt" !== i[o] && a.options.add(new Option(i[o], i[o]));
				document.getElementById("dialog_settings_object_edit_accvirt_param").value = settingsObjectData[t].accvirt_cn.param, $("#dialog_settings_object_edit_accvirt_param").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_accvirt_1_cn").value = settingsObjectData[t].accvirt_cn.accvirt_1_cn, $("#dialog_settings_object_edit_accvirt_1_cn").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_accvirt_0_cn").value = settingsObjectData[t].accvirt_cn.accvirt_0_cn, $("#dialog_settings_object_edit_accvirt_0_cn").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_accvirt_1_val").value = settingsObjectData[t].accvirt_cn.accvirt_1_val, document.getElementById("dialog_settings_object_edit_accvirt_0_val").value = settingsObjectData[t].accvirt_cn.accvirt_0_val, $("#dialog_settings_object_edit_accvirt").dialog("open");
				break;
			case "save":
				var s = document.getElementById("dialog_settings_object_edit_accvirt_param").value,
					n = document.getElementById("dialog_settings_object_edit_accvirt_1_cn").value,
					l = document.getElementById("dialog_settings_object_edit_accvirt_0_cn").value,
					d = document.getElementById("dialog_settings_object_edit_accvirt_1_val").value,
					r = document.getElementById("dialog_settings_object_edit_accvirt_0_val").value;
				if ("" == s || "" == d || "" == r) {
					notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
					break
				}
				var _ = {
					param: s,
					accvirt_1_cn: n,
					accvirt_0_cn: l,
					accvirt_1_val: d,
					accvirt_0_val: r
				};
				settingsObjectData[t].accvirt_cn = _, settingsEditData.object_accvirt_cn = JSON.stringify(_), $("#dialog_settings_object_edit_accvirt").dialog("close");
				break;
			case "cancel":
				$("#dialog_settings_object_edit_accvirt").dialog("close")
		}
	}
}

function settingsObjectSensorResultPreview() {
	var e = settingsEditData.object_imei;
	if (null != objectsData[e].data[0]) {
		var t = objectsData[e].data[0].params,
			a = document.getElementById("dialog_settings_object_sensor_type").value,
			i = document.getElementById("dialog_settings_object_sensor_param").value,
			o = document.getElementById("dialog_settings_object_sensor_result_type").value,
			s = document.getElementById("dialog_settings_object_sensor_units").value,
			n = document.getElementById("dialog_settings_object_sensor_text_1").value,
			l = document.getElementById("dialog_settings_object_sensor_text_0").value,
			d = document.getElementById("dialog_settings_object_sensor_formula").value,
			r = document.getElementById("dialog_settings_object_sensor_lv").value,
			_ = document.getElementById("dialog_settings_object_sensor_hv").value,
			c = settingsEditData.sensor_calibration;
		1 == c.length && (c = []);
		var g = settingsEditData.sensor_dictionary,
			m = getParamValue(t, i);
		document.getElementById("dialog_settings_object_sensor_cur_param_val").value = m;
		var u = getSensorValue(t, {
			type: a,
			param: i,
			result_type: o,
			text_1: n,
			text_0: l,
			units: s,
			lv: r,
			hv: _,
			formula: d,
			calibration: c,
			dictionary: g
		});
		document.getElementById("dialog_settings_object_sensor_result_preview").value = u.value_full
	}
}

function settingsObjectSensorImport() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectSensorImportSENFile, !1), document.getElementById("load_file").click())
}

function settingsObjectSensorExport() {
	if (utilsCheckPrivileges("viewer")) {
		var e = "func/fn_export.php?format=sen&imei=" + settingsEditData.object_imei;
		window.location = e
	}
}

function settingsObjectSensorImportSENFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onload = function (e) {
		try {
			var t = $.parseJSON(e.target.result);
			if ("0.1v" == t.sen) {
				var a = settingsEditData.object_imei,
					i = t.sensors.length;
				if (0 == i) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
				confirmDialog(sprintf(la.SENSORS_FOUND, i) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function (t) {
					if (t) {
						loadingData(!0);
						var i = {
							format: "sen",
							data: e.target.result,
							imei: a
						};
						$.ajax({
							type: "POST",
							url: "func/fn_import.php",
							data: i,
							cache: !1,
							success: function (e) {
								loadingData(!1), "OK" == e && (settingsReloadObjects(), $("#settings_object_sensor_list_grid").trigger("reloadGrid"))
							},
							error: function (e, t) {
								loadingData(!1)
							}
						})
					}
				})
			} else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		} catch (e) {
			notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		}
		document.getElementById("load_file").value = ""
	}, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectSensorImportSENFile, !1)
}

function settingsObjectClearDetectedSensorCache() {
	var e = settingsEditData.object_imei;
	confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_CLEAR_DETECTED_SENSOR_CACHE, function (t) {
		if (t) {
			var a = {
				cmd: "clear_detected_sensor_cache",
				imei: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.sensors.php",
				data: a,
				success: function (e) {
					"OK" == e && (settingsReloadObjects(), $("#settings_object_sensor_list_grid").trigger("reloadGrid"))
				}
			})
		}
	})
}

function settingsObjectSensorProperties(a) {
	var b = settingsEditData.object_imei;
	switch (a) {
		default:
			var c = a;
			settingsEditData.sensor_id = c;
			var d = document.getElementById("dialog_settings_object_sensor_param");
			d.options.length = 0;
			for (var f = getObjectParamsArray(b), i = 0; i < f.length; i++) d.options.add(new Option(f[i], f[i]));
			document.getElementById("dialog_settings_object_sensor_type").value = settingsObjectData[b].sensors[c].type, $("#dialog_settings_object_sensor_type").multipleSelect("refresh"), settingsObjectSensorType(), document.getElementById("dialog_settings_object_sensor_result_type").value = settingsObjectData[b].sensors[c].result_type, $("#dialog_settings_object_sensor_result_type").multipleSelect("refresh"), settingsObjectSensorResultType(), document.getElementById("dialog_settings_object_sensor_name").value = settingsObjectData[b].sensors[c].name, document.getElementById("dialog_settings_object_sensor_param").value = settingsObjectData[b].sensors[c].param, $("#dialog_settings_object_sensor_param").multipleSelect("refresh"), document.getElementById("dialog_settings_object_sensor_units").value = settingsObjectData[b].sensors[c].units, document.getElementById("dialog_settings_object_sensor_text_1").value = settingsObjectData[b].sensors[c].text_1, document.getElementById("dialog_settings_object_sensor_text_0").value = settingsObjectData[b].sensors[c].text_0;
			var h = settingsObjectData[b].sensors[c].result_type;
			"abs" == h || "rel" == h ? (document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").checked = !1) : (document.getElementById("dialog_settings_object_sensor_data_list").checked = strToBoolean(settingsObjectData[b].sensors[c].data_list), document.getElementById("dialog_settings_object_sensor_popup").checked = strToBoolean(settingsObjectData[b].sensors[c].popup)), "value" != h && "accum" != h && "abs" != h && "rel" != h || (document.getElementById("dialog_settings_object_sensor_formula").value = settingsObjectData[b].sensors[c].formula), "percentage" == h ? (document.getElementById("dialog_settings_object_sensor_lv").value = settingsObjectData[b].sensors[c].lv, document.getElementById("dialog_settings_object_sensor_hv").value = settingsObjectData[b].sensors[c].hv) : (document.getElementById("dialog_settings_object_sensor_lv").value = "", document.getElementById("dialog_settings_object_sensor_hv").value = ""), "acc" == settingsObjectData[b].sensors[c].type ? document.getElementById("dialog_settings_object_sensor_acc_ignore").checked = !1 : document.getElementById("dialog_settings_object_sensor_acc_ignore").checked = strToBoolean(settingsObjectData[b].sensors[c].acc_ignore), document.getElementById("settings_object_sensor_calibration_x").value = "", document.getElementById("settings_object_sensor_calibration_y").value = "", settingsEditData.sensor_calibration = settingsObjectData[b].sensors[c].calibration.slice(0), settingsObjectSensorCalibrationList(), document.getElementById("settings_object_sensor_dictionary_value").value = "", document.getElementById("settings_object_sensor_dictionary_text").value = "", settingsEditData.sensor_dictionary = settingsObjectData[b].sensors[c].dictionary.slice(0), settingsObjectSensorDictionaryList(), document.getElementById("dialog_settings_object_sensor_cur_param_val").value = "", document.getElementById("dialog_settings_object_sensor_result_preview").value = "", $("#dialog_settings_object_sensor_properties").dialog("open"), settingsObjectSensorResultPreview();
			break;
		case "add":
			if (settingsEditData.sensor_id = !1, "" != settingsObjectData[b].params) {
				var d = document.getElementById("dialog_settings_object_sensor_param");
				d.options.length = 0;
				for (var f = getObjectParamsArray(b), i = 0; i < f.length; i++) d.options.add(new Option(f[i], f[i]));
				document.getElementById("dialog_settings_object_sensor_type").value = "batt", $("#dialog_settings_object_sensor_type").multipleSelect("refresh"), settingsObjectSensorType(), document.getElementById("dialog_settings_object_sensor_result_type").value = "value", $("#dialog_settings_object_sensor_result_type").multipleSelect("refresh"), settingsObjectSensorResultType(), document.getElementById("dialog_settings_object_sensor_name").value = "", document.getElementById("dialog_settings_object_sensor_param").value = "", $("#dialog_settings_object_sensor_param").multipleSelect("refresh"), document.getElementById("dialog_settings_object_sensor_data_list").checked = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").checked = !1, document.getElementById("dialog_settings_object_sensor_cur_param_val").value = "", document.getElementById("dialog_settings_object_sensor_result_preview").value = "", $("#dialog_settings_object_sensor_properties").dialog("open")
			} else notifyBox("info", la.INFORMATION, la.SENSOR_PARAMETERS_ARE_NOT_DETECTED_FOR_THIS_GPS_DEVICE);
			break;
		case "cancel":
			$("#dialog_settings_object_sensor_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var j = document.getElementById("dialog_settings_object_sensor_name").value,
				type = document.getElementById("dialog_settings_object_sensor_type").value,
				param = document.getElementById("dialog_settings_object_sensor_param").value,
				data_list = document.getElementById("dialog_settings_object_sensor_data_list").checked,
				popup = document.getElementById("dialog_settings_object_sensor_popup").checked,
				h = document.getElementById("dialog_settings_object_sensor_result_type").value,
				units = document.getElementById("dialog_settings_object_sensor_units").value,
				text_1 = document.getElementById("dialog_settings_object_sensor_text_1").value,
				text_0 = document.getElementById("dialog_settings_object_sensor_text_0").value,
				lv = document.getElementById("dialog_settings_object_sensor_lv").value,
				hv = document.getElementById("dialog_settings_object_sensor_hv").value,
				acc_ignore = document.getElementById("dialog_settings_object_sensor_acc_ignore").checked,
				formula = document.getElementById("dialog_settings_object_sensor_formula").value;
			if (("" == j || "" == param) && "abs" == h) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if (("" == j || "" == param) && "rel" == h) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if (("" == j || "" == param || "" == text_1 || "" == text_0) && "logic" == h) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if (("" == j || "" == param) && "value" == h) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if (("" == j || "" == param) && "string" == h && "blueid" != type) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if (("" == j || "" == param || "" == lv || "" == hv) && "percentage" == h) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if ("" != formula) {
				formula = formula.toLowerCase(), formula = formula.replace(/[^-()\d/*+.x]/g, "");
				var k = formula.replace("x", "1");
				try {
					eval(k)
				} catch (e) {
					if (e instanceof SyntaxError) {
						notifyBox("error", la.ERROR, la.FORMULA_IS_NOT);
						break
					}
					notifyBox("error", la.ERROR, la.FORMULA_IS_NOT);
					break
				}
				if (!formula.match("x")) {
					notifyBox("error", la.ERROR, la.FORMULA_IS_NOT);
					break
				}
			}
			if (0 == settingsEditData.sensor_id) {
				if (0 != getSensorFromType(b, "acc") && "acc" == type) {
					notifyBox("error", la.ERROR, la.IGNITION_SENSOR_IS_ALREADY_AVAILABLE);
					break
				}
				if (0 != getSensorFromType(b, "blueid") && "blueid" == type) {
					notifyBox("error", la.ERROR, la.BLUE_ID_SENSOR_IS_ALREADY_AVAILABLE);
					break
				}
				if (0 != getSensorFromType(b, "da") && "da" == type) {
					notifyBox("error", la.ERROR, la.DRIVER_ASSIGN_SENSOR_IS_ALREADY_AVAILABLE);
					break
				}
				if (0 != getSensorFromType(b, "engh") && "engh" == type) {
					notifyBox("error", la.ERROR, la.ENGINE_HOURS_SENSOR_IS_ALREADY_AVAILABLE);
					break
				}
				if (0 != getSensorFromType(b, "fuelsumup") && "fuelsumup" == type) {
					notifyBox("error", la.ERROR, la.FUEL_LEVEL_SUM_UP_SENSOR_IS_ALREADY_AVAILABLE);
					break
				}
				if (0 != getSensorFromType(b, "fuelcons") && "fuelcons" == type) {
					notifyBox("error", la.ERROR, la.FUEL_CONSUMPTION_SENSOR_IS_ALREADY_AVAILABLE);
					break
				}
				if (0 != getSensorFromType(b, "odo") && "odo" == type) {
					notifyBox("error", la.ERROR, la.ODOMETER_SENSOR_IS_ALREADY_AVAILABLE);
					break
				}
				if (0 != getSensorFromType(b, "pa") && "pa" == type) {
					notifyBox("error", la.ERROR, la.PASSENGER_ASSIGN_SENSOR_IS_ALREADY_AVAILABLE);
					break
				}
				if (0 != getSensorFromType(b, "ta") && "ta" == type) {
					notifyBox("error", la.ERROR, la.TRAILER_ASSIGN_SENSOR_IS_ALREADY_AVAILABLE);
					break
				}
			}
			var l = settingsEditData.sensor_calibration;
			if (1 == l.length) {
				notifyBox("error", la.ERROR, la.AT_LEAST_TWO_CALIBRATION_POINTS);
				break
			}
			var l = JSON.stringify(l),
				dictionary = settingsEditData.sensor_dictionary,
				dictionary = JSON.stringify(dictionary),
				data = {
					cmd: "save_object_sensor",
					sensor_id: settingsEditData.sensor_id,
					imei: b,
					name: j,
					type: type,
					param: param,
					data_list: data_list,
					popup: popup,
					result_type: h,
					text_1: text_1,
					text_0: text_0,
					units: units,
					lv: lv,
					hv: hv,
					acc_ignore: acc_ignore,
					formula: formula,
					calibration: l,
					dictionary: dictionary
				};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.sensors.php",
				data: data,
				cache: !1,
				success: function (e) {
					"OK" == e && (settingsReloadObjects(), $("#settings_object_sensor_list_grid").trigger("reloadGrid"), $("#dialog_settings_object_sensor_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function settingsObjectSensorDelete(e) {
	if (utilsCheckPrivileges("viewer")) {
		var t = settingsEditData.object_imei;
		confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (a) {
			if (a) {
				var i = {
					cmd: "delete_object_sensor",
					sensor_id: e,
					imei: t
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.sensors.php",
					data: i,
					success: function (e) {
						"OK" == e && (settingsReloadObjects(), $("#settings_object_sensor_list_grid").trigger("reloadGrid"))
					}
				})
			}
		})
	}
}

function settingsObjectSensorDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = settingsEditData.object_imei,
			t = $("#settings_object_sensor_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != t ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (a) {
			if (a) {
				var i = {
					cmd: "delete_selected_object_sensors",
					items: t,
					imei: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.sensors.php",
					data: i,
					success: function (e) {
						"OK" == e && (settingsReloadObjects(), $("#settings_object_sensor_list_grid").trigger("reloadGrid"))
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function settingsObjectSensorCalibrationList() {
	var e = settingsEditData.sensor_calibration,
		t = [],
		a = $("#settings_object_sensor_calibration_list_grid");
	if (a.clearGridData(!0), 0 != e.length) {
		for (var i = 0; i < e.length; i++) {
			var o = '<a href="#" onclick="settingsObjectSensorCalibrationDel(' + i + ');" title="' + la.DELETE + '"><img src="theme/images/remove3.svg" /></a>';
			t.push({
				x: e[i].x,
				y: e[i].y,
				modify: o
			})
		}
		for (i = 0; i < t.length; i++) a.jqGrid("addRowData", i, t[i]);
		a.setGridParam({
			sortname: "x",
			sortorder: "asc"
		}).trigger("reloadGrid")
	}
}

function settingsObjectSensorCalibrationAdd() {
	var e = document.getElementById("settings_object_sensor_calibration_x").value,
		t = document.getElementById("settings_object_sensor_calibration_y").value;
	isNumber(e) || (e = 0), isNumber(t) || (t = 0);
	for (var a = 0; a < settingsEditData.sensor_calibration.length; a++)
		if (settingsEditData.sensor_calibration[a].x == e) return void notifyBox("error", la.ERROR, la.VALUE_IS_ALREADY_AVAILABLE);
	settingsEditData.sensor_calibration.push({
		x: e,
		y: t
	}), document.getElementById("settings_object_sensor_calibration_x").value = "", document.getElementById("settings_object_sensor_calibration_y").value = "", settingsObjectSensorCalibrationList()
}

function settingsObjectSensorCalibrationDel(e) {
	settingsEditData.sensor_calibration.splice(e, 1), settingsObjectSensorCalibrationList()
}

function settingsObjectSensorDictionaryList() {
	var e = settingsEditData.sensor_dictionary,
		t = [],
		a = $("#settings_object_sensor_dictionary_list_grid");
	if (a.clearGridData(!0), 0 != e.length) {
		for (var i = 0; i < e.length; i++) {
			var o = '<a href="#" onclick="settingsObjectSensorDictionaryDel(' + i + ');" title="' + la.DELETE + '"><img src="theme/images/remove3.svg" /></a>';
			t.push({
				value: e[i].value,
				text: e[i].text,
				modify: o
			})
		}
		for (i = 0; i < t.length; i++) a.jqGrid("addRowData", i, t[i]);
		a.setGridParam({
			sortname: "value",
			sortorder: "asc"
		}).trigger("reloadGrid")
	}
}

function settingsObjectSensorDictionaryAdd() {
	var e = document.getElementById("settings_object_sensor_dictionary_value").value,
		t = document.getElementById("settings_object_sensor_dictionary_text").value;
	isNumber(e) || (e = 0);
	for (var a = 0; a < settingsEditData.sensor_dictionary.length; a++)
		if (settingsEditData.sensor_dictionary[a].value == e) return void notifyBox("error", la.ERROR, la.VALUE_IS_ALREADY_AVAILABLE);
	settingsEditData.sensor_dictionary.push({
		value: e,
		text: t
	}), document.getElementById("settings_object_sensor_dictionary_value").value = "", document.getElementById("settings_object_sensor_dictionary_text").value = "", settingsObjectSensorDictionaryList()
}

function settingsObjectSensorDictionaryDel(e) {
	settingsEditData.sensor_dictionary.splice(e, 1), settingsObjectSensorDictionaryList()
}

function settingsObjectSensorType() {
	var e = document.getElementById("dialog_settings_object_sensor_type").value,
		t = document.getElementById("dialog_settings_object_sensor_result_type");
	switch (t.options.length = 0, e) {
		case "batt":
			document.getElementById("dialog_settings_object_sensor_param").disabled = !1, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !1, t.options.add(new Option(la.VALUE, "value")), t.options.add(new Option("Percentage", "percentage"));
			break;
		case "blueid":
			document.getElementById("dialog_settings_object_sensor_param").value = "", document.getElementById("dialog_settings_object_sensor_param").disabled = !0, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !0, document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !0, document.getElementById("dialog_settings_object_sensor_acc_ignore").checked = !1, t.options.add(new Option(la.STRING, "string"));
			break;
		case "di":
		case "do":
			document.getElementById("dialog_settings_object_sensor_param").disabled = !1, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !1, t.options.add(new Option(la.LOGIC, "logic"));
			break;
		case "da":
			document.getElementById("dialog_settings_object_sensor_param").disabled = !1, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !0, document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !0, document.getElementById("dialog_settings_object_sensor_acc_ignore").checked = !1, t.options.add(new Option(la.STRING, "string"));
			break;
		case "engh":
			document.getElementById("dialog_settings_object_sensor_param").disabled = !1, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !0, document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !0, document.getElementById("dialog_settings_object_sensor_acc_ignore").checked = !1, t.options.add(new Option(la.ABSOLUTE, "abs")), t.options.add(new Option(la.RELATIVE, "rel"));
			break;
		case "fuel":
			document.getElementById("dialog_settings_object_sensor_param").disabled = !1, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !1, t.options.add(new Option(la.VALUE, "value")), t.options.add(new Option("Percentage", "percentage"));
			break;
		case "fuelsumup":
			document.getElementById("dialog_settings_object_sensor_param").value = "", document.getElementById("dialog_settings_object_sensor_param").disabled = !0, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !0, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !0, document.getElementById("dialog_settings_object_sensor_acc_ignore").checked = !1;
			break;
		case "fuelcons":
			document.getElementById("dialog_settings_object_sensor_param").disabled = !1, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !0, document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !1, t.options.add(new Option(la.ABSOLUTE, "abs")), t.options.add(new Option(la.RELATIVE, "rel"));
			break;
		case "gsm":
		case "gps":
			document.getElementById("dialog_settings_object_sensor_param").disabled = !1, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !1, t.options.add(new Option(la.VALUE, "value")), t.options.add(new Option("Percentage", "percentage"));
			break;
		case "acc":
			document.getElementById("dialog_settings_object_sensor_param").disabled = !1, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !0, document.getElementById("dialog_settings_object_sensor_acc_ignore").checked = !1, t.options.add(new Option(la.LOGIC, "logic"));
			break;
		case "odo":
			document.getElementById("dialog_settings_object_sensor_param").disabled = !1, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !0, document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !0, document.getElementById("dialog_settings_object_sensor_acc_ignore").checked = !1, t.options.add(new Option(la.ABSOLUTE, "abs")), t.options.add(new Option(la.RELATIVE, "rel"));
			break;
		case "pa":
			document.getElementById("dialog_settings_object_sensor_param").disabled = !1, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !0, document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !0, document.getElementById("dialog_settings_object_sensor_acc_ignore").checked = !1, t.options.add(new Option(la.STRING, "string"));
			break;
		case "temp":
			document.getElementById("dialog_settings_object_sensor_param").disabled = !1, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !1, t.options.add(new Option(la.VALUE, "value"));
			break;
		case "ta":
			document.getElementById("dialog_settings_object_sensor_param").disabled = !1, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !0, document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !0, document.getElementById("dialog_settings_object_sensor_acc_ignore").checked = !1, t.options.add(new Option(la.STRING, "string"));
			break;
		case "cust":
			document.getElementById("dialog_settings_object_sensor_param").disabled = !1, document.getElementById("dialog_settings_object_sensor_data_list").disabled = !1, document.getElementById("dialog_settings_object_sensor_popup").disabled = !1, document.getElementById("dialog_settings_object_sensor_result_type").disabled = !1, document.getElementById("dialog_settings_object_sensor_acc_ignore").disabled = !1, t.options.add(new Option(la.LOGIC, "logic")), t.options.add(new Option(la.VALUE, "value")), t.options.add(new Option(la.STRING, "string")), t.options.add(new Option(la.PERCENTAGE, "percentage"))
	}
	settingsObjectSensorResultType()
}

function settingsObjectSensorResultType() {
	switch (document.getElementById("dialog_settings_object_sensor_units").value = "", document.getElementById("dialog_settings_object_sensor_text_1").value = "", document.getElementById("dialog_settings_object_sensor_text_0").value = "", document.getElementById("dialog_settings_object_sensor_lv").value = "", document.getElementById("dialog_settings_object_sensor_hv").value = "", document.getElementById("dialog_settings_object_sensor_formula").value = "", document.getElementById("settings_object_sensor_calibration_x").value = "", document.getElementById("settings_object_sensor_calibration_y").value = "", settingsEditData.sensor_calibration = [], $("#settings_object_sensor_calibration_list_grid").clearGridData(!0), document.getElementById("settings_object_sensor_dictionary_value").value = "", document.getElementById("settings_object_sensor_dictionary_text").value = "", settingsEditData.sensor_dictionary = [], $("#settings_object_sensor_dictionary_list_grid").clearGridData(!0), document.getElementById("dialog_settings_object_sensor_result_type").value) {
		case "":
			document.getElementById("dialog_settings_object_sensor_units").disabled = !1, document.getElementById("dialog_settings_object_sensor_text_1").disabled = !0, document.getElementById("dialog_settings_object_sensor_text_0").disabled = !0, document.getElementById("dialog_settings_object_sensor_lv").disabled = !0, document.getElementById("dialog_settings_object_sensor_hv").disabled = !0, document.getElementById("dialog_settings_object_sensor_formula").disabled = !0, $("#settings_object_sensor_calibration_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("settings_object_sensor_calibration_x").disabled = !0, document.getElementById("settings_object_sensor_calibration_y").disabled = !0, document.getElementById("settings_object_sensor_calibration_add").disabled = !0, $("#settings_object_sensor_dictionary_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("settings_object_sensor_dictionary_value").disabled = !0, document.getElementById("settings_object_sensor_dictionary_text").disabled = !0, document.getElementById("settings_object_sensor_dictionary_add").disabled = !0;
			break;
		case "abs":
		case "rel":
			document.getElementById("dialog_settings_object_sensor_units").disabled = !0, document.getElementById("dialog_settings_object_sensor_text_1").disabled = !0, document.getElementById("dialog_settings_object_sensor_text_0").disabled = !0, document.getElementById("dialog_settings_object_sensor_lv").disabled = !0, document.getElementById("dialog_settings_object_sensor_hv").disabled = !0, document.getElementById("dialog_settings_object_sensor_formula").disabled = !1, $("#settings_object_sensor_calibration_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("settings_object_sensor_calibration_x").disabled = !0, document.getElementById("settings_object_sensor_calibration_y").disabled = !0, document.getElementById("settings_object_sensor_calibration_add").disabled = !0, $("#settings_object_sensor_dictionary_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("settings_object_sensor_dictionary_value").disabled = !0, document.getElementById("settings_object_sensor_dictionary_text").disabled = !0, document.getElementById("settings_object_sensor_dictionary_add").disabled = !0;
			break;
		case "logic":
			document.getElementById("dialog_settings_object_sensor_units").disabled = !0, document.getElementById("dialog_settings_object_sensor_text_1").disabled = !1, document.getElementById("dialog_settings_object_sensor_text_0").disabled = !1, document.getElementById("dialog_settings_object_sensor_lv").disabled = !0, document.getElementById("dialog_settings_object_sensor_hv").disabled = !0, document.getElementById("dialog_settings_object_sensor_formula").disabled = !0, $("#settings_object_sensor_calibration_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("settings_object_sensor_calibration_x").disabled = !0, document.getElementById("settings_object_sensor_calibration_y").disabled = !0, document.getElementById("settings_object_sensor_calibration_add").disabled = !0, $("#settings_object_sensor_dictionary_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("settings_object_sensor_dictionary_value").disabled = !0, document.getElementById("settings_object_sensor_dictionary_text").disabled = !0, document.getElementById("settings_object_sensor_dictionary_add").disabled = !0;
			break;
		case "value":
			document.getElementById("dialog_settings_object_sensor_units").disabled = !1, document.getElementById("dialog_settings_object_sensor_text_1").disabled = !0, document.getElementById("dialog_settings_object_sensor_text_0").disabled = !0, document.getElementById("dialog_settings_object_sensor_lv").disabled = !0, document.getElementById("dialog_settings_object_sensor_hv").disabled = !0, document.getElementById("dialog_settings_object_sensor_formula").disabled = !1, $("#settings_object_sensor_calibration_list_grid").closest(".ui-jqgrid").unblock(), document.getElementById("settings_object_sensor_calibration_x").disabled = !1, document.getElementById("settings_object_sensor_calibration_y").disabled = !1, document.getElementById("settings_object_sensor_calibration_add").disabled = !1, "cust" == document.getElementById("dialog_settings_object_sensor_type").value ? ($("#settings_object_sensor_dictionary_list_grid").closest(".ui-jqgrid").unblock(), document.getElementById("settings_object_sensor_dictionary_value").disabled = !1, document.getElementById("settings_object_sensor_dictionary_text").disabled = !1, document.getElementById("settings_object_sensor_dictionary_add").disabled = !1) : ($("#settings_object_sensor_dictionary_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("settings_object_sensor_dictionary_value").disabled = !0, document.getElementById("settings_object_sensor_dictionary_text").disabled = !0, document.getElementById("settings_object_sensor_dictionary_add").disabled = !0);
			break;
		case "string":
			document.getElementById("dialog_settings_object_sensor_units").disabled = !0, document.getElementById("dialog_settings_object_sensor_text_1").disabled = !0, document.getElementById("dialog_settings_object_sensor_text_0").disabled = !0, document.getElementById("dialog_settings_object_sensor_lv").disabled = !0, document.getElementById("dialog_settings_object_sensor_hv").disabled = !0, document.getElementById("dialog_settings_object_sensor_formula").disabled = !0, $("#settings_object_sensor_calibration_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("settings_object_sensor_calibration_x").disabled = !0, document.getElementById("settings_object_sensor_calibration_y").disabled = !0, document.getElementById("settings_object_sensor_calibration_add").disabled = !0, $("#settings_object_sensor_dictionary_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("settings_object_sensor_dictionary_value").disabled = !0, document.getElementById("settings_object_sensor_dictionary_text").disabled = !0, document.getElementById("settings_object_sensor_dictionary_add").disabled = !0;
			break;
		case "percentage":
			document.getElementById("dialog_settings_object_sensor_units").value = "%", document.getElementById("dialog_settings_object_sensor_units").disabled = !0, document.getElementById("dialog_settings_object_sensor_text_1").disabled = !0, document.getElementById("dialog_settings_object_sensor_text_0").disabled = !0, document.getElementById("dialog_settings_object_sensor_lv").disabled = !1, document.getElementById("dialog_settings_object_sensor_hv").disabled = !1, document.getElementById("dialog_settings_object_sensor_formula").disabled = !0, $("#settings_object_sensor_calibration_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("settings_object_sensor_calibration_x").disabled = !0, document.getElementById("settings_object_sensor_calibration_y").disabled = !0, document.getElementById("settings_object_sensor_calibration_add").disabled = !0, $("#settings_object_sensor_dictionary_list_grid").closest(".ui-jqgrid").block({
				message: ""
			}), document.getElementById("settings_object_sensor_dictionary_value").disabled = !0, document.getElementById("settings_object_sensor_dictionary_text").disabled = !0, document.getElementById("settings_object_sensor_dictionary_add").disabled = !0
	}
}

function settingsObjectServiceImport() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectServiceImportSERFile, !1), document.getElementById("load_file").click())
}

function settingsObjectServiceExport() {
	if (utilsCheckPrivileges("viewer")) {
		var e = "func/fn_export.php?format=ser&imei=" + settingsEditData.object_imei;
		window.location = e
	}
}

function settingsObjectServiceImportSERFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onload = function (e) {
		try {
			var t = $.parseJSON(e.target.result);
			if ("0.1v" == t.ser) {
				var a = settingsEditData.object_imei,
					i = t.services.length;
				if (0 == i) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
				confirmDialog(sprintf(la.SERVICES_FOUND, i) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function (t) {
					if (t) {
						loadingData(!0);
						var i = {
							format: "ser",
							data: e.target.result,
							imei: a
						};
						$.ajax({
							type: "POST",
							url: "func/fn_import.php",
							data: i,
							cache: !1,
							success: function (e) {
								loadingData(!1), "OK" == e && (settingsReloadObjects(), $("#settings_object_service_list_grid").trigger("reloadGrid"))
							},
							error: function (e, t) {
								loadingData(!1)
							}
						})
					}
				})
			} else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		} catch (e) {
			notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		}
		document.getElementById("load_file").value = ""
	}, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectServiceImportSERFile, !1)
}

function settingsObjectServiceProperties(e) {
	var t = settingsEditData.object_imei;
	switch (e) {
		default:
			var a = e;
			settingsEditData.service_id = a, document.getElementById("dialog_settings_object_service_name").value = settingsObjectData[t].service[a].name, document.getElementById("dialog_settings_object_service_data_list").checked = strToBoolean(settingsObjectData[t].service[a].data_list), document.getElementById("dialog_settings_object_service_popup").checked = strToBoolean(settingsObjectData[t].service[a].popup), document.getElementById("dialog_settings_object_service_odo").checked = strToBoolean(settingsObjectData[t].service[a].odo), 1 == document.getElementById("dialog_settings_object_service_odo").checked ? (document.getElementById("dialog_settings_object_service_odo_interval").value = settingsObjectData[t].service[a].odo_interval, document.getElementById("dialog_settings_object_service_odo_last").value = settingsObjectData[t].service[a].odo_last, document.getElementById("dialog_settings_object_service_odo_left").checked = strToBoolean(settingsObjectData[t].service[a].odo_left), document.getElementById("dialog_settings_object_service_odo_left_num").value = settingsObjectData[t].service[a].odo_left_num) : (document.getElementById("dialog_settings_object_service_odo_interval").value = "", document.getElementById("dialog_settings_object_service_odo_last").value = "", document.getElementById("dialog_settings_object_service_odo_left").checked = !1, document.getElementById("dialog_settings_object_service_odo_left_num").value = ""), document.getElementById("dialog_settings_object_service_engh").checked = strToBoolean(settingsObjectData[t].service[a].engh), 1 == document.getElementById("dialog_settings_object_service_engh").checked ? (document.getElementById("dialog_settings_object_service_engh_interval").value = settingsObjectData[t].service[a].engh_interval, document.getElementById("dialog_settings_object_service_engh_last").value = settingsObjectData[t].service[a].engh_last, document.getElementById("dialog_settings_object_service_engh_left").checked = strToBoolean(settingsObjectData[t].service[a].engh_left), document.getElementById("dialog_settings_object_service_engh_left_num").value = settingsObjectData[t].service[a].engh_left_num) : (document.getElementById("dialog_settings_object_service_engh_interval").value = "", document.getElementById("dialog_settings_object_service_engh_last").value = "", document.getElementById("dialog_settings_object_service_engh_left").checked = !1, document.getElementById("dialog_settings_object_service_engh_left_num").value = ""), document.getElementById("dialog_settings_object_service_days").checked = strToBoolean(settingsObjectData[t].service[a].days), 1 == document.getElementById("dialog_settings_object_service_days").checked ? (document.getElementById("dialog_settings_object_service_days_interval").value = settingsObjectData[t].service[a].days_interval, document.getElementById("dialog_settings_object_service_days_last").value = settingsObjectData[t].service[a].days_last, document.getElementById("dialog_settings_object_service_days_left").checked = strToBoolean(settingsObjectData[t].service[a].days_left), document.getElementById("dialog_settings_object_service_days_left_num").value = settingsObjectData[t].service[a].days_left_num) : (document.getElementById("dialog_settings_object_service_days_interval").value = "", document.getElementById("dialog_settings_object_service_days_last").value = "", document.getElementById("dialog_settings_object_service_days_left").checked = !1, document.getElementById("dialog_settings_object_service_days_left_num").value = ""), document.getElementById("dialog_settings_object_service_update_last").checked = strToBoolean(settingsObjectData[t].service[a].update_last), document.getElementById("dialog_settings_object_service_odo_curr").value = settingsObjectData[t].odometer, document.getElementById("dialog_settings_object_service_engh_curr").value = settingsObjectData[t].engine_hours, settingsObjectServiceCheck(), $("#dialog_settings_object_service_properties").dialog("open");
			break;
		case "add":
			settingsEditData.service_id = !1, document.getElementById("dialog_settings_object_service_name").value = "", document.getElementById("dialog_settings_object_service_data_list").checked = !1, document.getElementById("dialog_settings_object_service_popup").checked = !1, document.getElementById("dialog_settings_object_service_odo").checked = !1, document.getElementById("dialog_settings_object_service_odo_interval").value = "", document.getElementById("dialog_settings_object_service_odo_last").value = "", document.getElementById("dialog_settings_object_service_engh").checked = !1, document.getElementById("dialog_settings_object_service_engh_interval").value = "", document.getElementById("dialog_settings_object_service_engh_last").value = "", document.getElementById("dialog_settings_object_service_days").checked = !1, document.getElementById("dialog_settings_object_service_days_interval").value = "", document.getElementById("dialog_settings_object_service_days_last").value = "", document.getElementById("dialog_settings_object_service_odo_left").checked = !1, document.getElementById("dialog_settings_object_service_odo_left_num").value = "", document.getElementById("dialog_settings_object_service_engh_left").checked = !1, document.getElementById("dialog_settings_object_service_engh_left_num").value = "", document.getElementById("dialog_settings_object_service_days_left").checked = !1, document.getElementById("dialog_settings_object_service_days_left_num").value = "", document.getElementById("dialog_settings_object_service_update_last").checked = !1, document.getElementById("dialog_settings_object_service_odo_curr").value = settingsObjectData[t].odometer, document.getElementById("dialog_settings_object_service_engh_curr").value = settingsObjectData[t].engine_hours, settingsObjectServiceCheck(), $("#dialog_settings_object_service_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_settings_object_service_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var i = document.getElementById("dialog_settings_object_service_name").value,
				o = document.getElementById("dialog_settings_object_service_data_list").checked,
				s = document.getElementById("dialog_settings_object_service_popup").checked,
				n = document.getElementById("dialog_settings_object_service_odo").checked,
				l = document.getElementById("dialog_settings_object_service_odo_interval").value,
				d = document.getElementById("dialog_settings_object_service_odo_last").value,
				r = document.getElementById("dialog_settings_object_service_engh").checked,
				_ = document.getElementById("dialog_settings_object_service_engh_interval").value,
				c = document.getElementById("dialog_settings_object_service_engh_last").value,
				g = document.getElementById("dialog_settings_object_service_days").checked,
				m = document.getElementById("dialog_settings_object_service_days_interval").value,
				u = document.getElementById("dialog_settings_object_service_days_last").value,
				p = document.getElementById("dialog_settings_object_service_odo_left").checked,
				y = document.getElementById("dialog_settings_object_service_odo_left_num").value,
				h = document.getElementById("dialog_settings_object_service_engh_left").checked,
				v = document.getElementById("dialog_settings_object_service_engh_left_num").value,
				b = document.getElementById("dialog_settings_object_service_days_left").checked,
				E = document.getElementById("dialog_settings_object_service_days_left_num").value,
				f = document.getElementById("dialog_settings_object_service_update_last").checked;
			if ("" == i) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if (1 == n && ("" == l || "" == d)) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if (1 == r && ("" == _ || "" == c)) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if (1 == g && ("" == m || "" == u)) {
				notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
				break
			}
			if (parseFloat(l) <= parseFloat(y) && 1 == p) {
				notifyBox("error", la.ERROR, la.INTERVAL_VALUE_SHOULD_BE_GREATER_THAN_LEFT_VALUE);
				break
			}
			if (parseFloat(_) <= parseFloat(v) && 1 == h) {
				notifyBox("error", la.ERROR, la.INTERVAL_VALUE_SHOULD_BE_GREATER_THAN_LEFT_VALUE);
				break
			}
			if (parseFloat(m) <= parseFloat(E) && 1 == b) {
				notifyBox("error", la.ERROR, la.INTERVAL_VALUE_SHOULD_BE_GREATER_THAN_LEFT_VALUE);
				break
			}
			var I = {
				cmd: "save_object_service",
				service_id: settingsEditData.service_id,
				imei: t,
				name: i,
				data_list: o,
				popup: s,
				odo: n,
				odo_interval: l,
				odo_last: d,
				engh: r,
				engh_interval: _,
				engh_last: c,
				days: g,
				days_interval: m,
				days_last: u,
				odo_left: p,
				odo_left_num: y,
				engh_left: h,
				engh_left_num: v,
				days_left: b,
				days_left_num: E,
				update_last: f
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.service.php",
				data: I,
				cache: !1,
				success: function (e) {
					"OK" == e && (1 == $("#dialog_maintenance").dialog("isOpen") && $("#maintenance_list_grid").trigger("reloadGrid"), settingsReloadObjects(), $("#dialog_settings_object_service_properties").dialog("close"), $("#settings_object_service_list_grid").trigger("reloadGrid"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function settingsObjectServiceDelete(e) {
	if (utilsCheckPrivileges("viewer")) {
		var t = settingsEditData.object_imei;
		confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (a) {
			if (a) {
				var i = {
					cmd: "delete_object_service",
					service_id: e,
					imei: t
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.service.php",
					data: i,
					success: function (e) {
						"OK" == e && (1 == $("#dialog_maintenance").dialog("isOpen") && $("#maintenance_list_grid").trigger("reloadGrid"), settingsReloadObjects(), $("#settings_object_service_list_grid").trigger("reloadGrid"))
					}
				})
			}
		})
	}
}

function settingsObjectServiceDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = settingsEditData.object_imei,
			t = $("#settings_object_service_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != t ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (a) {
			if (a) {
				var i = {
					cmd: "delete_selected_object_services",
					items: t,
					imei: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.service.php",
					data: i,
					success: function (e) {
						"OK" == e && (settingsReloadObjects(), $("#settings_object_service_list_grid").trigger("reloadGrid"))
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function settingsObjectServiceCheck() {
	1 == document.getElementById("dialog_settings_object_service_odo").checked ? (document.getElementById("dialog_settings_object_service_odo_interval").disabled = !1, document.getElementById("dialog_settings_object_service_odo_last").disabled = !1, document.getElementById("dialog_settings_object_service_odo_left").disabled = !1, document.getElementById("dialog_settings_object_service_odo_left_num").disabled = !1) : (document.getElementById("dialog_settings_object_service_odo_interval").disabled = !0, document.getElementById("dialog_settings_object_service_odo_last").disabled = !0, document.getElementById("dialog_settings_object_service_odo_left").disabled = !0, document.getElementById("dialog_settings_object_service_odo_left_num").disabled = !0), 1 == document.getElementById("dialog_settings_object_service_engh").checked ? (document.getElementById("dialog_settings_object_service_engh_interval").disabled = !1, document.getElementById("dialog_settings_object_service_engh_last").disabled = !1, document.getElementById("dialog_settings_object_service_engh_left").disabled = !1, document.getElementById("dialog_settings_object_service_engh_left_num").disabled = !1) : (document.getElementById("dialog_settings_object_service_engh_interval").disabled = !0, document.getElementById("dialog_settings_object_service_engh_last").disabled = !0, document.getElementById("dialog_settings_object_service_engh_left").disabled = !0, document.getElementById("dialog_settings_object_service_engh_left_num").disabled = !0), 1 == document.getElementById("dialog_settings_object_service_days").checked ? (document.getElementById("dialog_settings_object_service_days_interval").disabled = !1, document.getElementById("dialog_settings_object_service_days_last").disabled = !1, document.getElementById("dialog_settings_object_service_days_left").disabled = !1, document.getElementById("dialog_settings_object_service_days_left_num").disabled = !1) : (document.getElementById("dialog_settings_object_service_days_interval").disabled = !0, document.getElementById("dialog_settings_object_service_days_last").disabled = !0, document.getElementById("dialog_settings_object_service_days_left").disabled = !0, document.getElementById("dialog_settings_object_service_days_left_num").disabled = !0), 1 == document.getElementById("dialog_settings_object_service_odo").checked || 1 == document.getElementById("dialog_settings_object_service_engh").checked || 1 == document.getElementById("dialog_settings_object_service_days").checked ? document.getElementById("dialog_settings_object_service_update_last").disabled = !1 : document.getElementById("dialog_settings_object_service_update_last").disabled = !0
}

function settingsObjectCustomFieldImport() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectCustomFieldImportCFLFile, !1), document.getElementById("load_file").click())
}

function settingsObjectCustomFieldExport() {
	if (utilsCheckPrivileges("viewer")) {
		var e = "func/fn_export.php?format=cfl&imei=" + settingsEditData.object_imei;
		window.location = e
	}
}

function settingsObjectCustomFieldImportCFLFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onload = function (e) {
		try {
			var t = $.parseJSON(e.target.result);
			if ("0.1v" == t.cfl) {
				var a = settingsEditData.object_imei,
					i = t.fields.length;
				if (0 == i) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
				confirmDialog(sprintf(la.CUSTOM_FIELDS_FOUND, i) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function (t) {
					if (t) {
						loadingData(!0);
						var i = {
							format: "cfl",
							data: e.target.result,
							imei: a
						};
						$.ajax({
							type: "POST",
							url: "func/fn_import.php",
							data: i,
							cache: !1,
							success: function (e) {
								loadingData(!1), "OK" == e && (settingsReloadObjects(), $("#settings_object_custom_fields_list_grid").trigger("reloadGrid"))
							},
							error: function (e, t) {
								loadingData(!1)
							}
						})
					}
				})
			} else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		} catch (e) {
			notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		}
		document.getElementById("load_file").value = ""
	}, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectCustomFieldImportCFLFile, !1)
}

function settingsObjectCustomFieldDelete(e) {
	if (utilsCheckPrivileges("viewer")) {
		var t = settingsEditData.object_imei;
		confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (a) {
			if (a) {
				var i = {
					cmd: "delete_object_custom_field",
					field_id: e,
					imei: t
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.customfields.php",
					data: i,
					success: function (e) {
						"OK" == e && (settingsReloadObjects(), $("#settings_object_custom_fields_list_grid").trigger("reloadGrid"))
					}
				})
			}
		})
	}
}

function settingsObjectCustomFieldDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = settingsEditData.object_imei,
			t = $("#settings_object_custom_fields_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != t ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (a) {
			if (a) {
				var i = {
					cmd: "delete_selected_object_custom_fields",
					items: t,
					imei: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.customfields.php",
					data: i,
					success: function (e) {
						"OK" == e && (settingsReloadObjects(), $("#settings_object_custom_fields_list_grid").trigger("reloadGrid"))
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function settingsObjectCustomFieldProperties(e) {
	var t = settingsEditData.object_imei;
	switch (e) {
		default:
			var a = e;
			settingsEditData.custom_field_id = a, document.getElementById("dialog_settings_object_custom_field_name").value = settingsObjectData[t].custom_fields[a].name, document.getElementById("dialog_settings_object_custom_field_value").value = settingsObjectData[t].custom_fields[a].value, document.getElementById("dialog_settings_object_custom_field_data_list").checked = strToBoolean(settingsObjectData[t].custom_fields[a].data_list), document.getElementById("dialog_settings_object_custom_field_popup").checked = strToBoolean(settingsObjectData[t].custom_fields[a].popup), $("#dialog_settings_object_custom_field_properties").dialog("open");
			break;
		case "add":
			settingsEditData.custom_field_id = !1, document.getElementById("dialog_settings_object_custom_field_name").value = "", document.getElementById("dialog_settings_object_custom_field_value").value = "", document.getElementById("dialog_settings_object_custom_field_data_list").checked = !0, document.getElementById("dialog_settings_object_custom_field_popup").checked = !0, $("#dialog_settings_object_custom_field_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_settings_object_custom_field_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var i = document.getElementById("dialog_settings_object_custom_field_name").value,
				o = document.getElementById("dialog_settings_object_custom_field_value").value,
				s = document.getElementById("dialog_settings_object_custom_field_data_list").checked,
				n = document.getElementById("dialog_settings_object_custom_field_popup").checked;
			if ("" == i) {
				notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
				break
			}
			var l = {
				cmd: "save_object_custom_field",
				field_id: settingsEditData.custom_field_id,
				imei: t,
				name: i,
				value: o,
				data_list: s,
				popup: n
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.customfields.php",
				data: l,
				cache: !1,
				success: function (e) {
					"OK" == e && (settingsReloadObjects(), $("#settings_object_custom_fields_list_grid").trigger("reloadGrid"), $("#dialog_settings_object_custom_field_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function settingsTemplateImport() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsTemplateImportTEMFile, !1), document.getElementById("load_file").click())
}

function settingsTemplateExport() {
	if (utilsCheckPrivileges("viewer")) {
		window.location = "func/fn_export.php?format=tem"
	}
}

function settingsTemplateImportTEMFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onload = function (e) {
		try {
			var t = $.parseJSON(e.target.result);
			if ("0.1v" == t.tem) {
				var a = t.templates.length;
				if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
				confirmDialog(sprintf(la.TEMPLATES_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function (t) {
					if (t) {
						loadingData(!0);
						var a = {
							format: "tem",
							data: e.target.result
						};
						$.ajax({
							type: "POST",
							url: "func/fn_import.php",
							data: a,
							cache: !1,
							success: function (e) {
								loadingData(!1), "OK" == e && settingsReloadTemplates()
							},
							error: function (e, t) {
								loadingData(!1)
							}
						})
					}
				})
			} else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		} catch (e) {
			notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
		}
		document.getElementById("load_file").value = ""
	}, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsTemplateImportTEMFile, !1)
}

function settingsTemplateProperties(e) {
	switch (e) {
		default:
			var t = e;
			settingsEditData.template_id = t, document.getElementById("dialog_settings_template_name").value = settingsTemplateData[t].name, document.getElementById("dialog_settings_template_desc").value = settingsTemplateData[t].desc, document.getElementById("dialog_settings_template_subject").value = settingsTemplateData[t].subject, document.getElementById("dialog_settings_template_message").value = settingsTemplateData[t].message, $("#dialog_settings_template_properties").dialog("open");
			break;
		case "add":
			settingsEditData.template_id = !1, document.getElementById("dialog_settings_template_name").value = "", document.getElementById("dialog_settings_template_desc").value = "", document.getElementById("dialog_settings_template_subject").value = "", document.getElementById("dialog_settings_template_message").value = "", $("#dialog_settings_template_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_settings_template_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var a = document.getElementById("dialog_settings_template_name").value,
				i = document.getElementById("dialog_settings_template_desc").value,
				o = document.getElementById("dialog_settings_template_subject").value,
				s = document.getElementById("dialog_settings_template_message").value;
			if ("" == a) {
				notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
				break
			}
			var n = {
				cmd: "save_template",
				template_id: settingsEditData.template_id,
				name: a,
				desc: i,
				subject: o,
				message: s
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.templates.php",
				data: n,
				cache: !1,
				success: function (e) {
					"OK" == e && (settingsReloadTemplates(), $("#dialog_settings_template_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
				}
			})
	}
}

function settingsTemplateDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_template",
				template_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.templates.php",
				data: a,
				success: function (e) {
					"OK" == e && settingsReloadTemplates()
				}
			})
		}
	})
}

function settingsTemplateDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#settings_main_templates_template_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_templates",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.templates.php",
					data: a,
					success: function (e) {
						"OK" == e && settingsReloadTemplates()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function settingsKMLUpload() {
	utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsKMLUploadFile, !1), document.getElementById("load_file").click())
}

function settingsKMLUploadFile(e) {
	var t = e.target.files,
		a = new FileReader;
	a.onloadend = function (e) {
		var a = t[0];
		"kml" == a.name.toLowerCase().split(".").pop() ? (document.getElementById("dialog_settings_kml_file").value = a.name, settingsEditData.kml_file.name = a.name, settingsEditData.kml_file.data = e.target.result, document.getElementById("load_file").value = "") : notifyBox("error", la.ERROR, la.FILE_TYPE_MUST_BE_KML)
	}, a.readAsDataURL(t[0]), this.removeEventListener("change", settingsKMLUploadFile, !1)
}

function settingsKMLProperties(e) {
	switch (e) {
		default:
			var t = e;
			settingsEditData.kml_id = t, settingsEditData.kml_file = new Array, document.getElementById("dialog_settings_kml_active").checked = strToBoolean(settingsKMLData[t].active), document.getElementById("dialog_settings_kml_name").value = settingsKMLData[t].name, document.getElementById("dialog_settings_kml_desc").value = settingsKMLData[t].desc, document.getElementById("dialog_settings_kml_file").value = settingsKMLData[t].file_name, document.getElementById("dialog_settings_kml_upload").disabled = !0, $("#dialog_settings_kml_properties").dialog("open");
			break;
		case "add":
			settingsEditData.kml_id = !1, settingsEditData.kml_file = new Array, document.getElementById("dialog_settings_kml_active").checked = !0, document.getElementById("dialog_settings_kml_name").value = "", document.getElementById("dialog_settings_kml_desc").value = "", document.getElementById("dialog_settings_kml_file").value = "", document.getElementById("dialog_settings_kml_upload").disabled = !1, $("#dialog_settings_kml_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_settings_kml_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var a = document.getElementById("dialog_settings_kml_active").checked,
				i = document.getElementById("dialog_settings_kml_name").value,
				o = document.getElementById("dialog_settings_kml_desc").value;
			if ("" == i) {
				notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
				break
			}
			if (0 == settingsEditData.kml_id) {
				if (void 0 === settingsEditData.kml_file.data) {
					notifyBox("error", la.ERROR, la.PLEASE_SELECT_KML_FILE);
					break
				}
				var s = {
					cmd: "save_kml",
					kml_id: settingsEditData.kml_id,
					active: a,
					name: i,
					desc: o,
					file_name: settingsEditData.kml_file.name,
					file_data: settingsEditData.kml_file.data
				}
			} else s = {
				cmd: "save_kml",
				kml_id: settingsEditData.kml_id,
				active: a,
				name: i,
				desc: o,
				file_name: "",
				file_data: ""
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.kml.php",
				data: s,
				cache: !1,
				success: function (e) {
					"OK" == e ? (settingsReloadKML(), $("#dialog_settings_kml_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY)) : "ERROR_TOTAL_SIZE_LIMIT" == e && notifyBox("error", la.ERROR, la.KML_SIZE_LIMIT_IS_REACHED)
				}
			})
	}
}

function settingsKMLDelete(e) {
	utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_kml",
				kml_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.kml.php",
				data: a,
				success: function (e) {
					"OK" == e && settingsReloadKML()
				}
			})
		}
	})
}

function settingsKMLDeleteSelected() {
	if (utilsCheckPrivileges("viewer")) {
		var e = $("#settings_main_kml_kml_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_kml",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.kml.php",
					data: a,
					success: function (e) {
						"OK" == e && settingsReloadKML()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}

function settingsSubaccountGenerateAU() {
	var e = settingsUserData.email + moment();
	return CryptoJS.MD5(e).toString().toUpperCase()
}

function settingsSubaccountCheck() {
	1 == document.getElementById("dialog_settings_subaccount_expire").checked ? document.getElementById("dialog_settings_subaccount_expire_dt").disabled = !1 : document.getElementById("dialog_settings_subaccount_expire_dt").disabled = !0
}

function settingsSubaccountProperties(e) {
	if (utilsCheckPrivileges("subuser") && utilsCheckPrivileges("subaccounts")) switch (e) {
		default:
			var t = e;
			settingsEditData.subaccount_id = t, document.getElementById("dialog_settings_subaccount_active").checked = strToBoolean(settingsSubaccountData[t].active), document.getElementById("dialog_settings_subaccount_username").value = settingsSubaccountData[t].username, document.getElementById("dialog_settings_subaccount_email").value = settingsSubaccountData[t].email, document.getElementById("dialog_settings_subaccount_password").value = "", document.getElementById("dialog_settings_subaccount_send").checked = !1;
			var a = strToBoolean(settingsSubaccountData[t].account_expire);
			document.getElementById("dialog_settings_subaccount_expire_dt").checked = a, document.getElementById("dialog_settings_subaccount_expire_dt").value = 1 == a ? settingsSubaccountData[t].account_expire_dt : "", document.getElementById("dialog_settings_subaccount_dashboard").checked = settingsSubaccountData[t].dashboard, document.getElementById("dialog_settings_subaccount_history").checked = settingsSubaccountData[t].history, document.getElementById("dialog_settings_subaccount_reports").checked = settingsSubaccountData[t].reports, document.getElementById("dialog_settings_subaccount_tachograph").checked = settingsSubaccountData[t].tachograph, document.getElementById("dialog_settings_subaccount_tasks").checked = settingsSubaccountData[t].tasks, document.getElementById("dialog_settings_subaccount_rilogbook").checked = settingsSubaccountData[t].rilogbook, document.getElementById("dialog_settings_subaccount_dtc").checked = settingsSubaccountData[t].dtc, document.getElementById("dialog_settings_subaccount_maintenance").checked = settingsSubaccountData[t].maintenance, document.getElementById("dialog_settings_subaccount_expenses").checked = settingsSubaccountData[t].expenses, document.getElementById("dialog_settings_subaccount_object_control").checked = settingsSubaccountData[t].object_control, document.getElementById("dialog_settings_subaccount_image_gallery").checked = settingsSubaccountData[t].image_gallery, document.getElementById("dialog_settings_subaccount_chat").checked = settingsSubaccountData[t].chat;
			var i = document.getElementById("dialog_settings_subaccount_available_objects"),
				o = settingsSubaccountData[t].imei.split(",");
			multiselectSetValues(i, o), $("#dialog_settings_subaccount_available_objects").multipleSelect("refresh");
			var s = document.getElementById("dialog_settings_subaccount_available_markers"),
				n = settingsSubaccountData[t].marker.split(",");
			multiselectSetValues(s, n), $("#dialog_settings_subaccount_available_markers").multipleSelect("refresh");
			var l = document.getElementById("dialog_settings_subaccount_available_routes"),
				d = settingsSubaccountData[t].route.split(",");
			multiselectSetValues(l, d), $("#dialog_settings_subaccount_available_routes").multipleSelect("refresh");
			var r = document.getElementById("dialog_settings_subaccount_available_zones"),
				_ = settingsSubaccountData[t].zone.split(",");
			multiselectSetValues(r, _), $("#dialog_settings_subaccount_available_zones").multipleSelect("refresh"), document.getElementById("dialog_settings_subaccount_au_active").checked = settingsSubaccountData[t].au_active, settingsEditData.subaccount_au = settingsSubaccountData[t].au, "" == settingsEditData.subaccount_au && (settingsEditData.subaccount_au = settingsSubaccountGenerateAU()), document.getElementById("dialog_settings_subaccount_au").value = gsValues.url_root + "/index.php?au=" + settingsEditData.subaccount_au, document.getElementById("dialog_settings_subaccount_au_mobile").value = gsValues.url_root + "/index.php?au=" + settingsEditData.subaccount_au + "&m=true", settingsSubaccountCheck(), $("#dialog_settings_subaccount_properties").dialog("open");
			break;
		case "add":
			settingsEditData.subaccount_id = !1, document.getElementById("dialog_settings_subaccount_active").checked = !0, document.getElementById("dialog_settings_subaccount_username").value = "", document.getElementById("dialog_settings_subaccount_email").value = "", document.getElementById("dialog_settings_subaccount_password").value = "", document.getElementById("dialog_settings_subaccount_send").checked = !0, document.getElementById("dialog_settings_subaccount_expire").checked = !1, document.getElementById("dialog_settings_subaccount_expire_dt").value = "", document.getElementById("dialog_settings_subaccount_dashboard").checked = !1, document.getElementById("dialog_settings_subaccount_history").checked = !1, document.getElementById("dialog_settings_subaccount_reports").checked = !1, document.getElementById("dialog_settings_subaccount_tachograph").checked = !1, document.getElementById("dialog_settings_subaccount_tasks").checked = !1, document.getElementById("dialog_settings_subaccount_rilogbook").checked = !1, document.getElementById("dialog_settings_subaccount_dtc").checked = !1, document.getElementById("dialog_settings_subaccount_maintenance").checked = !1, document.getElementById("dialog_settings_subaccount_expenses").checked = !1, document.getElementById("dialog_settings_subaccount_object_control").checked = !1, document.getElementById("dialog_settings_subaccount_image_gallery").checked = !1, document.getElementById("dialog_settings_subaccount_chat").checked = !1, $("#dialog_settings_subaccount_available_objects option:selected").removeAttr("selected"), $("#dialog_settings_subaccount_available_objects").multipleSelect("refresh"), $("#dialog_settings_subaccount_available_markers option:selected").removeAttr("selected"), $("#dialog_settings_subaccount_available_markers").multipleSelect("refresh"), $("#dialog_settings_subaccount_available_routes option:selected").removeAttr("selected"), $("#dialog_settings_subaccount_available_routes").multipleSelect("refresh"), $("#dialog_settings_subaccount_available_zones option:selected").removeAttr("selected"), $("#dialog_settings_subaccount_available_zones").multipleSelect("refresh"), document.getElementById("dialog_settings_subaccount_au_active").checked = !1, settingsEditData.subaccount_au = settingsSubaccountGenerateAU(), document.getElementById("dialog_settings_subaccount_au").value = gsValues.url_root + "/index.php?au=" + settingsEditData.subaccount_au, document.getElementById("dialog_settings_subaccount_au_mobile").value = gsValues.url_root + "/index.php?au=" + settingsEditData.subaccount_au + "&m=true", settingsSubaccountCheck(), $("#dialog_settings_subaccount_properties").dialog("open");
			break;
		case "cancel":
			$("#dialog_settings_subaccount_properties").dialog("close");
			break;
		case "save":
			if (!utilsCheckPrivileges("viewer")) return;
			var c = document.getElementById("dialog_settings_subaccount_active").checked,
				g = document.getElementById("dialog_settings_subaccount_username").value,
				m = document.getElementById("dialog_settings_subaccount_email").value,
				u = document.getElementById("dialog_settings_subaccount_password").value,
				p = document.getElementById("dialog_settings_subaccount_send").checked,
				y = (a = document.getElementById("dialog_settings_subaccount_expire").checked, document.getElementById("dialog_settings_subaccount_expire_dt").value);
			if ("" == g) {
				notifyBox("error", la.ERROR, la.USERNAME_CANT_BE_EMPTY);
				break
			}
			if (-1 != g.indexOf(" ")) {
				notifyBox("error", la.ERROR, la.USERNAME_SPACE_CHARACTERS);
				break
			}
			if (!isEmailValid(m)) {
				notifyBox("error", la.ERROR, la.THIS_EMAIL_IS_NOT_VALID);
				break
			}
			if (0 == settingsEditData.subaccount_id) {
				if ("" == u) {
					notifyBox("error", la.ERROR, la.PASSWORD_CANT_BE_EMPTY);
					break
				}
				if (-1 != u.indexOf(" ")) return void notifyBox("error", la.ERROR, la.PASSWORD_SPACE_CHARACTERS);
				if (u.length < 6) {
					notifyBox("error", la.ERROR, la.PASSWORD_LENGHT_AT_LEAST);
					break
				}
			} else if ("" != u && u.length < 6) {
				notifyBox("error", la.ERROR, la.PASSWORD_LENGHT_AT_LEAST);
				break
			}
			if (1 == a) {
				if ("" == y) return void notifyBox("error", la.ERROR, la.DATE_CANT_BE_EMPTY, !0)
			} else y = "";
			i = document.getElementById("dialog_settings_subaccount_available_objects"), s = document.getElementById("dialog_settings_subaccount_available_markers"), l = document.getElementById("dialog_settings_subaccount_available_routes"), r = document.getElementById("dialog_settings_subaccount_available_zones");
			var h = {
				cmd: "save_subaccount",
				subaccount_id: settingsEditData.subaccount_id,
				active: c,
				username: g,
				email: m,
				password: u,
				send: p,
				account_expire: a,
				account_expire_dt: y,
				dashboard: document.getElementById("dialog_settings_subaccount_dashboard").checked,
				history: document.getElementById("dialog_settings_subaccount_history").checked,
				reports: document.getElementById("dialog_settings_subaccount_reports").checked,
				tachograph: document.getElementById("dialog_settings_subaccount_tachograph").checked,
				tasks: document.getElementById("dialog_settings_subaccount_tasks").checked,
				rilogbook: document.getElementById("dialog_settings_subaccount_rilogbook").checked,
				dtc: document.getElementById("dialog_settings_subaccount_dtc").checked,
				maintenance: document.getElementById("dialog_settings_subaccount_maintenance").checked,
				expenses: document.getElementById("dialog_settings_subaccount_expenses").checked,
				object_control: document.getElementById("dialog_settings_subaccount_object_control").checked,
				image_gallery: document.getElementById("dialog_settings_subaccount_image_gallery").checked,
				chat: document.getElementById("dialog_settings_subaccount_chat").checked,
				imei: multiselectGetValues(i),
				marker: multiselectGetValues(s),
				route: multiselectGetValues(l),
				zone: multiselectGetValues(r),
				au_active: document.getElementById("dialog_settings_subaccount_au_active").checked,
				au: settingsEditData.subaccount_au
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.subaccounts.php",
				data: h,
				cache: !1,
				success: function (e) {
					"OK" == e ? (settingsReloadSubaccounts(), $("#dialog_settings_subaccount_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY)) : "ERROR_EMAIL_EXISTS" == e ? notifyBox("error", la.ERROR, la.THIS_EMAIL_ALREADY_EXISTS) : "ERROR_USERNAME_EXISTS" == e ? notifyBox("error", la.ERROR, la.THIS_USERNAME_ALREADY_EXISTS) : "ERROR_NOT_SENT" == e && notifyBox("error", la.ERROR, la.CANT_SEND_EMAIL + " " + la.PLEASE_CHECK_SERVER_EMAIL_SMTP_SETTINGS)
				}
			})
	}
}

function settingsSubaccountDelete(e) {
	utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("subaccounts") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function (t) {
		if (t) {
			var a = {
				cmd: "delete_subaccount",
				subaccount_id: e
			};
			$.ajax({
				type: "POST",
				url: "func/fn_settings.subaccounts.php",
				data: a,
				success: function (e) {
					"OK" == e && settingsReloadSubaccounts()
				}
			})
		}
	})
}

function settingsSubaccountDeleteSelected() {
	if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("subaccounts")) {
		var e = $("#settings_main_subaccount_list_grid").jqGrid("getGridParam", "selarrrow");
		"" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function (t) {
			if (t) {
				var a = {
					cmd: "delete_selected_subaccounts",
					items: e
				};
				$.ajax({
					type: "POST",
					url: "func/fn_settings.subaccounts.php",
					data: a,
					success: function (e) {
						"OK" == e && settingsReloadSubaccounts()
					}
				})
			}
		}) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
	}
}
settingsEditData.object_icon = !1, settingsEditData.object_imei = !1, settingsEditData.object_duplicate_imei = !1, settingsEditData.object_accvirt_cn = !1, settingsEditData.sensor_id = !1, settingsEditData.sensor_calibration = new Array, settingsEditData.sensor_dictionary = new Array, settingsEditData.service_id = !1, settingsEditData.custom_field_id = !1, settingsEditData.group_id = !1, settingsEditData.driver_id = !1, settingsEditData.driver_img_file = !1, settingsEditData.passenger_id = !1, settingsEditData.trailer_id = !1, settingsEditData.event_id = !1, settingsEditData.event_condition = new Array, settingsEditData.template_id = !1, settingsEditData.kml_id = !1, settingsEditData.kml_file = new Array, settingsEditData.subaccount_id = !1, settingsEditData.subaccount_au = !1, settingsEditData.default_icons_loaded = !1, settingsEditData.custom_icons_loaded = !1, gsValues.title = document.title, gsValues.map_fit_objects_finished = !1, gsValues.map_objects = !0, gsValues.map_object_labels = !0, gsValues.map_markers = !0, gsValues.map_routes = !0, gsValues.map_zones = !0, gsValues.map_kml = !0, gsValues.map_clusters = !0, gsValues.map_street_view = !1, gsValues.map_traffic = !1, gsValues.objects_visible = !0, gsValues.objects_follow = !1, gsValues.datalist_groups_colapsed = new Array, gsValues.datalist_groups_colapsed.object = new Array, gsValues.datalist_groups_colapsed.event = new Array, gsValues.datalist_groups_colapsed.route = new Array, gsValues.datalist_first_show = !0;
var la = [],
	map, mapPopup, mapMarkerIcons = new Array,
	mapLayers = new Array,
	objectsData = new Array,
	guiDragbars = new Array,
	menuOnItem, timer_objectLoadData;
guiDragbars.objects = 180, guiDragbars.events = 180, guiDragbars.history = 180, guiDragbars.bottom_panel = 178;
var isIE = eval("/*@cc_on!@*/!1");

function load() {
	if (isIE) {
		return '<div class="row">Please use one of these browsers:</div>', '<div class="row"><a href="http://www.mozilla.org/en-US/" target="_blank"><img style="border:0px" src="img/firefox.png" /></a>', "&nbsp;&nbsp;&nbsp;", '<a href="https://www.google.com/intl/en/chrome/browser/" target="_blank"><img style="border:0px" src="img/chrome.png" /></a></div>', void (document.getElementById("loading_panel_text").innerHTML = '<div class="row">This application uses features that are unavailables in your browser.</div><div class="row">Please use one of these browsers:</div><div class="row"><a href="http://www.mozilla.org/en-US/" target="_blank"><img style="border:0px" src="img/firefox.png" /></a>&nbsp;&nbsp;&nbsp;<a href="https://www.google.com/intl/en/chrome/browser/" target="_blank"><img style="border:0px" src="img/chrome.png" /></a></div>')
	}
	loadLanguage(function (e) {
		loadSettings("server", function (e) {
			loadSettings("user", function (e) {
				loadSettings("cookies", function (e) {
					loadSettings("object_groups", function (e) {
						loadSettings("object_drivers", function (e) {
							loadSettings("object_trailers", function (e) {
								loadSettings("objects", function (e) {
									loadSettings("events", function (e) {
										loadSettings("templates", function (e) {
											loadSettings("kml", function (e) {
												loadSettings("subaccounts", function (e) {
													load2()
												})
											})
										})
									})
								})
							})
						})
					})
				})
			})
		})
	})
}

function load2() {
	var e;
	(initMap(), initGui(), initGrids(), initGraph(), objectLoadList(), objectLoadData(), eventsLoadData(), placesGroupLoadData(function (e) {
		placesMarkerLoadData(), placesRouteLoadData(), placesZoneLoadData()
	}), 1 == settingsUserData.privileges_reports && reportsLoadData(), 1 == settingsUserData.privileges_object_control && cmdTemplateLoadData(), 1 == settingsUserData.privileges_chat && chatLoadData(), 1 == settingsUserData.billing && billingLoadData(), "subuser" == settingsUserData.privileges) ? ($("#settings_main").tabs("option", "active", 5), (e = document.getElementById("settings_main_objects")).parentNode.removeChild(e), (e = document.getElementById("settings_main_objects_tab")).parentNode.removeChild(e), (e = document.getElementById("settings_main_events")).parentNode.removeChild(e), (e = document.getElementById("settings_main_events_tab")).parentNode.removeChild(e), (e = document.getElementById("settings_main_templates")).parentNode.removeChild(e), (e = document.getElementById("settings_main_templates_tab")).parentNode.removeChild(e), (e = document.getElementById("settings_main_kml")).parentNode.removeChild(e), (e = document.getElementById("settings_main_kml_tab")).parentNode.removeChild(e), (e = document.getElementById("settings_main_sms")).parentNode.removeChild(e), (e = document.getElementById("settings_main_sms_tab")).parentNode.removeChild(e), (e = document.getElementById("settings_main_subaccounts")).parentNode.removeChild(e), (e = document.getElementById("settings_main_subaccounts_tab")).parentNode.removeChild(e), (e = document.getElementById("reports_generated")).parentNode.removeChild(e), (e = document.getElementById("reports_generated_tab")).parentNode.removeChild(e)) : (0 == settingsUserData.privileges_kml && ((e = document.getElementById("settings_main_kml")).parentNode.removeChild(e), (e = document.getElementById("settings_main_kml_tab")).parentNode.removeChild(e)), 0 == settingsUserData.privileges_subaccounts && ((e = document.getElementById("settings_main_subaccounts")).parentNode.removeChild(e), (e = document.getElementById("settings_main_subaccounts_tab")).parentNode.removeChild(e)));
	"bottom_panel" == settingsUserData.datalist ? ($("#side_panel_objects_dragbar").off(), $("#side_panel_events_dragbar").off(), $("#side_panel_history_dragbar").off(), document.getElementById("side_panel_objects_dragbar").style.display = "none", document.getElementById("side_panel_objects_object_data_list").style.display = "none", document.getElementById("side_panel_events_dragbar").style.display = "none", document.getElementById("side_panel_events_event_data_list").style.display = "none", document.getElementById("side_panel_history_dragbar").style.display = "none", document.getElementById("side_panel_history_route_data_list").style.display = "none") : (document.getElementById("bottom_panel_datalist_tab").style.display = "none", document.getElementById("bottom_panel_datalist").style.display = "none"), document.getElementById("loading_panel").style.display = "none", document.getElementById("content").style.visibility = "visible", notifyCheck("expiring_objects"), notifyCheck("inactive_objects"), notifyCheck("session_check"), "true" == settingsUserData.push_notify_desktop && Push.Permission.request(null, null), 1 == settingsUserData.dashboard.open_after_login && dashboardOpen()
}

function unload() {
	settingsSaveCookies()
}

function objectLoadList() {
	var e = $("#side_panel_objects_object_list_grid");
	for (var t in e.clearGridData(!0), settingsObjectData) {
		var a = settingsObjectData[t];
		if ("true" == a.active) {
			var i = a.name.toLowerCase() + t.toLowerCase(),
				o = a.name.toLowerCase(),
				s = a.group_id,
				n = '<input id="object_visible_' + t + '" onClick="objectVisibleToggle(\'' + t + '\');" class="checkbox" type="checkbox"/>',
				l = '<input id="object_follow_' + t + '" onClick="objectFollowToggle(\'' + t + '\');" class="checkbox" type="checkbox"/>',
				d = '<a href="#"><img src="' + a.icon + '" style="width: 26px;"/></a>',
				r = '<div class="object-list-item"><div class="left"><div class="name">' + a.name + '</div><div class="status" id="object_status_' + t + '">' + la.NO_DATA + "</div></div>";
			r += '<div class="right"><div class="speed" id="object_speed_' + t + '">0 ' + la.UNIT_SPEED + "</div>", r += '<div class="engine" id="object_engine_' + t + '"></div>', r += '<div class="connection" id="object_connection_' + t + '">' + getConnectionIcon(0) + "</div></div></div>";
			var _ = '<div class="object-action-menu" id="object_action_menu_' + t + '" tag="' + t + '"><a href="#"><img src="theme/images/menu.svg" style="width: 4px;" title="' + la.ACTION + '"/></a></div>';
			e.jqGrid("addRowData", t, {
				search: i,
				name_sort: o,
				group_id: s,
				show: n,
				follow: l,
				icon: d,
				name: r,
				menu: _
			})
		}
	}
	e.setGridParam({
		sortname: "name_sort",
		sortorder: "asc"
	}).trigger("reloadGrid")
}

function objectReloadData() {
	objectsData = [], objectLoadList(), objectLoadData()
}

function objectLoadData() {
	clearTimeout(timer_objectLoadData);
	$.ajax({
		type: "POST",
		url: "func/fn_objects.php",
		data: {
			cmd: "load_object_data"
		},
		dataType: "json",
		cache: !1,
		error: function (e, t) {
			timer_objectLoadData = setTimeout("objectLoadData();", 1e3 * gsValues.map_refresh)
		},
		success: function (e) {
			for (var t in e) e[t] = transformToObjectData(e[t]);
			if (Object.keys(objectsData).length != Object.keys(e).length) objectsData = e;
			else
				for (var t in e) {
					if (objectsData[t].connection = e[t].connection, objectsData[t].status = e[t].status, objectsData[t].status_string = e[t].status_string, objectsData[t].odometer = e[t].odometer, objectsData[t].engine_hours = e[t].engine_hours, objectsData[t].service = e[t].service, objectsData[t].last_img_file = e[t].last_img_file, "" == objectsData[t].data) objectsData[t].data = e[t].data;
					else {
						if (objectsData[t].data.length >= settingsObjectData[t].tail_points && objectsData[t].data.pop(), objectsData[t].data.unshift(e[t].data[0]), 1 == objectsData[t].selected && 1 == gsValues.map_street_view) utilsStreetView(objectsData[t].data[0].lat, objectsData[t].data[0].lng, objectsData[t].data[0].angle);
						1 == objectsData[t].selected && 1 == gsValues.map_camera && utilsCamera(t)
					}
					settingsObjectData[t].protocol = e[t].protocol, settingsObjectData[t].odometer = e[t].odometer, settingsObjectData[t].engine_hours = Math.floor(e[t].engine_hours / 60 / 60)
				}
			objectUpdateList(), objectAddAllToMap(), "fit" == settingsUserData.map_sp && 0 == gsValues.map_fit_objects_finished && (fitObjectsOnMap(), gsValues.map_fit_objects_finished = !0), objectFollow(), 1 == $("#dialog_dashboard").dialog("isOpen") && dashboardInitObjects(), timer_objectLoadData = setTimeout("objectLoadData();", 1e3 * gsValues.map_refresh)
		}
	})
}

function objectUpdateList() {
	for (var e in objectsData) {
		if ("" != objectsData[e].data) {
			if (null != document.getElementById("object_status_" + e)) {
				document.getElementById("object_visible_" + e).checked = objectsData[e].visible, document.getElementById("object_follow_" + e).checked = objectsData[e].follow;
				var t = objectsData[e].status_string;
				"server" == settingsUserData.od ? document.getElementById("object_status_" + e).innerHTML = objectsData[e].data[0].dt_server : "status" == settingsUserData.od && "" != t ? document.getElementById("object_status_" + e).innerHTML = t : document.getElementById("object_status_" + e).innerHTML = objectsData[e].data[0].dt_tracker, document.getElementById("object_speed_" + e).innerHTML = objectsData[e].data[0].speed + " " + la.UNIT_SPEED;
				var a = getSensorFromType(e, "acc");
				if (0 == a || 0 == objectsData[e].connection) document.getElementById("object_engine_" + e).innerHTML = "";
				else 1 == getSensorValue(objectsData[e].data[0].params, a[0]).value ? document.getElementById("object_engine_" + e).innerHTML = getEngineIcon(1) : document.getElementById("object_engine_" + e).innerHTML = getEngineIcon(0);
				if (document.getElementById("object_connection_" + e).innerHTML = getConnectionIcon(objectsData[e].connection), 1 == objectsData[e].selected) datalistShowData("object", e, objectsData[e].data[0])
			}
		} else null != document.getElementById("object_status_" + e) && (document.getElementById("object_visible_" + e).checked = objectsData[e].visible, document.getElementById("object_follow_" + e).checked = objectsData[e].follow, document.getElementById("object_status_" + e).innerHTML = la.NO_DATA, document.getElementById("object_speed_" + e).innerHTML = "0 " + la.UNIT_SPEED, document.getElementById("object_engine_" + e).innerHTML = "", document.getElementById("object_connection_" + e).innerHTML = getConnectionIcon(objectsData[e].connection));
		objectSetListStatus(e, objectsData[e].status, objectsData[e].event_ohc_color)
	}
	for (var i in settingsObjectGroupData) null != document.getElementById("object_group_visible_" + i) && (document.getElementById("object_group_visible_" + i).checked = settingsObjectGroupData[i].visible), null != document.getElementById("object_group_follow_" + i) && (document.getElementById("object_group_follow_" + i).checked = settingsObjectGroupData[i].follow)
}

function objectSetListStatus(e, t, a) {
	var i = getObjectListColor(t, a),
		o = $("#side_panel_objects_object_list_grid");
	$(o).jqGrid("setRowData", e, !1, {
		background: i
	})
}

function objectAddAllToMap() {
	var e = document.getElementById("side_panel_objects_object_list_search").value;
	for (var t in objectRemoveAllFromMap(), objectsData) "true" == settingsObjectData[t].active && (strMatches(settingsObjectData[t].name, e) || strMatches(t, e)) && (objectAddToMap(t), objectVisible(t))
}

function objectRemoveAllFromMap() {
	mapLayers.realtime.clearLayers()
}

function objectSetStatusEvent(e, t, a) {
	if (null != objectsData[e])
		if (0 == t && 0 == a) {
			if (objectsData[e].event = !1, objectsData[e].event_arrow_color = !1, objectsData[e].event_ohc_color = !1, "arrow" == settingsObjectData[e].map_icon) {
				var i = objectsData[e].data[0].speed,
					o = objectsData[e].status,
					s = getMarkerIcon(e, i, o, !1);
				objectsData[e].layers.marker.setIcon(s)
			}
			objectSetListStatus(e, objectsData[e].status, !1)
		} else {
			if (objectsData[e].event = !0, objectsData[e].event_arrow_color = t, objectsData[e].event_ohc_color = a, "arrow" == settingsObjectData[e].map_icon) {
				i = objectsData[e].data[0].speed, o = objectsData[e].status, s = getMarkerIcon(e, i, o, t);
				objectsData[e].layers.marker.setIcon(s)
			}
			objectSetListStatus(e, o, a)
		}
}

function objectAddToMap(e) {
	var t = settingsObjectData[e].name;
	if ("" != objectsData[e].data) var a = objectsData[e].data[0].lat,
		i = objectsData[e].data[0].lng,
		o = objectsData[e].data[0].altitude,
		s = objectsData[e].data[0].angle,
		n = objectsData[e].data[0].speed,
		l = objectsData[e].data[0].dt_tracker,
		d = objectsData[e].data[0].params;
	else a = 0, i = 0, n = 0, d = !1;
	var r = settingsUserData.map_is,
		_ = s;
	"arrow" != settingsObjectData[e].map_icon && (_ = 0);
	var c = objectsData[e].status,
		g = objectsData[e].event_arrow_color,
		m = getMarkerIcon(e, n, c, g),
		u = L.marker([a, i], {
			icon: m,
			iconAngle: _
		}),
		p = t + " (" + n + " " + la.UNIT_SPEED + ")";
	u.bindTooltip(p, {
		permanent: !0,
		offset: [20 * r, 0],
		direction: "right"
	}).openTooltip(), u.on("click", function (_) {
		objectSelect(e), "" != objectsData[e].data && geocoderGetAddress(a, i, function (_) {
			var c = _,
				g = urlPosition(a, i),
				m = "",
				u = "",
				p = "",
				y = new Array;
			for (var h in settingsObjectData[e].sensors) y.push(settingsObjectData[e].sensors[h]);
			var v = sortArrayByElement(y, "name");
			for (var h in v) {
				var b = v[h];
				if ("true" == b.popup)
					if ("fuelsumup" == b.type) {
						var E = getSensorValueFuelLevelSumUp(e, d, b);
						m += "<tr><td><strong>" + b.name + ":</strong></td><td>" + E.value_full + "</td></tr>"
					} else {
						E = getSensorValue(d, b);
						m += "<tr><td><strong>" + b.name + ":</strong></td><td>" + E.value_full + "</td></tr>"
					}
			}
			var f = new Array;
			for (var h in settingsObjectData[e].custom_fields) f.push(settingsObjectData[e].custom_fields[h]);
			var I = sortArrayByElement(f, "name");
			for (var h in I) {
				var B = I[h];
				"true" == B.popup && (u += "<tr><td><strong>" + B.name + ":</strong></td><td>" + textToLinks(B.value) + "</td></tr>")
			}
			var D = new Array;
			for (var h in objectsData[e].service) D.push(objectsData[e].service[h]);
			var O = sortArrayByElement(D, "name");
			for (var h in O) "true" == O[h].popup && (p += "<tr><td><strong>" + O[h].name + ":</strong></td><td>" + O[h].status + "</td></tr>");
			var k = "<table>\t\t\t\t\t<tr><td><strong>" + la.OBJECT + ":</strong></td><td>" + t + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + c + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + g + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.ALTITUDE + ":</strong></td><td>" + o + " " + la.UNIT_HEIGHT + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.ANGLE + ":</strong></td><td>" + s + " &deg;</td></tr>\t\t\t\t\t<tr><td><strong>" + la.SPEED + ":</strong></td><td>" + n + " " + la.UNIT_SPEED + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.TIME + ":</strong></td><td>" + l + "</td></tr>",
				j = getObjectOdometer(e, !1); - 1 != j && (k += "<tr><td><strong>" + la.ODOMETER + ":</strong></td><td>" + j + " " + la.UNIT_DISTANCE + "</td></tr>");
			var T = getObjectEngineHours(e, !1); - 1 != T && (k += "<tr><td><strong>" + la.ENGINE_HOURS + ":</strong></td><td>" + T + "</td></tr>");
			var R = k + u + m + p;
			addPopupToMap(a, i, [0, -14 * r], k += "</table>", R += "</table>")
		})
	}), u.on("add", function (t) {
		0 == gsValues.map_object_labels && u.closeTooltip(), objectAddTailToMap(e)
	}), u.on("remove", function (t) {
		null != objectsData[e] && objectsData[e].layers.tail && mapLayers.realtime.removeLayer(objectsData[e].layers.tail)
	}), u.imei = e, mapLayers.realtime.addLayer(u), objectsData[e].layers.marker = u
}

function objectAddTailToMap(e) {
	if (settingsObjectData[e].tail_points > 0) {
		objectsData[e].layers.tail && mapLayers.realtime.removeLayer(objectsData[e].layers.tail);
		var t, a = new Array;
		for (t = 0; t < objectsData[e].data.length; t++) {
			var i = objectsData[e].data[t].lat,
				o = objectsData[e].data[t].lng;
			a.push(L.latLng(i, o))
		}
		var s = L.polyline(a, {
			color: settingsObjectData[e].tail_color,
			opacity: .8,
			weight: 3
		});
		mapLayers.realtime.addLayer(s), objectsData[e].layers.tail = s
	}
}

function objectGroupVisibleToggle(e) {
	var t = document.getElementById("object_group_visible_" + e).checked;
	for (var a in settingsObjectData) settingsObjectData[a].group_id == e && (settingsObjectGroupData[e].visible = t, null != document.getElementById("object_visible_" + a) && (document.getElementById("object_visible_" + a).checked = t, objectsData[a].visible = t, objectVisible(a)))
}

function objectVisibleToggle(e) {
	var t = document.getElementById("object_visible_" + e).checked;
	objectsData[e].visible = t, objectVisible(e)
}

function objectVisible(e) {
	1 == objectsData[e].visible ? mapLayers.realtime.addLayer(objectsData[e].layers.marker) : mapLayers.realtime.removeLayer(objectsData[e].layers.marker)
}

function objectVisibleAllToggle() {
	1 == gsValues.objects_visible ? objectVisibleAll(!1) : objectVisibleAll(!0)
}

function objectVisibleAll(e) {
	for (var t in gsValues.objects_visible = e, objectsData) objectsData[t].visible = e, null != document.getElementById("object_visible_" + t) && (document.getElementById("object_visible_" + t).checked = e), objectVisible(t);
	for (var a in settingsObjectGroupData) null != document.getElementById("object_group_visible_" + a) && (settingsObjectGroupData[a].visible = e, document.getElementById("object_group_visible_" + a).checked = e)
}

function objectGroupFollowToggle(e) {
	var t = document.getElementById("object_group_follow_" + e).checked;
	for (var a in settingsObjectData) settingsObjectData[a].group_id == e && (settingsObjectGroupData[e].follow = t, null != document.getElementById("object_follow_" + a) && (document.getElementById("object_follow_" + a).checked = t, objectsData[a].follow = t));
	objectFollow()
}

function objectFollowToggle(e) {
	var t = document.getElementById("object_follow_" + e).checked;
	objectsData[e].follow = t, objectFollow()
}

function objectFollow() {
	var e = document.getElementById("side_panel_objects_object_list_search").value,
		t = 0,
		a = new Array;
	for (var i in objectsData)
		if (strMatches(settingsObjectData[i].name, e) && "" != objectsData[i].data && 1 == objectsData[i].follow) {
			var o = objectsData[i].data[0].lat,
				s = objectsData[i].data[0].lng;
			a.push([o, s]), t += 1
		} t > 1 ? map.fitBounds(a) : 1 == t && map.panTo({
			lat: o,
			lng: s
		})
}

function objectFollowAllToggle() {
	1 == gsValues.objects_follow ? objectFollowAll(!1) : objectFollowAll(!0)
}

function objectFollowAll(e) {
	for (var t in gsValues.objects_follow = e, objectsData) objectsData[t].follow = e, null != document.getElementById("object_follow_" + t) && (document.getElementById("object_follow_" + t).checked = e);
	for (var a in settingsObjectGroupData) null != document.getElementById("object_group_follow_" + a) && (settingsObjectGroupData[a].follow = e, document.getElementById("object_group_follow_" + a).checked = e);
	objectFollow()
}

function objectPanToZoom(e) {
	if ("" != objectsData[e].data) {
		var t = objectsData[e].data[0].lat,
			a = objectsData[e].data[0].lng;
		map.setView([t, a], 15)
	}
}

function objectPanTo(e) {
	if ("" != objectsData[e].data) {
		var t = objectsData[e].data[0].lat,
			a = objectsData[e].data[0].lng;
		map.panTo({
			lat: t,
			lng: a
		})
	}
}

function objectSelect(e) {
	if (objectUnSelectAll(), 0 != objectsData[e].event && objectSetStatusEvent(e, !1, !1), "" != objectsData[e].data) {
		if (objectsData[e].selected = !0, datalistShowData("object", e, objectsData[e].data[0]), 1 == gsValues.map_street_view) utilsStreetView(objectsData[e].data[0].lat, objectsData[e].data[0].lng, objectsData[e].data[0].angle);
		1 == gsValues.map_camera && utilsCamera(e)
	} else notifyBox("info", la.INFORMATION, la.NO_DATA_HAS_BEEN_RECEIVED_YET), datalistShowData("object", e, "")
}

function objectUnSelectAll() {
	for (var e in objectsData) objectsData[e].selected = !1
}
var utilsRulerData = new Array;
utilsRulerData.enabled = !1, utilsRulerData.line_layer, utilsRulerData.label_layer;
var utilsAreaData = new Array;
utilsAreaData.enabled = !1, utilsAreaData.area_layer;
var utilsRouteBetweenPointsData = new Array;
utilsRouteBetweenPointsData.route_points = !1;
var utilsFollowObjectData = new Array,
	utilsStreetViewData = new Array;

function utilsCheckPrivileges(e) {
	switch (e) {
		case "viewer":
			if (("" == settingsUserData.privileges || "viewer" == settingsUserData.privileges) && 0 == settingsUserData.cpanel_privileges) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "subuser":
			if ("subuser" == settingsUserData.privileges) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "obj_add":
			if (0 != settingsUserData.manager_id || "false" == settingsUserData.obj_add) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "obj_edit":
			if ("true" != settingsUserData.obj_edit) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "obj_delete":
			if ("true" != settingsUserData.obj_delete) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "obj_history_clear":
			if ("true" != settingsUserData.obj_history_clear) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "dashboard":
			if (1 != settingsUserData.privileges_dashboard) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "history":
			if (1 != settingsUserData.privileges_history) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "reports":
			if (1 != settingsUserData.privileges_reports) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "tachograph":
			if (1 != settingsUserData.privileges_tachograph) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "tasks":
			if (1 != settingsUserData.privileges_tasks) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "rilogbook":
			if (1 != settingsUserData.privileges_rilogbook) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "dtc":
			if (1 != settingsUserData.privileges_dtc) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "maintenance":
			if (1 != settingsUserData.privileges_maintenance) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "expenses":
			if (1 != settingsUserData.privileges_expenses) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "object_control":
			if (1 != settingsUserData.privileges_object_control) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "image_gallery":
			if (1 != settingsUserData.privileges_image_gallery) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "chat":
			if (1 != settingsUserData.privileges_chat) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
			break;
		case "subaccounts":
			if (1 != settingsUserData.privileges_subaccounts) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1
	}
	return !0
}

function utilsArea() {
	0 == utilsAreaData.enabled ? 1 != gsValues.map_bussy && (utilsAreaData.area_layer = map.editTools.startPolygon(), map.on("editable:drawing:end", function (e) {
		if (!(utilsAreaData.area_layer.getLatLngs()[0].length < 3)) {
			var t = getAreaFromLatLngs(utilsAreaData.area_layer.getLatLngs()[0]);
			if ("km" == settingsUserData.unit_distance) {
				var a = 1e-6 * t;
				a = (a = Math.round(100 * a) / 100) + " " + la.UNIT_SQ_KM
			} else {
				a = 1e-6 * t * .386102;
				a = (a = Math.round(100 * a) / 100) + " " + la.UNIT_SQ_MI
			}
			var i = 1e-4 * t,
				o = a + "</br>" + (i = (i = Math.round(100 * i) / 100) + " " + la.UNIT_HECTARES);
			utilsAreaData.area_layer.bindTooltip(o, {
				permanent: !0,
				direction: "center"
			}).openTooltip(), map.on("editable:editing editable:drag", function (e) {
				var t = getAreaFromLatLngs(utilsAreaData.area_layer.getLatLngs()[0]);
				if ("km" == settingsUserData.unit_distance) {
					var a = 1e-6 * t;
					a = (a = Math.round(100 * a) / 100) + " " + la.UNIT_SQ_KM
				} else {
					a = 1e-6 * t * .386102;
					a = (a = Math.round(100 * a) / 100) + " " + la.UNIT_SQ_MI
				}
				var i = 1e-4 * t,
					o = a + "</br>" + (i = (i = Math.round(100 * i) / 100) + " " + la.UNIT_HECTARES);
				utilsAreaData.area_layer.setTooltipContent(o), utilsAreaData.area_layer.openTooltip()
			}), map.off("editable:drawing:end")
		}
	}), utilsAreaData.enabled = !0, gsValues.map_bussy = !0, map.doubleClickZoom.disable()) : (map.editTools.stopDrawing(), 1 == map.hasLayer(utilsAreaData.area_layer) && map.removeLayer(utilsAreaData.area_layer), map.off("editable:editing editable:drag"), utilsAreaData.enabled = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable())
}

function utilsRuler() {
	0 == utilsRulerData.enabled ? 1 != gsValues.map_bussy && (utilsRulerData.line_layer = map.editTools.startPolyline(), map.on("editable:editing editable:drag", function (e) {
		var t = utilsRulerData.line_layer.getLatLngs(),
			a = t[t.length - 1];
		if (map.hasLayer(utilsRulerData.label_layer)) {
			var i = getLengthFromLatLngs(t);
			i = (i = convDistanceUnits(i, "km", settingsUserData.unit_distance)).toFixed(2), i += " " + la.UNIT_DISTANCE, utilsRulerData.label_layer.setLatLng(a), utilsRulerData.label_layer.setContent(i)
		} else utilsRulerData.label_layer = L.tooltip({
			permanent: !0,
			offset: [10, 0],
			direction: "right"
		}), utilsRulerData.label_layer.setLatLng(a), utilsRulerData.label_layer.setContent("0 " + la.UNIT_DISTANCE), map.addLayer(utilsRulerData.label_layer)
	}), utilsRulerData.enabled = !0, gsValues.map_bussy = !0, map.doubleClickZoom.disable()) : (map.editTools.stopDrawing(), 1 == map.hasLayer(utilsRulerData.line_layer) && map.removeLayer(utilsRulerData.line_layer), 1 == map.hasLayer(utilsRulerData.label_layer) && map.removeLayer(utilsRulerData.label_layer), map.off("editable:editing editable:drag"), utilsRulerData.enabled = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable())
}

function utilsShowDriverInfo(e) {
	var t = settingsObjectDriverData[e].name,
		a = settingsObjectDriverData[e].idn,
		i = settingsObjectDriverData[e].address,
		o = settingsObjectDriverData[e].phone,
		s = settingsObjectDriverData[e].email,
		n = settingsObjectDriverData[e].desc,
		l = settingsObjectDriverData[e].img;
	l = '<center><img style="border:0px; width: 80px;" src="' + (l = "" == l ? "img/user-blank.svg" : "data/user/drivers/" + l) + '" /></center>', text = '<div class="row">', text += '<div class="row2"><div class="width40">' + l + '</div><div class="width60">' + t + "</div></div>", "" != a && (text += '<div class="row2"><div class="width40"><strong>' + la.ID_NUMBER + ':</strong></div><div class="width60">' + a + "</div></div>"), "" != i && (text += '<div class="row2"><div class="width40"><strong>' + la.ADDRESS + ':</strong></div><div class="width60">' + i + "</div></div>"), "" != o && (text += '<div class="row2"><div class="width40"><strong>' + la.PHONE + ':</strong></div><div class="width60">' + o + "</div></div>"), "" != s && (s = '<a href="mailto:' + s + '">' + s + "</a>", text += '<div class="row2"><div class="width40"><strong>' + la.EMAIL + ':</strong></div><div class="width60">' + s + "</div></div>"), "" != n && (text += '<div class="row2"><div class="width40"><strong>' + la.DESCRIPTION + ':</strong></div><div class="width60">' + n + "</div></div>"), text += "</div>", notifyBox("info", la.DRIVER_INFO, text)
}

function utilsShowTrailerInfo(e) {
	var t = settingsObjectTrailerData[e].name,
		a = settingsObjectTrailerData[e].model,
		i = settingsObjectTrailerData[e].vin,
		o = settingsObjectTrailerData[e].plate_number,
		s = settingsObjectTrailerData[e].desc;
	text = '<div class="row">', text += '<div class="row2"><div class="width40"><strong>' + la.NAME + ':</strong></div><div class="width60">' + t + "</div></div>", "" != a && (text += '<div class="row2"><div class="width40"><strong>' + la.MODEL + ':</strong></div><div class="width60">' + a + "</div></div>"), "" != i && (text += '<div class="row2"><div class="width40"><strong>' + la.VIN + ':</strong></div><div class="width60">' + i + "</div></div>"), "" != o && (text += '<div class="row2"><div class="width40"><strong>' + la.PLATE_NUMBER + ':</strong></div><div class="width60">' + o + "</div></div>"), "" != s && (text += '<div class="row2"><div class="width40"><strong>' + la.DESCRIPTION + ':</strong></div><div class="width60">' + s + "</div></div>"), text += "</div>", notifyBox("info", la.TRAILER_INFO, text)
}

function utilsShowPassengerInfo(e) {
	var t = {
		cmd: "load_object_passenger_data",
		passenger_id: e
	};
	$.ajax({
		type: "POST",
		url: "func/fn_settings.passengers.php",
		data: t,
		dataType: "json",
		cache: !1,
		success: function (e) {
			var t = e.name,
				a = e.idn,
				i = e.address,
				o = e.phone,
				s = e.email,
				n = e.desc;
			text = '<div class="row">', text += '<div class="row2"><div class="width40"><strong>' + la.NAME + ':</strong></div><div class="width60">' + t + "</div></div>", "" != a && (text += '<div class="row2"><div class="width40"><strong>' + la.ID_NUMBER + ':</strong></div><div class="width60">' + a + "</div></div>"), "" != i && (text += '<div class="row2"><div class="width40"><strong>' + la.ADDRESS + ':</strong></div><div class="width60">' + i + "</div></div>"), "" != o && (text += '<div class="row2"><div class="width40"><strong>' + la.PHONE + ':</strong></div><div class="width60">' + o + "</div></div>"), "" != s && (s = '<a href="mailto:' + s + '">' + s + "</a>", text += '<div class="row2"><div class="width40"><strong>' + la.EMAIL + ':</strong></div><div class="width60">' + s + "</div></div>"), "" != n && (text += '<div class="row2"><div class="width40"><strong>' + la.DESCRIPTION + ':</strong></div><div class="width60">' + n + "</div></div>"), text += "</div>", notifyBox("info", la.PASSENGER_INFO, text)
		}
	})
}

function utilsShowPoint() {
	utilsPointOnMap(document.getElementById("dialog_show_point_lat").value, document.getElementById("dialog_show_point_lng").value)
}

function utilsPointOnMap(e, t) {
	"" == e && (e = 0), "" == t && (t = 0), geocoderGetAddress(e, t, function (a) {
		var i = a,
			o = urlPosition(e, t),
			s = "<table>\t\t\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + i + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>\t\t\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + o + "</td></tr>\t\t\t\t\t</table>";
		addPopupToMap(e, t, [0, 0], s, ""), map.panTo({
			lat: e,
			lng: t
		}), 1 == gsValues.map_street_view && (objectUnSelectAll(), utilsStreetView(e, t, 0))
	})
}

function utilsSearchAddress() {
	var e = document.getElementById("dialog_address_search_addr").value;
	geocoderGetLocation(e, function (t) {
		if (null != t[0]) {
			e = t[0].address;
			var a = t[0].lat,
				i = t[0].lng,
				o = urlPosition(a, i);
			addPopupToMap(a, i, [0, 0], "<table>\t\t\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + e + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>\t\t\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + o + "</td></tr>\t\t\t\t\t</table>", ""), map.panTo({
				lat: a,
				lng: i
			}), 1 == gsValues.map_street_view && (objectUnSelectAll(), utilsStreetView(a, i, 0))
		} else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
	})
}

function utilsFollowObject(e, t) {
	if ("" != objectsData[e].data) {
		var a = document.getElementById("map_layer").value,
			i = "func/fn_object.follow.php?imei=" + e + "&map_layer=" + a;
		if (1 == t) window.open(i, "_blank");
		else if (null == utilsFollowObjectData[e]) {
			var o = '<div style="position:absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;">';
			o += '<iframe src="' + i + '" style="border: 0px; width: 100%; height: 100%;"></iframe>', o += "</div>";
			var s = settingsObjectData[e].name,
				n = $(document.createElement("div"));
			n.attr("title", la.FOLLOW + " (" + s + ")"), n.html(o), $(n).dialog({
				autoOpen: !1,
				width: 500,
				height: 400,
				minWidth: 350,
				minHeight: 250,
				resizable: !0,
				close: function (t, a) {
					utilsFollowObjectData[e] = void 0
				}
			}), $(n).dialog("open"), utilsFollowObjectData[e] = new Array, utilsFollowObjectData[e].dialog = n
		} else utilsFollowObjectData[e].dialog.dialog("moveToTop")
	} else notifyBox("info", la.INFORMATION, la.NO_DATA_HAS_BEEN_RECEIVED_YET)
}

function utilsRouteToPoint(e) {
	if (1 != gsValues.map_bussy) {
		utilsRouteBetweenPointsHide();
		var t = !1;
		for (var a in objectsData)
			if (1 == objectsData[a].selected) {
				t = a;
				break
			} if (0 == t) notifyBox("info", la.INFORMATION, la.NO_OBJECT_SELECTED);
		else {
			new Array;
			if ("" != objectsData[t].data) {
				var i = objectsData[t].data[0].lat,
					o = objectsData[t].data[0].lng;
				utilsRouteBetweenPointsGet(e, L.latLng(i, o))
			}
		}
	}
}

function utilsRouteBetweenPoints(e) {
	if (1 != gsValues.map_bussy) {
		gsValues.map_bussy = !0, utilsRouteBetweenPointsHide();
		var t = map.editTools.startPolyline(e);
		map.doubleClickZoom.disable(), map.on("editable:drawing:clicked", function (a) {
			var i = t.getLatLngs(),
				o = i[i.length - 1];
			map.editTools.stopDrawing(), 1 == map.hasLayer(t) && map.removeLayer(t), map.doubleClickZoom.enable(), map.off("editable:drawing:clicked"), utilsRouteBetweenPointsGet(e, o), gsValues.map_bussy = !1
		})
	}
}

function utilsRouteBetweenPointsGet(e, t) {
	var a = settingsUserData.map_is,
		i = new Array;
	i.push(e), i.push(t);
	var o = L.Routing.control({
		waypoints: i,
		show: !1,
		showAlternatives: !1,
		waypointMode: "snap",
		createMarker: function () { }
	}).addTo(map);
	o.on("routeselected", function (e) {
		utilsRouteBetweenPointsData.route_points = e.route.coordinates;
		var t = L.polyline(utilsRouteBetweenPointsData.route_points, {
			color: settingsUserData.map_rc,
			opacity: .8,
			weight: 3
		});
		mapLayers.utils.addLayer(t), map.removeControl(o);
		var i = getLengthFromLatLngs(utilsRouteBetweenPointsData.route_points);
		i = (i = convDistanceUnits(i, "km", settingsUserData.unit_distance)).toFixed(2), i += " " + la.UNIT_DISTANCE;
		var s = getTimeDetails(Math.floor(e.route.summary.totalTime), !0),
			n = utilsRouteBetweenPointsData.route_points[0].lat,
			l = utilsRouteBetweenPointsData.route_points[0].lng,
			d = L.marker([n, l], {
				icon: mapMarkerIcons.route_start
			});
		d.on("click", function (e) {
			geocoderGetAddress(n, l, function (e) {
				var t = e,
					o = urlPosition(n, l),
					d = "<table>\t\t\t\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + t + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>\t\t\t\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + o + "</td></tr>\t\t\t\t\t\t<tr><td><strong>" + la.LENGTH + ":</strong></td><td>" + i + "</td></tr>\t\t\t\t\t\t<tr><td><strong>" + la.DURATION + ":</strong></td><td>" + s + "</td></tr>\t\t\t\t\t\t</table>";
				d += '<div style="width:100%; text-align: right;"><a href="#" class="" onClick="utilsRouteBetweenPointsSave();">' + la.SAVE_AS_ROUTE + "</a> " + la.OR, d += ' <a href="#" class="" onClick="utilsRouteBetweenPointsHide();">' + la.HIDE.toLowerCase() + "</a></div>", addPopupToMap(n, l, [0, -28 * a], d, "")
			})
		}), mapLayers.utils.addLayer(d);
		var r = utilsRouteBetweenPointsData.route_points[utilsRouteBetweenPointsData.route_points.length - 1].lat,
			_ = utilsRouteBetweenPointsData.route_points[utilsRouteBetweenPointsData.route_points.length - 1].lng;
		(d = L.marker([r, _], {
			icon: mapMarkerIcons.route_end
		})).on("click", function (e) {
			geocoderGetAddress(r, _, function (e) {
				var t = e,
					o = urlPosition(r, _),
					n = "<table>\t\t\t\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + t + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>\t\t\t\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + o + "</td></tr>\t\t\t\t\t\t<tr><td><strong>" + la.LENGTH + ":</strong></td><td>" + i + "</td></tr>\t\t\t\t\t\t<tr><td><strong>" + la.DURATION + ":</strong></td><td>" + s + "</td></tr>\t\t\t\t\t\t</table>";
				n += '<div style="width:100%; text-align: right;"><a href="#" class="" onClick="utilsRouteBetweenPointsSave();">' + la.SAVE_AS_ROUTE + "</a> " + la.OR, n += ' <a href="#" class="" onClick="utilsRouteBetweenPointsHide();">' + la.HIDE.toLowerCase() + "</a></div>", addPopupToMap(r, _, [0, -28 * a], n, "")
			})
		});
		var c = t.getBounds();
		map.fitBounds(c), mapLayers.utils.addLayer(d)
	})
}

function utilsRouteBetweenPointsSave() {
	if (1 != gsValues.map_bussy) {
		var e = Math.ceil(utilsRouteBetweenPointsData.route_points.length / 200),
			t = new Array;
		for (i = 0; i < utilsRouteBetweenPointsData.route_points.length; i += e) {
			var a = utilsRouteBetweenPointsData.route_points[i].lat,
				o = utilsRouteBetweenPointsData.route_points[i].lng;
			t.push(L.latLng(a, o))
		}
		placesRouteSave(t), utilsRouteBetweenPointsHide()
	}
}

function utilsRouteBetweenPointsHide() {
	utilsRouteBetweenPointsData.route_points = !1, mapLayers.utils.clearLayers(), destroyMapPopup()
}

function utilsCamera(e) {
	var t = objectsData[e].last_img_file;
	if ("" != t) {
		var a = "data/img/" + t;
		imageExists(a, function (e) {
			document.getElementById("camera_control").innerHTML = e ? '<img style="image-orientation: from-image; object-fit: contain; height: 100%; width: 100%;" src="' + a + '">' : '<img style="image-orientation: from-image; object-fit: contain; height: 100%; width: 100%;" src="img/no-image.svg">'
		})
	} else document.getElementById("camera_control").innerHTML = '<img style="image-orientation: from-image; object-fit: contain; height: 100%; width: 100%;" src="img/no-image.svg">'
}

function utilsStreetView(e, t, a) {
	if (e != utilsStreetViewData.prev_lat && t != utilsStreetViewData.prev_lng) {
		var i = {
			lat: e,
			lng: t,
			angle: a
		};
		$.ajax({
			type: "POST",
			url: "func/fn_streetview.php",
			data: i,
			cache: !1,
			success: function (a) {
				if ("" == a) document.getElementById("street_view_control").innerHTML = la.STREET_VIEW;
				else {
					var i = "data:image/jpg;base64," + a;
					document.getElementById("street_view_control").innerHTML = '<a href="#" onClick="utilsStreetViewPoint(' + e + ", " + t + ', true);"><img src="' + i + '"/></a>'
				}
			}
		}), utilsStreetViewData.prev_lat = e, utilsStreetViewData.prev_lng = t
	}
}

function utilsStreetViewObject(e, t) {
	if ("" != objectsData[e].data) {
		var a = "https://maps.google.com/maps?q=&layer=c&cbll=" + objectsData[e].data[0].lat + "," + objectsData[e].data[0].lng;
		1 == t && window.open(a, "_blank")
	} else notifyBox("info", la.INFORMATION, la.NO_DATA_HAS_BEEN_RECEIVED_YET)
}

function utilsStreetViewPoint(e, t, a) {
	var i = "https://maps.google.com/maps?q=&layer=c&cbll=" + e + "," + t;
	1 == a && window.open(i, "_blank")
}
utilsStreetViewData.prev_lat = !1, utilsStreetViewData.prev_lng = !1;