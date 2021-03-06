$(function() {

	// init date tables
	var jobTable = $("#job_list").dataTable({
		"deferRender": true,
		"processing" : true, 
	    "serverSide": true,
		"ajax": {
			url: base_url + "/jobinfo/pageList?systemName=delivery",
			type:"post",
	        data : function ( d ) {
	        	var obj = {};
	        	obj.jobGroup = $('#jobGroup').val();
                obj.triggerStatus = $('#triggerStatus').val();
                obj.jobDesc = $('#jobDesc').val();
	        	obj.executorHandler = $('#executorHandler').val();
                obj.author = $('#author').val();
	        	obj.start = d.start;
	        	obj.length = d.length;
                return obj;
            }
	    },
	    "searching": false,
	    "ordering": false,
	    //"scrollX": true,	// scroll x，close self-adaption
	    "columns": [
	                {
	                	"data": 'id',
						"bSortable": false,
						"visible" : true,
						"width":'5%'
					},
	                { 
	                	"data": 'jobGroup', 
	                	"visible" : false,
	                	"render": function ( data, type, row ) {
	            			var groupMenu = $("#jobGroup").find("option");
	            			for ( var index in $("#jobGroup").find("option")) {
	            				if ($(groupMenu[index]).attr('value') == data) {
									return $(groupMenu[index]).html();
								}
							}
	            			return data;
	            		}
            		},
	                {
	                	"data": 'jobDesc',
						"visible" : true,
						"width":'15%'
					},
					{
						"data": 'glueType',
						"width":'15%',
						"visible" : true,
						"render": function ( data, type, row ) {
							var glueTypeTitle = findGlueTypeTitle(row.glueType);
                            if (row.executorHandler) {
                                return glueTypeTitle +"：" + row.executorHandler;
                            } else {
                                return glueTypeTitle;
                            }
						}
					},
	                { "data": 'executorParam', "visible" : false},

					{
						"data": 'jobCron',
						"visible" : true,
						"width":'13%'
					},
	                { 
	                	"data": 'addTime', 
	                	"visible" : false, 
	                	"render": function ( data, type, row ) {
	                		return data?moment(new Date(data)).format("YYYY-MM-DD HH:mm:ss"):"";
	                	}
	                },
	                { 
	                	"data": 'updateTime', 
	                	"visible" : false, 
	                	"render": function ( data, type, row ) {
	                		return data?moment(new Date(data)).format("YYYY-MM-DD HH:mm:ss"):"";
	                	}
	                },
	                { "data": 'author', "visible" : true, "width":'10%'},
	                { "data": 'alarmEmail', "visible" : false},
	                { 
	                	"data": 'triggerStatus',
						"width":'10%',
	                	"visible" : true,
	                	"render": function ( data, type, row ) {
                            // status
                            if (1 == data) {
                                return '<small class="label label-success" >RUNNING</small>';
                            } else {
                                return '<small class="label label-default" >STOP</small>';
                            }
	                		return data;
	                	}
	                },

					{
						"data": 'tzName',
						"width":'10%',
						"visible" : true,
						"render": function ( data, type, row ) {
							return data;
						}
					},
					{ "data": 'robotAlarm', "visible" : false},
					{
						"data": 'triggerNextTime',
						"width":'10%',
						"visible" : true,
						"render": function ( data, type, row ) {
							if (data !== 0){
								var date = new Date(data) ;
								var year = date.getFullYear();  // 获取完整的年份(4位,1970)
								var month = date.getMonth() + 1;  // 获取月份(0-11,0代表1月,用的时候记得加上1)
								var day = date.getDate();  // 获取日(1-31)
								var hours = date.getHours();  // 获取小时数(0-23)
								var min = date.getMinutes();  // 获取分钟数(0-59)
								var seconds = date.getSeconds();  // 获取秒数(0-59)
								var res = year + '-' + month + '-' + day + " " + hours + ":" + min + ":" + seconds;
								return res ;
							}else {
								return null;
							}

						}
					},

	                {
						"data": I18n.system_opt ,
						"width":'10%',
	                	"render": function ( data, type, row ) {
	                		return function(){

                                // status
                                var start_stop_div = "";
                                if (1 == row.triggerStatus ) {
                                    start_stop_div = '<li><a href="javascript:void(0);" class="job_operate" _type="job_pause" >'+ I18n.jobinfo_opt_stop +'</a></li>\n';
                                } else {
                                    start_stop_div = '<li><a href="javascript:void(0);" class="job_operate" _type="job_resume" >'+ I18n.jobinfo_opt_start +'</a></li>\n';
                                }

                                // log url
                                var logHref = base_url +'/joblog?jobId='+ row.id;

                                // log url
                                var codeBtn = "";
                                if ('BEAN' != row.glueType) {
                                    var codeUrl = base_url +'/jobcode?jobId='+ row.id;
                                    codeBtn = '<li><a href="'+ codeUrl +'" target="_blank" >GLUE IDE</a></li>\n';
                                }

                                // data
                                tableData['key'+row.id] = row;

                                // opt
                                var html = '<div class="btn-group">\n' +
                                    '     <button type="button" class="btn btn-primary btn-sm">'+ I18n.system_opt +'</button>\n' +
                                    '     <button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown">\n' +
                                    '       <span class="caret"></span>\n' +
                                    '       <span class="sr-only">Toggle Dropdown</span>\n' +
                                    '     </button>\n' +
                                    '     <ul class="dropdown-menu" role="menu" _id="'+ row.id +'" >\n' +
                                    '       <li><a href="javascript:void(0);" class="job_trigger" >'+ I18n.jobinfo_opt_run +'</a></li>\n' +
                                    '       <li><a href="'+ logHref +'">'+ I18n.jobinfo_opt_log +'</a></li>\n' +
                                    '       <li><a href="javascript:void(0);" class="job_registryinfo" >' + I18n.jobinfo_opt_registryinfo + '</a></li>\n' +
                                    '       <li class="divider"></li>\n' +
                                    start_stop_div +
                                    codeBtn +
                                    '       <li><a href="javascript:void(0);" class="update" >'+ I18n.system_opt_edit +'</a></li>\n' +
                                    '       <li><a href="javascript:void(0);" class="job_operate" _type="job_del" >'+ I18n.system_opt_del +'</a></li>\n' +
									'       <li><a href="javascript:void(0);" class="copy" >'+ I18n.system_opt_copy +'</a></li>\n' +
									'       <li><a href="javascript:void(0);" class="export" >'+ I18n.system_opt_export +'</a></li>\n' +
                                    '     </ul>\n' +
                                    '   </div>';

	                			return html;
							};
	                	}
	                }
	            ],
		"language" : {
			"sProcessing" : I18n.dataTable_sProcessing ,
			"sLengthMenu" : I18n.dataTable_sLengthMenu ,
			"sZeroRecords" : I18n.dataTable_sZeroRecords ,
			"sInfo" : I18n.dataTable_sInfo ,
			"sInfoEmpty" : I18n.dataTable_sInfoEmpty ,
			"sInfoFiltered" : I18n.dataTable_sInfoFiltered ,
			"sInfoPostFix" : "",
			"sSearch" : I18n.dataTable_sSearch ,
			"sUrl" : "",
			"sEmptyTable" : I18n.dataTable_sEmptyTable ,
			"sLoadingRecords" : I18n.dataTable_sLoadingRecords ,
			"sInfoThousands" : ",",
			"oPaginate" : {
				"sFirst" : I18n.dataTable_sFirst ,
				"sPrevious" : I18n.dataTable_sPrevious ,
				"sNext" : I18n.dataTable_sNext ,
				"sLast" : I18n.dataTable_sLast
			},
			"oAria" : {
				"sSortAscending" : I18n.dataTable_sSortAscending ,
				"sSortDescending" : I18n.dataTable_sSortDescending
			}
		}
	});

    // table data
    var tableData = {};

	// search btn
	$('#searchBtn').on('click', function(){
		jobTable.fnDraw();
	});
	
	// jobGroup change
	$('#jobGroup').on('change', function(){
        //reload
        var jobGroup = $('#jobGroup').val();
        window.location.href = base_url + "/jobinfo?jobGroup=" + jobGroup;
    });
	
	// job operate
	$("#job_list").on('click', '.job_operate',function() {
		var typeName;
		var url;
		var needFresh = false;

		var type = $(this).attr("_type");
		if ("job_pause" == type) {
			typeName = I18n.jobinfo_opt_stop ;
			url = base_url + "/jobinfo/stop";
			needFresh = true;
		} else if ("job_resume" == type) {
			typeName = I18n.jobinfo_opt_start ;
			url = base_url + "/jobinfo/start";
			needFresh = true;
		} else if ("job_del" == type) {
			typeName = I18n.system_opt_del ;
			url = base_url + "/jobinfo/remove";
			needFresh = true;
		} else {
			return;
		}
		
		var id = $(this).parents('ul').attr("_id");

		layer.confirm( I18n.system_ok + typeName + '?', {
			icon: 3,
			title: I18n.system_tips ,
            btn: [ I18n.system_ok, I18n.system_cancel ]
		}, function(index){
			layer.close(index);

			$.ajax({
				type : 'POST',
				url : url,
				data : {
					"id" : id
				},
				dataType : "json",
				success : function(data){
					if (data.code == 200) {
                        layer.msg( typeName + I18n.system_success );
                        if (needFresh) {
                            //window.location.reload();
                            jobTable.fnDraw(false);
                        }
					} else {
                        layer.msg( data.msg || typeName + I18n.system_fail );
					}
				}
			});
		});
	});

	$("#job_list").on('click', '.copy',function() {
		var id = $(this).parents('ul').attr("_id");
		$.ajax({
			type : 'POST',
			url : base_url + "/jobinfo/copy",
			data : {
				"id" : id
			},
			dataType : "json",
			success : function(data){
				if (data.code == 200) {
					layer.msg( '复制' + I18n.system_success );
					jobTable.fnDraw(false);
				} else {
					layer.msg( data.msg || '复制' + I18n.system_fail );
				}
			}
		});
	});

	$("#job_list").on('click', '.export',function() {
		var id = $(this).parents('ul').attr("_id");
		$.ajax({
			type : 'POST',
			url : base_url + "/jobinfo/exportJobInfo",
			data : {
				"id" : id
			},
			dataType : "json",
			success : function(data){
				if (data.code == 200) {
					$("#export_data .form textarea[name='export_data']").val(data.content );
					$("#export_data_hidden_input").val(data.content)
					$('#export_data').modal({backdrop: false, keyboard: false}).modal('show');
				} else {
					layer.msg( data.msg || '导出' + I18n.system_fail );
				}
			}
		});
	});

	$("#export_data .ok").on('click',function() {
		var copyText = document.getElementById("export_data_hidden_input");
		copyText.select();
		copyText.setSelectionRange(0, 99999); /*For mobile devices*/
		document.execCommand("copy");
		layer.msg( 'Copy success.' );
	});

	// import
	$("#import").click(function(){
		navigator.clipboard.readText()
			.then(text => {
				$("#import_data_hidden_input").val(text);
			})
		$('#import_data').modal({backdrop: false, keyboard: false}).modal('show');
	});

	// import data
	$("#import_data .ok").on('click',function() {
		var env = $("#evn").val()
		var import_data = $("#import_data_hidden_input").val()
		if (import_data === ""){
			layer.msg('Import data cannot be empty!');
			return;
		}
		try {
			var job_info = JSON.parse(import_data)
			var jobDesc = job_info.jobDesc;
			var jobCron = job_info.jobCron;
			var executorHandler = job_info.executorHandler;
			var author = job_info.author;
			var alarmEmail = job_info.alarmEmail;
			var robotAlarm = job_info.robotAlarm;
			var executorParam = job_info.executorParam;
			if (env == "pro"){
				var index = executorParam.indexOf("com/")
				index += 3
				executorParam = executorParam.substring(index)
			}
			$("#add-jobDesc").val(jobDesc);
			$("#add-jobCron").val(jobCron);
			$("#add-executorHandler").val(executorHandler);
			$("#add-author").val(author);
			$("#add-alarmEmail").val(alarmEmail);
			$("#add-robotAlarm").val(robotAlarm);
			$("#add-executorParam").val(executorParam);

			$('#import_data').modal('hide');
		}catch (err) {
			layer.alert('Data error!')
		}

		// layer.msg( 'Copy success.' );
	});

    // job trigger
    $("#job_list").on('click', '.job_trigger',function() {
        var id = $(this).parents('ul').attr("_id");
        var row = tableData['key'+id];

        $("#jobTriggerModal .form input[name='id']").val( row.id );
        $("#jobTriggerModal .form textarea[name='executorParam']").val( row.executorParam );

        $('#jobTriggerModal').modal({backdrop: false, keyboard: false}).modal('show');
    });
    $("#jobTriggerModal .ok").on('click',function() {
        $.ajax({
            type : 'POST',
            url : base_url + "/jobinfo/trigger",
            data : {
                "id" : $("#jobTriggerModal .form input[name='id']").val(),
                "executorParam" : $("#jobTriggerModal .textarea[name='executorParam']").val()
            },
            dataType : "json",
            success : function(data){
                if (data.code == 200) {
                    $('#jobTriggerModal').modal('hide');

                    layer.msg( I18n.jobinfo_opt_run + I18n.system_success );
                } else {
                    layer.msg( data.msg || I18n.jobinfo_opt_run + I18n.system_fail );
                }
            }
        });
    });
    $("#jobTriggerModal").on('hide.bs.modal', function () {
        $("#jobTriggerModal .form")[0].reset();
    });


    // job registryinfo
    $("#job_list").on('click', '.job_registryinfo',function() {
        var id = $(this).parents('ul').attr("_id");
        var row = tableData['key'+id];

        var jobGroup = row.jobGroup;

        $.ajax({
            type : 'POST',
            url : base_url + "/jobgroup/loadById",
            data : {
                "id" : jobGroup
            },
            dataType : "json",
            success : function(data){

                var html = '<center>';
                if (data.code == 200 && data.content.registryList) {
                    for (var index in data.content.registryList) {
                        html += '<span class="badge bg-green" >' + data.content.registryList[index] + '</span><br>';
                    }
                }
                html += '</center>';

                layer.open({
                    title: I18n.jobinfo_opt_registryinfo ,
                    btn: [ I18n.system_ok ],
                    content: html
                });

            }
        });



    });

	// add
	$(".add").click(function(){

		// init
        //$("#addModal .form input[name='jobCron']").cronGen({});

		$('#addModal').modal({backdrop: false, keyboard: false}).modal('show');
	});
	var addModalValidate = $("#addModal .form").validate({
		errorElement : 'span',  
        errorClass : 'help-block',
        focusInvalid : true,  
        rules : {
			jobDesc : {
				required : true,
				maxlength: 50
			},
            jobCron : {
            	required : true
            },
			author : {
				required : true
			},
            executorTimeout : {
                digits:true
            },
            executorFailRetryCount : {
                digits:true
            }
        }, 
        messages : {  
            jobDesc : {
            	required : I18n.system_please_input + I18n.jobinfo_field_jobdesc
            },
            jobCron : {
            	required : I18n.system_please_input + "Cron"
            },
            author : {
            	required : I18n.system_please_input + I18n.jobinfo_field_author
            },
            executorTimeout : {
                digits: I18n.system_please_input + I18n.system_digits
            },
            executorFailRetryCount : {
                digits: I18n.system_please_input + I18n.system_digits
            }
        },
		highlight : function(element) {  
            $(element).closest('.form-group').addClass('has-error');  
        },
        success : function(label) {  
            label.closest('.form-group').removeClass('has-error');  
            label.remove();  
        },
        errorPlacement : function(error, element) {  
            element.parent('div').append(error);  
        },
        submitHandler : function(form) {

			// process
            var executorTimeout = $("#addModal .form input[name='executorTimeout']").val();
            if(!/^\d+$/.test(executorTimeout)) {
                executorTimeout = 0;
			}
            $("#addModal .form input[name='executorTimeout']").val(executorTimeout);
            var executorFailRetryCount = $("#addModal .form input[name='executorFailRetryCount']").val();
            if(!/^\d+$/.test(executorFailRetryCount)) {
                executorFailRetryCount = 0;
            }
            $("#addModal .form input[name='executorFailRetryCount']").val(executorFailRetryCount);


        	$.post(base_url + "/jobinfo/add",  $("#addModal .form").serialize(), function(data, status) {
    			if (data.code == "200") {
					$('#addModal').modal('hide');
					layer.open({
						title: I18n.system_tips ,
                        btn: [ I18n.system_ok ],
						content: I18n.system_add_suc ,
						icon: '1',
						end: function(layero, index){
							jobTable.fnDraw();
							//window.location.reload();
						}
					});
    			} else {
					layer.open({
						title: I18n.system_tips ,
                        btn: [ I18n.system_ok ],
						content: (data.msg || I18n.system_add_fail),
						icon: '2'
					});
    			}
    		});
		}
	});
	$("#addModal").on('hide.bs.modal', function () {
		$("#addModal .form")[0].reset();
		addModalValidate.resetForm();
		$("#addModal .form .form-group").removeClass("has-error");
		$(".remote_panel").show();	// remote

		$("#addModal .form input[name='executorHandler']").removeAttr("readonly");
	});


    // glueType change
    $(".glueType").change(function(){
		// executorHandler
        var $executorHandler = $(this).parents("form").find("input[name='executorHandler']");
        var glueType = $(this).val();
        if ('BEAN' != glueType) {
            $executorHandler.val("");
            $executorHandler.attr("readonly","readonly");
        } else {
            $executorHandler.removeAttr("readonly");
        }
    });

	$("#addModal .glueType").change(function(){
		// glueSource
		var glueType = $(this).val();
		if ('GLUE_GROOVY'==glueType){
			$("#addModal .form textarea[name='glueSource']").val( $("#addModal .form .glueSource_java").val() );
		} else if ('GLUE_SHELL'==glueType){
			$("#addModal .form textarea[name='glueSource']").val( $("#addModal .form .glueSource_shell").val() );
		} else if ('GLUE_PYTHON'==glueType){
			$("#addModal .form textarea[name='glueSource']").val( $("#addModal .form .glueSource_python").val() );
		} else if ('GLUE_PHP'==glueType){
            $("#addModal .form textarea[name='glueSource']").val( $("#addModal .form .glueSource_php").val() );
        } else if ('GLUE_NODEJS'==glueType){
			$("#addModal .form textarea[name='glueSource']").val( $("#addModal .form .glueSource_nodejs").val() );			
		} else if ('GLUE_POWERSHELL'==glueType){
            $("#addModal .form textarea[name='glueSource']").val( $("#addModal .form .glueSource_powershell").val() );
        } else {
            $("#addModal .form textarea[name='glueSource']").val("");
		}
	});

	// update
	$("#job_list").on('click', '.update',function() {

        var id = $(this).parents('ul').attr("_id");
        var row = tableData['key'+id];

		// base data
		$("#updateModal .form input[name='id']").val( row.id );
		$('#updateModal .form select[name=jobGroup] option[value='+ row.jobGroup +']').prop('selected', true);
		$("#updateModal .form input[name='jobDesc']").val( row.jobDesc );
		$("#updateModal .form input[name='jobCron']").val( row.jobCron );
		$("#updateModal .form input[name='author']").val( row.author );
		$("#updateModal .form input[name='alarmEmail']").val( row.alarmEmail );
		$("#updateModal .form input[name='executorTimeout']").val( row.executorTimeout );
        $("#updateModal .form input[name='executorFailRetryCount']").val( row.executorFailRetryCount );
		$('#updateModal .form select[name=executorRouteStrategy] option[value='+ row.executorRouteStrategy +']').prop('selected', true);
		$("#updateModal .form input[name='executorHandler']").val( row.executorHandler );
		$("#updateModal .form textarea[name='executorParam']").val( row.executorParam );
        $("#updateModal .form input[name='childJobId']").val( row.childJobId );
		$('#updateModal .form select[name=executorBlockStrategy] option[value='+ row.executorBlockStrategy +']').prop('selected', true);
		$('#updateModal .form select[name=glueType] option[value='+ row.glueType +']').prop('selected', true);
		// $('#updateModal .form select[name=tzName] [shortName='+ row.tzName +']').prop('selected', true);
		$('#updateModal .form select[name=tzName] ').val(row.tzName);
		$("#updateModal .form input[name='robotAlarm']").val( row.robotAlarm );

        $("#updateModal .form select[name=glueType]").change();

        // init
        //$("#updateModal .form input[name='jobCron']").cronGen({});

		// show
		$('#updateModal').modal({backdrop: false, keyboard: false}).modal('show');
	});
	var updateModalValidate = $("#updateModal .form").validate({
		errorElement : 'span',  
        errorClass : 'help-block',
        focusInvalid : true,

		rules : {
			jobDesc : {
				required : true,
				maxlength: 50
			},
			jobCron : {
				required : true
			},
			author : {
				required : true
			},
            executorTimeout : {
                digits:true
            },
            executorFailRetryCount : {
                digits:true
            }
		},
		messages : {
			jobDesc : {
                required : I18n.system_please_input + I18n.jobinfo_field_jobdesc
			},
			jobCron : {
				required : I18n.system_please_input + "Cron"
			},
			author : {
				required : I18n.system_please_input + I18n.jobinfo_field_author
			},
            executorTimeout : {
                digits: I18n.system_please_input + I18n.system_digits
            },
            executorFailRetryCount : {
                digits: I18n.system_please_input + I18n.system_digits
            }
		},
		highlight : function(element) {
            $(element).closest('.form-group').addClass('has-error');  
        },
        success : function(label) {  
            label.closest('.form-group').removeClass('has-error');  
            label.remove();  
        },
        errorPlacement : function(error, element) {  
            element.parent('div').append(error);  
        },
        submitHandler : function(form) {

            // process
            var executorTimeout = $("#updateModal .form input[name='executorTimeout']").val();
            if(!/^\d+$/.test(executorTimeout)) {
                executorTimeout = 0;
            }
            $("#updateModal .form input[name='executorTimeout']").val(executorTimeout);
            var executorFailRetryCount = $("#updateModal .form input[name='executorFailRetryCount']").val();
            if(!/^\d+$/.test(executorFailRetryCount)) {
                executorFailRetryCount = 0;
            }
            $("#updateModal .form input[name='executorFailRetryCount']").val(executorFailRetryCount);

			// post
    		$.post(base_url + "/jobinfo/update", $("#updateModal .form").serialize(), function(data, status) {
    			if (data.code == "200") {
					$('#updateModal').modal('hide');
					layer.open({
						title: I18n.system_tips ,
                        btn: [ I18n.system_ok ],
						content: I18n.system_update_suc ,
						icon: '1',
						end: function(layero, index){
							//window.location.reload();
							jobTable.fnDraw();
						}
					});
    			} else {
					layer.open({
						title: I18n.system_tips ,
                        btn: [ I18n.system_ok ],
						content: (data.msg || I18n.system_update_fail ),
						icon: '2'
					});
    			}
    		});
		}
	});
	$("#updateModal").on('hide.bs.modal', function () {
		$("#updateModal .form")[0].reset()
	});

    /**
	 * find title by name, GlueType
     */
	function findGlueTypeTitle(glueType) {
		var glueTypeTitle;
        $("#addModal .form select[name=glueType] option").each(function () {
            var name = $(this).val();
            var title = $(this).text();
            if (glueType == name) {
                glueTypeTitle = title;
                return false
            }
        });
        return glueTypeTitle;
    }

});
